import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  compact?: boolean;
}

export function EmptyState({ icon, title, description, action, className, compact }: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center",
      compact ? "py-10 px-6" : "py-16 px-8",
      className
    )}>
      {icon && (
        <div
          className="flex items-center justify-center rounded-2xl mb-4"
          style={{
            width: compact ? 48 : 64,
            height: compact ? 48 : 64,
            background: "var(--gold-subtle)",
            color: "var(--gold)",
          }}
        >
          {icon}
        </div>
      )}
      <p style={{
        fontSize: compact ? 14 : 16,
        fontWeight: 600,
        color: "var(--text-primary)",
        marginBottom: 6,
      }}>
        {title}
      </p>
      {description && (
        <p style={{
          fontSize: 13,
          color: "var(--text-muted)",
          maxWidth: 320,
          lineHeight: 1.6,
          marginBottom: action ? 20 : 0,
        }}>
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
