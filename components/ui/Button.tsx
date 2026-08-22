import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
  className?: string;
}

const variants: Record<Variant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-sm",
  secondary: "bg-brand-50 text-brand-700 hover:bg-brand-100",
  outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
  ghost: "text-gray-600 hover:bg-gray-100",
  danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-3 py-1.5 rounded-lg",
  md: "text-sm px-4 py-2.5 rounded-xl",
  lg: "text-base px-6 py-3 rounded-xl",
};

interface ButtonProps extends BaseProps, ButtonHTMLAttributes<HTMLButtonElement> {
  href?: undefined;
}

interface LinkButtonProps extends BaseProps {
  href: string;
}

export function Button({
  variant = "primary",
  size = "md",
  loading,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

export function LinkButton({
  variant = "primary",
  size = "md",
  children,
  className,
  href,
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </Link>
  );
}
