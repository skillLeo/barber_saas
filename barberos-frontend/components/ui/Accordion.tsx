"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
  allowMultiple?: boolean;
}

export function Accordion({ items, className, allowMultiple = false }: AccordionProps) {
  const [open, setOpen] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setOpen(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!allowMultiple) next.clear();
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {items.map(item => {
        const isOpen = open.has(item.id);
        return (
          <div
            key={item.id}
            className="rounded-2xl overflow-hidden transition-all"
            style={{
              background: "var(--bg-card)",
              border: `1px solid ${isOpen ? "var(--border-gold)" : "var(--border)"}`,
              boxShadow: isOpen ? "var(--shadow-gold)" : "none",
            }}
          >
            <button
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                {item.question}
              </span>
              <ChevronDown
                size={16}
                style={{
                  color: isOpen ? "var(--gold)" : "var(--text-muted)",
                  transform: isOpen ? "rotate(180deg)" : "none",
                  transition: "transform 0.2s ease",
                  flexShrink: 0,
                  marginLeft: 12,
                }}
              />
            </button>
            {isOpen && (
              <div
                className="px-5 pb-4"
                style={{ fontSize: 13.5, lineHeight: 1.7, color: "var(--text-secondary)", borderTop: "1px solid var(--border)", paddingTop: 14 }}
              >
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
