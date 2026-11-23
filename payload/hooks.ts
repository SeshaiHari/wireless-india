import { revalidateTag } from "next/cache";

// Purge the cached catalog whenever content changes in the admin, so edits go
// live immediately. Outside a Next.js request
// (e.g. the migration script) revalidateTag throws; that's harmless there.
export function revalidateCatalog() {
  try {
    revalidateTag("catalog", { expire: 0 });
  } catch {
    // not running inside Next.js
  }
}

export const catalogHooks = {
  afterChange: [() => revalidateCatalog()],
  afterDelete: [() => revalidateCatalog()],
};
