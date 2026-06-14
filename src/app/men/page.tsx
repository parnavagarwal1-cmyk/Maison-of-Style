import { getProducts, getCategories } from "@/lib/db";
import CategoryPageClient from "@/components/CategoryPageClient";

export const revalidate = 0; // Ensure live updates when admin alters items

export default async function MenPage() {
  const [products, allCategories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const filterCategories = allCategories.filter((c) => c.gender === "Men");

  return (
    <CategoryPageClient
      title="Men's Edit"
      gender="Men"
      filterCategories={filterCategories}
      initialProducts={products}
    />
  );
}
