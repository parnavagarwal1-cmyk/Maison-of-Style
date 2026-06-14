"use client";

import React, { useState } from "react";
import { Product, Category } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";

interface FeaturedGridClientProps {
  products: Product[];
  categories: Category[];
}

export default function FeaturedGridClient({ products, categories }: FeaturedGridClientProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
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

      {filteredProducts.length === 0 ? (
        <p style={{ textAlign: "center", color: "var(--text-secondary)", marginTop: "40px", width: "100%" }}>
          No products match your search.
        </p>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => {
            const catObj = categories.find((c) => c.id === product.category);
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

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}
