"use client";

import React, { useState } from "react";
import { Product, Category } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";

interface CategoryPageClientProps {
  title: string;
  gender: "Men" | "Women";
  filterCategories: Category[];
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
  const [searchQuery, setSearchQuery] = useState("");

  // Filter products by gender (e.g. "Men-Shirts" starts with "Men-")
  const genderProducts = initialProducts.filter((p) =>
    p.category.startsWith(`${gender}-`)
  );

  // Apply both category tab and search filters
  const filteredProducts = genderProducts.filter((product) => {
    // Category check (activeFilter is "All" or matches product category code e.g. "Men-Shirts")
    const matchesCategory = activeFilter === "All" || product.category === activeFilter;
    
    // Search check (case-insensitive name match)
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
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

        {/* Search Bar */}
        <div className="search-bar-container">
          <input
            type="text"
            className="search-input"
            placeholder="SEARCH PRODUCTS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg
            className="search-icon-svg"
            viewBox="0 0 24 24"
          >
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
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
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`filter-tab ${activeFilter === cat.id ? "active" : ""}`}
            >
              {cat.name}
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
            {filteredProducts.map((product) => {
              const catObj = filterCategories.find((c) => c.id === product.category);
              const categoryLabel = catObj ? catObj.name : undefined;
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  categoryLabel={categoryLabel}
                  onClick={() => setSelectedProduct(product)}
                />
              );
            })}
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
