"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/types";

interface AdminDashboardProps {
  initialProducts: Product[];
  initialStats: { total: number; men: number; women: number };
}

const CATEGORIES = [
  { value: "Men-Shirts", label: "Men's Shirts" },
  { value: "Men-Pants", label: "Men's Pants" },
  { value: "Men-Jackets", label: "Men's Jackets" },
  { value: "Men-Accessories", label: "Men's Accessories" },
  { value: "Women-Tops", label: "Women's Tops" },
  { value: "Women-Dresses", label: "Women's Dresses" },
  { value: "Women-Bottoms", label: "Women's Bottoms" },
  { value: "Women-Accessories", label: "Women's Accessories" },
];

export default function AdminDashboard({
  initialProducts,
  initialStats,
}: AdminDashboardProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [stats, setStats] = useState(initialStats);
  const router = useRouter();

  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Men-Shirts");
  const [image, setImage] = useState("");
  const [affiliateLink, setAffiliateLink] = useState("");
  const [newArrival, setNewArrival] = useState(false);
  
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          category,
          image,
          affiliateLink,
          newArrival,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to add product");
      }

      setFormSuccess("Product added successfully.");
      // Prepend to state
      setProducts([data.product, ...products]);
      setStats(data.stats);

      // Reset form
      setName("");
      setImage("");
      setAffiliateLink("");
      setNewArrival(false);
    } catch (err: any) {
      setFormError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setDeletingId(id);

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete product");
      }

      setProducts(products.filter((p) => p.id !== id));
      setStats(data.stats);
    } catch (err: any) {
      alert(err.message || "Could not delete product");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="dark-theme" style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh", color: "var(--text-primary)" }}>
      <div className="container admin-container">
        {/* Header Row */}
        <div className="admin-header-row">
          <div>
            <h1 className="admin-title">Maison Dashboard</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "4px" }}>
              Product Catalog Curation
            </p>
          </div>
          <button onClick={handleLogout} className="admin-logout-btn">
            Logout
          </button>
        </div>

        {/* Stats Row */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Curation</div>
            <div className="stat-value">{stats.total}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Men's Catalog</div>
            <div className="stat-value">{stats.men}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Women's Catalog</div>
            <div className="stat-value">{stats.women}</div>
          </div>
        </div>

        {/* Form and List Grid */}
        <div className="admin-split">
          {/* Add Product Form */}
          <div className="admin-form-panel">
            <h2 className="admin-panel-title">Add Curation</h2>
            <form onSubmit={handleAddProduct}>
              <div className="form-group">
                <label className="form-label" htmlFor="prod-name">
                  Product Name
                </label>
                <input
                  id="prod-name"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Silk Cuffed Blouse"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prod-cat">
                  Category
                </label>
                <select
                  id="prod-cat"
                  className="form-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={submitting}
                  style={{ cursor: "pointer" }}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prod-image">
                  Image URL
                </label>
                <input
                  id="prod-image"
                  type="text"
                  className="form-input"
                  placeholder="https://images.unsplash.com/..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prod-affiliate">
                  Affiliate Link(s)
                </label>
                <textarea
                  id="prod-affiliate"
                  className="form-input"
                  placeholder="Format: Item Name | Link (one per line)&#10;e.g.&#10;Shirt | https://rstyle.me/shirt-link&#10;Pants | https://rstyle.me/pants-link"
                  value={affiliateLink}
                  onChange={(e) => setAffiliateLink(e.target.value)}
                  required
                  disabled={submitting}
                  rows={4}
                  style={{ resize: "vertical", minHeight: "100px" }}
                />
                <span style={{ fontSize: "10px", color: "var(--text-secondary)", marginTop: "4px", display: "block", lineHeight: "1.4" }}>
                  Write one item per line: <strong>Item Name | Affiliate Link</strong>. A single plain URL defaults to &quot;Shop Item&quot;.
                </span>
              </div>

              <div className="form-group toggle-container">
                <input
                  id="prod-new-arrival"
                  type="checkbox"
                  className="toggle-checkbox"
                  checked={newArrival}
                  onChange={(e) => setNewArrival(e.target.checked)}
                  disabled={submitting}
                />
                <label className="form-label" htmlFor="prod-new-arrival" style={{ margin: 0, cursor: "pointer" }}>
                  Mark as New Arrival?
                </label>
              </div>

              {formError && <p className="form-error" style={{ marginBottom: "16px" }}>{formError}</p>}
              {formSuccess && <p style={{ color: "#ffffff", fontSize: "12px", marginBottom: "16px" }}>{formSuccess}</p>}

              <button
                type="submit"
                className="btn-editorial"
                style={{ width: "100%" }}
                disabled={submitting}
              >
                {submitting ? "Adding..." : "Add Product"}
              </button>
            </form>
          </div>

          {/* Product List Table */}
          <div className="admin-table-panel">
            <h2 className="admin-panel-title">Curated Items ({products.length})</h2>
            {products.length === 0 ? (
              <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
                No products found. Add products to populate the list.
              </p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Img</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Affiliate Link</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.image}
                          alt={product.name}
                          className="table-thumb"
                          loading="lazy"
                        />
                      </td>
                      <td style={{ fontWeight: 500, color: "#ffffff" }}>
                        {product.name}
                        {product.newArrival && (
                          <span
                            style={{
                              display: "inline-block",
                              marginLeft: "6px",
                              padding: "2px 6px",
                              backgroundColor: "var(--border-color)",
                              fontSize: "9px",
                              color: "var(--bg-primary)",
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                            }}
                          >
                            New
                          </span>
                        )}
                      </td>
                      <td style={{ color: "var(--text-secondary)" }}>
                        {product.category.replace("-", " ")}
                      </td>
                      <td>
                        <a
                          href={product.affiliateLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-truncated"
                          title={product.affiliateLink}
                        >
                          {product.affiliateLink}
                        </a>
                      </td>
                      <td>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="delete-btn"
                          disabled={deletingId === product.id}
                        >
                          {deletingId === product.id ? "..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
