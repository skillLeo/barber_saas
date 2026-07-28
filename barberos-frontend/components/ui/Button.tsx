"use client";
import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "gold-outline";
  size?: "xs" | "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<string, string> = {
  primary: "btn btn-primary",
  secondary: "btn btn-secondary",
  ghost: "btn btn-ghost",
  danger: "btn btn-danger",
  "gold-outline": "btn",
};

const goldOutlineStyle = {
  background: "transparent",
  border: "1px solid var(--border-gold)",
  color: "var(--gold)",
} as React.CSSProperties;

const sizeClasses: Record<string, string> = {
  xs: "!text-[11px] !py-1.5 !px-3 !gap-1.5",
  sm: "!text-[12px] !py-2 !px-3",
  md: "",
  lg: "!text-[14px] !py-3 !px-5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, icon, iconRight, fullWidth, children, className, disabled, style, ...props }, ref) => {
    const isGoldOutline = variant === "gold-outline";
    return (
      <button
        ref={ref}
        className={cn(
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && "w-full justify-center",
          className
        )}
        style={isGoldOutline ? { ...goldOutlineStyle, ...style } : style}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? <Loader2 size={14} className="animate-spin shrink-0" /> : icon ? <span className="shrink-0">{icon}</span> : null}
        {children}
        {iconRight && !loading && <span className="shrink-0">{iconRight}</span>}
      </button>
    );
  }
);
Button.displayName = "Button";
