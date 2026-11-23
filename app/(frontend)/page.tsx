import Link from "next/link";
import {
  getBrands,
  getCategories,
  getFeaturedProducts,
  getShopSettings,
} from "@/lib/catalog";
import type { Product } from "@/lib/types";
import { discountPct } from "@/lib/price";
import { waLink } from "@/lib/wa";
import { localBusinessJsonLd } from "@/lib/jsonld";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductCard } from "@/components/ProductCard";
import { CategoryCard } from "@/components/CategoryCard";
import styles from "./page.module.css";

// Small-tile badge: show discount for deals, otherwise the tag text.
function smallBadge(p: Product) {
  const pct = discountPct(p.price, p.was);
  if ((p.tag === "Hot deal" || p.tag === "Best deal") && pct) {
    return { text: `-${pct}%`, cls: styles.hot };
  }
  if (p.tag === "New") return { text: "New", cls: styles.new };
  if (p.tag) return { text: p.tag, cls: "" };
  return null;
}

export default async function HomePage() {
  const [shop, categories, featured, brands] = await Promise.all([
    getShopSettings(),
    getCategories(),
    getFeaturedProducts(),
    getBrands(),
  ]);

  const pick = (id: string) => featured.find((p) => p.id === id);
  const feature = pick("zeb-juke-bar-9750-pro") ?? featured[0];
  const smallIds = [
    "astroai-am33d",
    "stone-spinx-pro",
    "sandisk-ultra-dual",
    "usb-c-power-strip",
  ];
  const smalls = smallIds
    .map(pick)
    .filter((p): p is Product => Boolean(p))
    .concat(featured.filter((p) => p.id !== feature?.id))
    .slice(0, 4);

  const featurePct = feature ? discountPct(feature.price, feature.was) : null;
  const featureCategory =
    categories.find((c) => c.id === feature?.categoryId)?.name ?? "";

  return (
    <>
      <JsonLd data={localBusinessJsonLd(shop)} />
      <SiteHeader categories={categories} shop={shop} variant="home" />

      <main id="main">
      {/* ===== Hero bento ===== */}
      <section className={styles.hero}>
        <div className="wrap">
          <div className={styles.bento}>
            {/* Brand manifesto tile */}
            <article className={`${styles.btile} ${styles.brand}`}>
              <div>
                <span className={styles.eye}>
                  <span className={styles.dot} /> Stocked ·{" "}
                  {new Date().toLocaleString("en-IN", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <h1>
                  From a single <em>resistor</em>, to a full <em>soundstage.</em>
                </h1>
                <p>
                  Audio, multimeters, ICs, cables, peripherals &amp; tools —
                  stocked, sorted, ready to walk out with.
                </p>
              </div>
              <div>
                <div className={styles.ctas}>
                  <Link className="btn accent" href="/categories">
                    Browse the shop
                    <Icon name="arrowRight" size={14} />
                  </Link>
                  <a
                    className="btn ghost on-dark"
                    href={waLink(shop.whatsapp)}
                    target="_blank"
                    rel="noopener"
                  >
                    <Icon name="whatsapp" size={14} />
                    WhatsApp us
                  </a>
                </div>
                <div className={styles.stats}>
                  {shop.heroStats.slice(0, 4).map((s) => (
                    <div key={s.label}>
                      <b>{s.value}</b>
                      {s.label}
                    </div>
                  ))}
                </div>
              </div>
            </article>

            {/* Big featured deal */}
            {feature && (
              <article className={`${styles.btile} ${styles.feature}`}>
                <Link
                  className={styles.cover}
                  href={`/product/${feature.id}`}
                  aria-label={`View ${feature.name}`}
                />
                <span className={`${styles.tag} ${styles.hot}`}>
                  {featurePct
                    ? `Hot deal · -${featurePct}%`
                    : feature.tag ?? "Featured"}
                </span>
                <div className={styles.metaRow}>
                  <span className={styles.brandTag}>
                    {feature.brand} · {featureCategory}
                  </span>
                  <h2>{feature.name}</h2>
                  <div className={styles.featureSpecs}>
                    {(feature.highlights ?? feature.specs).map((s) => (
                      <span key={s}>{s}</span>
                    ))}
                  </div>
                </div>
                <div className={styles.imgArea}>
                  <img src={feature.images[0]} alt={feature.name} />
                </div>
                <div className={styles.priceRow}>
                  <div className={styles.price}>
                    {feature.price}
                    {feature.was && (
                      <span className={styles.was}>{feature.was}</span>
                    )}
                  </div>
                  <Link
                    className={styles.waPill}
                    href={`/product/${feature.id}`}
                  >
                    View &amp; enquire <Icon name="arrowRight" size={12} />
                  </Link>
                </div>
              </article>
            )}

            {/* Four small tiles */}
            {smalls.map((p) => {
              const badge = smallBadge(p);
              return (
                <article
                  key={p.id}
                  className={`${styles.btile} ${styles.small}`}
                >
                  <Link
                    className={styles.cover}
                    href={`/product/${p.id}`}
                    aria-label={`View ${p.name}`}
                  />
                  {badge && (
                    <span className={`${styles.tag} ${badge.cls}`}>
                      {badge.text}
                    </span>
                  )}
                  <div className={styles.smallBrand}>{p.brand}</div>
                  <div className={styles.smallName}>{p.name}</div>
                  <div className={styles.smallImg}>
                    <img src={p.images[0]} alt={p.name} />
                  </div>
                  <div className={styles.smallPriceRow}>
                    <span className={styles.smallPrice}>
                      {p.price}
                      {p.was && <span className={styles.was}>{p.was}</span>}
                    </span>
                    <span className={styles.smallWa}>
                      <Icon name="whatsapp" size={12} /> Enquire
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Brand strip ===== */}
      <div className={styles.brandstrip}>
        <div className={`wrap ${styles.brandstripRow}`}>
          <span className={styles.brandstripLabel}>Brands we carry —</span>
          <div className={styles.brands}>
            {brands.slice(0, 9).map((b) => (
              <span key={b.name} className={styles.brandName}>
                {b.name}
              </span>
            ))}
            <span className={styles.brandName}>+40 more</span>
          </div>
        </div>
      </div>

      {/* ===== Featured ===== */}
      <section className={styles.section}>
        <div className="wrap">
          <div className={styles.sHead}>
            <div>
              <h2>Stocked this week</h2>
              <p className={styles.sSub}>
                A walk down the shop — soundbars, multimeters, drives, cables,
                ICs. Picked by the floor staff.
              </p>
            </div>
            <div className={styles.sRight}>
              <Link className="btn ghost" href="/categories">
                See all →
              </Link>
            </div>
          </div>
          <div className={styles.gridProducts}>
            {featured.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== Categories ===== */}
      <section className={styles.section} style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className={styles.sHead}>
            <div>
              <h2>Shop by category</h2>
              <p className={styles.sSub}>
                From a single FET to a 5.1 sound system — we&apos;ve got the
                rack-space for it.
              </p>
            </div>
            <div className={styles.sRight}>
              <Link className="btn ghost" href="/categories">
                All categories →
              </Link>
            </div>
          </div>
          <div className={styles.cats}>
            {categories.slice(0, 8).map((c) => (
              <CategoryCard key={c.id} category={c} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== Promo ===== */}
      <section className={styles.section} style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className={styles.promo}>
            <div>
              <span className={styles.eyebrow}>
                <span className={styles.dot} /> WhatsApp first
              </span>
              <h2>
                Not sure which one?
                <br />
                Just ask us.
              </h2>
              <p>
                Send a photo, model number, or even a voice note — our team
                replies within 15 minutes during shop hours with availability,
                the best price, and an honest recommendation.
              </p>
              <a
                className={styles.waCta}
                href={waLink(shop.whatsapp)}
                target="_blank"
                rel="noopener"
              >
                <Icon name="whatsapp" size={18} />
                Chat on WhatsApp
              </a>
            </div>
            <div className={styles.promoSide}>
              <div className={styles.promoPh}>Drop a shop photo here →</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== New arrivals ===== */}
      <section className={styles.section} style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className={styles.arrivals}>
            <div className={styles.arrivalsIntro}>
              <span className={styles.eyebrow}>
                <span className={styles.dot} /> Just in
              </span>
              <h2>
                New
                <br />
                arrivals.
              </h2>
              <p>
                Restocked this fortnight. Drop in, or message us for a stock
                check.
              </p>
            </div>
            <div className={styles.ticker}>
              {featured.slice(-6).map((a) => (
                <Link
                  key={a.id}
                  href={`/product/${a.id}`}
                  className={styles.arrival}
                >
                  <div className={styles.arrivalImg}>
                    <img src={a.images[0]} alt={a.name} loading="lazy" />
                  </div>
                  <div className={styles.arrivalBrand}>{a.brand}</div>
                  <div className={styles.arrivalName}>{a.name}</div>
                  <div className={styles.arrivalPrice}>{a.price}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Trust ===== */}
      <section className={styles.section} style={{ padding: "36px 0" }}>
        <div className="wrap">
          <div className={styles.trust}>
            {[
              {
                icon: "bag",
                h: "Curated, not just stocked",
                p: "Every brand on shelf is one we'd recommend to a friend.",
              },
              {
                icon: "shield",
                h: "Genuine warranty",
                p: "Brand warranty on everything. We handle the paperwork too.",
              },
              {
                icon: "pulse",
                h: "Test before you buy",
                p: "Demo bench — listen, click, compare in-store.",
              },
              {
                icon: "pin",
                h: "Walk-in shop, real humans",
                p: "Open Mon–Sat. Coffee while you compare? Sure.",
              },
            ].map((t) => (
              <div key={t.h} className={styles.trustItem}>
                <div className={styles.trustIco}>
                  <Icon name={t.icon as "bag"} />
                </div>
                <div>
                  <h3>{t.h}</h3>
                  <p>{t.p}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Visit ===== */}
      <section className={styles.section} style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className={styles.visit}>
            <div className={styles.visitCard}>
              <div>
                <span className={styles.eyebrow}>
                  <span className={styles.dot} /> Come say hi
                </span>
                <h2>
                  Visit the
                  <br />
                  shop in person.
                </h2>
                <p
                  style={{
                    color: "var(--color-ink-3)",
                    maxWidth: 380,
                    lineHeight: 1.55,
                  }}
                >
                  There&apos;s no replacement for actually hearing a soundbar in
                  a room, or holding the keyboard before you commit.
                </p>
              </div>
              <dl>
                <dt>Address</dt>
                <dd>{shop.address}</dd>
                <dt>Hours</dt>
                <dd>{shop.hours}</dd>
                <dt>Phone</dt>
                <dd>{shop.phone}</dd>
                <dt>WhatsApp</dt>
                <dd>{shop.phone}</dd>
              </dl>
            </div>
            <div className={styles.mapCard}>
              {shop.mapEmbedUrl && (
                <iframe
                  src={shop.mapEmbedUrl}
                  title="Wireless India location"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </div>
      </section>
      </main>

      <SiteFooter categories={categories} shop={shop} />
    </>
  );
}
