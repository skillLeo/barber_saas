"use client";
import { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Scissors, Upload, Palette, Type, Layout, Eye, Check, RotateCcw } from "lucide-react";

const colorPresets = [
  { name: "Gold & Black", primary: "#C9A84C", bg: "#0A0A0A", accent: "#A07830", text: "#F5F5F5" },
  { name: "Royal Blue", primary: "#3B82F6", bg: "#0F172A", accent: "#1D4ED8", text: "#F8FAFC" },
  { name: "Emerald", primary: "#10B981", bg: "#064E3B", accent: "#059669", text: "#ECFDF5" },
  { name: "Rose Gold", primary: "#FB7185", bg: "#1C1010", accent: "#E11D48", text: "#FFF1F2" },
  { name: "Purple Premium", primary: "#8B5CF6", bg: "#0D0B1A", accent: "#6D28D9", text: "#F5F3FF" },
  { name: "Platinum White", primary: "#E5E7EB", bg: "#F9FAFB", accent: "#9CA3AF", text: "#111827" },
];

const fontOptions = [
  { name: "Inter", label: "Inter — Modern & Clean", style: "font-sans" },
  { name: "Playfair Display", label: "Playfair — Classic & Elegant", style: "font-serif" },
  { name: "Montserrat", label: "Montserrat — Bold & Premium", style: "font-sans font-semibold" },
  { name: "Raleway", label: "Raleway — Refined & Light", style: "font-sans tracking-wide" },
];

