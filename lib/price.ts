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
