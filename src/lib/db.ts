import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { Product } from "./types";

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "products.json");

// Check if Supabase credentials are provided in the environment
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const isSupabaseConfigured = !!(supabaseUrl && supabaseKey);

const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseKey!)
  : null;

// Default seeds (fallback for local JSON file DB)
const SEED_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Classic Silk Look",
    category: "Women-Tops",
    image: "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=600&auto=format&fit=crop",
    affiliateLink: "Silk Blouse | https://rstyle.me/demo-women-tops-1\nPleated Skirt | https://rstyle.me/demo-women-skirt-1",
    newArrival: true,
    createdAt: Date.now() - 80000,
  },
  {
    id: "2",
    name: "Wool Blazer Look",
    category: "Men-Jackets",
    image: "https://images.unsplash.com/photo-1544923246-77307dd654cb?q=80&w=600&auto=format&fit=crop",
    affiliateLink: "Tailored Blazer | https://rstyle.me/demo-men-jackets-2\nWhite T-Shirt | https://rstyle.me/demo-men-tee-2\nBlack Chinos | https://rstyle.me/demo-men-pants-2",
    newArrival: true,
    createdAt: Date.now() - 70000,
  },
  {
    id: "3",
    name: "Linen Dress Look",
    category: "Women-Dresses",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600&auto=format&fit=crop",
    affiliateLink: "Linen Dress | https://rstyle.me/demo-women-dresses-3\nLeather Sandals | https://rstyle.me/demo-women-sandals-3",
    newArrival: true,
    createdAt: Date.now() - 60000,
  },
  {
    id: "4",
    name: "Relaxed Fit Look",
    category: "Men-Shirts",
    image: "https://images.unsplash.com/photo-1621072156002-e2fcc104e76a?q=80&w=600&auto=format&fit=crop",
    affiliateLink: "Relaxed Shirt | https://rstyle.me/demo-men-shirts-4\nClassic Chinos | https://rstyle.me/demo-men-chinos-4",
    newArrival: false,
    createdAt: Date.now() - 50000,
  },
  {
    id: "5",
    name: "Pleated Trousers Look",
    category: "Women-Bottoms",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=600&auto=format&fit=crop",
    affiliateLink: "Pleated Trousers | https://rstyle.me/demo-women-bottoms-5\nKnit Top | https://rstyle.me/demo-women-knit-5",
    newArrival: false,
    createdAt: Date.now() - 40000,
  },
  {
    id: "6",
    name: "Structured Bag",
    category: "Women-Accessories",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop",
    affiliateLink: "Minimalist Bag | https://rstyle.me/demo-women-acc-6",
    newArrival: true,
    createdAt: Date.now() - 30000,
  },
  {
    id: "7",
    name: "Chronograph Watch",
    category: "Men-Accessories",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop",
    affiliateLink: "Chronograph Watch | https://rstyle.me/demo-men-acc-7",
    newArrival: false,
    createdAt: Date.now() - 20000,
  },
  {
    id: "8",
    name: "Chinos Look",
    category: "Men-Pants",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600&auto=format&fit=crop",
    affiliateLink: "Pleated Chinos | https://rstyle.me/demo-men-pants-8\nSuede Loafers | https://rstyle.me/demo-men-loafers-8",
    newArrival: false,
    createdAt: Date.now() - 10000,
  },
];

function ensureDbExists() {
  if (isSupabaseConfigured) return;
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(SEED_PRODUCTS, null, 2), "utf-8");
  }
}

// Map database row to project Product type
function mapRowToProduct(row: any): Product {
  return {
    id: String(row.id),
    name: row.name,
    category: row.category,
    image: row.image,
    affiliateLink: row.affiliate_link,
    newArrival: !!row.new_arrival,
    createdAt: Number(row.created_at),
  };
}

// Map project data to database row structure
function mapProductToRow(product: Omit<Product, "id" | "createdAt"> & { id?: string; createdAt?: number }) {
  return {
    name: product.name,
    category: product.category,
    image: product.image,
    affiliate_link: product.affiliateLink,
    new_arrival: product.newArrival,
    created_at: product.createdAt || Date.now(),
  };
}

export async function getProducts(): Promise<Product[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []).map(mapRowToProduct);
    } catch (err) {
      console.error("Supabase getProducts error, falling back to local file:", err);
    }
  }

  // Fallback to local JSON
  ensureDbExists();
  try {
    const data = await fs.promises.readFile(DB_FILE, "utf-8");
    return JSON.parse(data) as Product[];
  } catch (error) {
    console.error("Error reading database file", error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data ? mapRowToProduct(data) : null;
    } catch (err) {
      console.error("Supabase getProductById error:", err);
    }
  }

  const products = await getProducts();
  return products.find((p) => p.id === id) || null;
}

export async function addProduct(
  productData: Omit<Product, "id" | "createdAt">
): Promise<Product> {
  if (isSupabaseConfigured && supabase) {
    try {
      const dbRow = mapProductToRow(productData);
      const { data, error } = await supabase
        .from("products")
        .insert([dbRow])
        .select()
        .single();

      if (error) throw error;
      return mapRowToProduct(data);
    } catch (err) {
      console.error("Supabase addProduct error:", err);
      throw err;
    }
  }

  // Local JSON write
  ensureDbExists();
  const products = await getProducts();
  const newProduct: Product = {
    ...productData,
    id: String(Date.now() + Math.floor(Math.random() * 1000)),
    createdAt: Date.now(),
  };
  products.push(newProduct);
  await fs.promises.writeFile(DB_FILE, JSON.stringify(products, null, 2), "utf-8");
  return newProduct;
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error("Supabase deleteProduct error:", err);
      return false;
    }
  }

  // Local JSON delete
  ensureDbExists();
  const products = await getProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return false;
  products.splice(index, 1);
  await fs.promises.writeFile(DB_FILE, JSON.stringify(products, null, 2), "utf-8");
  return true;
}

export async function getStats() {
  const products = await getProducts();
  const total = products.length;
  const men = products.filter((p) => p.category.startsWith("Men-")).length;
  const women = products.filter((p) => p.category.startsWith("Women-")).length;
  return { total, men, women };
}
