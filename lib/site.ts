/** Public site URL used for absolute URLs (sitemap, JSON-LD, OG). */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://wirelessindia.example"
).replace(/\/$/, "");
