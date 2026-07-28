"use client";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  size?: "sm" | "md";
}

export function Toggle({ checked, onChange, disabled, label, description, size = "md" }: ToggleProps) {
  const isSmall = size === "sm";
  return (
    <div
      className="flex items-center gap-3"
      style={{ cursor: disabled ? "not-allowed" : "default", opacity: disabled ? 0.5 : 1 }}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        style={{
          position: "relative",
          width: isSmall ? 36 : 44,
          height: isSmall ? 20 : 24,
          borderRadius: 999,
          background: checked ? "var(--gold)" : "var(--bg-elevated)",
          border: checked ? "none" : "1px solid var(--border-strong)",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "background 0.2s ease",
          flexShrink: 0,
          outline: "none",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: isSmall ? 2 : 2,
            width: isSmall ? 16 : 20,
            height: isSmall ? 16 : 20,
            borderRadius: "50%",
            background: "white",
            boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
            transition: "left 0.2s ease",
            left: checked ? (isSmall ? 18 : 22) : 2,
          }}
        />
      </button>
      {(label || description) && (
        <div className="flex flex-col">
          {label && <span style={{ fontSize: 13.5, fontWeight: 500, color: "var(--text-primary)" }}>{label}</span>}
          {description && <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{description}</span>}
        </div>
      )}
    </div>
  );
}
