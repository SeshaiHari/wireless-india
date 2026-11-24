import Link from "next/link";
import type { Category } from "@/lib/types";
import { Icon } from "@/components/Icon";
import styles from "./CategoryCard.module.css";

function countLabel(n: number) {
  if (n === 0) return "New stock soon";
  return `${n} ${n === 1 ? "item" : "items"}`;
}

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link href={`/category/${category.id}`} className={styles.cat}>
      <span className={styles.count}>{countLabel(category.productCount)}</span>
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
