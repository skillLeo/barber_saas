"use client";
import { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { mockApiKeys, apiServiceOptions } from "@/lib/mock-data";
import {
  Key, Plus, Eye, EyeOff, Trash2, Edit, Copy, Check,
  Info, Globe, Building2, Shield, ToggleLeft, ToggleRight, X
} from "lucide-react";

const serviceIcons: Record<string, string> = {
  openai: "🤖",
  stripe: "💳",
  paypal: "🅿️",
  "google-maps": "🗺️",
  "google-calendar": "📅",
  firebase: "🔔",
  twilio: "📱",
  zoom: "🎥",
  mailgun: "📧",
  fixer: "💱",
};

export default function ApiKeysPage() {
  const [keys, setKeys] = useState(mockApiKeys);
  const [showModal, setShowModal] = useState(false);
  const [showKey, setShowKey] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState<number | null>(null);
  const [scope, setScope] = useState<"super-admin" | "tenant">("super-admin");
  const [newKey, setNewKey] = useState({ service: "", name: "", key: "", scope: "super-admin" });

  const handleCopy = (id: number, value: string) => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleKey = (id: number) => {
    setKeys(ks => ks.map(k => k.id === id ? { ...k, status: k.status === "active" ? "inactive" : "active" } : k));
  };

  const deleteKey = (id: number) => {
    setKeys(ks => ks.filter(k => k.id !== id));
  };

  const filteredKeys = keys.filter(k => k.scope === scope);

  return (
    <DashboardShell
      role="super-admin"
      title="API Key Management"
      subtitle="Manage platform-wide and tenant-level API integrations"
      action={
        <button onClick={() => setShowModal(true)} className="btn btn-primary text-[13px] py-2 px-4">
          <Plus size={14} /> Add API Key
        </button>
      }
    >
      {/* Add API Key Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-panel w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid var(--border)" }}>
              <h3 className="text-[15px] font-semibold" style={{ color: "var(--text-primary)" }}>Add API Key</h3>
              <button onClick={() => setShowModal(false)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--bg-elevated)" }}>
                <X size={14} style={{ color: "var(--text-muted)" }} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-[12px] font-medium mb-2" style={{ color: "var(--text-muted)" }}>Key scope</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "super-admin", label: "Platform Default", desc: "Used by all tenants", icon: Globe },
                    { value: "tenant", label: "Tenant Override", desc: "For specific tenant", icon: Building2 },
                  ].map(s => {
                    const active = newKey.scope === s.value;
                    return (
                      <button key={s.value} onClick={() => setNewKey(k => ({ ...k, scope: s.value }))}
                        className="p-3 rounded-xl text-left transition-all"
                        style={{
                          border: active ? "1px solid var(--border-gold)" : "1px solid var(--border)",
                          background: active ? "var(--gold-subtle)" : "transparent",
                        }}>
                        <s.icon size={15} className="mb-1.5" style={{ color: active ? "var(--gold)" : "var(--text-muted)" }} />
                        <div className="text-[12px] font-semibold" style={{ color: active ? "var(--text-primary)" : "var(--text-secondary)" }}>{s.label}</div>
                        <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>{s.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Service *</label>
                <select className="input w-full" value={newKey.service} onChange={e => setNewKey(k => ({ ...k, service: e.target.value }))}>
                  <option value="">Select service...</option>
                  {apiServiceOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.icon} {opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Key name *</label>
                <input className="input w-full" placeholder="e.g. OpenAI Production Key" value={newKey.name} onChange={e => setNewKey(k => ({ ...k, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>API Key / Secret *</label>
                <input type="password" className="input w-full font-mono" placeholder="Paste your API key here" value={newKey.key} onChange={e => setNewKey(k => ({ ...k, key: e.target.value }))} />
                <p className="text-[11px] mt-1.5 flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                  <Shield size={11} /> Keys are encrypted at rest using AES-256
                </p>
              </div>
            </div>
            <div className="flex gap-3 p-5" style={{ borderTop: "1px solid var(--border)" }}>
              <button onClick={() => setShowModal(false)} className="btn btn-ghost flex-1 justify-center py-2.5">Cancel</button>
              <button onClick={() => setShowModal(false)} className="btn btn-primary flex-1 justify-center py-2.5">Save API Key</button>
            </div>
          </div>
        </div>
      )}

      {/* Info banner */}
      <div className="p-4 mb-6 rounded-2xl" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
        <div className="flex gap-3">
          <Info size={16} className="flex-shrink-0 mt-0.5" style={{ color: "#6366F1" }} />
          <div>
            <p className="text-[13px] font-medium mb-1" style={{ color: "var(--text-primary)" }}>Two-tier API key management</p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              <strong style={{ color: "var(--text-primary)" }}>Super Admin keys</strong> are used as platform defaults for all tenants.{" "}
              <strong style={{ color: "var(--text-primary)" }}>Tenant keys</strong> override the platform defaults for individual shops —
              if a tenant adds their own API key for a service, their key is used instead of the platform key.
            </p>
          </div>
        </div>
      </div>

      {/* Scope tabs */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button onClick={() => setScope("super-admin")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all"
          style={{
            background: scope === "super-admin" ? "var(--gold-subtle)" : "var(--bg-elevated)",
            color: scope === "super-admin" ? "var(--gold)" : "var(--text-secondary)",
            border: scope === "super-admin" ? "1px solid var(--border-gold)" : "1px solid var(--border)",
          }}>
          <Globe size={14} /> Super Admin Keys (Platform Default)
          <span className="ml-1 text-[11px] font-semibold px-1.5 py-0.5 rounded-full"
            style={{ background: "var(--gold-subtle)", color: "var(--gold)" }}>
            {keys.filter(k => k.scope === "super-admin").length}
          </span>
        </button>
        <button onClick={() => setScope("tenant")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all"
          style={{
            background: scope === "tenant" ? "rgba(99,102,241,0.12)" : "var(--bg-elevated)",
            color: scope === "tenant" ? "#818CF8" : "var(--text-secondary)",
            border: scope === "tenant" ? "1px solid rgba(99,102,241,0.3)" : "1px solid var(--border)",
          }}>
          <Building2 size={14} /> Tenant-Level Overrides
          <span className="ml-1 text-[11px] font-semibold px-1.5 py-0.5 rounded-full"
            style={{ background: "rgba(99,102,241,0.12)", color: "#818CF8" }}>
            {keys.filter(k => k.scope === "tenant").length}
          </span>
        </button>
      </div>

      {/* Available services */}
      <div className="card p-5 mb-5">
        <h3 className="text-[13px] font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>Supported Integrations</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {apiServiceOptions.map(opt => {
            const hasKey = keys.some(k => k.service === opt.value);
            return (
              <div key={opt.value} className="flex items-center gap-2 p-2.5 rounded-xl text-[12px]"
                style={{
                  border: hasKey ? "1px solid rgba(16,185,129,0.3)" : "1px solid var(--border)",
                  background: hasKey ? "var(--success-bg)" : "var(--bg-base)",
                }}>
                <span className="text-[16px]">{opt.icon}</span>
                <div>
                  <div className="font-medium" style={{ color: hasKey ? "var(--success)" : "var(--text-secondary)" }}>
                    {opt.label.split(" ")[0]}
                  </div>
                  {hasKey && <div className="text-[10px]" style={{ color: "var(--success)" }}>Configured</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Keys list */}
      <div className="space-y-3">
        {filteredKeys.length === 0 ? (
          <div className="card p-10 text-center">
            <Key size={32} className="mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
            <p className="text-[14px]" style={{ color: "var(--text-muted)" }}>No {scope === "tenant" ? "tenant override" : "platform"} keys configured</p>
            <button onClick={() => setShowModal(true)} className="btn btn-primary mt-4 text-[13px] py-2 px-4">
              <Plus size={13} /> Add API Key
            </button>
          </div>
        ) : (
          filteredKeys.map(apiKey => (
            <div key={apiKey.id} className="card p-4 transition-all"
              onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--border-gold)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[20px] flex-shrink-0"
                  style={{ background: "var(--bg-elevated)" }}>
                  {serviceIcons[apiKey.service] || "🔑"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>{apiKey.name}</span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                      style={{
                        background: apiKey.status === "active" ? "var(--success-bg)" : "var(--bg-elevated)",
                        color: apiKey.status === "active" ? "var(--success)" : "var(--text-muted)",
                      }}>
                      {apiKey.status}
                    </span>
                    {apiKey.scope === "tenant" && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(99,102,241,0.12)", color: "#818CF8" }}>
                        Tenant Override
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <code className="text-[12px] font-mono px-2 py-0.5 rounded"
                      style={{ color: "var(--text-secondary)", background: "var(--bg-elevated)" }}>
                      {showKey[apiKey.id] ? apiKey.key + "...full_key" : apiKey.key + "••••••••••••"}
                    </code>
                    <button onClick={() => setShowKey(s => ({ ...s, [apiKey.id]: !s[apiKey.id] }))}
                      className="transition-colors" style={{ color: "var(--text-muted)" }}>
                      {showKey[apiKey.id] ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                    <button onClick={() => handleCopy(apiKey.id, apiKey.key)}
                      className="transition-colors" style={{ color: "var(--text-muted)" }}>
                      {copied === apiKey.id ? <Check size={13} style={{ color: "var(--success)" }} /> : <Copy size={13} />}
                    </button>
                  </div>
                  <div className="text-[11px] mt-1" style={{ color: "var(--text-muted)" }}>Last used: {apiKey.lastUsed}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => toggleKey(apiKey.id)} className="transition-colors">
                    {apiKey.status === "active"
                      ? <ToggleRight size={22} style={{ color: "var(--success)" }} />
                      : <ToggleLeft size={22} style={{ color: "var(--text-muted)" }} />
                    }
                  </button>
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                    style={{ background: "var(--bg-elevated)" }}>
                    <Edit size={13} style={{ color: "var(--text-muted)" }} />
                  </button>
                  <button onClick={() => deleteKey(apiKey.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                    style={{ background: "var(--error-bg)" }}>
                    <Trash2 size={13} style={{ color: "var(--error)" }} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardShell>
  );
}
