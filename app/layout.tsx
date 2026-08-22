import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const companyName =
  process.env.NEXT_PUBLIC_COMPANY_NAME || "PT Maju Bersama Indonesia";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${companyName} — Solusi Bisnis Terpercaya`,
    template: `%s | ${companyName}`,
  },
  description:
    "PT Maju Bersama Indonesia menghadirkan solusi bisnis yang inovatif, andal, dan berkelanjutan. Temukan informasi perusahaan, berita, dan lowongan kerja terbaru.",
  keywords: ["company profile", "lowongan kerja", "karir", "berita perusahaan"],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: companyName,
    title: `${companyName} — Solusi Bisnis Terpercaya`,
    description:
      "Solusi bisnis yang inovatif, andal, dan berkelanjutan untuk pertumbuhan perusahaan Anda.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="font-sans">
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
