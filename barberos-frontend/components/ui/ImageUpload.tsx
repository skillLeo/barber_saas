"use client";
import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (dataUrl: string | null) => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  hint?: string;
  className?: string;
  aspect?: "square" | "wide" | "free";
}

export function ImageUpload({ value, onChange, accept = "image/*", maxSizeMB = 5, label, hint, className, aspect = "free" }: ImageUploadProps) {
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handle = (file: File) => {
    setError("");
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File too large (max ${maxSizeMB}MB)`);
      return;
    }
    const reader = new FileReader();
    reader.onload = e => onChange(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    const file = e.dataTransfer.files[0];
    if (file) handle(file);
  };

  const heightClass = aspect === "square" ? "h-40" : aspect === "wide" ? "h-28" : "h-32";

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>{label}</label>}
      <div
        className={cn(
          "relative rounded-2xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-all overflow-hidden",
          heightClass,
          drag && "border-[var(--gold)] bg-[var(--gold-subtle)]",
          !drag && "border-[var(--border)] hover:border-[var(--border-strong)]"
        )}
        onClick={() => fileRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
      >
        <input
          ref={fileRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handle(f); }}
        />
        {value ? (
          <>
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: "var(--error)", color: "white" }}
              onClick={e => { e.stopPropagation(); onChange(null); }}
            >
              <X size={12} />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 pointer-events-none px-4">
            <div className="rounded-xl flex items-center justify-center" style={{ width: 40, height: 40, background: "var(--bg-elevated)" }}>
              {drag ? <Upload size={18} style={{ color: "var(--gold)" }} /> : <ImageIcon size={18} style={{ color: "var(--text-muted)" }} />}
            </div>
            <p style={{ fontSize: 12.5, color: "var(--text-secondary)", textAlign: "center" }}>
              {drag ? "Drop to upload" : <><span style={{ color: "var(--gold)", fontWeight: 600 }}>Click to upload</span> or drag & drop</>}
            </p>
            {hint && <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{hint}</p>}
          </div>
        )}
      </div>
      {error && <p style={{ fontSize: 12, color: "var(--error)" }}>{error}</p>}
    </div>
  );
}
