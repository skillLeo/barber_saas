"use client";
import { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { useToast } from "@/contexts/ToastContext";
import { mockSalaryPayments, mockSalaryConfig, mockBarbers } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import {
  Plus, Search, X, Check, Download, Users, Wallet,
  Clock, CheckCircle2, TrendingUp, CreditCard, Banknote,
  Building2, ChevronDown, Eye, Percent, Hash,
} from "lucide-react";

type SalaryPayment = typeof mockSalaryPayments[0];
type PayType = "commission" | "weekly" | "hourly";

const PAY_TYPE_COLORS: Record<PayType, { color: string; bg: string; label: string }> = {
  commission: { color: "var(--gold)", bg: "var(--gold-subtle)", label: "Commission" },
  weekly:     { color: "var(--success)", bg: "var(--success-bg)", label: "Weekly Fixed" },
  hourly:     { color: "#6366f1", bg: "rgba(99,102,241,0.1)", label: "Hourly" },
};

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string; icon: React.ReactNode }> = {
  paid:    { bg: "var(--success-bg)", color: "var(--success)", label: "Paid", icon: <CheckCircle2 size={11} /> },
  pending: { bg: "rgba(245,158,11,0.12)", color: "#f59e0b", label: "Due", icon: <Clock size={11} /> },
};

const emptyForm = {
  barberId: 0,
  period: "",
  payType: "commission" as PayType,
  base: "",
  commission: "",
  tips: "",
  deductions: "",
  notes: "",
  method: "Bank Transfer",
};

