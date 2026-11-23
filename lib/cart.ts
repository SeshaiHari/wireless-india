// Client-side cart, persisted in localStorage (same pattern as lib/favourites.ts).
// Only product ids + quantities are stored; names and prices are always read
// fresh from the catalog (Payload or seed), so CMS price edits show up in the cart.

import { useSyncExternalStore } from "react";

const KEY = "wi-cart";
export const CART_EVENT = "wi-cart-updated";
export const MAX_QTY = 99;

export interface CartLine {
  id: string;
  qty: number;
}

function clampQty(qty: number): number {
  if (!Number.isFinite(qty)) return 1;
  return Math.min(MAX_QTY, Math.max(1, Math.floor(qty)));
}

export function getCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    if (!Array.isArray(raw)) return [];
    return raw
      .filter((l) => l && typeof l.id === "string")
      .map((l) => ({ id: l.id, qty: clampQty(Number(l.qty)) }));
  } catch {
    return [];
  }
}

function save(lines: CartLine[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    // Storage unavailable (private mode etc.) — cart just won't persist.
  }
  window.dispatchEvent(new Event(CART_EVENT));
}

/** Add `qty` of a product, merging with any existing line. */
export function addToCart(id: string, qty = 1): void {
  const lines = getCart();
  const existing = lines.find((l) => l.id === id);
  if (existing) existing.qty = clampQty(existing.qty + qty);
  else lines.push({ id, qty: clampQty(qty) });
  save(lines);
}

/** Set a line's quantity; 0 or less removes it. */
export function setCartQty(id: string, qty: number): void {
  const lines = getCart();
  save(
    qty <= 0
      ? lines.filter((l) => l.id !== id)
      : lines.map((l) => (l.id === id ? { ...l, qty: clampQty(qty) } : l)),
  );
}

export function removeFromCart(id: string): void {
  setCartQty(id, 0);
}

export function clearCart(): void {
  save([]);
}

/** Total number of units in the cart (for the header badge). */
export function cartUnitCount(lines: CartLine[] = getCart()): number {
  return lines.reduce((n, l) => n + l.qty, 0);
}

// --- React binding -----------------------------------------------------------

let cachedRaw: string | null | undefined;
let cachedLines: CartLine[] = [];

function readSnapshot(): CartLine[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    raw = null;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedLines = getCart();
  }
  return cachedLines;
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener(CART_EVENT, onChange);
  window.addEventListener("storage", onChange); // keep multiple tabs in step
  return () => {
    window.removeEventListener(CART_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/**
 * Live cart lines. Returns null during server render / hydration (cart is
 * unknown there), then the stored lines on the client.
 */
export function useCart(): CartLine[] | null {
  return useSyncExternalStore<CartLine[] | null>(subscribe, readSnapshot, () => null);
}
