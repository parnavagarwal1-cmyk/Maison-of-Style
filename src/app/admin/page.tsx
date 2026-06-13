import { isAuthenticated } from "@/lib/auth";
import { getProducts, getStats } from "@/lib/db";
import AdminLogin from "@/components/AdminLogin";
import AdminDashboard from "@/components/AdminDashboard";

export const revalidate = 0;

export default async function AdminPage() {
  const isAuth = await isAuthenticated();

  if (!isAuth) {
    return <AdminLogin />;
  }

  // Fetch initial data on the server
  const products = await getProducts();
  const stats = await getStats();
  
  // Sort products newest first for admin dashboard list
  const sortedProducts = [...products].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <AdminDashboard
      initialProducts={sortedProducts}
      initialStats={stats}
    />
  );
}
