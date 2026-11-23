import type { CollectionConfig } from "payload";
import { catalogHooks } from "../hooks";

export const Brands: CollectionConfig = {
  slug: "brands",
  admin: { useAsTitle: "name", defaultColumns: ["name", "order"], group: "Catalog" },
  access: { read: () => true },
  defaultSort: "order",
  hooks: catalogHooks,
  fields: [
    { name: "name", type: "text", required: true, unique: true },
    { name: "logo", type: "upload", relationTo: "media" },
    { name: "order", label: "Sort order", type: "number" },
  ],
};
