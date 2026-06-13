import Link from "next/link";
import { getProducts } from "@/lib/db";
import FeaturedGridClient from "@/components/FeaturedGridClient";

export const revalidate = 0; // Disable caching to fetch live products in dev / admin changes

export default async function HomePage() {
  const allProducts = await getProducts();
  
  // Latest 8 products sorted by createdAt desc
  const featuredProducts = [...allProducts]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 8);

  return (
    <div className="home-page">
      {/* Pinterest Profile Header Section */}
      <section className="pinterest-profile" id="pinterest-header">
        <div className="pinterest-banner-wrapper">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop"
            alt="Maison of Style Banner"
            className="pinterest-banner"
          />
        </div>
        <div className="pinterest-pfp-wrapper">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://i.pinimg.com/280x280_RS/be/e2/33/bee233863dc1c88e7e286ae84f062ee2.jpg"
            alt="Maison of Style Profile"
            className="pinterest-pfp"
          />
        </div>
        <h1 className="pinterest-name">Maison of Style</h1>
        <p className="pinterest-tagline">Curated Style. Elevated You.</p>
      </section>

      {/* Category Navigation Blocks */}
      <section className="category-blocks" id="category-selection">
        <Link href="/men" className="category-block-btn">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=800&auto=format&fit=crop"
            alt="Shop Men Category"
            className="category-block-img"
          />
          <div className="category-block-content">
            <span className="category-block-title">Shop Men</span>
            <span className="category-block-subtitle">Minimalist Edit</span>
          </div>
        </Link>
        <Link href="/women" className="category-block-btn">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop"
            alt="Shop Women Category"
            className="category-block-img"
          />
          <div className="category-block-content">
            <span className="category-block-title">Shop Women</span>
            <span className="category-block-subtitle">Elegant Curation</span>
          </div>
        </Link>
      </section>

      {/* Featured Products Section */}
      <section className="container section-padding" id="featured-products">
        <h2 className="products-section-title">Latest Curation</h2>
        {featuredProducts.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--text-secondary)" }}>
            No products found. Please add products via the admin panel.
          </p>
        ) : (
          <FeaturedGridClient products={featuredProducts} />
        )}
      </section>
    </div>
  );
}
