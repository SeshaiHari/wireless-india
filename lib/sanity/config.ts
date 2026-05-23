// Central Sanity connection config. Reading env here keeps the values in one
// place and lets the catalog facade cheaply check whether a CMS is wired up.

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-10-01";

/** True only when a real Sanity project id is configured. When false, the app
 *  falls back to the local seed catalog (lib/data/seed.ts). */
export const sanityConfigured = projectId.length > 0;
