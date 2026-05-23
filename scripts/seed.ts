/**
 * One-off seed: pushes the local catalog (lib/data/seed.ts) into Sanity,
 * uploading every product/category image as a Sanity asset.
 *
 * Run once after creating your Sanity project + write token:
 *   npm run seed
 *
 * Idempotent: uses deterministic _ids, so re-running updates in place.
 * Image uploads are de-duplicated by Sanity (content hash).
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env" });

import { createClient } from "@sanity/client";
import { createReadStream } from "node:fs";
import path from "node:path";
import { shopSettings, categories, brands, products } from "../lib/data/seed";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    "Missing env. Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-10-01",
  useCdn: false,
});

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const brandId = (name: string) => `brand-${slugify(name)}`;
const catDocId = (id: string) => `category-${id}`;
const prodDocId = (id: string) => `product-${id}`;

async function uploadImage(publicPath: string) {
  const abs = path.join(process.cwd(), "public", publicPath);
  const asset = await client.assets.upload("image", createReadStream(abs), {
    filename: path.basename(publicPath),
  });
  return { _type: "image" as const, asset: { _type: "reference" as const, _ref: asset._id } };
}

async function run() {
  // Shop settings (singleton)
  await client.createOrReplace({
    _id: "shopSettings",
    _type: "shopSettings",
    name: shopSettings.name,
    tagline: shopSettings.tagline,
    phone: shopSettings.phone,
    whatsapp: shopSettings.whatsapp,
    address: shopSettings.address,
    hours: shopSettings.hours,
    mapEmbedUrl: shopSettings.mapEmbedUrl,
    marqueeLines: shopSettings.marqueeLines,
    heroStats: shopSettings.heroStats.map((s, i) => ({ _key: `s${i}`, ...s })),
  });
  console.log("✓ shopSettings");

  // Brands — union of curated list + any brand names used by products
  const brandOrder = new Map(brands.map((b) => [b.name, b.order]));
  const allBrandNames = Array.from(
    new Set([...brands.map((b) => b.name), ...products.map((p) => p.brand)]),
  );
  for (const name of allBrandNames) {
    await client.createOrReplace({
      _id: brandId(name),
      _type: "brand",
      name,
      order: brandOrder.get(name) ?? 99,
    });
  }
  console.log(`✓ ${allBrandNames.length} brands`);

  // Categories (with hero image)
  for (const c of categories) {
    const heroImage = c.hero ? await uploadImage(c.hero) : undefined;
    await client.createOrReplace({
      _id: catDocId(c.id),
      _type: "category",
      name: c.name,
      slug: { _type: "slug", current: c.id },
      blurb: c.blurb,
      claimedCount: c.claimedCount,
      order: c.order,
      ...(heroImage ? { heroImage } : {}),
    });
    console.log(`✓ category ${c.id}`);
  }

  // Products
  for (const p of products) {
    const images = [];
    for (let i = 0; i < p.images.length; i++) {
      const img = await uploadImage(p.images[i]);
      images.push({ ...img, _key: `img-${i}` });
    }
    await client.createOrReplace({
      _id: prodDocId(p.id),
      _type: "product",
      name: p.name,
      slug: { _type: "slug", current: p.id },
      brand: { _type: "reference", _ref: brandId(p.brand) },
      category: { _type: "reference", _ref: catDocId(p.categoryId) },
      price: p.price,
      ...(p.was ? { wasPrice: p.was } : {}),
      ...(p.tag ? { tag: p.tag } : {}),
      images,
      specs: p.specs,
      sku: p.sku,
      inStock: p.inStock,
      featured: p.featured,
      ...(p.featuredOrder ? { featuredOrder: p.featuredOrder } : {}),
      ...(p.description ? { description: p.description } : {}),
      ...(p.specTable
        ? { specTable: p.specTable.map((r, i) => ({ _key: `r${i}`, ...r })) }
        : {}),
      ...(p.highlights ? { highlights: p.highlights } : {}),
    });
    console.log(`✓ product ${p.id}`);
  }

  console.log("\nSeed complete.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
