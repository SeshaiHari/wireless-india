"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { FAVOURITES_EVENT, getFavourites } from "@/lib/favourites";
import { ProductCard } from "@/components/ProductCard";
import styles from "./favourites.module.css";

export function FavouritesShelf({ allProducts }: { allProducts: Product[] }) {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setIds(getFavourites());
    sync();
    setReady(true);
    window.addEventListener(FAVOURITES_EVENT, sync);
    return () => window.removeEventListener(FAVOURITES_EVENT, sync);
  }, []);

  if (!ready) return null;

  const saved = allProducts.filter((p) => ids.includes(p.id));

  if (saved.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>♡</span>
        <h2>Your wishlist is empty</h2>
        <p>Tap the heart on any product to save it here.</p>
        <Link href="/categories" className="btn">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {saved.map((p) => (
        <ProductCard key={p.id} product={p} variant="withSpecs" />
      ))}
    </div>
  );
}
