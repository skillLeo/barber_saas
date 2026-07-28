"use client";
import { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Save, Shield, Bell, Mail, Globe, Server, AlertTriangle, RefreshCw } from "lucide-react";

const tabs = ["General", "Security", "Email", "Notifications", "Maintenance"];

export default function SuperAdminSettings() {
  const [activeTab, setActiveTab] = useState("General");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <DashboardShell role="super-admin" title="Platform Settings" subtitle="Global configuration for BarberOS">
      <div className="max-w-4xl space-y-5">

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-[12px] overflow-x-auto" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
          {tabs.map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              className="flex-shrink-0 px-4 py-2 rounded-[9px] text-[13px] font-medium transition-all"
              style={{
                background: activeTab === t ? "var(--bg-card)" : "transparent",
                color: activeTab === t ? "var(--text-primary)" : "var(--text-muted)",
                boxShadow: activeTab === t ? "var(--shadow-sm)" : "none",
                border: activeTab === t ? "1px solid var(--border)" : "1px solid transparent",
              }}>
              {t}
            </button>
          ))}
        </div>

        {activeTab === "General" && (
          <div className="space-y-4">
            <div className="card p-5">
              <div className="flex items-center gap-2.5 mb-5">
                <Globe size={16} style={{ color: "var(--gold)" }} />
                <h3 className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>Platform Identity</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Platform Name", val: "BarberOS" },
                  { label: "Support Email", val: "support@barberos.io" },
                  { label: "Platform URL", val: "https://barberos.io" },
                  { label: "Default Currency", val: "GBP (£)" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>{f.label}</label>
                    <input className="input w-full text-[13px]" defaultValue={f.val} />
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-5">
              <div className="flex items-center gap-2.5 mb-5">
                <Server size={16} style={{ color: "var(--gold)" }} />
                <h3 className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>Trial & Limits</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Free Trial Days", val: "14" },
                  { label: "Max Tenants (Starter)", val: "500" },
                  { label: "Max Staff per Tenant", val: "50" },
                  { label: "Max Locations (Pro)", val: "5" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>{f.label}</label>
                    <input className="input w-full text-[13px]" defaultValue={f.val} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "Security" && (
          <div className="space-y-4">
            <div className="card p-5">
              <div className="flex items-center gap-2.5 mb-5">
                <Shield size={16} style={{ color: "var(--gold)" }} />
                <h3 className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>Security Policies</h3>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Force 2FA for Admins", desc: "All shop owners must enable two-factor authentication", enabled: true },
                  { label: "IP Allowlisting", desc: "Restrict super admin access to specific IP ranges", enabled: false },
                  { label: "Audit Logging", desc: "Log all admin actions to audit trail", enabled: true },
                  { label: "Session Timeout (minutes)", desc: "Auto-logout after inactivity", type: "number", val: "60" },
                ].map((s) => (
                  <div key={s.label} className="flex items-start justify-between py-3"
                    style={{ borderBottom: "1px solid var(--border)" }}>
                    <div>
                      <div className="text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>{s.label}</div>
                      <div className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>{s.desc}</div>
                    </div>
                    {s.type === "number" ? (
                      <input className="input w-20 text-[13px] text-center" defaultValue={s.val} type="number" />
                    ) : (
                      <button className={`relative w-10 h-5.5 rounded-full transition-colors flex-shrink-0 ${s.enabled ? "bg-[var(--gold)]" : "bg-[var(--bg-elevated)]"}`}
                        style={{ width: 40, height: 22 }}>
                        <span className={`absolute top-0.5 w-[18px] h-[18px] rounded-full bg-white transition-all ${s.enabled ? "left-[19px]" : "left-0.5"}`} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "Email" && (
          <div className="card p-5">
            <div className="flex items-center gap-2.5 mb-5">
              <Mail size={16} style={{ color: "var(--gold)" }} />
              <h3 className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>SMTP Configuration</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "SMTP Host", val: "smtp.sendgrid.net" },
                { label: "SMTP Port", val: "587" },
                { label: "Username", val: "apikey" },
                { label: "Password", val: "••••••••••••" },
                { label: "From Name", val: "BarberOS" },
                { label: "From Email", val: "no-reply@barberos.io" },
              ].map((f) => (
                <div key={f.label}>
                  <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>{f.label}</label>
                  <input className="input w-full text-[13px]" defaultValue={f.val}
                    type={f.label === "Password" ? "password" : "text"} />
                </div>
              ))}
            </div>
            <button className="btn btn-secondary mt-4 text-[13px]">Send Test Email</button>
          </div>
        )}

        {activeTab === "Notifications" && (
          <div className="card p-5">
            <div className="flex items-center gap-2.5 mb-5">
              <Bell size={16} style={{ color: "var(--gold)" }} />
              <h3 className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>Platform Notifications</h3>
            </div>
            <div className="space-y-1">
              {[
                { label: "New tenant registered", desc: "Alert when a new shop signs up" },
                { label: "Failed payment", desc: "Alert when a subscription payment fails" },
                { label: "Subscription cancelled", desc: "Alert when a tenant cancels their plan" },
                { label: "High error rate", desc: "Alert when platform error rate exceeds 1%" },
                { label: "New support ticket", desc: "Alert when a tenant submits a support request" },
              ].map((n, i) => (
                <div key={n.label} className="flex items-center justify-between py-3"
                  style={{ borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
                  <div>
                    <div className="text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>{n.label}</div>
                    <div className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>{n.desc}</div>
                  </div>
                  <button className="relative rounded-full transition-colors flex-shrink-0 bg-[var(--gold)]"
                    style={{ width: 40, height: 22 }}>
                    <span className="absolute top-0.5 left-[19px] w-[18px] h-[18px] rounded-full bg-white transition-all" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Maintenance" && (
          <div className="space-y-4">
            <div className="card p-5" style={{ border: "1px solid var(--warning)" }}>
              <div className="flex items-center gap-2.5 mb-3">
                <AlertTriangle size={16} style={{ color: "var(--warning)" }} />
                <h3 className="text-[14px] font-semibold" style={{ color: "var(--warning)" }}>Maintenance Mode</h3>
              </div>
              <p className="text-[13px] mb-4" style={{ color: "var(--text-secondary)" }}>
                Enabling maintenance mode will show a maintenance page to all tenants and users. Only super admins can still log in.
              </p>
              <button className="btn btn-danger text-[13px]">Enable Maintenance Mode</button>
            </div>
            <div className="card p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <RefreshCw size={16} style={{ color: "var(--gold)" }} />
                <h3 className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>Cache Management</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="btn btn-secondary text-[13px]">Clear Application Cache</button>
                <button className="btn btn-secondary text-[13px]">Clear API Cache</button>
                <button className="btn btn-secondary text-[13px]">Rebuild Search Index</button>
              </div>
            </div>
          </div>
        )}

        {/* Save */}
        <div className="flex justify-end">
          <button onClick={handleSave} className="btn btn-primary gap-2 text-[13px]">
            <Save size={14} />
            {saved ? "Saved!" : "Save Settings"}
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}
