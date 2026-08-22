import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = "brand",
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accent?: "brand" | "amber" | "emerald" | "indigo" | "red" | "purple";
}) {
  const accents: Record<string, string> = {
    brand: "bg-brand-50 text-brand-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    indigo: "bg-indigo-50 text-indigo-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center shrink-0", accents[accent])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
