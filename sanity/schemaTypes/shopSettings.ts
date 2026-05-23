import { defineField, defineType } from "sanity";

// Singleton: shop-wide info + the marketing copy/stats that appear in the
// design (marquee, hero stat tiles). Kept editable so the numbers aren't
// hard-coded.
export const shopSettings = defineType({
  name: "shopSettings",
  title: "Shop settings",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Shop name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({ name: "phone", title: "Phone (display)", type: "string", description: 'e.g. "+91 98658 11796"' }),
    defineField({ name: "whatsapp", title: "WhatsApp number (digits only)", type: "string", description: 'For wa.me links, e.g. "919865811796"' }),
    defineField({ name: "address", title: "Address", type: "text", rows: 2 }),
    defineField({ name: "hours", title: "Opening hours", type: "string" }),
    defineField({ name: "mapEmbedUrl", title: "Google Maps embed URL", type: "url", description: "The src of a Google Maps embed iframe" }),
    defineField({ name: "marqueeLines", title: "Top bar marquee lines", type: "array", of: [{ type: "string" }] }),
    defineField({
      name: "heroStats",
      title: "Hero stat tiles",
      type: "array",
      of: [
        defineField({
          name: "stat",
          type: "object",
          fields: [
            defineField({ name: "value", type: "string", title: "Value" }),
            defineField({ name: "label", type: "string", title: "Label" }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        }),
      ],
    }),
    defineField({ name: "shopfrontPhoto", title: "Shop-front photo", type: "image", options: { hotspot: true } }),
  ],
  preview: { prepare: () => ({ title: "Shop settings" }) },
});
