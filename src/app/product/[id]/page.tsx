import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductById } from "@/lib/db";
import { parseAffiliateLinks } from "@/lib/types";

export const revalidate = 0;

type Params = Promise<{ id: string }>;

interface PageProps {
  params: Params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  
  if (!product) {
    return {
      title: "Product Not Found | Maison of Style",
    };
  }

  return {
    title: `${product.name} | Maison of Style`,
    description: `Shop the curated ${product.name} at Maison of Style.`,
    openGraph: {
      title: product.name,
      description: `Curated Style. Elevated You. Shop ${product.name} via Maison of Style.`,
      images: [
        {
          url: product.image,
          width: 600,
          height: 900,
          alt: product.name,
        },
      ],
      type: "website",
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const links = parseAffiliateLinks(product.affiliateLink);

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center" }}>
      <section className="container section-padding" id="product-detail">
        <div className="product-detail-layout">
          {/* Left: Image */}
          <div className="product-detail-image-wrapper">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={product.name}
              className="product-detail-image"
              loading="eager"
            />
          </div>

          {/* Right: Product Details */}
          <div className="product-detail-info">
            <span className="product-detail-cat">
              {product.category.replace("-", " ")}
            </span>
            <h1 className="product-detail-title">{product.name}</h1>
            <p className="product-detail-desc">
              This premium styling has been meticulously selected for our curated collection.
              Select items below to shop them directly at our retail partners.
            </p>
            
            {/* Display list of look items with individual shop buttons */}
            <div className="product-detail-actions" style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-secondary)", marginBottom: "8px" }}>
                Items In This Look
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {links.map((link, idx) => (
                  <div 
                    key={idx} 
                    style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "center", 
                      borderBottom: "1px solid var(--border-color)", 
                      paddingBottom: "12px" 
                    }}
                  >
                    <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)" }}>
                      {link.label}
                    </span>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-editorial"
                      style={{ padding: "10px 24px", fontSize: "11px" }}
                    >
                      Shop Now
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="product-detail-actions">
              <LinkBack />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function LinkBack() {
  return (
    <Link
      href="/"
      className="btn-editorial-outline"
      style={{ textAlign: "center" }}
    >
      Back to Collection
    </Link>
  );
}
