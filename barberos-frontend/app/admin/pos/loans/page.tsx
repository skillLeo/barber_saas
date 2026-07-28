"use client";
import { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { useToast } from "@/contexts/ToastContext";
import { mockLoans } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import {
  Plus, Search, X, Landmark, Check, ArrowUpRight,
  ArrowDownLeft, AlertCircle, CheckCircle2, Clock, Trash2,
  Download, User, Building2, UserCheck
} from "lucide-react";

type Loan = typeof mockLoans[0];

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string; icon: React.ReactNode }> = {
  outstanding: { bg: "var(--error-bg)", color: "var(--error)", label: "Outstanding", icon: <AlertCircle size={11} /> },
  partial: { bg: "rgba(245,158,11,0.12)", color: "#f59e0b", label: "Partial", icon: <Clock size={11} /> },
  repaid: { bg: "var(--success-bg)", color: "var(--success)", label: "Repaid", icon: <CheckCircle2 size={11} /> },
};

const PARTY_ICONS: Record<string, React.ReactNode> = {
  staff: <UserCheck size={15} />,
  client: <User size={15} />,
  supplier: <Building2 size={15} />,
  owner: <User size={15} />,
};

const emptyForm = {
  type: "given" as "given" | "taken",
  party: "", partyType: "client" as "staff" | "client" | "supplier" | "owner",
  amount: "", reason: "", dueDate: "", notes: "",
};

