import { getAllProducts, getCategories } from "@/lib/catalog";

export async function GET() {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getCategories(),
  ]);

  return Response.json({
    products: products.map((p) => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      price: p.price,
      categoryId: p.categoryId,
      image: p.images[0] ?? null,
      specs: p.specs.slice(0, 3),
    })),
    categories: categories.map((c) => ({ id: c.id, name: c.name })),
  });
}
