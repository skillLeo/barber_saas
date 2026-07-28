"use client";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  onIconRightClick?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, iconRight, onIconRightClick, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.02em" }}>
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <span className="absolute left-3 pointer-events-none" style={{ color: "var(--text-muted)" }}>
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "input",
              icon && "!pl-9",
              iconRight && "!pr-9",
              error && "!border-[var(--error)] focus:!shadow-[0_0_0_3px_var(--error-bg)]",
              className
            )}
            {...props}
          />
          {iconRight && (
            <span
              className="absolute right-3"
              style={{ color: "var(--text-muted)", cursor: onIconRightClick ? "pointer" : "default" }}
              onClick={onIconRightClick}
            >
              {iconRight}
            </span>
          )}
        </div>
        {error && <p style={{ fontSize: 12, color: "var(--error)" }}>{error}</p>}
        {!error && hint && <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{hint}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
