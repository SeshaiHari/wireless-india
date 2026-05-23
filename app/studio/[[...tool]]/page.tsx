import { sanityConfigured } from "@/lib/sanity/config";
import Studio from "./Studio";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!sanityConfigured) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          fontFamily: "system-ui, sans-serif",
          padding: 24,
          textAlign: "center",
          color: "#0e0e0c",
          background: "#fafaf7",
        }}
      >
        <div style={{ maxWidth: 460 }}>
          <h1 style={{ fontSize: 22, marginBottom: 12 }}>Studio not configured</h1>
          <p style={{ color: "#45433e", lineHeight: 1.6 }}>
            Set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> (and{" "}
            <code>NEXT_PUBLIC_SANITY_DATASET</code>) in <code>.env.local</code>,
            then restart. See <code>README.md</code> → “Connect Sanity”. Until
            then the site runs from the local seed catalog.
          </p>
        </div>
      </div>
    );
  }
  return <Studio />;
}
