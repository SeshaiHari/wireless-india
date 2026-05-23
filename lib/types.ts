// Shared domain types for the Wireless India catalog.
// These are the shapes the rest of the app consumes, regardless of whether the
// data comes from Sanity or the local seed fallback (see lib/data + lib/sanity).

export type ProductTag =
  | "New"
  | "Hot deal"
  | "Best deal"
  | "Bestseller"
  | "Combo"
  | "Office pick"
  | null;

export interface ShopSettings {
  name: string;
  tagline: string;
  /** Display phone, e.g. "+91 98658 11796" */
  phone: string;
  /** Digits only, for wa.me links, e.g. "919865811796" */
  whatsapp: string;
  address: string;
  hours: string;
  /** Full Google Maps embed src URL */
  mapEmbedUrl: string;
  /** Rotating lines in the top utility bar */
  marqueeLines: string[];
  /** Hero stat tiles, e.g. { value: "2,400+", label: "Items in stock" } */
  heroStats: { value: string; label: string }[];
}

export interface Category {
  /** slug, also matches the image folder name */
  id: string;
  name: string;
  blurb: string;
  /** Aspirational marketing count shown on cards (NOT computed from real SKUs) */
  claimedCount: number;
  /** Hero/thumbnail image URL */
  hero: string;
  order: number;
}

export interface Brand {
  name: string;
  order: number;
}

export interface SpecRow {
  label: string;
  value: string;
}

export interface Product {
  /** slug */
  id: string;
  name: string;
  brand: string;
  /** Category.id this product belongs to */
  categoryId: string;
  /** Display price, e.g. "₹1,499" */
  price: string;
  /** Strikethrough "was" price, or null */
  was: string | null;
  tag: ProductTag;
  /** One or more image URLs (first is primary) */
  images: string[];
  /** Short spec chips */
  specs: string[];
  sku: string;
  inStock: boolean;
  featured: boolean;
  /** Sort order within the featured grid */
  featuredOrder?: number;
  /** Optional rich detail-page copy */
  description?: string;
  /** Optional detailed spec table (falls back to a derived table) */
  specTable?: SpecRow[];
  /** Optional highlight pills (falls back to `specs`) */
  highlights?: string[];
}
