import type { NextConfig } from "next";
import path from "node:path";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  // Pin the workspace root (a stray parent lockfile otherwise confuses Turbopack).
  turbopack: { root: path.resolve(".") },
};

export default withPayload(nextConfig);
