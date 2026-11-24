import type {
  Brand,
  Category,
  Product,
  ShopSettings,
} from "@/lib/types";
import * as seed from "@/lib/data/seed";
import { payloadConfigured } from "@/lib/payload/config";

// Loaded lazily so seed-only builds never touch the database.
const cms = () => import("@/lib/payload/queries");

// ---------------------------------------------------------------------------
// Catalog facade — the ONLY module pages/components import for content.
//
// Every function is async so the data source can swap freely. When Payload's
// DATABASE_URL is set we read from the CMS; otherwise we fall back to the local
// seed so the site renders end-to-end before any backend is configured.
// This is the "park & pick later" seam: changing the source is a one-file edit.
// ---------------------------------------------------------------------------

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

export async function getShopSettings(): Promise<ShopSettings> {
  if (payloadConfigured) return (await cms()).getShopSettings();
  return seed.shopSettings;
}

/** Visible categories, each with the real number of products shown on the
 *  site. Products in hidden categories are already left out upstream. */
export async function getCategories(): Promise<Category[]> {
  const [base, products] = await Promise.all([
    payloadConfigured
      ? (await cms()).getCategories()
      : Promise.resolve([...seed.categories].sort(byOrder)),
    getAllProducts(),
  ]);
  const counts = new Map<string, number>();
  for (const p of products) {
    counts.set(p.categoryId, (counts.get(p.categoryId) ?? 0) + 1);
  }
  return base.map((c) => ({ ...c, productCount: counts.get(c.id) ?? 0 }));
}

export async function getCategory(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find((c) => c.id === slug) ?? null;
}

export async function getBrands(): Promise<Brand[]> {
  if (payloadConfigured) return (await cms()).getBrands();
  return [...seed.brands].sort(byOrder);
}

export async function getAllProducts(): Promise<Product[]> {
  if (payloadConfigured) return (await cms()).getAllProducts();
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

// ---------------------------------------------------------------------------
// Single-category mode.
//
// When fewer than two categories are visible on the site, category browsing
// (the "All categories" page, category menus, filters) looks empty. Pages use
// these helpers to switch to a focused layout: the home page lists the
// products directly and category navigation is hidden. Turning a second
// category's "Visible on site" toggle back on restores the normal layout.
// ---------------------------------------------------------------------------

/** True when the shop has fewer than two visible categories. */
export function isSingleCategory(categories: Category[]): boolean {
  return categories.length < 2;
}

/** Where "browse products" links should point. */
export function browseHref(categories: Category[]): string {
  return isSingleCategory(categories) ? "/#products" : "/categories";
}
