import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        className || "bg-gray-100 text-gray-700 border-gray-200"
      )}
    >
      {children}
    </span>
  );
}
