"use client";
import { useState } from "react";
import { X, Clock, Plus } from "lucide-react";
import { mockAddons } from "@/lib/mock-data";

interface AddonSelectorProps {
  serviceName: string;
  addonIds: number[];
  onConfirm: (selectedAddonIds: number[]) => void;
  onClose: () => void;
}

export function AddonSelector({ serviceName, addonIds, onConfirm, onClose }: AddonSelectorProps) {
  const available = mockAddons.filter(a => addonIds.includes(a.id));
  const [selected, setSelected] = useState<number[]>([]);

  const toggle = (id: number) => {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  };

  const extraPrice = selected.reduce((sum, id) => {
    const a = available.find(x => x.id === id);
    return sum + (a?.extraPrice ?? 0);
  }, 0);

  const extraTime = selected.reduce((sum, id) => {
    const a = available.find(x => x.id === id);
    return sum + (a?.extraDuration ?? 0);
  }, 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel w-full" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", borderBottom: "1px solid var(--border)" }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>Add Extras</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{serviceName}</div>
          </div>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 8, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-elevated)" }}>
            <X size={14} style={{ color: "var(--text-muted)" }} />
          </button>
        </div>

        <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
          {available.map(addon => {
            const isSelected = selected.includes(addon.id);
            return (
              <button
                key={addon.id}
                onClick={() => toggle(addon.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 14px",
                  borderRadius: 12, cursor: "pointer",
                  border: `1px solid ${isSelected ? "var(--border-gold)" : "var(--border)"}`,
                  background: isSelected ? "var(--gold-subtle)" : "var(--bg-elevated)",
                  textAlign: "left", width: "100%",
                  transition: "all 0.15s",
                }}
              >
                <div style={{
                  width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                  border: `2px solid ${isSelected ? "var(--gold)" : "var(--border-strong)"}`,
                  background: isSelected ? "var(--gold)" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {isSelected && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{addon.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 1 }}>{addon.description}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2, flexShrink: 0 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: isSelected ? "var(--gold)" : "var(--text-primary)" }}>+£{addon.extraPrice}</span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 3 }}>
                    <Clock size={10} />+{addon.extraDuration}min
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {selected.length > 0 && (
          <div style={{ padding: "0 20px 12px", display: "flex", gap: 8, fontSize: 12, color: "var(--text-secondary)" }}>
            <span style={{ background: "var(--gold-subtle)", color: "var(--gold)", borderRadius: 6, padding: "3px 8px", fontWeight: 600 }}>+£{extraPrice}</span>
            <span style={{ background: "var(--bg-elevated)", borderRadius: 6, padding: "3px 8px", display: "flex", alignItems: "center", gap: 3 }}>
              <Clock size={10} />+{extraTime}min
            </span>
          </div>
        )}

        <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)", display: "flex", gap: 10 }}>
          <button onClick={onClose} className="btn btn-ghost" style={{ flex: 1 }}>Skip extras</button>
          <button
            onClick={() => onConfirm(selected)}
            className="btn btn-primary"
            style={{ flex: 2, justifyContent: "center" }}
          >
            <Plus size={14} />
            Add to Cart{selected.length > 0 ? ` (+£${extraPrice})` : ""}
          </button>
        </div>
      </div>
    </div>
  );
}
