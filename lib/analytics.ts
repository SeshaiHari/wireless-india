// Visitor analytics via Umami (https://umami.is): open source, cookie-free,
// no personal data stored, so no consent banner is needed.
//
// Analytics is off unless NEXT_PUBLIC_UMAMI_WEBSITE_ID is set. Page views are
// recorded automatically by the Umami script (including client-side route
// changes). The custom events below are the lead funnel:
//
//   category_view   → product_view → add_to_cart → whatsapp_click (kind=order)
//
// plus whatsapp_click (kind=chat / contact_form) and call_click for enquiries.

export type AnalyticsEvent =
  | "product_view"
  | "category_view"
  | "add_to_cart"
  | "whatsapp_click"
  | "call_click";

export type EventData = Record<string, string | number | boolean | undefined>;

interface UmamiTracker {
  track: (event: string, data?: Record<string, string | number | boolean>) => void;
}

declare global {
  interface Window {
    umami?: UmamiTracker;
  }
}

// Events fired before the (deferred) Umami script has loaded are held here
// and sent once it is ready, so early events like product_view aren't lost.
const queue: Array<[AnalyticsEvent, EventData | undefined]> = [];

function clean(data?: EventData): Record<string, string | number | boolean> | undefined {
  if (!data) return undefined;
  const out: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined || v === "" || (typeof v === "number" && !Number.isFinite(v))) continue;
    // Umami caps string values at 500 characters.
    out[k] = typeof v === "string" ? v.slice(0, 500) : v;
  }
  return out;
}

/** Record a custom event. Safe to call anywhere; does nothing on the server or when analytics is off. */
export function track(event: AnalyticsEvent, data?: EventData): void {
  if (typeof window === "undefined") return;
  if (!process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID) return;
  if (window.umami) {
    try {
      window.umami.track(event, clean(data));
    } catch {
      // Never let analytics break the page.
    }
  } else if (queue.length < 50) {
    queue.push([event, data]);
  }
}

/** Called once the Umami script has loaded. */
export function flushQueue(): void {
  while (queue.length && window.umami) {
    const [event, data] = queue.shift()!;
    track(event, data);
  }
}
