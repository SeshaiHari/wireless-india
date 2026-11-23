import type { CollectionConfig } from "payload";
import { catalogHooks } from "../hooks";

export const Media: CollectionConfig = {
  slug: "media",
  admin: { group: "Catalog" },
  access: { read: () => true },
  hooks: catalogHooks,
  upload: {
    mimeTypes: ["image/*"],
    // One resized web-friendly copy for the storefront; the original is kept.
    imageSizes: [{ name: "display", width: 1600, withoutEnlargement: true, formatOptions: { format: "webp", options: { quality: 82 } } }],
    adminThumbnail: "display",
    focalPoint: true,
  },
  fields: [{ name: "alt", type: "text", label: "Alt text" }],
};
