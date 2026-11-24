import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import sharp from "sharp";
import { attachDatabasePool } from "@vercel/functions";
import type { Pool } from "pg";
import { Users } from "./payload/collections/Users";
import { Media } from "./payload/collections/Media";
import { Categories } from "./payload/collections/Categories";
import { Brands } from "./payload/collections/Brands";
import { Products } from "./payload/collections/Products";
import { ShopSettings } from "./payload/globals/ShopSettings";
import { blobStorage } from "./payload/blobStorage";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: dirname },
    meta: { titleSuffix: " — Wireless India" },
  },
  collections: [Products, Categories, Brands, Media, Users],
  globals: [ShopSettings],
  secret: process.env.PAYLOAD_SECRET ?? "",
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL ?? "" },
    migrationDir: path.resolve(dirname, "payload/migrations"),
    // Schema changes go through migrations only (npm run migrate:create), never auto-push.
    push: false,
  }),
  sharp,
  plugins: [blobStorage()],
  // On Vercel, let the platform close idle Postgres connections before a
  // function instance is suspended, so warm instances keep reusing open
  // connections (no new handshake to the database on each admin click) without
  // leaking them. No-op outside Vercel.
  onInit: (payload) => {
    const pool = (payload.db as { pool?: Pool }).pool;
    if (pool && process.env.VERCEL) attachDatabasePool(pool);
  },
});
