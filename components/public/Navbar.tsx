"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/tentang-kami", label: "Tentang Kami" },
  { href: "/layanan", label: "Layanan" },
  { href: "/berita", label: "Berita" },
  { href: "/karir", label: "Karir" },
  { href: "/#kontak", label: "Kontak" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-shadow duration-200 bg-white/90 backdrop-blur",
        scrolled ? "shadow-sm border-b border-gray-100" : "border-b border-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Building2 className="h-5 w-5" />
          </span>
          <span className="font-semibold text-gray-900 text-[15px] leading-tight">
            PT Maju Bersama
            <br className="hidden sm:block" /> Indonesia
          </span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3.5 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname === link.href
                  ? "text-brand-700 bg-brand-50"
                  : "text-gray-600 hover:text-brand-700 hover:bg-gray-50"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/karir"
            className="ml-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors shadow-sm"
          >
            Lihat Lowongan
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          aria-label="Buka menu navigasi"
          className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu panel */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white animate-fade-in">
          <div className="flex flex-col gap-1 px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2.5 rounded-lg text-sm font-medium",
                  pathname === link.href
                    ? "text-brand-700 bg-brand-50"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/karir"
              className="mt-2 text-center rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white"
            >
              Lihat Lowongan
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
