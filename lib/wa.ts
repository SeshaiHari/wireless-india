import type { Product } from "@/lib/types";

/** Build a wa.me link, optionally with a pre-filled message. */
export function waLink(whatsapp: string, text?: string): string {
  const digits = whatsapp.replace(/\D/g, "");
  const base = `https://wa.me/${digits}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** tel: href from a display phone number. */
export function telHref(phone: string): string {
  const cleaned = phone.replace(/[^\d+]/g, "");
  return `tel:${cleaned}`;
}

/** Pre-filled WhatsApp enquiry for a specific product. */
export function productEnquiryLink(whatsapp: string, product: Product): string {
  return waLink(
    whatsapp,
    `Hi Wireless India, I'm interested in the ${product.name} (${product.price}). Is it available?`,
  );
}
