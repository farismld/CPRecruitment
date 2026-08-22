"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Newspaper,
  Briefcase,
  Users,
  LogOut,
  Menu,
  X,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/applicants", label: "Data Pelamar", icon: Users },
  { href: "/admin/news", label: "Berita", icon: Newspaper },
  { href: "/admin/jobs", label: "Lowongan", icon: Briefcase },
];

export function AdminSidebar({ adminName }: { adminName?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      toast.success("Berhasil logout");
      router.push("/admin/login");
      router.refresh();
    } catch {
      toast.error("Gagal logout, silakan coba lagi");
      setLoggingOut(false);
    }
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-gray-800">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shrink-0">
          <Building2 className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">Admin CRM</p>
          <p className="text-xs text-gray-400 truncate">Maju Bersama</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1">
        {links.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
              isActive(href, exact)
                ? "bg-brand-600 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            )}
          >
            <Icon className="h-4.5 w-4.5" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-gray-800">
        {adminName && (
          <p className="px-3.5 mb-2 text-xs text-gray-500 truncate">
            Masuk sebagai <span className="text-gray-300">{adminName}</span>
          </p>
        )}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors disabled:opacity-60"
        >
          <LogOut className="h-4.5 w-4.5" />
          {loggingOut ? "Keluar..." : "Logout"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Building2 className="h-4.5 w-4.5" />
          </span>
          <span className="text-sm font-semibold text-white">Admin CRM</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-gray-300 hover:text-white"
          aria-label="Buka menu admin"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 bg-gray-900 animate-fade-in">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-white"
              aria-label="Tutup menu"
            >
              <X className="h-5 w-5" />
            </button>
            {SidebarContent}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-gray-900">
        {SidebarContent}
      </aside>
    </>
  );
}
