"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { addToCart } from "@/lib/cart";
import { orderLink, telHref } from "@/lib/wa";
import { Icon } from "@/components/Icon";
import { QtyStepper } from "@/components/QtyStepper";
import styles from "./product.module.css";

/** Quantity picker + Add to cart + direct WhatsApp order for one product. */
export function ProductBuyBox({
  product,
  whatsapp,
  phone,
}: {
  product: Product;
  whatsapp: string;
  phone: string;
}) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <>
      <div className={styles.ctas}>
        <QtyStepper value={qty} onChange={(n) => { setQty(n); setAdded(false); }} />
        <button
          type="button"
          className="btn"
          onClick={() => {
            addToCart(product.id, qty);
            setAdded(true);
          }}
        >
          <Icon name="bag" /> {added ? "Added to cart" : "Add to cart"}
        </button>
      </div>
      <div className={styles.ctas}>
        <a
          className="btn wa"
          href={orderLink(whatsapp, [{ product, qty }])}
          target="_blank"
          rel="noopener"
        >
          <Icon name="whatsapp" /> Buy {qty > 1 ? `${qty} ` : ""}on WhatsApp
        </a>
        <a className="btn ghost" href={telHref(phone)}>
          <Icon name="phone" /> Call
        </a>
      </div>
      <p className={styles.addedMsg} role="status" aria-live="polite">
        {added && (
          <>
            {qty} × {product.name} added.{" "}
            <Link href="/cart">View cart &amp; order on WhatsApp →</Link>
          </>
        )}
      </p>
    </>
  );
}
