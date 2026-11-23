"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import { addToCart } from "@/lib/cart";

/** Compact "Add" button for product cards (sits inside the card link). */
export function AddToCartButton({
  productId,
  productName,
  className,
}: {
  productId: string;
  productName: string;
  className?: string;
}) {
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1600);
    return () => clearTimeout(t);
  }, [added]);

  return (
    <button
      type="button"
      className={className}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(productId, 1);
        setAdded(true);
      }}
      aria-label={`Add ${productName} to cart`}
    >
      <Icon name={added ? "check" : "bag"} size={14} />
      {added ? "Added" : "Add"}
    </button>
  );
}
