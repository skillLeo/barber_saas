"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounce?: number;
  className?: string;
  autoFocus?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function SearchInput({ value, onChange, placeholder = "Search…", debounce = 0, className, autoFocus, onFocus, onBlur }: SearchInputProps) {
  const [local, setLocal] = useState(value);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setLocal(value); }, [value]);

  const handleChange = useCallback((v: string) => {
    setLocal(v);
    if (debounce > 0) {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => onChange(v), debounce);
    } else {
      onChange(v);
    }
  }, [onChange, debounce]);

  return (
    <div className={cn("relative flex items-center", className)}>
      <Search size={14} className="absolute left-3 pointer-events-none" style={{ color: "var(--text-muted)" }} />
      <input
        className="input !pl-9 !pr-9"
        value={local}
        onChange={e => handleChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {local && (
        <button
          className="absolute right-3 flex items-center justify-center"
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 2 }}
          onClick={() => handleChange("")}
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}
