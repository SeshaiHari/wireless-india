import type { GlobalConfig } from "payload";
import { revalidateCatalog } from "../hooks";

// Shop-wide info + the marketing copy/stats in the design (marquee, hero tiles).
export const ShopSettings: GlobalConfig = {
  slug: "shop-settings",
  label: "Shop settings",
  access: { read: () => true },
  hooks: { afterChange: [() => revalidateCatalog()] },
  fields: [
    { name: "name", label: "Shop name", type: "text", required: true },
    { name: "tagline", type: "text" },
    {
      type: "row",
      fields: [
        { name: "phone", label: "Phone (display)", type: "text", admin: { description: 'e.g. "+91 98658 11796"' } },
        {
          name: "whatsapp",
          label: "WhatsApp number (digits only)",
          type: "text",
          admin: { description: 'For wa.me links and cart orders, e.g. "919865811796"' },
        },
      ],
    },
    { name: "address", type: "textarea", admin: { rows: 2 } },
    { name: "hours", label: "Opening hours", type: "text" },
    { name: "mapEmbedUrl", label: "Google Maps embed URL", type: "text", admin: { description: "The src of a Google Maps embed iframe" } },
    { name: "marqueeLines", label: "Top bar marquee lines", type: "text", hasMany: true },
    {
      name: "heroStats",
      label: "Hero stat tiles",
      type: "array",
      fields: [
        {
          type: "row",
          fields: [
            { name: "value", type: "text" },
            { name: "label", type: "text" },
          ],
        },
      ],
    },
    { name: "shopfrontPhoto", label: "Shop-front photo", type: "upload", relationTo: "media" },
  ],
};
