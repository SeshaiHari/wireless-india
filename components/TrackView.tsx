"use client";

import { useEffect } from "react";
import { track, type AnalyticsEvent, type EventData } from "@/lib/analytics";

/** Records one event when a page mounts (e.g. product_view). Renders nothing. */
export function TrackView({ event, data }: { event: AnalyticsEvent; data: EventData }) {
  const key = JSON.stringify(data);
  useEffect(() => {
    track(event, JSON.parse(key) as EventData);
  }, [event, key]);
  return null;
}
