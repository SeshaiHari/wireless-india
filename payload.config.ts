import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import sharp from "sharp";
import { Users } from "./payload/collections/Users";
import { Media } from "./payload/collections/Media";
import { Categories } from "./payload/collections/Categories";
import { Brands } from "./payload/collections/Brands";
import { Products } from "./payload/collections/Products";
import { ShopSettings } from "./payload/globals/ShopSettings";

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
  plugins: [
    vercelBlobStorage({
      // Without a token (local dev) uploads fall back to ./media on disk.
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      alwaysInsertFields: true, // same DB schema with or without the token
      token: process.env.BLOB_READ_WRITE_TOKEN,
      collections: { media: { disablePayloadAccessControl: true } },
      clientUploads: true,
    }),
  ],
});
