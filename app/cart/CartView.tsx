"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { clearCart, removeFromCart, setCartQty, useCart } from "@/lib/cart";
import { formatINR, parsePrice } from "@/lib/price";
import { orderLink, type OrderLine } from "@/lib/wa";
import { Icon } from "@/components/Icon";
import { QtyStepper } from "@/components/QtyStepper";
import styles from "./cart.module.css";

export function CartView({
  allProducts,
  whatsapp,
}: {
  allProducts: Product[];
  whatsapp: string;
}) {
  const cart = useCart();
  const [customer, setCustomer] = useState({ name: "", phone: "", note: "" });

  // Join stored ids with live catalog data; lines for products no longer in
  // the catalog are skipped.
  const lines: OrderLine[] = useMemo(() => {
    const byId = new Map(allProducts.map((p) => [p.id, p]));
    return (cart ?? []).flatMap((l) => {
      const product = byId.get(l.id);
      return product ? [{ product, qty: l.qty }] : [];
    });
  }, [cart, allProducts]);

  if (cart === null) return null;

  if (lines.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>
          <Icon name="bag" size={48} />
        </span>
        <h2>Your cart is empty</h2>
        <p>Add products with the quantity you need, then order them all on WhatsApp.</p>
        <Link href="/categories" className="btn">
          Browse products
        </Link>
      </div>
    );
  }

  const units = lines.reduce((n, l) => n + l.qty, 0);
  const allPriced = lines.every((l) => parsePrice(l.product.price) > 0);
  const total = lines.reduce((s, l) => s + parsePrice(l.product.price) * l.qty, 0);
  const update = (key: keyof typeof customer) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setCustomer((c) => ({ ...c, [key]: e.target.value }));

  return (
    <div className={styles.layout}>
      <ul className={styles.lines}>
        {lines.map(({ product, qty }) => {
          const unit = parsePrice(product.price);
          return (
            <li key={product.id} className={styles.line}>
              <Link href={`/product/${product.id}`} className={styles.thumb}>
                <img src={product.images[0]} alt="" loading="lazy" />
              </Link>
              <div className={styles.info}>
                <div className={styles.brand}>{product.brand}</div>
                <Link href={`/product/${product.id}`} className={styles.name}>
                  {product.name}
                </Link>
                <div className={styles.unit}>
                  {product.price} each
                  {!product.inStock && <span className={styles.oos}> · Out of stock, we&apos;ll suggest an alternative</span>}
                </div>
              </div>
              <div className={styles.controls}>
                <QtyStepper
                  size="sm"
                  value={qty}
                  label={`Quantity of ${product.name}`}
                  onChange={(n) => setCartQty(product.id, n)}
                />
                <div className={styles.lineTotal}>{unit > 0 ? formatINR(unit * qty) : product.price}</div>
                <button
                  type="button"
                  className={styles.remove}
                  onClick={() => removeFromCart(product.id)}
                  aria-label={`Remove ${product.name} from cart`}
                >
                  Remove
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <aside className={styles.summary} aria-label="Order summary">
        <h2>Order summary</h2>
        <div className={styles.sumRow}>
          <span>Items</span>
          <span>{units}</span>
        </div>
        <div className={`${styles.sumRow} ${styles.sumTotal}`}>
          <span>Estimated total</span>
          <span>{allPriced ? formatINR(total) : "On confirmation"}</span>
        </div>
        <p className={styles.fine}>Inclusive of taxes. Final price and stock are confirmed on WhatsApp.</p>

        <label className={styles.field}>
          <span>Your name <em>(optional)</em></span>
          <input value={customer.name} onChange={update("name")} placeholder="e.g. Priya R." autoComplete="name" />
        </label>
        <label className={styles.field}>
          <span>Phone <em>(optional)</em></span>
          <input value={customer.phone} onChange={update("phone")} placeholder="+91 98xxx xxxxx" inputMode="tel" autoComplete="tel" />
        </label>
        <label className={styles.field}>
          <span>Note <em>(optional)</em></span>
          <textarea
            rows={2}
            value={customer.note}
            onChange={update("note")}
            placeholder="Pickup or delivery address, preferred time…"
          />
        </label>

        <a
          className={`btn wa ${styles.send}`}
          href={orderLink(whatsapp, lines, customer)}
          target="_blank"
          rel="noopener"
        >
          <Icon name="whatsapp" /> Send order on WhatsApp
        </a>
        <button type="button" className={styles.clear} onClick={() => clearCart()}>
          Clear cart
        </button>
      </aside>
    </div>
  );
}
