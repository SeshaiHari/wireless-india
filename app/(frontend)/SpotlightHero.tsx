import Link from "next/link";
import type { Category, Product, ShopSettings } from "@/lib/types";
import { discountPct } from "@/lib/price";
import { orderLink, waLink } from "@/lib/wa";
import { Icon } from "@/components/Icon";
import { AddToCartButton } from "@/components/AddToCartButton";
import styles from "./page.module.css";

/**
 * Home hero for single-category mode: a large banner for the one visible
 * category beside a spotlight on its featured product, with direct
 * Buy on WhatsApp and Add to cart actions.
 */
export function SpotlightHero({
  category,
  product,
  productCount,
  shop,
}: {
  category: Category | null;
  product: Product | null;
  productCount: number;
  shop: ShopSettings;
}) {
  const pct = product ? discountPct(product.price, product.was) : null;
  const title = category?.name ?? shop.name;
  // A "10 categories" stat would contradict a single-category shop.
  const stats = shop.heroStats
    .filter((s) => !/categor/i.test(s.label))
    .slice(0, 4);

  return (
    <section className={styles.hero}>
      <div className="wrap">
        <div className={styles.spotlight}>
          {/* Category banner */}
          <article className={`${styles.btile} ${styles.brand} ${styles.spotBanner}`}>
            <div>
              <span className={styles.eye}>
                <span className={styles.dot} /> Now in store
              </span>
              <h1>
                {title}
                <em>.</em>
              </h1>
              <p>
                {category?.blurb
                  ? `${category.blurb}. Hear it at the counter, or order straight from WhatsApp.`
                  : "Walk in, or order straight from WhatsApp."}
              </p>
            </div>
            <div>
              <div className={styles.spotCtas}>
                <a className="btn accent" href="#products">
                  {productCount > 0
                    ? `See all ${productCount} ${productCount === 1 ? "product" : "products"}`
                    : "See products"}
                  <Icon name="arrowRight" size={14} />
                </a>
                <a
                  className="btn ghost on-dark"
                  href={waLink(shop.whatsapp)}
                  target="_blank"
                  rel="noopener"
                >
                  <Icon name="whatsapp" size={14} />
                  Ask us on WhatsApp
                </a>
              </div>
              {stats.length > 0 && (
                <div className={styles.stats}>
                  {stats.map((s) => (
                    <div key={s.label}>
                      <b>{s.value}</b>
                      {s.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </article>

          {/* Featured product spotlight */}
          {product && (
            <article className={`${styles.btile} ${styles.feature} ${styles.spotProduct}`}>
              <span className={`${styles.tag} ${styles.hot}`}>
                {pct ? `${product.tag ?? "Deal"} · -${pct}%` : product.tag ?? "Featured"}
              </span>
              <div className={styles.spotBody}>
                <div className={styles.metaRow}>
                  <span className={styles.brandTag}>{product.brand}</span>
                  <h2>
                    <Link href={`/product/${product.id}`}>{product.name}</Link>
                  </h2>
                  {(product.highlights ?? product.specs).length > 0 && (
                    <div className={styles.featureSpecs}>
                      {(product.highlights ?? product.specs).slice(0, 6).map((s) => (
                        <span key={s}>{s}</span>
                      ))}
                    </div>
                  )}
                  <div className={styles.spotPrice}>
                    {product.price}
                    {product.was && <span className={styles.was}>{product.was}</span>}
                  </div>
                  <div className={styles.spotActions}>
                    <a
                      className="btn wa"
                      href={orderLink(shop.whatsapp, [{ product, qty: 1 }])}
                      target="_blank"
                      rel="noopener"
                    >
                      <Icon name="whatsapp" size={16} />
                      Buy on WhatsApp
                    </a>
                    <AddToCartButton
                      productId={product.id}
                      productName={product.name}
                      className="btn ghost"
                    />
                  </div>
                  <Link className={styles.spotDetails} href={`/product/${product.id}`}>
                    Full specs &amp; photos <Icon name="arrowRight" size={12} />
                  </Link>
                </div>
                <Link
                  className={styles.spotImg}
                  href={`/product/${product.id}`}
                  aria-label={`View ${product.name}`}
                >
                  <img src={product.images[0]} alt={product.name} />
                </Link>
              </div>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
