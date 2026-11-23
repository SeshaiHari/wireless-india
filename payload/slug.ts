import type { TextField } from "payload";

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/** URL slug, auto-filled from `name` when left blank. */
export function slugField(): TextField {
  return {
    name: "slug",
    type: "text",
    required: true,
    unique: true,
    index: true,
    admin: { position: "sidebar", description: "Used in the page URL. Leave blank to generate from the name." },
    hooks: {
      beforeValidate: [
        ({ value, data }) => (value ? slugify(String(value)) : data?.name ? slugify(String(data.name)) : value),
      ],
    },
  };
}
