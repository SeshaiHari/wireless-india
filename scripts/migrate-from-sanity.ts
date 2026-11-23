/**
 * Copies all published Sanity content into Payload. See lib/migration/sanity.ts.
 *   npm run migrate:sanity
 */
import { getPayload } from "payload";
import config from "../payload.config";
import { migrateFromSanity } from "../lib/migration/sanity";

const { failures } = await migrateFromSanity(await getPayload({ config }));
process.exit(failures.length ? 1 : 0);
