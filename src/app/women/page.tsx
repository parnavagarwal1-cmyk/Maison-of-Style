import { getProducts } from "@/lib/db";
import CategoryPageClient from "@/components/CategoryPageClient";

export const revalidate = 0; // Ensure live updates when admin alters items

export default async function WomenPage() {
  const products = await getProducts();
  const filterCategories = ["Tops", "Dresses", "Bottoms", "Accessories"];

  return (
    <CategoryPageClient
      title="Women's Edit"
      gender="Women"
      filterCategories={filterCategories}
      initialProducts={products}
    />
  );
}
