import { isAuthenticated } from "@/lib/auth";
import { getProducts, getStats, getCategories } from "@/lib/db";
import AdminLogin from "@/components/AdminLogin";
import AdminDashboard from "@/components/AdminDashboard";

export const revalidate = 0;

export default async function AdminPage() {
  const isAuth = await isAuthenticated();

  if (!isAuth) {
    return <AdminLogin />;
  }

  // Fetch initial data on the server
  const [products, stats, categories] = await Promise.all([
    getProducts(),
    getStats(),
    getCategories(),
  ]);
  
  // Sort products newest first for admin dashboard list
  const sortedProducts = [...products].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <AdminDashboard
      initialProducts={sortedProducts}
      initialStats={stats}
      initialCategories={categories}
    />
  );
}
