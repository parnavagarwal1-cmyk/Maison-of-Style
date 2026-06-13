import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Maison of Style | Curated Style. Elevated You.",
  description: "A luxury editorial fashion affiliate curation website for men's and women's premium apparel, accessories, and shoes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        {/* Inline script to prevent theme flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('maison-theme');
                  const theme = savedTheme || 'dark';
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark-theme');
                  } else {
                    document.documentElement.classList.remove('dark-theme');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <header className="main-header">
          <div className="container header-inner">
            <Link href="/" className="logo">
              Maison of Style
            </Link>
            <nav className="main-nav">
              <Link href="/men" className="nav-link">
                Men
              </Link>
              <Link href="/women" className="nav-link">
                Women
              </Link>
              <Link href="/new" className="nav-link">
                New Arrivals
              </Link>
              <Link href="/admin" className="nav-link">
                Admin
              </Link>
              <ThemeToggle />
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="main-footer">
          <div className="container">
            <div className="footer-logo">Maison of Style</div>
            <div className="footer-links">
              <Link href="/men" className="footer-link">
                Shop Men
              </Link>
              <Link href="/women" className="footer-link">
                Shop Women
              </Link>
              <Link href="/new" className="footer-link">
                New Arrivals
              </Link>
              <Link href="/admin" className="footer-link">
                Admin
              </Link>
            </div>
            <div className="footer-copy">
              &copy; {new Date().getFullYear()} Maison of Style. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
