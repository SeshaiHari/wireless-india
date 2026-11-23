// Vercel build: apply Payload migrations first when a database is configured,
// then build. Without DATABASE_URL the site builds on the seed catalog.
import { execSync } from "node:child_process";

const run = (cmd) => execSync(cmd, { stdio: "inherit" });

// Locally, pick up .env like Next.js and Payload do (Vercel sets real env vars).
try {
  process.loadEnvFile(".env");
} catch {}

if (process.env.DATABASE_URL) {
  run("npx payload migrate");
} else {
  console.log("DATABASE_URL not set — skipping Payload migrations (site will use the seed catalog).");
}
run("npx next build");
