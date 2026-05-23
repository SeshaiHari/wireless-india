import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "brand", title: "Brand", type: "reference", to: [{ type: "brand" }] }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (r) => r.required(),
    }),
    defineField({ name: "price", title: "Price", type: "string", description: 'e.g. "₹1,499"', validation: (r) => r.required() }),
    defineField({ name: "wasPrice", title: "Was price (strikethrough)", type: "string" }),
    defineField({
      name: "tag",
      title: "Badge",
      type: "string",
      options: {
        list: ["New", "Hot deal", "Best deal", "Bestseller", "Combo", "Office pick"],
        layout: "dropdown",
      },
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (r) => r.min(1),
    }),
    defineField({ name: "specs", title: "Spec chips", type: "array", of: [{ type: "string" }], description: "Short specs shown on cards" }),
    defineField({ name: "sku", title: "SKU", type: "string" }),
    defineField({ name: "inStock", title: "In stock", type: "boolean", initialValue: true }),
    defineField({ name: "featured", title: "Featured on home page", type: "boolean", initialValue: false }),
    defineField({ name: "featuredOrder", title: "Featured sort order", type: "number", hidden: ({ parent }) => !parent?.featured }),
    defineField({ name: "description", title: "Description", type: "text", rows: 6, description: "Blank line separates paragraphs." }),
    defineField({
      name: "specTable",
      title: "Spec table",
      type: "array",
      of: [
        defineField({
          name: "row",
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", title: "Label" }),
            defineField({ name: "value", type: "string", title: "Value" }),
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        }),
      ],
    }),
    defineField({ name: "highlights", title: "Highlight pills", type: "array", of: [{ type: "string" }] }),
  ],
  preview: {
    select: { title: "name", subtitle: "price", media: "images.0" },
  },
});
