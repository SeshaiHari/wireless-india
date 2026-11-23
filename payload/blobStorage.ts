import path from "node:path";
import { del, put } from "@vercel/blob";
import { cloudStoragePlugin } from "@payloadcms/plugin-cloud-storage";
import type { Adapter } from "@payloadcms/plugin-cloud-storage/types";
import type { Plugin } from "payload";

/**
 * Vercel Blob storage for Payload uploads that works with BOTH ways Vercel
 * connects a Blob store to a project:
 *   - OIDC (newer default): BLOB_STORE_ID, no token — auth is automatic on Vercel
 *   - Read-write token:     BLOB_READ_WRITE_TOKEN
 * Payload's official adapter only supports the token, hence this small one.
 * Files are public and served straight from the Blob CDN.
 *
 * With neither env var set (local dev) uploads fall back to ./media on disk.
 */

const token = process.env.BLOB_READ_WRITE_TOKEN || undefined;

function storeId(): string | undefined {
  const fromToken = token?.match(/^vercel_blob_rw_([a-z\d]+)_/i)?.[1];
  const raw = process.env.BLOB_STORE_ID || fromToken;
  return raw?.replace(/^store_/, "").toLowerCase();
}

export const blobEnabled = Boolean(storeId());

const baseUrl = () => process.env.BLOB_BASE_URL?.replace(/\/$/, "") || `https://${storeId()}.public.blob.vercel-storage.com`;

const key = (prefix: string | undefined, filename: string) => path.posix.join(prefix || "", filename);

const adapter: Adapter = ({ prefix = "" }) => ({
  name: "vercel-blob-oidc",
  generateURL: ({ filename, prefix: docPrefix }) => `${baseUrl()}/${key(docPrefix ?? prefix, filename)}`,
  handleUpload: async ({ data, file }) => {
    const pathname = key(data.prefix ?? prefix, file.filename);
    const result = await put(pathname, file.buffer, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: file.mimeType,
      cacheControlMaxAge: 60 * 60 * 24 * 365,
      token,
    });
    const expected = `${baseUrl()}/${pathname}`;
    if (decodeURI(result.url) !== decodeURI(expected)) {
      throw new Error(`Vercel Blob returned ${result.url} but URLs are built as ${expected}. Set BLOB_BASE_URL to ${new URL(result.url).origin}.`);
    }
    return data;
  },
  handleDelete: async ({ doc, filename }) => {
    await del(`${baseUrl()}/${key(doc.prefix ?? prefix, filename)}`, { token });
  },
  // Files are public on the Blob CDN; redirect any /api/media/file/* hits there.
  staticHandler: (_req, { params }) =>
    Response.redirect(`${baseUrl()}/${key(params.prefix ?? prefix, params.filename)}`, 302),
});

export const blobStorage = (): Plugin =>
  cloudStoragePlugin({
    enabled: blobEnabled,
    alwaysInsertFields: true, // same DB schema with or without Blob configured
    collections: {
      media: { adapter: blobEnabled ? adapter : null, disablePayloadAccessControl: true },
    },
  });
