"use client";

import React, { useState } from "react";
import { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";

interface CategoryPageClientProps {
  title: string;
  gender: "Men" | "Women";
  filterCategories: string[];
  initialProducts: Product[];
}

export default function CategoryPageClient({
  title,
  gender,
  filterCategories,
  initialProducts,
}: CategoryPageClientProps) {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter products by gender (e.g. "Men-Shirts" starts with "Men-")
  const genderProducts = initialProducts.filter((p) =>
    p.category.startsWith(`${gender}-`)
  );

  // Apply the category tab filter
  const filteredProducts = genderProducts.filter((product) => {
    if (activeFilter === "All") return true;
    
    // Extract actual category part, e.g., "Men-Shirts" -> "Shirts"
    const catPart = product.category.split("-")[1];
    return catPart.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <div style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh", transition: "background-color var(--transition-speed), color var(--transition-speed)" }}>
      <section className="container section-padding" id="category-page">
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
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
            {title}
          </h1>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="filter-container">
          <button
            onClick={() => setActiveFilter("All")}
            className={`filter-tab ${activeFilter === "All" ? "active" : ""}`}
          >
            All
          </button>
          {filterCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`filter-tab ${activeFilter === cat ? "active" : ""}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--text-secondary)", marginTop: "40px" }}>
            No products available in this category.
          </p>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
