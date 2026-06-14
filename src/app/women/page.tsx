import { getProducts, getCategories } from "@/lib/db";
import CategoryPageClient from "@/components/CategoryPageClient";

export const revalidate = 0; // Ensure live updates when admin alters items

export default async function WomenPage() {
  const [products, allCategories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const filterCategories = allCategories.filter((c) => c.gender === "Women");

  return (
    <CategoryPageClient
      title="Women's Edit"
      gender="Women"
      filterCategories={filterCategories}
      initialProducts={products}
    />
  );
}
