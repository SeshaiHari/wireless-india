/** True when a Payload database is configured. When false, the app falls back
 *  to the local seed catalog (lib/data/seed.ts) so it still renders. */
export const payloadConfigured = Boolean(process.env.DATABASE_URL);
