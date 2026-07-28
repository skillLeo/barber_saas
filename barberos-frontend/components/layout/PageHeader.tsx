import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  backHref?: string;
  className?: string;
  meta?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action, className, meta }: PageHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4 mb-6", className)}>
      <div className="flex flex-col gap-1 min-w-0">
        <h1 style={{ fontSize: "1.375rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.015em", lineHeight: 1.3 }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 13.5, color: "var(--text-muted)", lineHeight: 1.5 }}>{subtitle}</p>
        )}
        {meta && <div className="mt-1">{meta}</div>}
      </div>
      {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
    </div>
  );
}
