"use client";

import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

// Client wrapper: imports the config here so it never crosses the
// server→client prop boundary (config contains non-serializable functions).
export default function Studio() {
  return <NextStudio config={config} />;
}
