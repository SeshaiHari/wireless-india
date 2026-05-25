import Link from "next/link";
import type { Category, ShopSettings } from "@/lib/types";
import { Icon } from "@/components/Icon";
import { WishlistCount } from "@/components/WishlistCount";
import { SearchModal } from "@/components/SearchModal";
import { MobileSearchButton } from "@/components/MobileSearchButton";
import styles from "./SiteHeader.module.css";

type Variant = "home" | "sub";

export function SiteHeader({
  categories,
  shop,
  variant = "home",
  activeCategoryId,
}: {
  categories: Category[];
  shop: ShopSettings;
  variant?: Variant;
  activeCategoryId?: string;
}) {
  const marquee = shop.marqueeLines.length
    ? shop.marqueeLines
    : ["Components, audio, repairs & tools — under one roof"];

  return (
    <>
      {/* Utility bar */}
      <div className={styles.util}>
        <div className={`wrap ${styles.utilRow}`}>
          <div className={styles.marqueeWrap}>
            <div className="marquee-track">
              {[...marquee, ...marquee].map((line, i) => (
                <span key={i}>{line}</span>
              ))}
            </div>
          </div>
          <div className={styles.right}>
            <Link href="/contact">Visit shop</Link>
            <span>EN ▾</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className={styles.nav}>
        <div className={`wrap ${styles.navRow}`}>
          <Link href="/" className={styles.logo}>
            <span className={styles.mark}>
              <img src="/logo.svg" alt="Wireless India" />
            </span>
            <span>{shop.name}</span>
          </Link>

          <SearchModal />

          <div className={styles.actions}>
            <MobileSearchButton className={styles.mobileSearchBtn} />
            <Link href="/favourites" className="icon-btn" title="Wishlist" aria-label="Wishlist">
              <Icon name="heart" />
              <WishlistCount />
            </Link>
            {variant === "home" ? (
              <Link href="/categories" className="btn">
                Shop now
                <Icon name="arrowRight" size={14} />
              </Link>
            ) : (
              <Link href="/contact" className="btn">
                Visit shop ↗
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Nav row */}
      {variant === "home" ? (
        <div className={styles.navlinks}>
          <div className={`wrap ${styles.navlinksRow}`}>
            <Link href="/categories">
              <Icon name="menu" /> All categories
            </Link>
            {categories.slice(0, 8).map((c) => (
              <Link key={c.id} href={`/category/${c.id}`}>
                {c.name}
              </Link>
            ))}
            <Link href="/categories" className={styles.hot}>
              ● New arrivals
            </Link>
            <Link href="/contact" className={styles.spacer}>
              Visit shop
            </Link>
          </div>
        </div>
      ) : (
        <div className={styles.subnav}>
          <div className={`wrap ${styles.subnavRow}`}>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/category/${c.id}`}
                className={c.id === activeCategoryId ? styles.on : undefined}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
