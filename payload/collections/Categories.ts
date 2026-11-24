import type { CollectionConfig } from "payload";
import { catalogHooks } from "../hooks";
import { slugField } from "../slug";

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: { useAsTitle: "name", defaultColumns: ["name", "slug", "visible", "order"], group: "Catalog" },
  access: { read: () => true },
  defaultSort: "order",
  hooks: catalogHooks,
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "visible",
      label: "Visible on site",
      type: "checkbox",
      defaultValue: true,
      admin: {
        position: "sidebar",
        description: "Untick to hide this category and every product in it from the site. Nothing is deleted.",
      },
    },
    slugField(),
    { name: "blurb", type: "text" },
    {
      name: "claimedCount",
      label: "Claimed item count",
      type: "number",
      // No longer shown on the site: cards now count the real products in the
      // category. Kept (hidden) so the database column needs no migration.
      admin: { hidden: true },
    },
    { name: "heroImage", label: "Hero image", type: "upload", relationTo: "media" },
    { name: "order", label: "Sort order", type: "number" },
  ],
};
