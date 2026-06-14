import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getCategories, updateCategory } from "@/lib/db";

export async function GET() {
  const isAuth = await isAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const categories = await getCategories();
    return NextResponse.json({ categories });
  } catch (error: any) {
    console.error("GET categories admin API error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const isAuth = await isAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, name } = await request.json();

    if (!id || !name) {
      return NextResponse.json(
        { error: "Category ID and Name are required." },
        { status: 400 }
      );
    }

    const updatedCategory = await updateCategory(id, name.trim());

    if (!updatedCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, category: updatedCategory });
  } catch (error: any) {
    console.error("PUT categories admin API error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
