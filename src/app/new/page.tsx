import { getProducts, getCategories } from "@/lib/db";
import FeaturedGridClient from "@/components/FeaturedGridClient";

export const revalidate = 0;

export default async function NewArrivalsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const newArrivals = products.filter((p) => p.newArrival);

  return (
    <div style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh", transition: "background-color var(--transition-speed), color var(--transition-speed)" }}>
      <section className="container section-padding" id="new-arrivals-page">
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "48px",
              fontWeight: 400,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--text-primary)",
              marginBottom: "16px",
            }}
          >
            New Arrivals
          </h1>
          <p style={{ color: "var(--text-secondary)", textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.15em" }}>
            The latest additions to our curated edits
          </p>
        </div>

        {newArrivals.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--text-secondary)", marginTop: "40px" }}>
            No new arrivals found.
          </p>
        ) : (
          <FeaturedGridClient products={newArrivals} categories={categories} />
        )}
      </section>
    </div>
  );
}
