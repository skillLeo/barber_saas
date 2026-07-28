"use client";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "gold" | "success" | "warning" | "error" | "info" | "neutral";
  size?: "sm" | "md";
  className?: string;
}

const variantClasses = {
  gold: "bg-[rgba(201,168,76,0.15)] text-[#C9A84C] border border-[rgba(201,168,76,0.3)]",
  success: "bg-[rgba(16,185,129,0.15)] text-[#10B981] border border-[rgba(16,185,129,0.3)]",
  warning: "bg-[rgba(245,158,11,0.15)] text-[#F59E0B] border border-[rgba(245,158,11,0.3)]",
  error: "bg-[rgba(239,68,68,0.15)] text-[#EF4444] border border-[rgba(239,68,68,0.3)]",
  info: "bg-[rgba(99,102,241,0.15)] text-[#818CF8] border border-[rgba(99,102,241,0.3)]",
  neutral: "bg-[rgba(255,255,255,0.08)] text-[#A3A3A3] border border-[rgba(255,255,255,0.1)]",
};

const sizeClasses = {
  sm: "text-[11px] px-2 py-0.5",
  md: "text-[12px] px-2.5 py-1",
};

export function Badge({ children, variant = "neutral", size = "md", className }: BadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full font-medium",
      variantClasses[variant],
      sizeClasses[size],
      className
    )}>
      {children}
    </span>
  );
}
