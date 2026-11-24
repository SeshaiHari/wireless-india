// Vercel build: apply Payload migrations first when a database is configured,
// then build. Without DATABASE_URL the site builds on the seed catalog.
import { execSync } from "node:child_process";

const run = (cmd) => execSync(cmd, { stdio: "inherit" });

// Locally, pick up .env like Next.js and Payload do (Vercel sets real env vars).
try {
  process.loadEnvFile(".env");
} catch {}

// Print which settings are present (names only, never values) to make a
// failed deploy easy to diagnose from the build log.
const vars = ["DATABASE_URL", "PAYLOAD_SECRET", "BLOB_STORE_ID", "BLOB_READ_WRITE_TOKEN"];
console.log(
  `[wireless-india] env (${process.env.VERCEL_ENV ?? "local"}): ` +
    vars.map((v) => `${v}=${process.env[v] ? "set" : "missing"}`).join(", "),
);

// Where the database lives (region only, no credentials). Vercel functions must
// run in the same region, or every admin page pays the round trip many times over.
if (process.env.DATABASE_URL) {
  try {
    const host = new URL(process.env.DATABASE_URL).hostname;
    const labels = host.split(".");
    const region = labels.find((l) => /^[a-z]+-[a-z]+-\d+$/.test(l)) ?? labels.slice(1, -2).join(".");
    console.log(
      `[wireless-india] database region: ${region || "unknown"}, pooled connection: ${host.includes("-pooler") ? "yes" : "no"}`,
    );
  } catch {}
}

if (process.env.DATABASE_URL) {
  if (!process.env.PAYLOAD_SECRET) {
    console.error(
      `[wireless-india] PAYLOAD_SECRET is missing for the "${process.env.VERCEL_ENV}" environment. ` +
        "Add it in Vercel → Settings → Environment Variables (tick Preview and Production).",
    );
    process.exit(1);
  }
  run("npx payload migrate");
} else {
  console.log("DATABASE_URL not set — skipping Payload migrations (site will use the seed catalog).");
}
run("npx next build");
