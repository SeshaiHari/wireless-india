/**
 * One-off migration: copies ALL published content from Sanity into Payload.
 *
 *   Shop settings (+ shop-front photo) → global "shop-settings"
 *   Brands (+ logos)                   → collection "brands"
 *   Categories (+ hero images)         → collection "categories"
 *   Products (+ all images)            → collection "products"
 *
 * Images are downloaded from Sanity's CDN (with any crop applied, hotspot kept
 * as the focal point) and re-uploaded to Payload's storage (Vercel Blob).
 *
 * Env (read from .env):
 *   DATABASE_URL, PAYLOAD_SECRET, BLOB_STORE_ID or BLOB_READ_WRITE_TOKEN — the Payload side
 *   SANITY_PROJECT_ID, SANITY_DATASET (default production) — the Sanity side
 *   SANITY_READ_TOKEN                                      — only for private datasets
 *
 * Run:  npm run migrate:sanity   (locally)
 *   or: /api/migrate-sanity       (on Vercel, logged in as an admin)
 * Safe to re-run: everything is upserted by slug / name / asset id.
 */
import type { Payload } from "payload";
import { makeImporter, type ImageSource } from "./importer";
import { blobEnabled } from "../../payload/blobStorage";

// Defaults to Wireless India's Sanity project (not a secret).
const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "gvnp1gsh";
const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_READ_TOKEN;
// Overridable for testing against a local mock.
const apiBase = process.env.SANITY_API_BASE || `https://${projectId}.api.sanity.io`;

type SanityAsset = {
  _id: string;
  url: string;
  originalFilename?: string;
  mimeType?: string;
  metadata?: { dimensions?: { width: number; height: number } };
};
type SanityImage = {
  alt?: string;
  hotspot?: { x: number; y: number };
  crop?: { top: number; bottom: number; left: number; right: number };
  asset?: SanityAsset | null;
} | null;

const IMG = `{ alt, hotspot, crop, "asset": asset->{ _id, url, originalFilename, mimeType, metadata{ dimensions } } }`;

const QUERY = `{
  "types": array::unique(*[!(_id in path("_.**"))]._type),
  "settings": *[_type == "shopSettings"] | order(_updatedAt desc)[0]{
    name, tagline, phone, whatsapp, address, hours, mapEmbedUrl, marqueeLines,
    heroStats[]{ value, label },
    "shopfrontPhoto": shopfrontPhoto${IMG}
  },
  "brands": *[_type == "brand"]{ _id, name, order, "logo": logo${IMG} },
  "categories": *[_type == "category"]{
    _id, name, "slug": slug.current, blurb, claimedCount, order, "heroImage": heroImage${IMG}
  },
  "products": *[_type == "product"]{
    _id, name, "slug": slug.current, "brandRef": brand._ref, "categoryRef": category._ref,
    price, wasPrice, tag, "images": images[]${IMG}, specs, sku, inStock, featured,
    featuredOrder, description, specTable[]{ label, value }, highlights
  }
}`;

const HANDLED = new Set(["shopSettings", "brand", "category", "product", "sanity.imageAsset", "sanity.fileAsset"]);

async function fetchSanity() {
  const url = `${apiBase}/v2024-10-01/data/query/${dataset}?query=${encodeURIComponent(QUERY)}&perspective=published`;
  const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  if (!res.ok) {
    throw new Error(
      `Sanity query failed (${res.status}): ${await res.text()}\n` +
        (res.status === 401 || res.status === 403 ? "The dataset is probably private: set SANITY_READ_TOKEN." : ""),
    );
  }
  return (await res.json()).result;
}

const extFromMime = (m?: string) => (m?.split("/")[1] || "jpg").replace("jpeg", "jpg").replace("svg+xml", "svg");

function toImageSource(img: SanityImage): ImageSource | undefined {
  const asset = img?.asset;
  if (!asset?.url) return undefined;
  let url = asset.url;
  let suffix = "";
  // Apply the editor's crop the same way the Sanity image builder did.
  const c = img?.crop;
  const dim = asset.metadata?.dimensions;
  if (c && dim && (c.top || c.bottom || c.left || c.right)) {
    const left = Math.round(c.left * dim.width);
    const top = Math.round(c.top * dim.height);
    const w = Math.round((1 - c.left - c.right) * dim.width);
    const h = Math.round((1 - c.top - c.bottom) * dim.height);
    url += `?rect=${left},${top},${w},${h}`;
    suffix = `-crop-${left}-${top}-${w}-${h}`;
  }
  const ext = extFromMime(asset.mimeType) || url.split(".").pop();
  // Readable but unique: "<original-name>-<first 8 chars of Sanity's content hash>".
  const hash = asset._id.replace(/^image-/, "").split("-")[0].slice(0, 8);
  const base = (asset.originalFilename ?? "image").replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60) || "image";
  return {
    filename: `${base}-${hash}${suffix}.${ext}`,
    alt: img?.alt,
    focalX: img?.hotspot ? Math.round(img.hotspot.x * 1000) / 10 : undefined,
    focalY: img?.hotspot ? Math.round(img.hotspot.y * 1000) / 10 : undefined,
    load: async () => {
      const r = await fetch(url);
      if (!r.ok) throw new Error(`Image download failed (${r.status}): ${url}`);
      return { data: Buffer.from(await r.arrayBuffer()), mimetype: r.headers.get("content-type") || asset.mimeType || "image/jpeg" };
    },
  };
}

