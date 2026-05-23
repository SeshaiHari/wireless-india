import type { Product, ShopSettings } from "@/lib/types";
import { parsePrice } from "@/lib/price";
import { siteUrl } from "@/lib/site";

export function localBusinessJsonLd(shop: ShopSettings): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ElectronicsStore",
    name: shop.name,
    image: `${siteUrl}/logo.svg`,
    url: siteUrl,
    telephone: shop.phone,
    priceRange: "₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: "8, Kadarkarai Nadar St",
      addressLocality: "Theni",
      postalCode: "625531",
      addressRegion: "Tamil Nadu",
      addressCountry: "IN",
    },
    openingHours: "Mo-Sa 10:30-20:30",
  };
}

export function productJsonLd(
  product: Product,
  shop: ShopSettings,
  categoryName: string,
): Record<string, unknown> {
  const toAbs = (src: string) => (src.startsWith("http") ? src : `${siteUrl}${src}`);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map(toAbs),
    description: product.description?.split("\n")[0] ?? product.name,
    sku: product.sku,
    brand: { "@type": "Brand", name: product.brand },
    category: categoryName,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: parsePrice(product.price) || undefined,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",
      url: `${siteUrl}/product/${product.id}`,
      seller: { "@type": "Organization", name: shop.name },
    },
  };
}