export default function LoansPage() {
  const toast = useToast();
  const [loans, setLoans] = useState<Loan[]>(mockLoans);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNew, setShowNew] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [partialPayback, setPartialPayback] = useState("");

  const filtered = loans.filter(l => {
    const matchSearch = l.party.toLowerCase().includes(search.toLowerCase()) || l.ref.toLowerCase().includes(search.toLowerCase()) || l.reason.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || l.type === typeFilter;
    const matchStatus = statusFilter === "all" || l.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const totalGiven = loans.filter(l => l.type === "given").reduce((s, l) => s + l.amount, 0);
  const totalTaken = loans.filter(l => l.type === "taken").reduce((s, l) => s + l.amount, 0);
  const outstanding = loans.filter(l => l.status === "outstanding" || l.status === "partial")
    .reduce((s, l) => s + (l.amount - l.paidBack), 0);

  const createLoan = () => {
    if (!form.party || !form.amount || !form.reason) {
      toast.error("Please fill in all required fields");
      return;
    }
    const newLoan: Loan = {
      id: `LN-${String(loans.length + 7).padStart(3, "0")}`,
      ref: `LN-${String(loans.length + 7).padStart(3, "0")}`,
      date: new Date().toISOString().split("T")[0],
      type: form.type,
      party: form.party,
      partyType: form.partyType,
      amount: parseFloat(form.amount),
      reason: form.reason,
      dueDate: form.dueDate,
      paidBack: 0,
      status: "outstanding",
      notes: form.notes,
    };
    setLoans(prev => [newLoan, ...prev]);
    toast.success(`Loan recorded — ${formatCurrency(parseFloat(form.amount))} ${form.type === "given" ? "given to" : "taken from"} ${form.party}`);
    setShowNew(false);
    setForm(emptyForm);
  };

  const recordPayback = (loan: Loan) => {
    const amount = parseFloat(partialPayback);
    if (!amount || amount <= 0 || amount > (loan.amount - loan.paidBack)) {
      toast.error("Invalid amount");
      return;
    }
    const newPaid = loan.paidBack + amount;
    const newStatus = newPaid >= loan.amount ? "repaid" : "partial";
    setLoans(prev => prev.map(l => l.id === loan.id ? { ...l, paidBack: newPaid, status: newStatus } : l));
    setSelectedLoan(null);
    setPartialPayback("");
    toast.success(`${formatCurrency(amount)} recorded — ${newStatus === "repaid" ? "Fully repaid!" : "Partial payment"}`);
  };

  const deleteLoan = (id: string) => {
    setLoans(prev => prev.filter(l => l.id !== id));
    setSelectedLoan(null);
    toast.success("Loan record deleted");
  };

  return (
    <DashboardShell role="admin">
      <PageHeader
        title="Loans & Credits"
        subtitle="Track money given, taken, and client tabs"
        action={
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-secondary" style={{ gap: 6 }} onClick={() => toast.success("Exported")}>
              <Download size={14} /> Export
            </button>
            <button className="btn btn-primary" style={{ gap: 6 }} onClick={() => { setForm(emptyForm); setShowNew(true); }}>
              <Plus size={14} /> Record Loan
            </button>
          </div>
        }
      />

      {/* New Loan Modal */}
      {showNew && (
        <div className="modal-overlay" onClick={() => setShowNew(false)}>
          <div className="modal-panel" style={{ maxWidth: 480, width: "100%" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid var(--border)" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>Record Loan / Credit</h3>
              <button className="btn btn-ghost" style={{ padding: "6px 8px" }} onClick={() => setShowNew(false)}><X size={14} /></button>
            </div>
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Type selector */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {(["given", "taken"] as const).map(t => (
                  <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))} style={{
                    padding: "14px", borderRadius: 12, cursor: "pointer", textAlign: "center",
                    background: form.type === t ? (t === "given" ? "var(--gold-subtle)" : "rgba(239,68,68,0.08)") : "var(--bg-elevated)",
                    border: form.type === t ? `2px solid ${t === "given" ? "var(--gold)" : "var(--error)"}` : "2px solid var(--border)",
                    transition: "all 0.15s",
                  }}>
                    <div style={{ fontSize: 20, marginBottom: 6 }}>{t === "given" ? "↗" : "↙"}</div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: form.type === t ? (t === "given" ? "var(--gold)" : "var(--error)") : "var(--text-secondary)" }}>
                      {t === "given" ? "Given Out" : "Taken In"}
                    </p>
                    <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                      {t === "given" ? "You lent / gave money" : "You borrowed / received money"}
                    </p>
                  </button>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Party Name *</label>
                  <input className="input" value={form.party} onChange={e => setForm(f => ({ ...f, party: e.target.value }))} placeholder="e.g. James Okafor, Daniel Thompson" />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Party Type</label>
                  <select className="input" value={form.partyType} onChange={e => setForm(f => ({ ...f, partyType: e.target.value as any }))}>
                    <option value="client">Client</option>
                    <option value="staff">Staff</option>
                    <option value="supplier">Supplier</option>
                    <option value="owner">Owner</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Amount (£) *</label>
                  <input className="input" type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="0.00" />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Reason *</label>
                  <input className="input" value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} placeholder="e.g. Advance on wages, Client tab…" />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Due Date</label>
                  <input className="input" type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Notes</label>
                <textarea className="input" rows={2} style={{ resize: "none" }} value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Optional notes…" />
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button className="btn btn-ghost" onClick={() => setShowNew(false)}>Cancel</button>
                <button className="btn btn-primary" style={{ gap: 8 }} onClick={createLoan}>
                  <Check size={14} /> Record Loan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loan Detail Modal */}
      {selectedLoan && (
        <div className="modal-overlay" onClick={() => { setSelectedLoan(null); setPartialPayback(""); }}>
          <div className="modal-panel" style={{ maxWidth: 440, width: "100%" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid var(--border)" }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>{selectedLoan.ref}</h3>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{selectedLoan.date} · {selectedLoan.type === "given" ? "Given to" : "Taken from"} {selectedLoan.party}</p>
              </div>
              <button className="btn btn-ghost" style={{ padding: "6px 8px" }} onClick={() => { setSelectedLoan(null); setPartialPayback(""); }}><X size={14} /></button>
            </div>
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Summary */}
              <div style={{ background: "var(--bg-elevated)", borderRadius: 14, padding: 20, textAlign: "center" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 10,
                    background: selectedLoan.type === "given" ? "var(--gold-subtle)" : "var(--error-bg)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {selectedLoan.type === "given"
                      ? <ArrowUpRight size={16} style={{ color: "var(--gold)" }} />
                      : <ArrowDownLeft size={16} style={{ color: "var(--error)" }} />
                    }
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-secondary)" }}>
                    {selectedLoan.type === "given" ? "Money Given Out" : "Money Taken In"}
                  </p>
                </div>
                <p style={{ fontSize: 28, fontWeight: 900, color: selectedLoan.type === "given" ? "var(--gold)" : "var(--error)", lineHeight: 1 }}>
                  {formatCurrency(selectedLoan.amount)}
                </p>
                {selectedLoan.paidBack > 0 && (
                  <p style={{ fontSize: 13, color: "var(--success)", marginTop: 6 }}>
                    {formatCurrency(selectedLoan.paidBack)} repaid · {formatCurrency(selectedLoan.amount - selectedLoan.paidBack)} remaining
                  </p>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { label: "Party", value: selectedLoan.party },
                  { label: "Type", value: selectedLoan.partyType },
                  { label: "Due Date", value: selectedLoan.dueDate || "—" },
                  { label: "Status", value: STATUS_STYLES[selectedLoan.status]?.label },
                ].map(f => (
                  <div key={f.label} style={{ background: "var(--bg-elevated)", borderRadius: 10, padding: "10px 12px" }}>
                    <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 3 }}>{f.label}</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{f.value}</p>
                  </div>
                ))}
              </div>

              <div style={{ background: "var(--bg-elevated)", borderRadius: 10, padding: "12px 14px" }}>
                <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 3 }}>Reason</p>
                <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{selectedLoan.reason}</p>
                {selectedLoan.notes && <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>{selectedLoan.notes}</p>}
              </div>

              {/* Payback section */}
              {selectedLoan.status !== "repaid" && (
                <div style={{ background: "var(--success-bg)", borderRadius: 12, padding: "14px 16px", border: "1px solid rgba(16,185,129,0.2)" }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--success)", marginBottom: 10 }}>Record Repayment</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <div style={{ position: "relative", flex: 1 }}>
                      <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: 13, pointerEvents: "none" }}>£</span>
                      <input className="input" type="number" style={{ paddingLeft: 24, background: "var(--bg-card)" }}
                        value={partialPayback} onChange={e => setPartialPayback(e.target.value)}
                        placeholder={`Max: ${(selectedLoan.amount - selectedLoan.paidBack).toFixed(2)}`} />
                    </div>
                    <button className="btn btn-primary" style={{ gap: 6, whiteSpace: "nowrap" }}
                      onClick={() => recordPayback(selectedLoan)}>
                      <Check size={14} /> Record
                    </button>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-danger" style={{ gap: 6 }} onClick={() => deleteLoan(selectedLoan.id)}>
                  <Trash2 size={14} /> Delete
                </button>
                <button className="btn btn-ghost" style={{ flex: 1, justifyContent: "center" }}
                  onClick={() => { setSelectedLoan(null); setPartialPayback(""); }}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Given Out", value: formatCurrency(totalGiven), color: "var(--gold)", icon: <ArrowUpRight size={16} /> },
          { label: "Taken In", value: formatCurrency(totalTaken), color: "var(--error)", icon: <ArrowDownLeft size={16} /> },
          { label: "Outstanding", value: formatCurrency(outstanding), color: "#f59e0b", icon: <AlertCircle size={16} /> },
          { label: "Records", value: loans.length.toString(), color: "var(--text-primary)", icon: <Landmark size={16} /> },
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

      {/* Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
        <div style={{ position: "relative", flex: "0 0 220px" }}>
          <Search size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
          <input className="input" style={{ paddingLeft: 32, fontSize: 13 }} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search party, reason…" />
        </div>
        {[
          { label: "All", value: "all" },
          { label: "Given Out", value: "given" },
          { label: "Taken In", value: "taken" },
        ].map(f => (
          <button key={f.value} onClick={() => setTypeFilter(f.value)} style={{
            padding: "6px 14px", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer",
            background: typeFilter === f.value ? "var(--gold-subtle)" : "var(--bg-elevated)",
            color: typeFilter === f.value ? "var(--gold)" : "var(--text-secondary)",
            border: typeFilter === f.value ? "1px solid var(--border-gold)" : "1px solid var(--border)",
          }}>{f.label}</button>
        ))}
        <select className="input" style={{ width: "auto", fontSize: 13 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="outstanding">Outstanding</option>
          <option value="partial">Partial</option>
          <option value="repaid">Repaid</option>
        </select>
      </div>

      {/* Loans list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 24px", color: "var(--text-muted)", background: "var(--bg-card)", borderRadius: 16, border: "1px solid var(--border)" }}>
            <Landmark size={32} style={{ margin: "0 auto 12px", display: "block", opacity: 0.4 }} />
            <p style={{ fontSize: 14 }}>No loans found</p>
          </div>
        ) : filtered.map(loan => {
          const remaining = loan.amount - loan.paidBack;
          const pct = loan.amount > 0 ? (loan.paidBack / loan.amount) * 100 : 0;
          return (
            <div key={loan.id} className="card" style={{ padding: "18px 20px", cursor: "pointer", transition: "all 0.15s" }}
              onClick={() => { setSelectedLoan(loan); setPartialPayback(""); }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: loan.type === "given" ? "var(--gold-subtle)" : "var(--error-bg)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {loan.type === "given"
                    ? <ArrowUpRight size={19} style={{ color: "var(--gold)" }} />
                    : <ArrowDownLeft size={19} style={{ color: "var(--error)" }} />
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{loan.party}</p>
                    <span style={{ fontSize: 10, fontWeight: 700, borderRadius: 999, padding: "2px 7px", background: "var(--bg-elevated)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
                      {loan.partyType}
                    </span>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 3,
                      fontSize: 10, fontWeight: 700, borderRadius: 6, padding: "2px 7px",
                      background: STATUS_STYLES[loan.status]?.bg, color: STATUS_STYLES[loan.status]?.color,
                    }}>
                      {STATUS_STYLES[loan.status]?.icon}{STATUS_STYLES[loan.status]?.label}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: loan.paidBack > 0 ? 8 : 0 }}>{loan.reason}</p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{loan.date}{loan.dueDate ? ` · Due: ${loan.dueDate}` : ""}</p>
                  {loan.paidBack > 0 && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ height: 4, background: "var(--bg-elevated)", borderRadius: 999, overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: 999, width: `${pct}%`, background: "var(--success)", transition: "width 0.4s" }} />
                      </div>
                      <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>
                        {formatCurrency(loan.paidBack)} repaid of {formatCurrency(loan.amount)}
                      </p>
                    </div>
                  )}
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontSize: 18, fontWeight: 800, color: loan.type === "given" ? "var(--gold)" : "var(--error)" }}>
                    {formatCurrency(loan.amount)}
                  </p>
                  {loan.status !== "repaid" && remaining > 0 && (
                    <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                      {formatCurrency(remaining)} left
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardShell>
  );
}
