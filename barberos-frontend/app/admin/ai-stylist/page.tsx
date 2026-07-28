"use client";
import { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Wand2, Upload, Sparkles, X, ChevronRight, Star, Clock, Zap } from "lucide-react";

const styleCategories = [
  { id: "fade", name: "Fade Cuts", styles: ["Low Fade", "Mid Fade", "High Fade", "Skin Fade", "Drop Fade"] },
  { id: "classic", name: "Classic", styles: ["Side Part", "Pompadour", "Slick Back", "Comb Over", "Quiff"] },
  { id: "textured", name: "Textured", styles: ["Textured Crop", "French Crop", "Messy Fringe", "Undercut", "Buzz Cut"] },
  { id: "beard", name: "Beard Styles", styles: ["Full Beard", "Stubble", "Goatee", "Van Dyke", "Chevron"] },
];

const recentAnalyses = [
  { client: "Marcus T.", style: "Mid Fade + Textured Top", confidence: 94, date: "Today 14:32" },
  { client: "Ahmed K.", style: "Full Beard Trim + Low Fade", confidence: 88, date: "Today 11:15" },
  { client: "James W.", style: "Classic Pompadour", confidence: 91, date: "Yesterday" },
  { client: "Daniel R.", style: "Skin Fade + Line Up", confidence: 97, date: "Yesterday" },
];