export async function migrateFromSanity(
  payload: Payload,
  log: (line: string) => void = console.log,
): Promise<{ failures: string[] }> {
  if (!projectId && !process.env.SANITY_API_BASE) throw new Error("Set SANITY_PROJECT_ID (and SANITY_DATASET if not 'production').");
  if (!blobEnabled) {
    if (process.env.VERCEL) throw new Error("Vercel Blob isn't connected to this project (no BLOB_STORE_ID or BLOB_READ_WRITE_TOKEN).");
    log("⚠ Vercel Blob isn't configured — images will be stored on local disk (./media).");
  }

  log(`Reading Sanity project ${projectId ?? "(mock)"} / ${dataset} …`);
  const data = await fetchSanity();
  const { media, upsert } = makeImporter(payload);
  const failures: string[] = [];

  const unknown = (data.types as string[]).filter((t) => !HANDLED.has(t) && !t.startsWith("system."));
  if (unknown.length) {
    failures.push(`Sanity has content types this script doesn't migrate: ${unknown.join(", ")}`);
  }

  // Shop settings
  if (data.settings) {
    const s = data.settings;
    await payload.updateGlobal({
      slug: "shop-settings",
      data: {
        name: s.name ?? "Wireless India",
        tagline: s.tagline,
        phone: s.phone,
        whatsapp: s.whatsapp,
        address: s.address,
        hours: s.hours,
        mapEmbedUrl: s.mapEmbedUrl,
        marqueeLines: s.marqueeLines ?? [],
        heroStats: (s.heroStats ?? []).map((h: { value?: string; label?: string }) => ({ value: h.value, label: h.label })),
        shopfrontPhoto: (await media(toImageSource(s.shopfrontPhoto))) ?? null,
      },
    });
    log("✓ shop settings");
  } else {
    failures.push("No shopSettings document found in Sanity.");
  }

  // Brands
  const brandIds = new Map<string, number>();
  for (const b of data.brands) {
    try {
      const id = await upsert("brands", "name", b.name, {
        name: b.name,
        order: b.order ?? null,
        logo: (await media(toImageSource(b.logo))) ?? null,
      });
      brandIds.set(b._id, id);
    } catch (e) {
      failures.push(`brand "${b.name}": ${(e as Error).message}`);
    }
  }
  log(`✓ ${brandIds.size}/${data.brands.length} brands`);

  // Categories
  const categoryIds = new Map<string, number>();
  for (const c of data.categories) {
    try {
      const id = await upsert("categories", "slug", c.slug, {
        name: c.name,
        slug: c.slug,
        blurb: c.blurb ?? null,
        claimedCount: c.claimedCount ?? null,
        order: c.order ?? null,
        heroImage: (await media(toImageSource(c.heroImage))) ?? null,
      });
      categoryIds.set(c._id, id);
    } catch (e) {
      failures.push(`category "${c.slug}": ${(e as Error).message}`);
    }
  }
  log(`✓ ${categoryIds.size}/${data.categories.length} categories`);

  // Products
  let done = 0;
  for (const p of data.products) {
    try {
      const images: number[] = [];
      for (const img of p.images ?? []) {
        const id = await media(toImageSource(img));
        if (id) images.push(id);
      }
      await upsert("products", "slug", p.slug, {
        name: p.name,
        slug: p.slug,
        brand: (p.brandRef && brandIds.get(p.brandRef)) ?? null,
        category: (p.categoryRef && categoryIds.get(p.categoryRef)) ?? null,
        price: p.price,
        wasPrice: p.wasPrice ?? null,
        tag: p.tag ?? null,
        images,
        specs: p.specs ?? [],
        sku: p.sku ?? null,
        inStock: p.inStock ?? true,
        featured: p.featured ?? false,
        featuredOrder: p.featuredOrder ?? null,
        description: p.description ?? null,
        specTable: (p.specTable ?? []).map((r: { label?: string; value?: string }) => ({ label: r.label, value: r.value })),
        highlights: p.highlights ?? [],
      });
      done++;
      log(`  ✓ product ${p.slug} (${images.length} image${images.length === 1 ? "" : "s"})`);
    } catch (e) {
      failures.push(`product "${p.slug}": ${(e as Error).message}`);
    }
  }
  log(`✓ ${done}/${data.products.length} products`);

  if (failures.length) {
    log(`\n${failures.length} problem(s):\n- ${failures.join("\n- ")}`);
  } else {
    log("\nMigration complete.");
  }
  return { failures };
}

