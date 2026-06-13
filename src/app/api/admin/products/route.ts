import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getProducts, addProduct, deleteProduct, getStats } from "@/lib/db";

export async function GET() {
  const isAuth = await isAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const products = await getProducts();
    const stats = await getStats();
    // Sort products by newest first
    const sorted = [...products].sort((a, b) => b.createdAt - a.createdAt);
    return NextResponse.json({ products: sorted, stats });
  } catch (error) {
    console.error("GET products admin API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const isAuth = await isAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, category, image, affiliateLink, newArrival } = await request.json();

    if (!name || !category || !image || !affiliateLink) {
      return NextResponse.json(
        { error: "Product Name, Category, Image URL, and Affiliate Link are required." },
        { status: 400 }
      );
    }

    const newProduct = await addProduct({
      name,
      category,
      image,
      affiliateLink,
      newArrival: !!newArrival,
    });

    const stats = await getStats();

    return NextResponse.json({ success: true, product: newProduct, stats });
  } catch (error) {
    console.error("POST products admin API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const isAuth = await isAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const success = await deleteProduct(id);
    if (!success) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const stats = await getStats();

    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error("DELETE products admin API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
