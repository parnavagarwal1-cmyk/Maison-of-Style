import React from "react";
import { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  categoryLabel?: string;
  onClick?: () => void;
}

export default function ProductCard({ product, categoryLabel, onClick }: ProductCardProps) {
  const displayCategory = categoryLabel || product.category.replace("-", " ");

  // If onClick is provided, it behaves like an interactive card that opens a modal
  if (onClick) {
    return (
      <div
        className="product-card"
        id={`product-${product.id}`}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onClick();
          }
        }}
      >
        <div className="product-card-image-container">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className="product-card-image"
            loading="lazy"
          />
          <div className="product-card-overlay">
            <span className="product-card-shop-now">Shop Look</span>
          </div>
        </div>
        <div className="product-card-info">
          <h3 className="product-card-name">{product.name}</h3>
          <span className="product-card-category">
            {displayCategory}
          </span>
        </div>
      </div>
    );
  }

  // Fallback link if no onClick is provided (e.g. standard details route)
  return (
    <a
      href={`/product/${product.id}`}
      className="product-card"
      id={`product-${product.id}`}
    >
      <div className="product-card-image-container">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="product-card-image"
          loading="lazy"
        />
        <div className="product-card-overlay">
          <span className="product-card-shop-now">View Look</span>
        </div>
      </div>
      <div className="product-card-info">
        <h3 className="product-card-name">{product.name}</h3>
        <span className="product-card-category">
          {displayCategory}
        </span>
      </div>
    </a>
  );
}
