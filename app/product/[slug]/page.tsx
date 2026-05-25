import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllProducts,
  getCategories,
  getCategory,
  getProduct,
  getRelatedProducts,
  getShopSettings,
} from "@/lib/catalog";
import type { Product, SpecRow } from "@/lib/types";
import { discountPct } from "@/lib/price";
import { productEnquiryLink, telHref, waLink } from "@/lib/wa";
import { productJsonLd } from "@/lib/jsonld";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductCard } from "@/components/ProductCard";
import { ProductGallery } from "./ProductGallery";
import styles from "./product.module.css";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: `${product.name} — ${product.price} at Wireless India, Theni. ${
      product.description?.split("\n")[0] ?? "Enquire on WhatsApp."
    }`,
  };
}

function buildSpecTable(product: Product, categoryName: string): SpecRow[] {
  if (product.specTable?.length) return product.specTable;
  return [
    { label: "Brand", value: product.brand },
    { label: "Category", value: categoryName },
    ...(product.sku ? [{ label: "SKU", value: product.sku }] : []),
    { label: "Availability", value: product.inStock ? "In stock today" : "On order" },
    { label: "Warranty", value: "1 year (brand)" },
  ];
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const [category, categories, related, shop] = await Promise.all([
    getCategory(product.categoryId),
    getCategories(),
    getRelatedProducts(product, 4),
    getShopSettings(),
  ]);

  const categoryName = category?.name ?? "";
  const pct = discountPct(product.price, product.was);
  const highlights = product.highlights ?? product.specs;
  const specTable = buildSpecTable(product, categoryName);
  const paragraphs = (product.description ?? "").split("\n\n").filter(Boolean);
  const stageBadge = pct
    ? `${product.tag ?? "Deal"} · -${pct}%`
    : product.tag ?? null;

  return (
    <>
      <JsonLd data={productJsonLd(product, shop, categoryName)} />
      <SiteHeader
        categories={categories}
        shop={shop}
        variant="sub"
        activeCategoryId={product.categoryId}
      />

      <div className="wrap">
        <div className="crumb">
          <Link href="/">Home</Link>
          <span className="sep">/</span>
          <Link href="/categories">Categories</Link>
          <span className="sep">/</span>
          {category && (
            <>
              <Link href={`/category/${category.id}`}>{category.name}</Link>
              <span className="sep">/</span>
            </>
          )}
          <span>{product.name}</span>
        </div>
      </div>

      {/* Product hero */}
      <section className="wrap">
        <div className={styles.prod}>
          <ProductGallery
            images={product.images}
            name={product.name}
            badge={stageBadge}
            productId={product.id}
          />

          <div className={styles.info}>
            <div className={styles.brandRow}>
              <span>{product.brand}</span>
              <span>·</span>
              {category && (
                <Link href={`/category/${category.id}`}>{category.name}</Link>
              )}
              {product.inStock && <span className={styles.stock}>In stock today</span>}
            </div>

            <h1 className={styles.title}>{product.name}</h1>

            <div className={styles.rating}>
              <span className={styles.stars}>★★★★★</span>
              <span>4.7</span>
              <span>·</span>
              <span>In-store demo available</span>
            </div>

            {highlights.length > 0 && (
              <div className={styles.pills}>
                {highlights.map((h) => (
                  <span key={h} className={styles.pill}>
                    <Icon name="check" size={14} /> {h}
                  </span>
                ))}
              </div>
            )}

            {/* Price block */}
            <div className={styles.priceBlock}>
              <div className={styles.priceMain}>
                <span className={styles.now}>{product.price}</span>
                {product.was && <span className={styles.was}>{product.was}</span>}
                {pct && <span className={styles.save}>SAVE {pct}%</span>}
              </div>
              <div className={styles.tax}>
                Inclusive of all taxes · GST invoice on request
              </div>

              <div className={styles.ctas}>
                <a
                  className="btn wa"
                  href={productEnquiryLink(shop.whatsapp, product)}
                  target="_blank"
                  rel="noopener"
                >
                  <Icon name="whatsapp" /> Enquire on WhatsApp
                </a>
                <a className="btn ghost" href={telHref(shop.phone)}>
                  <Icon name="phone" /> Call
                </a>
              </div>

              <div className={styles.note}>
                <Icon name="info" size={18} />
                <div>
                  <b>Showcase mode.</b> Online ordering is coming — for now,
                  message us on WhatsApp and we&apos;ll confirm stock, set it
                  aside, or deliver in Theni.
                </div>
              </div>
            </div>

            {/* Key facts */}
            <div className={styles.facts}>
              {[
                { icon: "shield", h: "1-year brand warranty", p: "Replacement handled at the counter — bring the box." },
                { icon: "truck", h: "Same-day delivery in Theni", p: "Order by 6 pm. Out-of-town: 2–4 days by courier." },
                { icon: "check", h: "Test before you buy", p: "Try it at the counter before you commit." },
                { icon: "invoice", h: "GST invoice", p: "For office / bulk buyers. Just ask at the counter." },
              ].map((f) => (
                <div key={f.h} className={styles.f}>
                  <div className={styles.fIco}>
                    <Icon name={f.icon as "shield"} size={18} />
                  </div>
                  <div>
                    <h4>{f.h}</h4>
                    <p>{f.p}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust strip */}
            <div className={styles.trustStrip}>
              <div className={styles.row}>
                <Icon name="pin" size={18} />
                <div>
                  <b>On display at the shop:</b> {shop.address}
                </div>
              </div>
              <div className={styles.row}>
                <Icon name="clock" size={18} />
                <div>
                  <b>Reply time:</b> Usually within 15 minutes ({shop.hours})
                </div>
              </div>
              <div className={styles.row}>
                <Icon name="diamond" size={18} />
                <div>
                  <b>Genuine stock:</b> Sourced directly, with brand warranty.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description + specs */}
      <section className={styles.block}>
        <div className="wrap">
          <div className={styles.blockHead}>
            <h2>
              About this <em>product.</em>
            </h2>
            <div className={styles.blockHeadRight}>
              {category?.blurb}
            </div>
          </div>

          <div className={styles.descGrid}>
            <div className={styles.description}>
              {paragraphs.length > 0 ? (
                paragraphs.map((para, i) => <p key={i}>{para}</p>)
              ) : (
                <p>
                  {product.name} — in stock at Wireless India. Drop in to see it
                  in person, or message us on WhatsApp for availability and the
                  best price.
                </p>
              )}
            </div>

            <aside className={styles.specsCard}>
              <div className={styles.specsHead}>
                <span>Specifications</span>
                {product.sku && <span className={styles.sku}>SKU · {product.sku}</span>}
              </div>
              <dl>
                {specTable.map((row) => (
                  <div key={row.label} style={{ display: "contents" }}>
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </div>
      </section>

      {/* Visit promo */}
      <section className={styles.block}>
        <div className="wrap">
          <div className={styles.promo}>
            <div>
              <span className={styles.promoEye}>Want to hold one first?</span>
              <h2>
                Come down
                <br />
                to the <em>shop.</em>
              </h2>
              <p>
                We keep stock on the demo bench. Bring the thing you&apos;ve been
                chasing — the floor staff will help you sanity-check it before you
                buy.
              </p>
              <div className={styles.promoActions}>
                <Link className="btn accent" href="/contact">
                  Visit details
                  <Icon name="arrowRight" size={14} />
                </Link>
                <a
                  className="btn ghost on-dark"
                  href={waLink(shop.whatsapp)}
                  target="_blank"
                  rel="noopener"
                >
                  <Icon name="whatsapp" size={14} /> WhatsApp us
                </a>
              </div>
            </div>
            <div className={styles.hoursCard}>
              <div className={styles.label}>Shop hours</div>
              <div className={styles.hoursGrid}>
                <span className={styles.muted}>Mon — Sat</span>
                <span>10:30 am – 8:30 pm</span>
                <span className={styles.muted}>Sunday</span>
                <span style={{ color: "#807c72" }}>Closed</span>
              </div>
              <div className={styles.hoursFoot}>
                <b>{shop.phone}</b>
                <br />
                <span>{shop.address}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className={styles.block}>
          <div className="wrap">
            <div className={styles.blockHead}>
              <h2>
                You might
                <br />
                <em>also like.</em>
              </h2>
              {category && (
                <Link href={`/category/${category.id}`} className={styles.allLink}>
                  All {category.name} →
                </Link>
              )}
            </div>
            <div className={styles.related}>
              {related.map((p) => (
                <ProductCard key={p.id} product={p} variant="compact" />
              ))}
            </div>
          </div>
        </section>
      )}

      <SiteFooter categories={categories} shop={shop} />
    </>
  );
}
