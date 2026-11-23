"use client";

import { cartUnitCount, useCart } from "@/lib/cart";

/** Badge showing how many units are in the cart (hidden when empty). */
export function CartCount() {
  const cart = useCart();
  const count = cart ? cartUnitCount(cart) : 0;
  if (count === 0) return null;
  return (
    <span className="num" aria-label={`${count} items in cart`}>
      {count}
    </span>
  );
}
