"use client";
import { cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  color?: string;
  size?: "sm" | "md" | "lg" | "xl";
  src?: string;
  className?: string;
}

const sizeClasses = {
  sm: "w-7 h-7 text-[11px]",
  md: "w-9 h-9 text-[13px]",
  lg: "w-11 h-11 text-[15px]",
  xl: "w-14 h-14 text-[18px]",
};

export function Avatar({ name, color = "#C9A84C", size = "md", src, className }: AvatarProps) {
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn("rounded-full object-cover", sizeClasses[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold flex-shrink-0",
        sizeClasses[size],
        className
      )}
      style={{ background: `${color}22`, color, border: `1.5px solid ${color}44` }}
    >
      {initials}
    </div>
  );
}
