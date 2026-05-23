import Link from "next/link";
import type { Category } from "@/lib/types";
import { Icon } from "@/components/Icon";
import styles from "./CategoryCard.module.css";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link href={`/category/${category.id}`} className={styles.cat}>
      <span className={styles.count}>{category.claimedCount} items</span>
      <span className={styles.name}>{category.name}</span>
      <span className={styles.blurb}>{category.blurb}</span>
      {category.hero && (
        <span className={styles.img}>
          <img src={category.hero} alt={category.name} loading="lazy" />
        </span>
      )}
      <span className={styles.arrow}>
        <Icon name="arrowUpRight" size={14} />
      </span>
    </Link>
  );
}
