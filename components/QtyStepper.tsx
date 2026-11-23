"use client";

import { MAX_QTY } from "@/lib/cart";
import styles from "./QtyStepper.module.css";

export function QtyStepper({
  value,
  onChange,
  min = 1,
  label = "Quantity",
  size = "md",
}: {
  value: number;
  onChange: (qty: number) => void;
  min?: number;
  label?: string;
  size?: "sm" | "md";
}) {
  const set = (n: number) => onChange(Math.min(MAX_QTY, Math.max(min, n)));

  return (
    <div className={`${styles.stepper} ${size === "sm" ? styles.sm : ""}`} role="group" aria-label={label}>
      <button type="button" onClick={() => set(value - 1)} disabled={value <= min} aria-label="Decrease quantity">
        −
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={MAX_QTY}
        value={value}
        aria-label={label}
        onChange={(e) => {
          const n = parseInt(e.target.value, 10);
          if (!Number.isNaN(n)) set(n);
        }}
      />
      <button type="button" onClick={() => set(value + 1)} disabled={value >= MAX_QTY} aria-label="Increase quantity">
        +
      </button>
    </div>
  );
}