export default function BrandingPage() {
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [customPrimary, setCustomPrimary] = useState("#C9A84C");
  const [customBg, setCustomBg] = useState("#0A0A0A");
  const [selectedFont, setSelectedFont] = useState(0);
  const [logoText, setLogoText] = useState("BarberOS");
  const [tagline, setTagline] = useState("Premium Barbershop Management");
  const [saved, setSaved] = useState(false);

  const current = colorPresets[selectedPreset];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <DashboardShell
      role="super-admin"
      title="Platform Branding"
      subtitle="Customise colours, fonts, and visual identity"
      action={
        <button onClick={handleSave}
          className="text-[13px] py-2 px-4 flex items-center gap-2 rounded-xl font-semibold transition-all"
          style={saved ? {
            background: "var(--success-bg)",
            color: "var(--success)",
            border: "1px solid rgba(16,185,129,0.3)",
          } : undefined}>
          {saved
            ? <><Check size={14} /> Saved!</>
            : <span className="btn btn-primary px-4 py-2 text-[13px]">Save Changes</span>
          }
        </button>
      }
    >
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Settings panels */}
        <div className="lg:col-span-2 space-y-5">
          {/* Logo */}
          <div className="card p-5">
            <h3 className="text-[14px] font-semibold mb-1 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <Layout size={15} style={{ color: "var(--gold)" }} /> Logo & Identity
            </h3>
            <p className="text-[12px] mb-4" style={{ color: "var(--text-muted)" }}>Upload your logo or use text-based branding</p>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all group"
                style={{
                  background: "var(--bg-base)",
                  border: "2px dashed var(--border)",
                }}>
                <Upload size={18} className="mb-1 transition-colors group-hover:text-[var(--gold)]" style={{ color: "var(--text-muted)" }} />
                <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>Upload</span>
              </div>
              <div>
                <p className="text-[13px] mb-1" style={{ color: "var(--text-secondary)" }}>PNG, SVG or JPG · Max 2MB</p>
                <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>Recommended: 200×200px square</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Brand name</label>
                <input className="input w-full" value={logoText} onChange={e => setLogoText(e.target.value)} />
              </div>
              <div>
                <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Tagline</label>
                <input className="input w-full" value={tagline} onChange={e => setTagline(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Colour scheme */}
          <div className="card p-5">
            <h3 className="text-[14px] font-semibold mb-1 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <Palette size={15} style={{ color: "var(--gold)" }} /> Colour Scheme
            </h3>
            <p className="text-[12px] mb-4" style={{ color: "var(--text-muted)" }}>Choose a preset or customise your brand colours</p>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-5">
              {colorPresets.map((preset, i) => (
                <button key={preset.name} onClick={() => { setSelectedPreset(i); setCustomPrimary(preset.primary); setCustomBg(preset.bg); }}
                  className="relative rounded-xl overflow-hidden transition-all"
                  style={{ border: selectedPreset === i ? "2px solid var(--gold)" : "2px solid transparent" }}>
                  <div className="h-10 flex items-center justify-center" style={{ background: preset.bg }}>
                    <div className="w-5 h-5 rounded-full" style={{ background: preset.primary }} />
                  </div>
                  <div className="px-1 py-1.5 text-center" style={{ background: "var(--bg-elevated)" }}>
                    <span className="text-[9px] leading-tight block" style={{ color: "var(--text-muted)" }}>{preset.name}</span>
                  </div>
                  {selectedPreset === i && (
                    <div className="absolute top-0.5 right-0.5"><Check size={10} style={{ color: "var(--gold)" }} /></div>
                  )}
                </button>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Primary / Accent colour</label>
                <div className="flex gap-2">
                  <input type="color" value={customPrimary} onChange={e => setCustomPrimary(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer"
                    style={{ border: "1px solid var(--border)", background: "transparent" }} />
                  <input className="input flex-1 font-mono text-[13px]" value={customPrimary} onChange={e => setCustomPrimary(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Background colour</label>
                <div className="flex gap-2">
                  <input type="color" value={customBg} onChange={e => setCustomBg(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer"
                    style={{ border: "1px solid var(--border)", background: "transparent" }} />
                  <input className="input flex-1 font-mono text-[13px]" value={customBg} onChange={e => setCustomBg(e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          {/* Typography */}
          <div className="card p-5">
            <h3 className="text-[14px] font-semibold mb-1 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <Type size={15} style={{ color: "var(--gold)" }} /> Typography
            </h3>
            <p className="text-[12px] mb-4" style={{ color: "var(--text-muted)" }}>Choose the font family for your platform</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {fontOptions.map((font, i) => {
                const active = selectedFont === i;
                return (
                  <button key={font.name} onClick={() => setSelectedFont(i)}
                    className={`p-3.5 rounded-xl text-left transition-all ${font.style}`}
                    style={{
                      border: active ? "1px solid var(--border-gold)" : "1px solid var(--border)",
                      background: active ? "var(--gold-subtle)" : "transparent",
                    }}>
                    <div className="text-[18px] mb-1" style={{ color: active ? "var(--text-primary)" : "var(--text-secondary)" }}>Aa</div>
                    <div className="text-[12px]" style={{ color: active ? "var(--gold)" : "var(--text-muted)" }}>{font.label}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Preview panel */}
        <div className="lg:sticky lg:top-0">
          <div className="card overflow-hidden">
            <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: "1px solid var(--border)" }}>
              <Eye size={13} style={{ color: "var(--gold)" }} />
              <span className="text-[12px] font-medium" style={{ color: "var(--text-secondary)" }}>Live Preview</span>
            </div>

            {/* Simulated app UI — keeps its own dark bg as it's a branding preview */}
            <div className="p-4" style={{ background: current.bg }}>
              {/* Nav */}
              <div className="flex items-center gap-2 mb-4 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: current.primary }}>
                  <Scissors size={12} style={{ color: current.bg }} />
                </div>
                <div>
                  <div className="text-[12px] font-bold" style={{ color: current.text }}>{logoText}</div>
                  <div className="text-[9px]" style={{ color: current.primary }}>{tagline}</div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                {[{ label: "Revenue", val: "£1,284" }, { label: "Bookings", val: "47" }].map(s => (
                  <div key={s.label} className="p-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="text-[10px] mb-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>{s.label}</div>
                    <div className="text-[15px] font-bold" style={{ color: current.text }}>{s.val}</div>
                    <div className="text-[9px] font-medium" style={{ color: current.primary }}>↑ 12%</div>
                  </div>
                ))}
              </div>

              {/* Button */}
              <button className="w-full py-2 rounded-lg text-[12px] font-semibold mb-3" style={{ background: current.primary, color: current.bg }}>
                New Booking
              </button>

              {/* Nav items */}
              <div className="space-y-1">
                {["Dashboard", "Bookings", "Analytics"].map((item, i) => (
                  <div key={item} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg" style={{ background: i === 0 ? `${current.primary}20` : "transparent" }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: i === 0 ? current.primary : "rgba(255,255,255,0.2)" }} />
                    <span className="text-[11px]" style={{ color: i === 0 ? current.primary : "rgba(255,255,255,0.4)" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => { setSelectedPreset(0); setCustomPrimary("#C9A84C"); setCustomBg("#0A0A0A"); setSelectedFont(0); }}
            className="btn btn-ghost w-full justify-center mt-3 text-[12px] py-2">
            <RotateCcw size={13} /> Reset to Default
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}
