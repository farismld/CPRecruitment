"use client";

import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/States";

export interface Column<T> {
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  loading,
  emptyState,
  mobileCard,
}: {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyState?: ReactNode;
  /** Render kustom untuk tampilan card di layar mobile */
  mobileCard?: (row: T) => ReactNode;
}) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return <>{emptyState}</>;
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto scrollbar-thin rounded-2xl border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {columns.map((col) => (
                <th
                  key={col.header}
                  className={`text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide ${col.className || ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                {columns.map((col) => (
                  <td key={col.header} className={`px-4 py-3.5 ${col.className || ""}`}>
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {data.map((row) => (
          <div key={row.id}>{mobileCard ? mobileCard(row) : null}</div>
        ))}
      </div>
    </>
  );
}
