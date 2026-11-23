import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllProducts,
  getCategories,
  getCategory,
  getProductsByCategory,
  getShopSettings,
} from "@/lib/catalog";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CategoryBrowser } from "./CategoryBrowser";
import styles from "./category.module.css";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) return { title: "Category not found" };
  return {
    title: category.name,
    description: `${category.name} at Wireless India — ${category.blurb}. Walk in or enquire on WhatsApp.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [category, categories, products, shop, allProducts] = await Promise.all([
    getCategory(slug),
    getCategories(),
    getProductsByCategory(slug),
    getShopSettings(),
    getAllProducts(),
  ]);

  if (!category) notFound();

  const countsByCategory = allProducts.reduce<Record<string, number>>(
    (acc, p) => {
      acc[p.categoryId] = (acc[p.categoryId] ?? 0) + 1;
      return acc;
    },
    {},
  );
  const brandCount = new Set(products.map((p) => p.brand)).size;

  return (
    <>
      <SiteHeader
        categories={categories}
        shop={shop}
        variant="sub"
        activeCategoryId={category.id}
      />

      <main id="main" className="wrap">
        <div className="crumb">
          <Link href="/">Home</Link>
          <span className="sep">/</span>
          <Link href="/categories">Categories</Link>
          <span className="sep">/</span>
          <span>{category.name}</span>
        </div>

        <div className={styles.pagehead}>
          <div className={styles.titleRow}>
            <div>
              <h1>{category.name}.</h1>
              <p className={styles.blurb}>{category.blurb}. Test before you buy at the counter.</p>
            </div>
            <div className={styles.meta}>
              <p>
                <b>{products.length} PRODUCTS</b>
                <br />
                {brandCount > 0 ? `From ${brandCount} brand${brandCount > 1 ? "s" : ""}` : "Updated regularly"}
              </p>
            </div>
          </div>
        </div>

        <CategoryBrowser
          category={category}
          products={products}
          allCategories={categories}
          countsByCategory={countsByCategory}
        />
      </main>

      <SiteFooter categories={categories} shop={shop} />
    </>
  );
}
