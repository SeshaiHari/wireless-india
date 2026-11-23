import type { MetadataRoute } from "next";
import { getAllProducts, getCategories, isSingleCategory } from "@/lib/catalog";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([
    getCategories(),
    getAllProducts(),
  ]);

  // In single-category mode the category pages redirect home, so leave them out.
  const single = isSingleCategory(categories);

  const staticRoutes = (single ? ["", "/contact"] : ["", "/categories", "/contact"]).map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));

  const categoryRoutes = (single ? [] : categories).map((c) => ({
    url: `${siteUrl}/category/${c.id}`,
    lastModified: new Date(),
  }));

  const productRoutes = products.map((p) => ({
    url: `${siteUrl}/product/${p.id}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
