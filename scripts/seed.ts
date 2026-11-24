/**
 * Loads the local seed catalog (lib/data/seed.ts) into Payload, uploading the
 * images from public/products. Handy for a fresh local database.
 *
 *   npm run seed
 *
 * Safe to re-run: upserts by slug / name / filename.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getPayload } from "payload";
import config from "../payload.config";
import { shopSettings, categories, brands, products } from "../lib/data/seed";
import { makeImporter, type ImageSource } from "./importer";

const MIME: Record<string, string> = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml" };

const local = (publicPath: string, alt?: string): ImageSource => ({
  filename: `seed-${publicPath.replace(/^\/+/, "").replace(/[/\\]/g, "-")}`,
  alt,
  load: async () => ({
    data: await readFile(path.join(process.cwd(), "public", publicPath)),
    mimetype: MIME[path.extname(publicPath).toLowerCase()] ?? "application/octet-stream",
  }),
});

const payload = await getPayload({ config });
const { media, upsert } = makeImporter(payload);

await payload.updateGlobal({ slug: "shop-settings", data: { ...shopSettings } });
console.log("✓ shop settings");

const brandOrder = new Map(brands.map((b) => [b.name, b.order]));
const brandIds = new Map<string, number>();
for (const name of new Set([...brands.map((b) => b.name), ...products.map((p) => p.brand)])) {
  brandIds.set(name, await upsert("brands", "name", name, { name, order: brandOrder.get(name) ?? 99 }));
}
console.log(`✓ ${brandIds.size} brands`);

const categoryIds = new Map<string, number>();
for (const c of categories) {
  categoryIds.set(
    c.id,
    await upsert("categories", "slug", c.id, {
      name: c.name,
      slug: c.id,
      blurb: c.blurb,
      order: c.order,
      heroImage: c.hero ? await media(local(c.hero, c.name)) : null,
    }),
  );
}
console.log(`✓ ${categoryIds.size} categories`);

for (const p of products) {
  const images: number[] = [];
  for (const img of p.images) images.push((await media(local(img, p.name)))!);
  await upsert("products", "slug", p.id, {
    name: p.name,
    slug: p.id,
    brand: brandIds.get(p.brand) ?? null,
    category: categoryIds.get(p.categoryId),
    price: p.price,
    wasPrice: p.was,
    tag: p.tag,
    images,
    specs: p.specs,
    sku: p.sku,
    inStock: p.inStock,
    featured: p.featured,
    featuredOrder: p.featuredOrder ?? null,
    description: p.description ?? null,
    specTable: p.specTable ?? [],
    highlights: p.highlights ?? [],
  });
}
console.log(`✓ ${products.length} products\nSeed complete.`);
process.exit(0);
