import { createClient, type SanityClient } from "next-sanity";
import { apiVersion, dataset, projectId, sanityConfigured } from "@/lib/sanity/config";

// Only build a real client when configured. In seed-fallback mode the queries
// module is never called, so a guard proxy keeps imports cheap and avoids
// constructing a client with an empty projectId.
export const sanityClient: SanityClient = sanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: "published",
    })
  : (new Proxy(
      {},
      {
        get() {
          throw new Error("Sanity is not configured (missing NEXT_PUBLIC_SANITY_PROJECT_ID).");
        },
      },
    ) as unknown as SanityClient);
