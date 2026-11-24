import type { CollectionConfig } from "payload";
import { catalogHooks } from "../hooks";
import { slugField } from "../slug";

export const PRODUCT_TAGS = ["New", "Hot deal", "Best deal", "Bestseller", "Combo", "Office pick"] as const;

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "category", "price", "inStock", "featured"],
    group: "Catalog",
    listSearchableFields: ["name", "slug", "sku"],
  },
  access: { read: () => true },
  hooks: catalogHooks,
  fields: [
    { name: "name", type: "text", required: true },
    slugField(),
    {
      type: "row",
      fields: [
        { name: "brand", type: "relationship", relationTo: "brands" },
        { name: "category", type: "relationship", relationTo: "categories", required: true },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "price",
          label: "Price (₹)",
          type: "number",
          required: true,
          min: 0,
          admin: { description: "Numbers only, e.g. 1499. The site adds ₹ and commas." },
        },
        {
          name: "wasPrice",
          label: "Was price (₹, strikethrough)",
          type: "number",
          min: 0,
          admin: { description: "Optional. Numbers only, e.g. 1999." },
        },
        {
          name: "tag",
          label: "Badge",
          type: "select",
          options: PRODUCT_TAGS.map((t) => ({ label: t, value: t })),
        },
      ],
    },
    { name: "images", type: "upload", relationTo: "media", hasMany: true, required: true, minRows: 1 },
    {
      name: "specs",
      label: "Spec chips",
      type: "text",
      hasMany: true,
      admin: { description: "Short specs shown on cards" },
    },
    {
      type: "row",
      fields: [
        { name: "sku", label: "SKU", type: "text" },
        { name: "inStock", label: "In stock", type: "checkbox", defaultValue: true },
        { name: "featured", label: "Featured on home page", type: "checkbox", defaultValue: false },
        {
          name: "featuredOrder",
          label: "Featured sort order",
          type: "number",
          admin: { condition: (data) => Boolean(data?.featured) },
        },
      ],
    },
    {
      name: "description",
      type: "textarea",
      admin: { rows: 6, description: "Blank line separates paragraphs." },
    },
    {
      name: "specTable",
      label: "Spec table",
      type: "array",
      admin: { initCollapsed: true },
      fields: [
        {
          type: "row",
          fields: [
            { name: "label", type: "text" },
            { name: "value", type: "text" },
          ],
        },
      ],
    },
    { name: "highlights", label: "Highlight pills", type: "text", hasMany: true },
  ],
};
