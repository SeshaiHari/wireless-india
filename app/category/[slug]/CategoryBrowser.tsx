"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Category, Product } from "@/lib/types";
import { parsePrice } from "@/lib/price";
import { ProductCard } from "@/components/ProductCard";
import styles from "./category.module.css";

export function CategoryBrowser({
  category,
  products,
  allCategories,
  countsByCategory,
}: {
  category: Category;
  products: Product[];
  allCategories: Category[];
  countsByCategory: Record<string, number>;
}) {
  // Brand facets derived from the actual products in this category.
  const brandCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const p of products) m.set(p.brand, (m.get(p.brand) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [products]);

  const priceBounds = useMemo(() => {
    const nums = products.map((p) => parsePrice(p.price)).filter((n) => !isNaN(n));
    return { min: Math.min(...nums, 0), max: Math.max(...nums, 0) };
  }, [products]);

  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState("recommended");
  const [showFilters, setShowFilters] = useState(false);

  const toggleBrand = (b: string) =>
    setSelectedBrands((prev) => {
      const next = new Set(prev);
      if (next.has(b)) next.delete(b);
      else next.add(b);
      return next;
    });

  const clearAll = () => {
    setSelectedBrands(new Set());
    setMinPrice("");
    setMaxPrice("");
    setInStockOnly(false);
  };

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (selectedBrands.size && !selectedBrands.has(p.brand)) return false;
      if (inStockOnly && !p.inStock) return false;
      const n = parsePrice(p.price);
      if (minPrice !== "" && n < minPrice) return false;
      if (maxPrice !== "" && n > maxPrice) return false;
      return true;
    });
    const by = (f: (p: Product) => number) => (a: Product, b: Product) =>
      f(a) - f(b);
    if (sort === "price-asc") list = [...list].sort(by((p) => parsePrice(p.price)));
    else if (sort === "price-desc")
      list = [...list].sort(by((p) => -parsePrice(p.price)));
    else if (sort === "name")
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, selectedBrands, minPrice, maxPrice, inStockOnly, sort]);

  const hasActiveFilters =
    selectedBrands.size > 0 || minPrice !== "" || maxPrice !== "" || inStockOnly;

  return (
    <div className={styles.shell}>
      {/* Sidebar */}
      <aside className={`${styles.filters} ${showFilters ? styles.filtersOpen : ""}`}>
        <div>
          <h2>
            Browse categories <span>{allCategories.length}</span>
          </h2>
          <div className={styles.catQuick}>
            {allCategories.map((c) => (
              <Link
                key={c.id}
                href={`/category/${c.id}`}
                className={c.id === category.id ? styles.on : undefined}
              >
                {c.name} <span className={styles.c}>{countsByCategory[c.id] ?? 0}</span>
              </Link>
            ))}
          </div>
        </div>

        {brandCounts.length > 0 && (
          <div>
            <h2>
              Brand
              {selectedBrands.size > 0 && (
                <button
                  className={styles.clear}
                  onClick={() => setSelectedBrands(new Set())}
                >
                  Clear
                </button>
              )}
            </h2>
            <div className={styles.group}>
              {brandCounts.map(([b, n]) => (
                <label key={b}>
                  <input
                    type="checkbox"
                    checked={selectedBrands.has(b)}
                    onChange={() => toggleBrand(b)}
                  />
                  {b}
                  <span className={styles.c}>{n}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2>Price (₹)</h2>
          <div className={styles.priceRow}>
            <input
              type="number"
              inputMode="numeric"
              placeholder={`Min ${priceBounds.min}`}
              value={minPrice}
              onChange={(e) =>
                setMinPrice(e.target.value === "" ? "" : Number(e.target.value))
              }
              aria-label="Minimum price"
            />
            <input
              type="number"
              inputMode="numeric"
              placeholder={`Max ${priceBounds.max}`}
              value={maxPrice}
              onChange={(e) =>
                setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))
              }
              aria-label="Maximum price"
            />
          </div>
        </div>

        <div>
          <h2>Availability</h2>
          <div className={styles.group}>
            <label>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
              />
              In stock today
              <span className={styles.c}>
                {products.filter((p) => p.inStock).length}
              </span>
            </label>
          </div>
        </div>
      </aside>

      {/* Results column (page-level <main> lives in the page wrapper) */}
      <div>
        {hasActiveFilters && (
          <div className={styles.activeChips}>
            {[...selectedBrands].map((b) => (
              <button key={b} className={styles.chipTag} onClick={() => toggleBrand(b)}>
                Brand: {b} <span className={styles.x}>×</span>
              </button>
            ))}
            {(minPrice !== "" || maxPrice !== "") && (
              <button
                className={styles.chipTag}
                onClick={() => {
                  setMinPrice("");
                  setMaxPrice("");
                }}
              >
                ₹{minPrice || priceBounds.min} – ₹{maxPrice || priceBounds.max}{" "}
                <span className={styles.x}>×</span>
              </button>
            )}
            {inStockOnly && (
              <button className={styles.chipTag} onClick={() => setInStockOnly(false)}>
                In stock today <span className={styles.x}>×</span>
              </button>
            )}
            <button className={styles.clearAll} onClick={clearAll}>
              Clear all
            </button>
          </div>
        )}

        <div className={styles.toolbar}>
          <div className={styles.left}>
            <span>
              SHOWING <b>{filtered.length}</b> OF <b>{products.length}</b>
            </span>
          </div>
          <div className={styles.right}>
            <button
              type="button"
              className={styles.filterToggle}
              onClick={() => setShowFilters((v) => !v)}
              aria-expanded={showFilters}
            >
              {showFilters ? "Hide filters" : "Filters"}
              {hasActiveFilters ? " •" : ""}
            </button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort products"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="name">Name: A–Z</option>
            </select>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className={styles.grid}>
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} variant="withSpecs" />
            ))}
          </div>
        ) : (
          <p className={styles.empty}>
            No products match these filters.{" "}
            <button className={styles.clearAll} onClick={clearAll}>
              Clear all
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
