import { FileQuestion, AlertTriangle, Loader2 } from "lucide-react";
import type { ReactNode } from "react";

export function Loading({ label = "Memuat data..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
      <Loader2 className="h-8 w-8 animate-spin text-brand-500 mb-3" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function EmptyState({
  title = "Belum ada data",
  description,
  icon,
  action,
}: {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="h-14 w-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4 text-gray-400">
        {icon || <FileQuestion className="h-7 w-7" />}
      </div>
      <h3 className="font-semibold text-gray-800">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 mt-1 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({
  title = "Terjadi kesalahan",
  description = "Silakan coba muat ulang halaman ini.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="h-14 w-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4 text-red-500">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500 mt-1 max-w-sm">{description}</p>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-gray-200 ${className || "h-4 w-full"}`} />;
}
