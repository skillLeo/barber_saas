"use client";
import { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Globe, Check, Plus, Trash2, Edit2, Search } from "lucide-react";

const allLanguages = [
  { code: "en", name: "English", flag: "🇬🇧", dir: "ltr", enabled: true, default: true, tenants: 148, coverage: 100 },
  { code: "ar", name: "العربية", flag: "🇸🇦", dir: "rtl", enabled: true, default: false, tenants: 34, coverage: 92 },
  { code: "fr", name: "Français", flag: "🇫🇷", dir: "ltr", enabled: true, default: false, tenants: 52, coverage: 97 },
  { code: "de", name: "Deutsch", flag: "🇩🇪", dir: "ltr", enabled: true, default: false, tenants: 64, coverage: 95 },
  { code: "es", name: "Español", flag: "🇪🇸", dir: "ltr", enabled: true, default: false, tenants: 29, coverage: 94 },
  { code: "it", name: "Italiano", flag: "🇮🇹", dir: "ltr", enabled: true, default: false, tenants: 21, coverage: 88 },
  { code: "nl", name: "Nederlands", flag: "🇳🇱", dir: "ltr", enabled: true, default: false, tenants: 38, coverage: 91 },
  { code: "tr", name: "Türkçe", flag: "🇹🇷", dir: "ltr", enabled: false, default: false, tenants: 0, coverage: 61 },
  { code: "pl", name: "Polski", flag: "🇵🇱", dir: "ltr", enabled: false, default: false, tenants: 0, coverage: 73 },
  { code: "pt", name: "Português", flag: "🇵🇹", dir: "ltr", enabled: true, default: false, tenants: 8, coverage: 85 },
  { code: "ru", name: "Русский", flag: "🇷🇺", dir: "ltr", enabled: false, default: false, tenants: 0, coverage: 44 },
  { code: "ur", name: "اردو", flag: "🇵🇰", dir: "rtl", enabled: false, default: false, tenants: 0, coverage: 38 },
];

export default function LanguagesPage() {
  const [search, setSearch] = useState("");
  const [languages, setLanguages] = useState(allLanguages);

  const toggle = (code: string) => {
    setLanguages(prev => prev.map(l => l.code === code && !l.default ? { ...l, enabled: !l.enabled } : l));
  };

  const filtered = languages.filter(l => l.name.toLowerCase().includes(search.toLowerCase()) || l.code.includes(search.toLowerCase()));

  return (
    <DashboardShell role="super-admin" title="Languages" subtitle="Manage supported platform languages">
      <div className="max-w-4xl space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Languages", value: languages.length },
            { label: "Enabled", value: languages.filter(l => l.enabled).length, gold: true },
            { label: "RTL Languages", value: languages.filter(l => l.dir === "rtl").length },
            { label: "Full Coverage", value: languages.filter(l => l.coverage === 100).length },
          ].map((s) => (
            <div key={s.label} className="card p-4 text-center">
              <div className="text-[24px] font-bold mb-1" style={{ color: s.gold ? "var(--gold)" : "var(--text-primary)" }}>{s.value}</div>
              <div className="text-[12px]" style={{ color: "var(--text-muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Language list */}
        <div className="card overflow-hidden">
          <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-3" style={{ borderBottom: "1px solid var(--border)" }}>
            <div className="flex-1">
              <h3 className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>All Languages</h3>
              <p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>Enable or disable languages for tenants</p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                <input className="input pl-8 text-[13px] h-8 w-48" placeholder="Search..."
                  value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <button className="btn btn-primary gap-1.5 text-[13px] h-8 px-3">
                <Plus size={13} /> Add
              </button>
            </div>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {filtered.map((lang) => (
              <div key={lang.code} className="px-5 py-3.5 flex items-center gap-4">
                <span className="text-[22px]">{lang.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[13.5px] font-medium" style={{ color: "var(--text-primary)" }}>{lang.name}</span>
                    {lang.default && <span className="badge badge-gold text-[10px]">Default</span>}
                    {lang.dir === "rtl" && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                        style={{ background: "var(--bg-elevated)", color: "var(--text-muted)" }}>RTL</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                      {lang.code.toUpperCase()} · {lang.tenants} tenants
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-elevated)" }}>
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${lang.coverage}%`, background: lang.coverage === 100 ? "var(--success)" : lang.coverage > 80 ? "var(--gold)" : "var(--warning)" }} />
                      </div>
                      <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{lang.coverage}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                    style={{ background: "var(--bg-elevated)" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "var(--border)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "var(--bg-elevated)")}>
                    <Edit2 size={12} style={{ color: "var(--text-muted)" }} />
                  </button>
                  {!lang.default && (
                    <button className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                      style={{ background: "var(--bg-elevated)" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "var(--error-bg)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "var(--bg-elevated)")}>
                      <Trash2 size={12} style={{ color: "var(--text-muted)" }} />
                    </button>
                  )}
                  <button onClick={() => toggle(lang.code)}
                    className="relative rounded-full transition-colors flex-shrink-0"
                    style={{ width: 40, height: 22, background: lang.enabled ? "var(--gold)" : "var(--bg-elevated)" }}>
                    <span className={`absolute top-0.5 w-[18px] h-[18px] rounded-full bg-white transition-all`}
                      style={{ left: lang.enabled ? 19 : 2 }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Translation coverage note */}
        <div className="card p-4 flex items-start gap-3" style={{ background: "var(--gold-subtle)", border: "1px solid var(--border-gold)" }}>
          <Globe size={15} style={{ color: "var(--gold)", flexShrink: 0, marginTop: 1 }} />
          <div>
            <p className="text-[13px] font-medium" style={{ color: "var(--gold)" }}>Translation Coverage</p>
            <p className="text-[12px] mt-0.5" style={{ color: "var(--text-secondary)" }}>
              Coverage % shows how many UI strings have been translated. Languages below 80% may have untranslated strings displayed in English. Contact your translation team to improve coverage.
            </p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
