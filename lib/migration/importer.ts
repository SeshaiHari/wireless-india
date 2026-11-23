/**
 * Shared upsert helpers for loading catalog content into Payload. Used by both
 * the Sanity migration and the local seed. Every write is keyed on a stable
 * field (slug, brand name, media filename) so re-running updates in place
 * instead of creating duplicates.
 */
import type { Payload } from "payload";

export type ImageSource = {
  /** Stable, unique filename used to de-duplicate uploads across runs. */
  filename: string;
  load: () => Promise<{ data: Buffer; mimetype: string }>;
  alt?: string;
  /** Focal point, 0–100 (Payload's convention). */
  focalX?: number;
  focalY?: number;
};

export type Relation = number | null | undefined;

export function makeImporter(payload: Payload) {
  const mediaCache = new Map<string, number>();

  async function media(src: ImageSource | null | undefined): Promise<number | undefined> {
    if (!src) return undefined;
    const cached = mediaCache.get(src.filename);
    if (cached) return cached;

    const existing = await payload.find({
      collection: "media",
      where: { filename: { equals: src.filename } },
      limit: 1,
      depth: 0,
    });
    let id: number;
    if (existing.docs[0]) {
      id = existing.docs[0].id;
      await payload.update({
        collection: "media",
        id,
        data: { alt: src.alt ?? null, focalX: src.focalX, focalY: src.focalY },
      });
    } else {
      const { data, mimetype } = await src.load();
      const doc = await payload.create({
        collection: "media",
        data: { alt: src.alt ?? null, focalX: src.focalX, focalY: src.focalY },
        file: { data, mimetype, name: src.filename, size: data.length },
      });
      id = doc.id;
    }
    mediaCache.set(src.filename, id);
    return id;
  }

  async function upsert<C extends "brands" | "categories" | "products">(
    collection: C,
    field: "name" | "slug",
    value: string,
    data: Record<string, unknown>,
  ): Promise<number> {
    const existing = await payload.find({
      collection,
      where: { [field]: { equals: value } },
      limit: 1,
      depth: 0,
    });
    if (existing.docs[0]) {
      const doc = await payload.update({ collection, id: existing.docs[0].id, data: data as never });
      return doc.id;
    }
    const doc = await payload.create({ collection, data: data as never });
    return doc.id;
  }

  return { media, upsert };
}
