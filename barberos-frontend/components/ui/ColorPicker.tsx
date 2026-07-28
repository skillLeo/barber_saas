"use client";
import { useState } from "react";

const PRESETS = [
  "#C9A84C", "#D4AF37", "#B8920A",
  "#6366F1", "#8B5CF6", "#EC4899",
  "#10B981", "#22C55E", "#3B82F6",
  "#F59E0B", "#EF4444", "#0EA5E9",
  "#FFFFFF", "#F5F5F5", "#1A1A1A",
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const [hex, setHex] = useState(value);

  const handleHex = (v: string) => {
    setHex(v);
    if (/^#[0-9A-Fa-f]{6}$/.test(v)) onChange(v);
  };

  return (
    <div className="flex flex-col gap-2.5">
      {label && <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>{label}</label>}
      <div className="flex flex-wrap gap-2">
        {PRESETS.map(p => (
          <button
            key={p}
            type="button"
            onClick={() => { setHex(p); onChange(p); }}
            title={p}
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: p,
              border: value === p ? "3px solid var(--gold)" : "2px solid var(--border)",
              cursor: "pointer",
              transition: "transform 0.15s",
              transform: value === p ? "scale(1.1)" : "scale(1)",
            }}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 mt-1">
        <div
          className="rounded-lg flex-shrink-0"
          style={{ width: 36, height: 36, background: value, border: "1px solid var(--border)" }}
        />
        <input
          className="input !text-[12px] font-mono"
          value={hex}
          onChange={e => handleHex(e.target.value)}
          placeholder="#C9A84C"
          maxLength={7}
          style={{ textTransform: "uppercase" }}
        />
      </div>
    </div>
  );
}
