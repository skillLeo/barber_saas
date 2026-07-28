"use client";
import { cn } from "@/lib/utils";

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
  variant?: "underline" | "pill" | "button";
  className?: string;
}

export function Tabs({ tabs, active, onChange, variant = "pill", className }: TabsProps) {
  if (variant === "underline") {
    return (
      <div className={cn("flex border-b", className)} style={{ borderColor: "var(--border)" }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative"
            style={{
              color: active === tab.id ? "var(--gold)" : "var(--text-secondary)",
              borderBottom: active === tab.id ? "2px solid var(--gold)" : "2px solid transparent",
              marginBottom: -1,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && (
              <span style={{
                fontSize: 11, fontWeight: 600, padding: "1px 6px", borderRadius: 999,
                background: active === tab.id ? "var(--gold-subtle)" : "var(--bg-elevated)",
                color: active === tab.id ? "var(--gold)" : "var(--text-muted)",
              }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  }

  if (variant === "button") {
    return (
      <div className={cn("flex gap-1 p-1 rounded-xl", className)} style={{ background: "var(--bg-elevated)" }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex-1 justify-center"
            style={{
              background: active === tab.id ? "var(--bg-card)" : "transparent",
              color: active === tab.id ? "var(--text-primary)" : "var(--text-secondary)",
              boxShadow: active === tab.id ? "var(--shadow-sm)" : "none",
              border: "none",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    );
  }

  // pill (default)
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all"
          style={{
            background: active === tab.id ? "var(--gold-subtle)" : "var(--bg-elevated)",
            color: active === tab.id ? "var(--gold)" : "var(--text-secondary)",
            border: active === tab.id ? "1px solid var(--border-gold)" : "1px solid var(--border)",
            cursor: "pointer",
          }}
        >
          {tab.icon}
          {tab.label}
          {tab.count !== undefined && (
            <span style={{
              fontSize: 10, fontWeight: 700, padding: "0 4px", borderRadius: 999,
              background: active === tab.id ? "var(--gold)" : "var(--bg-card)",
              color: active === tab.id ? "#0A0800" : "var(--text-muted)",
            }}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