export default function SalariesPage() {
  const toast = useToast();
  const [payments, setPayments] = useState<SalaryPayment[]>(mockSalaryPayments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [barberFilter, setBarberFilter] = useState("all");
  const [showNew, setShowNew] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<SalaryPayment | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = payments.filter(p => {
    const matchSearch = p.barber.toLowerCase().includes(search.toLowerCase()) || p.ref.toLowerCase().includes(search.toLowerCase()) || p.period.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    const matchBarber = barberFilter === "all" || String(p.barberId) === barberFilter;
    return matchSearch && matchStatus && matchBarber;
  });

  const totalPaid = payments.filter(p => p.status === "paid").reduce((s, p) => s + p.total, 0);
  const totalDue = payments.filter(p => p.status === "pending").reduce((s, p) => s + p.total, 0);
  const pendingCount = payments.filter(p => p.status === "pending").length;
  const thisMonthPaid = payments.filter(p => p.status === "paid" && p.date.startsWith("2026-04")).reduce((s, p) => s + p.total, 0);

  const formBase = parseFloat(form.base) || 0;
  const formComm = parseFloat(form.commission) || 0;
  const formTips = parseFloat(form.tips) || 0;
  const formDed  = parseFloat(form.deductions) || 0;
  const formTotal = formBase + formComm + formTips - formDed;

  const createPayment = () => {
    if (!form.barberId || !form.period || formBase <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }
    const barber = mockBarbers.find(b => b.id === form.barberId);
    const newPayment: SalaryPayment = {
      id: `SAL-${String(payments.length + 1).padStart(3, "0")}`,
      ref: `SAL-${String(payments.length + 1).padStart(3, "0")}`,
      barberId: form.barberId,
      barber: barber?.name || "",
      date: new Date().toISOString().split("T")[0],
      period: form.period,
      payType: form.payType,
      base: formBase,
      commission: formComm,
      tips: formTips,
      deductions: formDed,
      total: formTotal,
      status: "paid",
      method: form.method,
      notes: form.notes,
    };
    setPayments(prev => [newPayment, ...prev]);
    toast.success(`${formatCurrency(formTotal)} salary recorded for ${barber?.name}`);
    setShowNew(false);
    setForm(emptyForm);
  };

  const markPaid = (payment: SalaryPayment) => {
    setPayments(prev => prev.map(p => p.id === payment.id ? { ...p, status: "paid" } : p));
    setSelectedPayment(null);
    toast.success(`${payment.barber} salary marked as paid — ${formatCurrency(payment.total)}`);
  };

  // Per-barber summary for the overview cards
  const barberSummary = mockSalaryConfig.map(cfg => {
    const pending = payments.filter(p => p.barberId === cfg.barberId && p.status === "pending");
    const due = pending.reduce((s, p) => s + p.total, 0);
    const lastPaid = payments.find(p => p.barberId === cfg.barberId && p.status === "paid");
    return { ...cfg, due, pendingCount: pending.length, lastPaid: lastPaid?.date || "—", pendingPayments: pending };
  });

  return (
    <DashboardShell role="admin">
      <PageHeader
        title="Staff Salaries"
        subtitle={`${pendingCount > 0 ? `${pendingCount} payment${pendingCount > 1 ? "s" : ""} due` : "All salaries up to date"}`}
        action={
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-secondary" style={{ gap: 6 }} onClick={() => toast.success("Exported")}>
              <Download size={14} /> Export
            </button>
            <button className="btn btn-primary" style={{ gap: 6 }} onClick={() => { setForm(emptyForm); setShowNew(true); }}>
              <Plus size={14} /> Record Payment
            </button>
          </div>
        }
      />

      {/* New Payment Modal */}
      {showNew && (
        <div className="modal-overlay" onClick={() => setShowNew(false)}>
          <div className="modal-panel" style={{ maxWidth: 500, width: "100%" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid var(--border)" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>Record Salary Payment</h3>
              <button className="btn btn-ghost" style={{ padding: "6px 8px" }} onClick={() => setShowNew(false)}><X size={14} /></button>
            </div>
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16, maxHeight: "75vh", overflowY: "auto" }} className="scrollable">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Staff Member *</label>
                  <select className="input" value={form.barberId} onChange={e => {
                    const id = parseInt(e.target.value);
                    const cfg = mockSalaryConfig.find(c => c.barberId === id);
                    setForm(f => ({ ...f, barberId: id, payType: cfg?.payType || "weekly" }));
                  }}>
                    <option value={0}>Select staff member…</option>
                    {mockBarbers.filter(b => b.status !== "inactive").map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Pay Period *</label>
                  <input className="input" value={form.period} onChange={e => setForm(f => ({ ...f, period: e.target.value }))} placeholder="e.g. Week ending 13 Apr 2026" />
                </div>

                {/* Pay type selector */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 8 }}>Pay Structure</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {(["weekly", "commission", "hourly"] as PayType[]).map(t => (
                      <button key={t} onClick={() => setForm(f => ({ ...f, payType: t }))} style={{
                        flex: 1, padding: "10px 6px", borderRadius: 10, cursor: "pointer", textAlign: "center",
                        background: form.payType === t ? `${PAY_TYPE_COLORS[t].color}15` : "var(--bg-elevated)",
                        border: `1.5px solid ${form.payType === t ? PAY_TYPE_COLORS[t].color : "var(--border)"}`,
                        transition: "all 0.15s",
                      }}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: form.payType === t ? PAY_TYPE_COLORS[t].color : "var(--text-secondary)" }}>
                          {PAY_TYPE_COLORS[t].label}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>
                    {form.payType === "hourly" ? "Hours Pay (£) *" : "Base Pay (£) *"}
                  </label>
                  <input className="input" type="number" value={form.base} onChange={e => setForm(f => ({ ...f, base: e.target.value }))} placeholder="0.00" />
                </div>
                {form.payType !== "weekly" && (
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Commission (£)</label>
                    <input className="input" type="number" value={form.commission} onChange={e => setForm(f => ({ ...f, commission: e.target.value }))} placeholder="0.00" />
                  </div>
                )}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Tips (£)</label>
                  <input className="input" type="number" value={form.tips} onChange={e => setForm(f => ({ ...f, tips: e.target.value }))} placeholder="0.00" />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Deductions (£)</label>
                  <input className="input" type="number" value={form.deductions} onChange={e => setForm(f => ({ ...f, deductions: e.target.value }))} placeholder="0.00" />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Payment Method</label>
                  <select className="input" value={form.method} onChange={e => setForm(f => ({ ...f, method: e.target.value }))}>
                    {["Bank Transfer", "Cash", "Cheque"].map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Notes</label>
                  <input className="input" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="e.g. Includes £200 loan deduction…" />
                </div>
              </div>

              {/* Totals preview */}
              {formBase > 0 && (
                <div style={{ background: "var(--bg-elevated)", borderRadius: 14, padding: "16px 20px" }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 12 }}>PAYMENT BREAKDOWN</p>
                  {[
                    { label: "Base / Hours", value: formBase, show: true },
                    { label: "Commission", value: formComm, show: formComm > 0 },
                    { label: "Tips", value: formTips, show: formTips > 0 },
                    { label: "Deductions", value: -formDed, show: formDed > 0, red: true },
                  ].filter(r => r.show).map(r => (
                    <div key={r.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{r.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: r.red ? "var(--error)" : "var(--text-primary)" }}>
                        {r.value < 0 ? "−" : ""}{formatCurrency(Math.abs(r.value))}
                      </span>
                    </div>
                  ))}
                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: 10, marginTop: 4, display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>Total</span>
                    <span style={{ fontSize: 18, fontWeight: 900, color: "var(--gold)" }}>{formatCurrency(formTotal)}</span>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button className="btn btn-ghost" onClick={() => setShowNew(false)}>Cancel</button>
                <button className="btn btn-primary" style={{ gap: 8 }} onClick={createPayment}>
                  <Check size={14} /> Record Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Detail Modal */}
      {selectedPayment && (
        <div className="modal-overlay" onClick={() => setSelectedPayment(null)}>
          <div className="modal-panel" style={{ maxWidth: 420, width: "100%" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid var(--border)" }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>{selectedPayment.ref}</h3>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{selectedPayment.barber} · {selectedPayment.period}</p>
              </div>
              <button className="btn btn-ghost" style={{ padding: "6px 8px" }} onClick={() => setSelectedPayment(null)}><X size={14} /></button>
            </div>
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Big total */}
              <div style={{ background: "var(--bg-elevated)", borderRadius: 14, padding: "20px", textAlign: "center" }}>
                <p style={{ fontSize: 32, fontWeight: 900, color: "var(--gold)", lineHeight: 1 }}>{formatCurrency(selectedPayment.total)}</p>
                <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6 }}>{selectedPayment.period}</p>
              </div>

              {/* Breakdown */}
              <div style={{ background: "var(--bg-elevated)", borderRadius: 12, padding: "14px 16px" }}>
                {[
                  { label: "Base / Hours Pay", value: selectedPayment.base },
                  ...(selectedPayment.commission > 0 ? [{ label: "Commission", value: selectedPayment.commission }] : []),
                  ...(selectedPayment.tips > 0 ? [{ label: "Tips", value: selectedPayment.tips }] : []),
                  ...(selectedPayment.deductions > 0 ? [{ label: "Deductions", value: -selectedPayment.deductions }] : []),
                ].map(r => (
                  <div key={r.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{r.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: r.value < 0 ? "var(--error)" : "var(--text-primary)" }}>
                      {r.value < 0 ? "−" : ""}{formatCurrency(Math.abs(r.value))}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { label: "Pay Type", value: PAY_TYPE_COLORS[selectedPayment.payType as PayType]?.label || selectedPayment.payType },
                  { label: "Method", value: selectedPayment.method },
                  { label: "Date", value: selectedPayment.date },
                  { label: "Status", value: STATUS_STYLES[selectedPayment.status]?.label },
                ].map(f => (
                  <div key={f.label} style={{ background: "var(--bg-elevated)", borderRadius: 10, padding: "10px 12px" }}>
                    <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 3 }}>{f.label}</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{f.value}</p>
                  </div>
                ))}
              </div>

              {selectedPayment.notes && (
                <div style={{ background: "var(--bg-elevated)", borderRadius: 10, padding: "10px 14px" }}>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 3 }}>Notes</p>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{selectedPayment.notes}</p>
                </div>
              )}

              {selectedPayment.status === "pending" && (
                <button className="btn btn-primary" style={{ gap: 8, justifyContent: "center" }}
                  onClick={() => markPaid(selectedPayment)}>
                  <Check size={14} /> Mark as Paid — {formatCurrency(selectedPayment.total)}
                </button>
              )}

              <button className="btn btn-ghost" style={{ justifyContent: "center" }} onClick={() => setSelectedPayment(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total Paid (All Time)", value: formatCurrency(totalPaid), icon: <Wallet size={16} />, color: "var(--success)" },
          { label: "This Month", value: formatCurrency(thisMonthPaid), icon: <TrendingUp size={16} />, color: "var(--gold)" },
          { label: "Payments Due", value: pendingCount.toString(), icon: <Clock size={16} />, color: "#f59e0b" },
          { label: "Outstanding", value: formatCurrency(totalDue), icon: <Users size={16} />, color: "var(--error)" },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--bg-elevated)", display: "flex", alignItems: "center", justifyContent: "center", color: s.color, flexShrink: 0 }}>
              {s.icon}
            </div>
            <div>
              <p style={{ fontSize: 20, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 3 }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Per-barber summary cards — Due payments highlighted */}
      {barberSummary.some(b => b.pendingCount > 0) && (
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 12 }}>PAYMENTS DUE THIS WEEK</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
            {barberSummary.filter(b => b.pendingCount > 0).map(b => (
              <div key={b.barberId} className="card" style={{ padding: "16px 20px", borderLeft: `3px solid ${b.color}`, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${b.color}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 14, fontWeight: 900, color: b.color }}>{b.name.charAt(0)}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.name}</p>
                    <span style={{
                      fontSize: 10, fontWeight: 700, borderRadius: 6, padding: "1px 6px",
                      background: PAY_TYPE_COLORS[b.payType as PayType]?.bg,
                      color: PAY_TYPE_COLORS[b.payType as PayType]?.color,
                    }}>{PAY_TYPE_COLORS[b.payType as PayType]?.label}</span>
                  </div>
                  <p style={{ fontSize: 18, fontWeight: 900, color: "#f59e0b", flexShrink: 0 }}>{formatCurrency(b.due)}</p>
                </div>
                <button className="btn btn-primary" style={{ gap: 6, justifyContent: "center", fontSize: 12 }}
                  onClick={() => {
                    const p = b.pendingPayments[0];
                    if (p) { setSelectedPayment(p as SalaryPayment); }
                  }}>
                  <Eye size={12} /> View & Pay
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
        <div style={{ position: "relative", flex: "0 0 240px" }}>
          <Search size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
          <input className="input" style={{ paddingLeft: 32, fontSize: 13 }} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search staff, period, ref…" />
        </div>
        <select className="input" style={{ width: "auto", fontSize: 13 }} value={barberFilter} onChange={e => setBarberFilter(e.target.value)}>
          <option value="all">All Staff</option>
          {mockBarbers.map(b => <option key={b.id} value={String(b.id)}>{b.name}</option>)}
        </select>
        {[
          { label: "All", value: "all" },
          { label: "Paid", value: "paid" },
          { label: "Due", value: "pending" },
        ].map(f => (
          <button key={f.value} onClick={() => setStatusFilter(f.value)} style={{
            padding: "6px 14px", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer",
            background: statusFilter === f.value ? "var(--gold-subtle)" : "var(--bg-elevated)",
            color: statusFilter === f.value ? "var(--gold)" : "var(--text-secondary)",
            border: statusFilter === f.value ? "1px solid var(--border-gold)" : "1px solid var(--border)",
          }}>{f.label}</button>
        ))}
      </div>

      {/* Salary history table */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Ref</th>
              <th>Staff Member</th>
              <th>Pay Period</th>
              <th>Pay Type</th>
              <th>Base</th>
              <th>Commission</th>
              <th>Tips</th>
              <th>Deductions</th>
              <th>Total</th>
              <th>Status</th>
              <th style={{ width: 60 }}>View</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={11} style={{ textAlign: "center", padding: "48px", color: "var(--text-muted)", fontSize: 14 }}>No salary records found</td></tr>
            ) : filtered.map(p => {
              const cfg = mockSalaryConfig.find(c => c.barberId === p.barberId);
              return (
                <tr key={p.id} onClick={() => setSelectedPayment(p)} style={{ cursor: "pointer" }}>
                  <td><span style={{ fontSize: 12, fontWeight: 700, fontFamily: "monospace", color: "var(--text-secondary)" }}>{p.ref}</span></td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: `${cfg?.color || "var(--gold)"}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: cfg?.color || "var(--gold)" }}>{p.barber.charAt(0)}</span>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{p.barber}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 12, color: "var(--text-secondary)" }}>{p.period}</td>
                  <td>
                    <span style={{
                      fontSize: 11, fontWeight: 700, borderRadius: 6, padding: "2px 7px",
                      background: PAY_TYPE_COLORS[p.payType as PayType]?.bg,
                      color: PAY_TYPE_COLORS[p.payType as PayType]?.color,
                    }}>{PAY_TYPE_COLORS[p.payType as PayType]?.label}</span>
                  </td>
                  <td style={{ fontSize: 13, color: "var(--text-secondary)" }}>{formatCurrency(p.base)}</td>
                  <td style={{ fontSize: 13, color: p.commission > 0 ? "var(--gold)" : "var(--text-muted)" }}>
                    {p.commission > 0 ? formatCurrency(p.commission) : "—"}
                  </td>
                  <td style={{ fontSize: 13, color: p.tips > 0 ? "var(--success)" : "var(--text-muted)" }}>
                    {p.tips > 0 ? formatCurrency(p.tips) : "—"}
                  </td>
                  <td style={{ fontSize: 13, color: p.deductions > 0 ? "var(--error)" : "var(--text-muted)" }}>
                    {p.deductions > 0 ? `−${formatCurrency(p.deductions)}` : "—"}
                  </td>
                  <td style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)" }}>{formatCurrency(p.total)}</td>
                  <td>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      fontSize: 11, fontWeight: 700, borderRadius: 6, padding: "3px 8px",
                      background: STATUS_STYLES[p.status]?.bg, color: STATUS_STYLES[p.status]?.color,
                    }}>
                      {STATUS_STYLES[p.status]?.icon}{STATUS_STYLES[p.status]?.label}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-ghost" style={{ padding: "5px 8px" }} onClick={e => { e.stopPropagation(); setSelectedPayment(p); }}>
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
