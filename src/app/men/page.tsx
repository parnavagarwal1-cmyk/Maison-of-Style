import { getProducts } from "@/lib/db";
import CategoryPageClient from "@/components/CategoryPageClient";

export const revalidate = 0; // Ensure live updates when admin alters items

export default async function MenPage() {
  const products = await getProducts();
  const filterCategories = ["Shirts", "Pants", "Jackets", "Accessories"];

  return (
    <CategoryPageClient
      title="Men's Edit"
      gender="Men"
      filterCategories={filterCategories}
      initialProducts={products}
    />
  );
}
