"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";
import { OPEN_SEARCH_EVENT } from "@/lib/search";
import styles from "./SearchModal.module.css";

type Hit = {
  id: string;
  name: string;
  brand: string;
  price: string;
  categoryId: string;
  image: string | null;
  specs: string[];
};

type SearchData = {
  products: Hit[];
  categories: { id: string; name: string }[];
};

function scoreHit(hit: Hit, catMap: Map<string, string>, q: string): number {
  const lq = q.toLowerCase();
  let s = 0;
  if (hit.name.toLowerCase().includes(lq)) s += 10;
  if (hit.brand.toLowerCase().includes(lq)) s += 6;
  const cat = catMap.get(hit.categoryId) ?? "";
  if (cat.toLowerCase().includes(lq)) s += 4;
  if (hit.specs.some((sp) => sp.toLowerCase().includes(lq))) s += 2;
  return s;
}

export function SearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [data, setData] = useState<SearchData | null>(null);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dataLoaded = useRef(false);
  const router = useRouter();

  const openModal = useCallback(() => {
    setOpen(true);
    if (!dataLoaded.current) {
      dataLoaded.current = true;
      fetch("/api/search")
        .then((r) => r.json())
        .then(setData)
        .catch(() => { dataLoaded.current = false; });
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openModal();
      }
      if (e.key === "Escape") setOpen(false);
    };
    const onEvent = () => openModal();
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_SEARCH_EVENT, onEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_SEARCH_EVENT, onEvent);
    };
  }, [openModal]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 30);
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setActive(0);
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const catMap = new Map(data?.categories.map((c) => [c.id, c.name]) ?? []);

  const q = query.trim();
  const results: Hit[] = q && data
    ? data.products
        .map((p) => ({ p, s: scoreHit(p, catMap, q) }))
        .filter((r) => r.s > 0)
        .sort((a, b) => b.s - a.s)
        .slice(0, 8)
        .map((r) => r.p)
    : [];

  function go(id: string) {
    setOpen(false);
    router.push(`/product/${id}`);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      go(results[active].id);
    }
  }

  return (
    <>
      {/* Desktop trigger — hidden on mobile via CSS */}
      <button className={styles.trigger} onClick={openModal} aria-label="Open search">
        <Icon name="search" />
        <span className={styles.triggerPlaceholder}>Search products…</span>
        <span className={styles.kbd}>⌘ K</span>
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          className={styles.overlay}
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Search"
        >
          <div className={styles.box} onClick={(e) => e.stopPropagation()}>

            <div className={styles.inputRow}>
              <Icon name="search" />
              <input
                ref={inputRef}
                className={styles.input}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setActive(0); }}
                onKeyDown={onKeyDown}
                placeholder='Try "multimeter", "HDMI 2m", "Zeb soundbar"…'
                aria-label="Search"
                autoComplete="off"
                spellCheck={false}
              />
              {query && (
                <button
                  className={styles.clearBtn}
                  onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
              <button className={styles.escBtn} onClick={() => setOpen(false)}>
                ESC
              </button>
            </div>

            {q ? (
              results.length > 0 ? (
                <ul className={styles.results} role="listbox">
                  {results.map((hit, i) => (
                    <li key={hit.id} role="option" aria-selected={i === active}>
                      <button
                        className={`${styles.result} ${i === active ? styles.resultOn : ""}`}
                        onClick={() => go(hit.id)}
                        onMouseEnter={() => setActive(i)}
                      >
                        <div className={styles.rThumb}>
                          {hit.image
                            ? <img src={hit.image} alt="" />
                            : <Icon name="bag" size={18} />}
                        </div>
                        <div className={styles.rBody}>
                          <div className={styles.rName}>{hit.name}</div>
                          <div className={styles.rMeta}>
                            {hit.brand}
                            <span className={styles.dot}>·</span>
                            {catMap.get(hit.categoryId)}
                          </div>
                        </div>
                        <div className={styles.rPrice}>{hit.price}</div>
                        <Icon name="arrowRight" size={14} className={styles.rArrow} />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={styles.empty}>
                  No products found for <b>&ldquo;{q}&rdquo;</b>
                </div>
              )
            ) : (
              <div className={styles.hint}>
                <Icon name="search" size={32} />
                <span>Start typing to search across all products</span>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}
