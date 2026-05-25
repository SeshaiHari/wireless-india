"use client";

import { Icon } from "@/components/Icon";
import { OPEN_SEARCH_EVENT } from "@/lib/search";

export function MobileSearchButton({ className }: { className?: string }) {
  return (
    <button
      className={`icon-btn${className ? ` ${className}` : ""}`}
      aria-label="Search"
      title="Search"
      onClick={() => window.dispatchEvent(new Event(OPEN_SEARCH_EVENT))}
    >
      <Icon name="search" />
    </button>
  );
}
