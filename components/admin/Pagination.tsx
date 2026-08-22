"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <div className="flex items-center justify-between gap-3 pt-4 flex-wrap">
      <p className="text-xs text-gray-500">
        Halaman {page} dari {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pages.map((p, idx) => (
          <span key={p} className="flex items-center">
            {idx > 0 && pages[idx - 1] !== p - 1 && (
              <span className="px-1.5 text-gray-300 text-xs">…</span>
            )}
            <button
              onClick={() => onPageChange(p)}
              className={cn(
                "h-8 w-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors",
                p === page
                  ? "bg-brand-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              {p}
            </button>
          </span>
        ))}

        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Halaman berikutnya"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
