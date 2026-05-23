import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

// Sanity webhook target. Configure a webhook in sanity.io/manage that POSTs to
//   https://<your-site>/api/revalidate?secret=<SANITY_REVALIDATE_SECRET>
// on create/update/delete of any document. This purges the cached catalog so
// edits in the Studio appear on the live site within seconds.
export async function POST(req: NextRequest) {
  const secret =
    req.nextUrl.searchParams.get("secret") ??
    req.headers.get("x-revalidate-secret");

  if (!process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json(
      { revalidated: false, message: "SANITY_REVALIDATE_SECRET not set" },
      { status: 500 },
    );
  }
  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json(
      { revalidated: false, message: "Invalid secret" },
      { status: 401 },
    );
  }

  // Next 16: second arg sets the cache profile; { expire: 0 } purges now.
  revalidateTag("catalog", { expire: 0 });
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
