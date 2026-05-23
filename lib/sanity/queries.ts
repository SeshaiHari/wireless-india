import type {
  Brand,
  Category,
  Product,
  ProductTag,
  ShopSettings,
  SpecRow,
} from "@/lib/types";
import type { SanityImageSource } from "@sanity/image-url";
import { sanityClient } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";

// Revalidation: time-based fallback + a shared tag the webhook can purge.
const fetchOpts = { next: { revalidate: 60, tags: ["catalog"] } };

// ---- shop settings -------------------------------------------------------
const SHOP_QUERY = `*[_type == "shopSettings"][0]{
  name, tagline, phone, whatsapp, address, hours, mapEmbedUrl,
  marqueeLines, heroStats
}`;

export async function getShopSettings(): Promise<ShopSettings> {
  const doc = await sanityClient.fetch(SHOP_QUERY, {}, fetchOpts);
  return {
    name: doc?.name ?? "Wireless India",
    tagline: doc?.tagline ?? "",
    phone: doc?.phone ?? "",
    whatsapp: doc?.whatsapp ?? "",
    address: doc?.address ?? "",
    hours: doc?.hours ?? "",
    mapEmbedUrl: doc?.mapEmbedUrl ?? "",
    marqueeLines: doc?.marqueeLines ?? [],
    heroStats: doc?.heroStats ?? [],
  };
}

// ---- categories ----------------------------------------------------------
const CATEGORIES_QUERY = `*[_type == "category"] | order(order asc){
  "id": slug.current, name, blurb, claimedCount, heroImage, order
}`;

type RawCategory = {
  id: string;
  name: string;
  blurb?: string;
  claimedCount?: number;
  heroImage?: SanityImageSource;
  order?: number;
};

export async function getCategories(): Promise<Category[]> {
  const docs: RawCategory[] = await sanityClient.fetch(
    CATEGORIES_QUERY,
    {},
    fetchOpts,
  );
  return docs.map((c, i) => ({
    id: c.id,
    name: c.name,
    blurb: c.blurb ?? "",
    claimedCount: c.claimedCount ?? 0,
    hero: urlFor(c.heroImage),
    order: c.order ?? i + 1,
  }));
}

// ---- brands --------------------------------------------------------------
const BRANDS_QUERY = `*[_type == "brand"] | order(order asc){ name, order }`;

export async function getBrands(): Promise<Brand[]> {
  const docs: { name: string; order?: number }[] = await sanityClient.fetch(
    BRANDS_QUERY,
    {},
    fetchOpts,
  );
  return docs.map((b, i) => ({ name: b.name, order: b.order ?? i + 1 }));
}

// ---- products ------------------------------------------------------------
const PRODUCTS_QUERY = `*[_type == "product"]{
  "id": slug.current,
  name,
  "brand": coalesce(brand->name, "Generic"),
  "categoryId": category->slug.current,
  price,
  "was": wasPrice,
  tag,
  images,
  specs,
  sku,
  "inStock": coalesce(inStock, true),
  "featured": coalesce(featured, false),
  featuredOrder,
  description,
  specTable,
  highlights
}`;

type RawProduct = {
  id: string;
  name: string;
  brand: string;
  categoryId: string;
  price: string;
  was?: string | null;
  tag?: string | null;
  images?: SanityImageSource[];
  specs?: string[];
  sku?: string;
  inStock?: boolean;
  featured?: boolean;
  featuredOrder?: number;
  description?: string;
  specTable?: SpecRow[];
  highlights?: string[];
};

function mapProduct(p: RawProduct): Product {
  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    categoryId: p.categoryId,
    price: p.price,
    was: p.was ?? null,
    tag: (p.tag as ProductTag) ?? null,
    images: (p.images ?? []).map((img) => urlFor(img)).filter(Boolean),
    specs: p.specs ?? [],
    sku: p.sku ?? "",
    inStock: p.inStock ?? true,
    featured: p.featured ?? false,
    featuredOrder: p.featuredOrder,
    description: p.description,
    specTable: p.specTable,
    highlights: p.highlights,
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const docs: RawProduct[] = await sanityClient.fetch(
    PRODUCTS_QUERY,
    {},
    fetchOpts,
  );
  return docs.map(mapProduct);
}
