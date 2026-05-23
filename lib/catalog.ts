import type {
  Brand,
  Category,
  Product,
  ShopSettings,
} from "@/lib/types";
import * as seed from "@/lib/data/seed";
import { sanityConfigured } from "@/lib/sanity/config";
import * as sanity from "@/lib/sanity/queries";

// ---------------------------------------------------------------------------
// Catalog facade — the ONLY module pages/components import for content.
//
// Every function is async so the data source can swap freely. When Sanity env
// vars are present we read from the CMS; otherwise we fall back to the local
// seed so the site renders end-to-end before any backend is configured.
// This is the "park & pick later" seam: changing the source is a one-file edit.
// ---------------------------------------------------------------------------

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

export async function getShopSettings(): Promise<ShopSettings> {
  if (sanityConfigured) return sanity.getShopSettings();
  return seed.shopSettings;
}

export async function getCategories(): Promise<Category[]> {
  if (sanityConfigured) return sanity.getCategories();
  return [...seed.categories].sort(byOrder);
}

export async function getCategory(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find((c) => c.id === slug) ?? null;
}

export async function getBrands(): Promise<Brand[]> {
  if (sanityConfigured) return sanity.getBrands();
  return [...seed.brands].sort(byOrder);
}

export async function getAllProducts(): Promise<Product[]> {
  if (sanityConfigured) return sanity.getAllProducts();
  return seed.products;
}

export async function getFeaturedProducts(limit?: number): Promise<Product[]> {
  const all = await getAllProducts();
  const featured = all
    .filter((p) => p.featured)
    .sort((a, b) => (a.featuredOrder ?? 999) - (b.featuredOrder ?? 999));
  return typeof limit === "number" ? featured.slice(0, limit) : featured;
}

export async function getProductsByCategory(
  categoryId: string,
): Promise<Product[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.categoryId === categoryId);
}

export async function getProduct(slug: string): Promise<Product | null> {
  const all = await getAllProducts();
  return all.find((p) => p.id === slug) ?? null;
}

/** Products to show in "related" / "you might also like" — same category first,
 *  topped up with other items, excluding the current product. */
export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  const all = await getAllProducts();
  const sameCat = all.filter(
    (p) => p.categoryId === product.categoryId && p.id !== product.id,
  );
  const others = all.filter(
    (p) => p.categoryId !== product.categoryId && p.id !== product.id,
  );
  return [...sameCat, ...others].slice(0, limit);
}
