import type { CSSProperties } from "react";

// Icon paths lifted verbatim from the design prototypes so strokes match 1:1.
const PATHS: Record<string, React.ReactNode> = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  heart: (
    <path d="M12 21s-7-4.5-9.5-9.5C1 8 3 4.5 6.5 4.5c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3 3.5 0 5.5 3.5 4 7-2.5 5-9.5 9.5-9.5 9.5z" />
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" />
    </>
  ),
  arrowRight: <path d="M5 12h14m-6-6 6 6-6 6" />,
  arrowUpRight: <path d="M7 17 17 7M9 7h8v8" />,
  chevronLeft: <path d="m15 18-6-6 6-6" />,
  chevronRight: <path d="m9 6 6 6-6 6" />,
  whatsapp: <path d="M3 21l2-5a9 9 0 1 1 4 4l-6 1z" />,
  phone: <path d="M5 4h4l2 5-3 2a12 12 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A18 18 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  pin: (
    <>
      <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 1 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  bag: (
    <>
      <path d="M3 7h18l-2 13H5z" />
      <path d="M8 7V5a4 4 0 0 1 8 0v2" />
    </>
  ),
  shield: <path d="M12 2 4 6v6c0 5 8 10 8 10s8-5 8-10V6z" />,
  pulse: <path d="M3 12h4l3-8 4 16 3-8h4" />,
  check: <path d="m5 12 5 5L20 7" />,
  menu: <path d="M3 6h18M3 12h18M3 18h18" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6m0 3v.5" />
    </>
  ),
  diamond: <path d="M3 12h18M12 3l9 9-9 9-9-9z" />,
  truck: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M7 18v2m10-2v2" />
    </>
  ),
  invoice: (
    <>
      <path d="M21 8H3M21 8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2m18 0v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8" />
      <path d="M7 14h4" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </>
  ),
  rows: <path d="M3 6h18M3 12h18M3 18h18" />,
};

export type IconName = keyof typeof PATHS;

export function Icon({
  name,
  size,
  className,
  style,
}: {
  name: IconName;
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const sizeStyle = size ? { width: size, height: size } : undefined;
  return (
    <svg
      className={`i${className ? ` ${className}` : ""}`}
      viewBox="0 0 24 24"
      style={{ ...sizeStyle, ...style }}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
