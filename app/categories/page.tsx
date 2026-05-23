import type { Metadata } from "next";
import Link from "next/link";
import { getCategories, getShopSettings } from "@/lib/catalog";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CategoryCard } from "@/components/CategoryCard";
import styles from "./categories.module.css";

export const metadata: Metadata = {
  title: "All categories",
  description:
    "Browse every category at Wireless India — sound bars, speakers, multimeters, ICs, cables, pendrives, power strips, tools and more.",
};

export default async function CategoriesPage() {
  const [categories, shop] = await Promise.all([
    getCategories(),
    getShopSettings(),
  ]);

  return (
    <>
      <SiteHeader categories={categories} shop={shop} variant="sub" />

      <div className="wrap">
        <div className="crumb">
          <Link href="/">Home</Link>
          <span className="sep">/</span>
          <span>All categories</span>
        </div>
        <div className={styles.head}>
          <h1>All categories.</h1>
          <p>
            Everything we stock, sorted. From a single FET to a full 5.1 sound
            system — pick a shelf and start browsing.
          </p>
        </div>
        <div className={styles.grid}>
          {categories.map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </div>
      </div>

      <SiteFooter categories={categories} shop={shop} />
    </>
  );
}
