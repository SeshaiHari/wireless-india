"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import { FAVOURITES_EVENT, getFavourites, toggleFavourite } from "@/lib/favourites";

export function FavouriteButton({
  productId,
  className,
}: {
  productId: string;
  className?: string;
}) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(getFavourites().includes(productId));
    const sync = () => setActive(getFavourites().includes(productId));
    window.addEventListener(FAVOURITES_EVENT, sync);
    return () => window.removeEventListener(FAVOURITES_EVENT, sync);
  }, [productId]);

  return (
    <button
      className={className}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavourite(productId);
      }}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      title={active ? "Remove from wishlist" : "Add to wishlist"}
      style={
        active
          ? { color: "var(--color-accent)", borderColor: "var(--color-accent)" }
          : undefined
      }
    >
      <Icon
        name="heart"
        style={active ? { fill: "var(--color-accent)", stroke: "var(--color-accent)" } : undefined}
      />
    </button>
  );
}
