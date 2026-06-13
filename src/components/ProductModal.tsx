"use client";

import React from "react";
import { Product, parseAffiliateLinks } from "@/lib/types";

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const links = parseAffiliateLinks(product.affiliateLink);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content dark-theme" 
        onClick={(e) => e.stopPropagation()} // Prevent close on clicking inside modal
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          &times;
        </button>

        <div className="modal-body-grid">
          {/* Left: Product Image */}
          <div className="modal-image-container">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={product.name}
              className="modal-image"
              loading="eager"
            />
          </div>

          {/* Right: Look Breakdown */}
          <div className="modal-details-container">
            <span className="modal-tag">Shop The Look</span>
            <h2 className="modal-title">{product.name}</h2>
            <p className="modal-subtitle">{product.category.replace("-", " ")}</p>

            <div className="modal-links-list">
              {links.map((link, idx) => (
                <div key={idx} className="modal-link-row">
                  <span className="modal-link-label">{link.label}</span>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-editorial-outline modal-link-btn"
                  >
                    Shop Now
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
