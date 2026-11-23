import { headers as getHeaders } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";
import { migrateFromSanity } from "@/lib/migration/sanity";
import { revalidateCatalog } from "@/payload/hooks";

// One-off Sanity → Payload copy that runs on Vercel, using the env vars already
// set there (DATABASE_URL, BLOB_READ_WRITE_TOKEN, NEXT_PUBLIC_SANITY_PROJECT_ID).
// Only a logged-in Payload admin can run it. Safe to run more than once.
// Delete this route once the move from Sanity is finished.

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const page = (body: string, status = 200) =>
  new Response(
    `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Copy content from Sanity</title>
<style>body{font:16px/1.5 system-ui,sans-serif;max-width:720px;margin:40px auto;padding:0 16px}
pre{background:#f4f4f4;padding:12px;white-space:pre-wrap;font-size:13px}button{font-size:16px;padding:10px 18px;cursor:pointer}</style>
<h1>Copy content from Sanity</h1>${body}`,
    { status, headers: { "content-type": "text/html; charset=utf-8" } },
  );

const escape = (s: string) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!);

async function adminUser() {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await getHeaders() });
  return { payload, user };
}

export async function GET() {
  const { user } = await adminUser();
  if (!user) {
    return page(`<p>Please <a href="/admin">log in to the admin</a> first (create the first user if asked), then come back to this page.</p>`, 401);
  }
  return page(`<p>Logged in as ${escape(String(user.email ?? ""))}.</p>
<p>This copies all published shop settings, brands, categories, products and images from Sanity into Payload. Existing items are updated, not duplicated. It takes a minute or two.</p>
<form method="post"><button type="submit">Start copying</button></form>`);
}

export async function POST() {
  const { payload, user } = await adminUser();
  if (!user) return page(`<p>Not logged in. <a href="/admin">Log in</a> and try again.</p>`, 401);

  const lines: string[] = [];
  let failures: string[] = [];
  try {
    ({ failures } = await migrateFromSanity(payload, (l) => lines.push(l)));
  } catch (e) {
    failures = [(e as Error).message];
    lines.push(`\nStopped: ${(e as Error).message}`);
  }
  revalidateCatalog();
  const verdict = failures.length
    ? `<p><strong>Finished with ${failures.length} problem(s).</strong> Fix them and run it again; it's safe to repeat.</p>`
    : `<p><strong>Done.</strong> Everything was copied. <a href="/">Open the site</a> or <a href="/admin">the admin</a>.</p>`;
  return page(`${verdict}<pre>${escape(lines.join("\n"))}</pre>`, failures.length ? 500 : 200);
}
