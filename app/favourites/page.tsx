import type { Metadata } from "next";
import Link from "next/link";
import { getAllProducts, getCategories, getShopSettings } from "@/lib/catalog";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { FavouritesShelf } from "./FavouritesShelf";
import styles from "./favourites.module.css";

export const metadata: Metadata = {
  title: "Wishlist",
};

export default async function FavouritesPage() {
  const [allProducts, categories, shop] = await Promise.all([
    getAllProducts(),
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
          <span>Wishlist</span>
        </div>
        <div className={styles.head}>
          <h1>Your wishlist.</h1>
        </div>
        <FavouritesShelf allProducts={allProducts} />
      </div>

      <SiteFooter categories={categories} shop={shop} />
    </>
  );
}
