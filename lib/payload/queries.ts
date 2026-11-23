import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Brand, Category, Product, ProductTag, ShopSettings } from "@/lib/types";
import type { Media } from "@/payload-types";

// Cached reads with the same policy the Sanity version had: 60s time-based
// revalidation plus the shared "catalog" tag, which Payload's afterChange hooks
// purge on every edit (see payload/hooks.ts).
const cacheOpts = { revalidate: 60, tags: ["catalog"] };

const payload = () => getPayload({ config });

/** Public URL for an upload, preferring the resized web copy. */
function mediaUrl(m: number | Media | null | undefined): string {
  if (!m || typeof m === "number") return "";
  return m.sizes?.display?.url || m.url || "";
}

export const getShopSettings = unstable_cache(
  async (): Promise<ShopSettings> => {
    const doc = await (await payload()).findGlobal({ slug: "shop-settings", depth: 0 });
    return {
      name: doc?.name || "Wireless India",
      tagline: doc?.tagline ?? "",
      phone: doc?.phone ?? "",
      whatsapp: doc?.whatsapp ?? "",
      address: doc?.address ?? "",
      hours: doc?.hours ?? "",
      mapEmbedUrl: doc?.mapEmbedUrl ?? "",
      marqueeLines: doc?.marqueeLines ?? [],
      heroStats: (doc?.heroStats ?? []).map((s) => ({ value: s.value ?? "", label: s.label ?? "" })),
    };
  },
  ["payload:shop-settings"],
  cacheOpts,
);

export const getCategories = unstable_cache(
  async (): Promise<Category[]> => {
    const { docs } = await (await payload()).find({
      collection: "categories",
      sort: "order",
      limit: 0,
      depth: 1,
      // Hidden categories (and, below, their products) never reach the site.
      where: { visible: { not_equals: false } },
    });
    return docs.map((c, i) => ({
      id: c.slug,
      name: c.name,
      blurb: c.blurb ?? "",
      claimedCount: c.claimedCount ?? 0,
      hero: mediaUrl(c.heroImage),
      order: c.order ?? i + 1,
    }));
  },
  ["payload:categories"],
  cacheOpts,
);

export const getBrands = unstable_cache(
  async (): Promise<Brand[]> => {
    const { docs } = await (await payload()).find({
      collection: "brands",
      sort: "order",
      limit: 0,
      depth: 0,
    });
    return docs.map((b, i) => ({ name: b.name, order: b.order ?? i + 1 }));
  },
  ["payload:brands"],
  cacheOpts,
);

export const getAllProducts = unstable_cache(
  async (): Promise<Product[]> => {
    const { docs } = await (await payload()).find({
      collection: "products",
      limit: 0,
      depth: 1,
      sort: "createdAt",
    });
    const isShown = (p: (typeof docs)[number]) =>
      typeof p.category === "object" && p.category !== null && p.category.visible !== false;
    return docs.filter(isShown).map((p) => ({
      id: p.slug,
      name: p.name,
      brand: typeof p.brand === "object" && p.brand ? p.brand.name : "Generic",
      categoryId: typeof p.category === "object" && p.category ? p.category.slug : "",
      price: p.price,
      was: p.wasPrice || null,
      tag: (p.tag as ProductTag) ?? null,
      images: (p.images ?? []).map(mediaUrl).filter(Boolean),
      specs: p.specs ?? [],
      sku: p.sku ?? "",
      inStock: p.inStock ?? true,
      featured: p.featured ?? false,
      featuredOrder: p.featuredOrder ?? undefined,
      description: p.description ?? undefined,
      specTable: p.specTable?.length
        ? p.specTable.map((r) => ({ label: r.label ?? "", value: r.value ?? "" }))
        : undefined,
      highlights: p.highlights?.length ? p.highlights : undefined,
    }));
  },
  ["payload:products"],
  cacheOpts,
);
