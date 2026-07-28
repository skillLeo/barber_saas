"use client";
import { CheckCircle2 } from "lucide-react";

export interface WizardStep {
  id: string;
  label: string;
  description?: string;
}

interface StepWizardProps {
  steps: WizardStep[];
  currentStep: number;
  className?: string;
}

export function StepWizard({ steps, currentStep, className }: StepWizardProps) {
  return (
    <div className={`flex items-center gap-0 ${className || ""}`}>
      {steps.map((step, index) => {
        const isDone = index < currentStep;
        const isActive = index === currentStep;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} className="flex items-center" style={{ flex: isLast ? 0 : 1 }}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="flex items-center justify-center rounded-full transition-all"
                style={{
                  width: 32,
                  height: 32,
                  background: isDone ? "var(--gold)" : isActive ? "var(--gold-subtle)" : "var(--bg-elevated)",
                  border: isDone ? "none" : isActive ? "2px solid var(--gold)" : "2px solid var(--border)",
                  color: isDone ? "#0A0800" : isActive ? "var(--gold)" : "var(--text-muted)",
                  fontWeight: 700,
                  fontSize: 13,
                  flexShrink: 0,
                }}
              >
                {isDone ? <CheckCircle2 size={16} /> : index + 1}
              </div>
              <div className="text-center hidden sm:block">
                <p style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: isActive ? "var(--text-primary)" : isDone ? "var(--gold)" : "var(--text-muted)",
                  whiteSpace: "nowrap",
                }}>
                  {step.label}
                </p>
              </div>
            </div>
            {!isLast && (
              <div
                className="flex-1 h-px mx-3 mb-4"
                style={{ background: isDone ? "var(--gold)" : "var(--border)", minWidth: 16 }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
