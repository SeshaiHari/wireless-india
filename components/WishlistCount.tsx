"use client";

import { useEffect, useState } from "react";
import { FAVOURITES_EVENT, getFavourites } from "@/lib/favourites";

export function WishlistCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sync = () => setCount(getFavourites().length);
    sync();
    window.addEventListener(FAVOURITES_EVENT, sync);
    return () => window.removeEventListener(FAVOURITES_EVENT, sync);
  }, []);

  if (count === 0) return null;
  return <span className="num">{count}</span>;
}
