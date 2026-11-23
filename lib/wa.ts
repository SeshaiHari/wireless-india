import type { Product } from "@/lib/types";
import { formatINR, parsePrice } from "@/lib/price";

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

export interface OrderLine {
  product: Product;
  qty: number;
}

export interface OrderCustomer {
  name?: string;
  phone?: string;
  note?: string;
}

/** Unit price as a number, or NaN for "call for price" style values. */
function unitPrice(product: Product): number {
  const n = parsePrice(product.price);
  return n > 0 ? n : NaN;
}

/** Build the WhatsApp order message for one or more products with quantities. */
export function orderMessage(lines: OrderLine[], customer: OrderCustomer = {}): string {
  const rows = lines.map(({ product, qty }, i) => {
    const unit = unitPrice(product);
    const lineTotal = Number.isFinite(unit) ? ` = ${formatINR(unit * qty)}` : "";
    return `${i + 1}. ${product.name} (SKU ${product.sku}) x ${qty} @ ${product.price}${lineTotal}`;
  });

  const priced = lines.every(({ product }) => Number.isFinite(unitPrice(product)));
  const total = lines.reduce((sum, { product, qty }) => sum + unitPrice(product) * qty, 0);
  const units = lines.reduce((n, l) => n + l.qty, 0);

  const out = ["Hi Wireless India, I'd like to order:", "", ...rows, ""];
  out.push(`Items: ${units}` + (priced ? ` · Total: ${formatINR(total)}` : ""));
  const name = customer.name?.trim();
  const phone = customer.phone?.trim();
  const note = customer.note?.trim();
  if (name) out.push(`Name: ${name}`);
  if (phone) out.push(`Phone: ${phone}`);
  if (note) out.push(`Note: ${note}`);
  out.push("", "Please confirm availability. Thanks!");
  return out.join("\n");
}

/** wa.me link carrying a full order (products + quantities). */
export function orderLink(whatsapp: string, lines: OrderLine[], customer?: OrderCustomer): string {
  return waLink(whatsapp, orderMessage(lines, customer));
}
