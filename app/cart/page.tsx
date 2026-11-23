import type { Metadata } from "next";
import Link from "next/link";
import { getAllProducts, getCategories, getShopSettings } from "@/lib/catalog";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CartView } from "./CartView";
import styles from "./cart.module.css";

export const metadata: Metadata = {
  title: "Your cart",
  robots: { index: false },
};

export default async function CartPage() {
  const [allProducts, categories, shop] = await Promise.all([
    getAllProducts(),
    getCategories(),
    getShopSettings(),
  ]);

  return (
    <>
      <SiteHeader categories={categories} shop={shop} variant="sub" />

      <main id="main" className="wrap">
        <div className="crumb">
          <Link href="/">Home</Link>
          <span className="sep">/</span>
          <span>Cart</span>
        </div>
        <div className={styles.head}>
          <h1>Your cart.</h1>
          <p>Send your whole order to us on WhatsApp in one message. We&apos;ll confirm stock and price, then set it aside or deliver.</p>
        </div>
        <CartView allProducts={allProducts} whatsapp={shop.whatsapp} />
      </main>

      <SiteFooter categories={categories} shop={shop} />
    </>
  );
}
