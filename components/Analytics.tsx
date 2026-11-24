"use client";

import { useEffect } from "react";
import Script from "next/script";
import { flushQueue, track } from "@/lib/analytics";

const WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
const SCRIPT_URL = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL || "https://cloud.umami.is/script.js";
// Comma-separated hostnames to record (e.g. "wirelessindia.in"). Keeps
// localhost and Vercel preview deployments out of the numbers.
const DOMAINS = process.env.NEXT_PUBLIC_UMAMI_DOMAINS;

/**
 * Loads Umami and records every WhatsApp and phone link click as a lead,
 * wherever the link sits on the site.
 *
 * Links describe themselves with data attributes:
 *   data-track="cart"            where on the site it is (on the link or any ancestor)
 *   data-track-kind="order"      "order" for links that carry an order; default "chat"
 *   data-track-product, data-track-items, data-track-units, data-track-value
 */
export function Analytics() {
  useEffect(() => {
    if (!WEBSITE_ID) return;
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      const isWhatsApp = /^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href);
      const isCall = href.startsWith("tel:");
      if (!isWhatsApp && !isCall) return;

      const placement =
        (link.closest("[data-track]") as HTMLElement | null)?.dataset.track ?? "other";
      const d = link.dataset;
      const common = { placement, page: window.location.pathname };

      if (isCall) {
        track("call_click", common);
        return;
      }
      track("whatsapp_click", {
        ...common,
        kind: d.trackKind ?? "chat",
        product: d.trackProduct,
        items: d.trackItems ? Number(d.trackItems) : undefined,
        units: d.trackUnits ? Number(d.trackUnits) : undefined,
        value: d.trackValue ? Number(d.trackValue) : undefined,
      });
    };
    // Capture phase, so links whose handlers stop propagation still count.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  if (!WEBSITE_ID) return null;
  return (
    <Script
      src={SCRIPT_URL}
      data-website-id={WEBSITE_ID}
      {...(DOMAINS ? { "data-domains": DOMAINS } : {})}
      strategy="afterInteractive"
      onLoad={flushQueue}
    />
  );
}
