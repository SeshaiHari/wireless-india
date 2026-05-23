import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "@/lib/sanity/config";

const builder = createImageUrlBuilder({ projectId, dataset });

/** Build a CDN URL for a Sanity image reference. Returns "" for falsy input so
 *  callers can fall back to a plain string path (used by the seed). */
export function urlFor(source: SanityImageSource | undefined | null): string {
  if (!source) return "";
  return builder.image(source).auto("format").fit("max").url();
}
