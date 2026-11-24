/** Parse a display price like "₹1,499" into a number (1499). NaN if unparseable. */
export function parsePrice(price: string | null | undefined): number {
  if (!price) return NaN;
  return Number(price.replace(/[^\d.]/g, ""));
}

/** Whole-number discount percent from price + was, or null when not applicable. */
export function discountPct(
  price: string,
  was: string | null | undefined,
): number | null {
  const now = parsePrice(price);
  const before = parsePrice(was);
  if (!before || !now || before <= now) return null;
  return Math.round((1 - now / before) * 100);
}

/** Format a rupee amount for display, e.g. 12998 → "₹12,998", 149999 → "₹1,49,999". */
export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

/** Shown when a product has no usable price (0 or blank) in the admin. */
export const PRICE_ON_REQUEST = "Price on request";

/** Display string for a numeric admin price: "₹1,499", or PRICE_ON_REQUEST when unset. */
export function displayPrice(amount: number | null | undefined): string {
  return amount && amount > 0 ? formatINR(amount) : PRICE_ON_REQUEST;
}
