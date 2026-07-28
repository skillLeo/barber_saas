"use client";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
  className?: string;
}

export function StatCard({ label, value, change, changeType = "up", icon: Icon, iconColor = "#C9A84C", className }: StatCardProps) {
  return (
    <div className={cn(
      "bg-[#1A1A1A] border border-[rgba(255,255,255,0.08)] rounded-2xl p-5 flex flex-col gap-4",
      "hover:border-[rgba(201,168,76,0.25)] hover:shadow-[0_0_20px_rgba(201,168,76,0.06)] transition-all duration-200",
      className
    )}>
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-[#A3A3A3]">{label}</span>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${iconColor}18` }}>
          <Icon size={18} style={{ color: iconColor }} />
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold text-[#F5F5F5] tracking-tight">{value}</div>
        {change && (
          <div className={cn(
            "text-[12px] font-medium mt-1",
            changeType === "up" ? "text-[#10B981]" : changeType === "down" ? "text-[#EF4444]" : "text-[#A3A3A3]"
          )}>
            {changeType === "up" ? "↑" : changeType === "down" ? "↓" : "—"} {change}
          </div>
        )}
      </div>
    </div>
  );
}
