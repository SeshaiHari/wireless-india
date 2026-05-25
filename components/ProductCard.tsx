import Link from "next/link";
import type { Product } from "@/lib/types";
import { Icon } from "@/components/Icon";
import { FavouriteButton } from "@/components/FavouriteButton";
import styles from "./ProductCard.module.css";

type Variant = "default" | "withSpecs" | "compact";

function tagClass(tag: Product["tag"]): string {
  if (tag === "New") return styles.new;
  if (tag === "Hot deal" || tag === "Best deal") return styles.hot;
  return "";
}

export function ProductCard({
  product,
  variant = "default",
}: {
  product: Product;
  variant?: Variant;
}) {
  const { id, name, brand, price, was, tag, images, specs } = product;

  return (
    <Link href={`/product/${id}`} className={styles.card}>
      {tag && <span className={`${styles.tag} ${tagClass(tag)}`}>{tag}</span>}
      <FavouriteButton productId={id} className={styles.heart} />

      <div className={styles.pimg}>
        <img src={images[0]} alt={name} loading="lazy" />
      </div>

      <div className={styles.body}>
        <div className={styles.brand}>{brand}</div>
        <div className={styles.name}>{name}</div>

        {variant === "withSpecs" && specs.length > 0 && (
          <div className={styles.specs}>
            {specs.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        )}
        {variant === "withSpecs" && (
          <div className={styles.stock}>In stock today</div>
        )}

        <div className={styles.row}>
          <div className={styles.price}>
            {price}
            {was && <span className={styles.was}>{was}</span>}
          </div>
          {variant === "compact" ? (
            <Icon name="arrowRight" size={16} className={styles.arrow} />
          ) : (
            <div className={styles.wa}>
              <Icon name="whatsapp" size={14} />
              Enquire
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
