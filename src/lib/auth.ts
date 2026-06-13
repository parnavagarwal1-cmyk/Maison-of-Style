import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "maison_admin_session";
const SESSION_VALUE = "authenticated_maison_admin";

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  return session?.value === SESSION_VALUE;
}

export async function loginAdmin() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, SESSION_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  });
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });
}

export function checkAdminPassword(password: string): boolean {
  const envPassword = process.env.ADMIN_PASSWORD;
  
  // Log a warning if the password isn't set in environment
  if (!envPassword) {
    console.warn("WARNING: ADMIN_PASSWORD environment variable is not set. Falling back to default: maison_admin_2026");
  }

  const correctPassword = envPassword || "maison_admin_2026";
  return password === correctPassword;
}