export default function AIStylistPage() {
  const [stage, setStage] = useState<"upload" | "analyzing" | "results">("upload");
  const [dragOver, setDragOver] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  const handleUpload = () => {
    setStage("analyzing");
    setTimeout(() => setStage("results"), 2200);
  };

  return (
    <DashboardShell role="admin" title="AI Stylist" subtitle="AI-powered hairstyle recommendations for your clients">
      <div className="max-w-5xl space-y-5">

        {/* Hero banner */}
        <div className="card p-5 overflow-hidden relative"
          style={{ background: "linear-gradient(135deg, var(--bg-elevated) 0%, var(--gold-subtle) 100%)", border: "1px solid var(--border-gold)" }}>
          <div className="absolute top-0 right-0 w-48 h-48 opacity-5">
            <Wand2 size={192} style={{ color: "var(--gold)" }} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} style={{ color: "var(--gold)" }} />
              <span className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: "var(--gold)" }}>Powered by AI</span>
            </div>
            <h2 className="text-[20px] font-bold mb-1.5" style={{ color: "var(--text-primary)" }}>Smart Hairstyle Recommender</h2>
            <p className="text-[13px] leading-relaxed max-w-xl" style={{ color: "var(--text-secondary)" }}>
              Upload a client photo and our AI will analyse their face shape, current hair texture, and preferences to suggest the perfect cuts and styles.
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              {[
                { icon: Zap, text: "Results in under 3 seconds" },
                { icon: Star, text: "94% client satisfaction" },
                { icon: Clock, text: "Saves 8 min per consultation" },
              ].map((f) => (
                <div key={f.text} className="flex items-center gap-1.5 text-[12px]" style={{ color: "var(--text-secondary)" }}>
                  <f.icon size={13} style={{ color: "var(--gold)" }} />
                  {f.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Upload / Analyze Panel */}
          <div className="lg:col-span-3 space-y-4">
            <div className="card p-5">
              <h3 className="text-[14px] font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                {stage === "upload" ? "Upload Client Photo" : stage === "analyzing" ? "Analysing..." : "AI Results"}
              </h3>

              {stage === "upload" && (
                <>
                  <div
                    className="border-2 border-dashed rounded-[12px] p-10 text-center cursor-pointer transition-all"
                    style={{
                      borderColor: dragOver ? "var(--gold)" : "var(--border-strong)",
                      background: dragOver ? "var(--gold-subtle)" : "var(--bg-elevated)",
                    }}
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={e => { e.preventDefault(); setDragOver(false); handleUpload(); }}
                    onClick={handleUpload}
                  >
                    <Upload size={32} className="mx-auto mb-3" style={{ color: dragOver ? "var(--gold)" : "var(--text-muted)" }} />
                    <p className="text-[13px] font-medium mb-1" style={{ color: "var(--text-primary)" }}>
                      Drop photo here or click to browse
                    </p>
                    <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                      JPG, PNG or WEBP · Max 10MB · Front-facing photo preferred
                    </p>
                  </div>
                  <div className="flex items-center gap-3 my-3">
                    <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                    <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>or try a demo</span>
                    <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                  </div>
                  <button onClick={handleUpload} className="btn btn-secondary w-full gap-2 text-[13px]">
                    <Wand2 size={14} /> Run Demo Analysis
                  </button>
                </>
              )}

              {stage === "analyzing" && (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                    style={{ background: "var(--gold-subtle)", border: "2px solid var(--gold)" }}>
                    <Wand2 size={28} style={{ color: "var(--gold)" }} className="animate-pulse" />
                  </div>
                  <p className="text-[14px] font-medium mb-2" style={{ color: "var(--text-primary)" }}>Analysing photo...</p>
                  <p className="text-[12px] mb-5" style={{ color: "var(--text-muted)" }}>Detecting face shape, hair texture, and skin tone</p>
                  <div className="max-w-xs mx-auto space-y-2">
                    {["Detecting face shape", "Analysing hair texture", "Generating recommendations"].map((step, i) => (
                      <div key={step} className="flex items-center gap-2.5 text-[12px]" style={{ color: "var(--text-secondary)" }}>
                        <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: "var(--gold-subtle)", border: "1px solid var(--gold)" }}>
                          <span style={{ color: "var(--gold)", fontSize: 9 }}>{i + 1}</span>
                        </div>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {stage === "results" && (
                <div>
                  {/* Mock face analysis */}
                  <div className="rounded-[10px] p-4 mb-4" style={{ background: "var(--bg-elevated)" }}>
                    <div className="text-[12px] font-semibold mb-2.5" style={{ color: "var(--text-muted)" }}>FACE ANALYSIS</div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      {[
                        { label: "Face Shape", val: "Oval" },
                        { label: "Hair Texture", val: "Medium" },
                        { label: "Confidence", val: "94%" },
                      ].map((a) => (
                        <div key={a.label}>
                          <div className="text-[14px] font-bold mb-0.5" style={{ color: "var(--gold)" }}>{a.val}</div>
                          <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>{a.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <h4 className="text-[13px] font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Recommended Styles</h4>
                  <div className="space-y-2">
                    {[
                      { name: "Mid Fade + Textured Top", match: 97, reason: "Perfect for oval faces, adds height" },
                      { name: "Quiff with Skin Fade", match: 91, reason: "Enhances natural texture, stylish" },
                      { name: "Classic Side Part", match: 84, reason: "Timeless look, low maintenance" },
                      { name: "French Crop", match: 79, reason: "Modern, suits medium texture well" },
                    ].map((s) => (
                      <button key={s.name} onClick={() => setSelectedStyle(s.name === selectedStyle ? null : s.name)}
                        className="w-full text-left p-3.5 rounded-[10px] transition-all"
                        style={{
                          background: selectedStyle === s.name ? "var(--gold-subtle)" : "var(--bg-elevated)",
                          border: `1px solid ${selectedStyle === s.name ? "var(--gold)" : "transparent"}`,
                        }}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>{s.name}</span>
                          <span className="text-[12px] font-bold" style={{ color: "var(--gold)" }}>{s.match}% match</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-base)" }}>
                            <div className="h-full rounded-full" style={{ width: `${s.match}%`, background: "var(--gold)" }} />
                          </div>
                          <span className="text-[11.5px]" style={{ color: "var(--text-muted)" }}>{s.reason}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button className="btn btn-primary flex-1 gap-1.5 text-[13px]">
                      <Sparkles size={13} /> Book This Style
                    </button>
                    <button onClick={() => setStage("upload")} className="btn btn-ghost gap-1.5 text-[13px]">
                      <X size={13} /> New Analysis
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right panel */}
          <div className="lg:col-span-2 space-y-4">
            {/* Style catalogue */}
            <div className="card p-4">
              <h3 className="text-[13px] font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Style Catalogue</h3>
              <div className="space-y-3">
                {styleCategories.map((cat) => (
                  <div key={cat.id}>
                    <div className="text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>{cat.name}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.styles.map((style) => (
                        <button key={style} className="text-[11.5px] px-2.5 py-1 rounded-full transition-colors"
                          style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--gold-subtle)"; (e.currentTarget as HTMLElement).style.color = "var(--gold)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--gold)"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-elevated)"; (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}>
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent analyses */}
            <div className="card p-4">
              <h3 className="text-[13px] font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Recent Analyses</h3>
              <div className="space-y-2.5">
                {recentAnalyses.map((r) => (
                  <div key={r.client} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                      style={{ background: "var(--gold-subtle)", color: "var(--gold)" }}>
                      {r.client[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12.5px] font-medium truncate" style={{ color: "var(--text-primary)" }}>{r.client}</div>
                      <div className="text-[11px] truncate" style={{ color: "var(--text-muted)" }}>{r.style}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-[12px] font-semibold" style={{ color: "var(--success)" }}>{r.confidence}%</div>
                      <div className="text-[10.5px]" style={{ color: "var(--text-muted)" }}>{r.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
