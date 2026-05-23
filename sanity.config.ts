import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "@/sanity/schemaTypes";
import { dataset, projectId } from "@/lib/sanity/config";

// Studio config for the embedded Studio at /studio.
export default defineConfig({
  name: "wireless-india",
  title: "Wireless India",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
