"use client";
import { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { SlideOver } from "@/components/ui/SlideOver";
import { useToast } from "@/contexts/ToastContext";
import { mockTenants } from "@/lib/mock-data";
import {
  Search, Plus, Building2, Users, DollarSign, ExternalLink,
  Ban, CheckCircle, Settings, Trash2, TrendingUp, Mail, Phone,
  Globe, CreditCard, BarChart2, Shield
} from "lucide-react";

type Tenant = typeof mockTenants[0];

const planConfig: Record<string, { color: string; bg: string }> = {
  Starter: { color: "var(--text-secondary)", bg: "var(--bg-elevated)" },
  Professional: { color: "var(--gold)", bg: "var(--gold-subtle)" },
  Business: { color: "#818CF8", bg: "rgba(99,102,241,0.12)" },
  Enterprise: { color: "var(--success)", bg: "var(--success-bg)" },
};

const statusStyle: Record<string, { bg: string; color: string; label: string }> = {
  active: { bg: "var(--success-bg)", color: "var(--success)", label: "Active" },
  trial: { bg: "var(--gold-subtle)", color: "var(--gold)", label: "Trial" },
  suspended: { bg: "var(--error-bg)", color: "var(--error)", label: "Suspended" },
};

const planOrder = ["Starter", "Professional", "Business", "Enterprise"];

export default function TenantsPage() {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [filterPlan, setFilterPlan] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState<Tenant | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [bulkAction, setBulkAction] = useState("");

  const filtered = mockTenants.filter(t => {
    const ms = t.name.toLowerCase().includes(search.toLowerCase()) || t.owner.toLowerCase().includes(search.toLowerCase());
    const mp = filterPlan === "all" || t.plan.toLowerCase() === filterPlan;
    const mst = filterStatus === "all" || t.status === filterStatus;
    return ms && mp && mst;
  });

  const totalMRR = mockTenants.filter(t => t.status === "active").reduce((s, t) => s + t.mrr, 0);

  return (
    <DashboardShell
      role="super-admin"
      title="Tenants"
      subtitle={`${mockTenants.length} registered barbershops`}
      action={
        <button className="btn btn-primary" style={{ fontSize: 13 }}>
          <Plus size={14} /> Add Tenant
        </button>
      }
    >
      {/* Tenant Detail SlideOver */}
      <SlideOver open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? "Tenant Details"} width={500}>
        {selected && (
          <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, flexShrink: 0, background: planConfig[selected.plan]?.bg ?? "var(--bg-elevated)", color: planConfig[selected.plan]?.color ?? "var(--text-primary)" }}>
                {selected.name[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>{selected.name}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Owner: {selected.owner}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{selected.domain}</div>
              </div>
              <span style={{ padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700, background: statusStyle[selected.status].bg, color: statusStyle[selected.status].color }}>
                {statusStyle[selected.status].label}
              </span>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {[
                { l: "Plan", v: selected.plan, color: planConfig[selected.plan]?.color ?? "var(--gold)" },
                { l: "Branches", v: selected.branches, color: "var(--gold)" },
                { l: "Staff", v: selected.staff, color: "#6366F1" },
                { l: "MRR", v: selected.mrr > 0 ? `£${selected.mrr}` : "Trial", color: "var(--success)" },
              ].map(s => (
                <div key={s.l} style={{ padding: "11px 8px", borderRadius: 10, background: "var(--bg-elevated)", textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: s.color }}>{s.v}</div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Contact */}
            <div className="card" style={{ padding: "14px 16px" }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 10 }}>Contact</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-secondary)" }}><Phone size={12} style={{ color: "var(--text-muted)", flexShrink: 0 }} />{selected.phone}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-secondary)" }}><Mail size={12} style={{ color: "var(--text-muted)", flexShrink: 0 }} />{selected.email}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-secondary)" }}><Globe size={12} style={{ color: "var(--text-muted)", flexShrink: 0 }} /><span style={{ color: "var(--gold)" }}>{selected.domain}</span></div>
              </div>
            </div>

            {/* Usage stats */}
            <div className="card" style={{ padding: "14px 16px" }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 12 }}>Usage This Month</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { l: "Bookings", v: selected.usage.bookingsThisMonth, max: 500, color: "var(--gold)" },
                  { l: "Storage", v: `${selected.usage.storageGB}GB`, pct: (selected.usage.storageGB / 20) * 100, color: "#6366f1" },
                  { l: "API calls today", v: selected.usage.apiCallsToday, max: 5000, color: "var(--success)" },
                ].map(u => (
                  <div key={u.l}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                      <span style={{ color: "var(--text-muted)" }}>{u.l}</span>
                      <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{u.v}</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 2, background: "var(--bg-elevated)", overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 2, background: u.color, width: `${Math.min(u.pct ?? (typeof u.v === "number" ? (u.v / (u.max ?? 1)) * 100 : 50), 100)}%`, transition: "width 0.3s" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Branding preview */}
            <div className="card" style={{ padding: "14px 16px" }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 10 }}>Branding</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: selected.branding.primaryColor }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>{selected.branding.primaryColor}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Font: {selected.branding.font}</div>
                </div>
              </div>
            </div>

            {/* Billing history */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 10 }}>Recent Invoices</div>
              {selected.invoices.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {selected.invoices.slice(0, 3).map(inv => (
                    <div key={inv.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)", fontSize: 12 }}>
                      <div>
                        <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{inv.id}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{inv.date}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontWeight: 700, color: "var(--gold)" }}>£{inv.amount}</span>
                        <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 6, background: inv.status === "paid" ? "var(--success-bg)" : "var(--error-bg)", color: inv.status === "paid" ? "var(--success)" : "var(--error)" }}>
                          {inv.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: 12, borderRadius: 10, background: "var(--bg-elevated)", fontSize: 12, color: "var(--text-muted)", textAlign: "center" }}>No invoices yet — on trial</div>
              )}
            </div>

            {/* Quick actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <button className="btn btn-ghost" style={{ justifyContent: "center", fontSize: 12 }} onClick={() => toast.info("Impersonating tenant…")}><Shield size={13} /> Impersonate</button>
                <button className="btn btn-primary" style={{ justifyContent: "center", fontSize: 12 }} onClick={() => { window.open("#", "_blank"); }}><ExternalLink size={13} /> Open Dashboard</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <button className="btn btn-secondary" style={{ justifyContent: "center", fontSize: 12 }}><Settings size={13} /> Settings</button>
                {selected.status === "active"
                  ? <button className="btn btn-danger" style={{ justifyContent: "center", fontSize: 12 }} onClick={() => { toast.warning("Tenant suspended"); setSelected(null); }}><Ban size={13} /> Suspend</button>
                  : <button className="btn btn-ghost" style={{ justifyContent: "center", fontSize: 12, color: "var(--success)" }} onClick={() => { toast.success("Tenant reactivated"); setSelected(null); }}><CheckCircle size={13} /> Reactivate</button>
                }
              </div>
              <button className="btn btn-danger" style={{ width: "100%", justifyContent: "center", fontSize: 12 }} onClick={() => { toast.error("Tenant deleted"); setSelected(null); }}><Trash2 size={13} /> Delete Tenant</button>
            </div>
          </div>
        )}
      </SlideOver>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Top stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
          {[
            { l: "Total Tenants", v: mockTenants.length, color: "var(--gold)" },
            { l: "Active", v: mockTenants.filter(t => t.status === "active").length, color: "var(--success)" },
            { l: "On Trial", v: mockTenants.filter(t => t.status === "trial").length, color: "var(--warning)" },
            { l: "MRR", v: `£${totalMRR}`, color: "#6366f1" },
          ].map(s => (
            <div key={s.l} className="card" style={{ padding: "16px 18px" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.v}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Bulk actions bar */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: "var(--gold-subtle)", border: "1px solid var(--gold)" }}>
            <span className="text-sm font-semibold" style={{ color: "var(--gold)" }}>
              {selectedIds.size} tenant{selectedIds.size > 1 ? "s" : ""} selected
            </span>
            <div className="flex items-center gap-2 ml-auto">
              <select
                className="input text-xs"
                value={bulkAction}
                onChange={e => setBulkAction(e.target.value)}
                style={{ minWidth: 150 }}
              >
                <option value="">Bulk action...</option>
                <option value="suspend">Suspend selected</option>
                <option value="activate">Activate selected</option>
                <option value="upgrade">Upgrade to Business</option>
                <option value="email">Send email</option>
                <option value="delete">Delete selected</option>
              </select>
              <button
                className="btn btn-primary"
                style={{ fontSize: 12 }}
                onClick={() => {
                  if (!bulkAction) return;
                  const count = selectedIds.size;
                  if (bulkAction === "suspend") toast.warning(`${count} tenant(s) suspended`);
                  else if (bulkAction === "activate") toast.success(`${count} tenant(s) activated`);
                  else if (bulkAction === "upgrade") toast.success(`${count} tenant(s) upgraded to Business`);
                  else if (bulkAction === "email") toast.info(`Email sent to ${count} tenant(s)`);
                  else if (bulkAction === "delete") toast.error(`${count} tenant(s) deleted`);
                  setSelectedIds(new Set());
                  setBulkAction("");
                }}
                disabled={!bulkAction}
              >
                Apply
              </button>
              <button
                className="btn btn-ghost text-xs"
                onClick={() => setSelectedIds(new Set())}
                style={{ color: "var(--text-muted)" }}
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: "1 1 200px" }}>
            <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input className="input" placeholder="Search tenants…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 30, fontSize: 13 }} />
          </div>
          <select className="input" value={filterPlan} onChange={e => setFilterPlan(e.target.value)} style={{ flex: "0 0 auto", fontSize: 12, minWidth: 130 }}>
            <option value="all">All Plans</option>
            {planOrder.map(p => <option key={p} value={p.toLowerCase()}>{p}</option>)}
          </select>
          <select className="input" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ flex: "0 0 auto", fontSize: 12, minWidth: 120 }}>
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="trial">Trial</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        {/* Tenants table */}
        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}>
                    <input
                      type="checkbox"
                      checked={filtered.length > 0 && filtered.every(t => selectedIds.has(t.id))}
                      onChange={e => {
                        if (e.target.checked) setSelectedIds(new Set(filtered.map(t => t.id)));
                        else setSelectedIds(new Set());
                      }}
                    />
                  </th>
                  <th>Tenant</th>
                  <th>Owner</th>
                  <th>Plan</th>
                  <th>Branches</th>
                  <th>Staff</th>
                  <th>Revenue</th>
                  <th>Status</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  <tr key={t.id} onClick={() => setSelected(t)} style={{ background: selectedIds.has(t.id) ? "var(--gold-subtle)" : undefined }}>
                    <td onClick={e => e.stopPropagation()} style={{ width: 40 }}>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(t.id)}
                        onChange={e => {
                          setSelectedIds(prev => {
                            const next = new Set(prev);
                            if (e.target.checked) next.add(t.id); else next.delete(t.id);
                            return next;
                          });
                        }}
                      />
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, flexShrink: 0, background: planConfig[t.plan]?.bg ?? "var(--bg-elevated)", color: planConfig[t.plan]?.color ?? "var(--text-primary)" }}>
                          {t.name[0]}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{t.name}</div>
                          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{t.domain}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: 13 }}>{t.owner}</td>
                    <td>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: planConfig[t.plan]?.bg, color: planConfig[t.plan]?.color }}>
                        {t.plan}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <Building2 size={12} style={{ color: "var(--text-muted)" }} />
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{t.branches}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <Users size={12} style={{ color: "var(--text-muted)" }} />
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{t.staff}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: 13, fontWeight: 700, color: t.revenue > 0 ? "var(--gold)" : "var(--text-muted)" }}>
                        {t.revenue > 0 ? `£${t.revenue.toLocaleString()}` : "Trial"}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 9px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: statusStyle[t.status]?.bg, color: statusStyle[t.status]?.color }}>
                        {statusStyle[t.status]?.label}
                      </span>
                    </td>
                    <td><span style={{ fontSize: 12 }}>{t.joined}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div style={{ padding: 40, textAlign: "center" }}>
                <Search size={28} style={{ color: "var(--border-strong)", marginBottom: 8 }} />
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>No tenants found</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
