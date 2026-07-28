"use client";
import { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { useToast } from "@/contexts/ToastContext";
import { mockExpenses, EXPENSE_CATEGORIES } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import {
  Plus, Search, X, Download, TrendingDown, Check,
  CreditCard, Banknote, Building2, Trash2, Edit2, Receipt
} from "lucide-react";

const PAYMENT_METHODS = ["Bank Transfer", "Card", "Cash", "Direct Debit"];
const CATEGORY_COLORS: Record<string, string> = {
  Rent: "#6366f1", Utilities: "#f59e0b", Staff: "#10b981",
  Marketing: "#EC4899", Equipment: "#8B5CF6", Products: "var(--gold)",
  Maintenance: "#ef4444", Software: "#06b6d4", Cleaning: "#84cc16",
  Insurance: "#f97316", Other: "var(--text-muted)",
};

type Expense = typeof mockExpenses[0];

const emptyForm = {
  category: "Utilities", description: "", amount: "",
  paymentMethod: "Bank Transfer", paidTo: "", notes: "", receipt: false,
};

export default function ExpensesPage() {
  const toast = useToast();
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showNew, setShowNew] = useState(false);
  const [editingExp, setEditingExp] = useState<Expense | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = expenses.filter(e => {
    const matchSearch = e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.paidTo.toLowerCase().includes(search.toLowerCase()) ||
      e.ref.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "All" || e.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const totalExpenses = filtered.reduce((s, e) => s + e.amount, 0);
  const byCategory = EXPENSE_CATEGORIES.map(cat => ({
    cat, total: expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0),
  })).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

  const createExpense = () => {
    if (!form.description || !form.amount || !form.paidTo) {
      toast.error("Please fill in all required fields");
      return;
    }
    const newExp: Expense = {
      id: `EXP-${String(expenses.length + 11).padStart(3, "0")}`,
      ref: `EXP-${String(expenses.length + 11).padStart(3, "0")}`,
      date: new Date().toISOString().split("T")[0],
      category: form.category,
      description: form.description,
      amount: parseFloat(form.amount),
      paymentMethod: form.paymentMethod,
      paidTo: form.paidTo,
      receipt: form.receipt,
      notes: form.notes,
    };
    setExpenses(prev => [newExp, ...prev]);
    toast.success("Expense recorded");
    setShowNew(false);
    setForm(emptyForm);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    setEditingExp(null);
    toast.success("Expense deleted");
  };

  const ExpenseForm = ({ onClose, onSave }: { onClose: () => void; onSave: () => void }) => (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16, maxHeight: "75vh", overflowY: "auto" }} className="scrollable">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Description *</label>
          <input className="input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="e.g. Electricity bill — April" />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Category</label>
          <select className="input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
            {EXPENSE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Amount (£) *</label>
          <input className="input" type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="0.00" />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Paid To *</label>
          <input className="input" value={form.paidTo} onChange={e => setForm(f => ({ ...f, paidTo: e.target.value }))} placeholder="Payee name" />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Payment Method</label>
          <select className="input" value={form.paymentMethod} onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value }))}>
            {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Notes</label>
        <textarea className="input" rows={2} style={{ resize: "none" }} value={form.notes}
          onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Optional notes…" />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <input type="checkbox" id="hasReceipt" checked={form.receipt}
          onChange={e => setForm(f => ({ ...f, receipt: e.target.checked }))}
          style={{ width: 16, height: 16, cursor: "pointer" }} />
        <label htmlFor="hasReceipt" style={{ fontSize: 13, color: "var(--text-secondary)", cursor: "pointer" }}>Receipt obtained</label>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" style={{ gap: 8 }} onClick={onSave}>
          <Check size={14} /> Save Expense
        </button>
      </div>
    </div>
  );

  return (
    <DashboardShell role="admin">
      <PageHeader
        title="Expenses"
        subtitle={`${filtered.length} records · ${formatCurrency(totalExpenses)} total`}
        action={
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-secondary" style={{ gap: 6 }} onClick={() => toast.success("Exported")}>
              <Download size={14} /> Export
            </button>
            <button className="btn btn-primary" style={{ gap: 6 }} onClick={() => { setForm(emptyForm); setShowNew(true); }}>
              <Plus size={14} /> Record Expense
            </button>
          </div>
        }
      />

      {/* New Expense Modal */}
      {showNew && (
        <div className="modal-overlay" onClick={() => setShowNew(false)}>
          <div className="modal-panel" style={{ maxWidth: 480, width: "100%" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid var(--border)" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>Record Expense</h3>
              <button className="btn btn-ghost" style={{ padding: "6px 8px" }} onClick={() => setShowNew(false)}><X size={14} /></button>
            </div>
            <ExpenseForm onClose={() => setShowNew(false)} onSave={createExpense} />
          </div>
        </div>
      )}

      {/* Edit Expense Modal */}
      {editingExp && (
        <div className="modal-overlay" onClick={() => setEditingExp(null)}>
          <div className="modal-panel" style={{ maxWidth: 480, width: "100%" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid var(--border)" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>Expense Details</h3>
              <button className="btn btn-ghost" style={{ padding: "6px 8px" }} onClick={() => setEditingExp(null)}><X size={14} /></button>
            </div>
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { label: "Date", value: editingExp.date },
                  { label: "Category", value: editingExp.category },
                  { label: "Paid To", value: editingExp.paidTo },
                  { label: "Payment", value: editingExp.paymentMethod },
                ].map(f => (
                  <div key={f.label} style={{ background: "var(--bg-elevated)", borderRadius: 10, padding: "10px 12px" }}>
                    <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 3 }}>{f.label}</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{f.value}</p>
                  </div>
                ))}
              </div>
              <div style={{ background: "var(--bg-elevated)", borderRadius: 12, padding: "16px" }}>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>{editingExp.description}</p>
                {editingExp.notes && <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{editingExp.notes}</p>}
                <p style={{ fontSize: 22, fontWeight: 800, color: "var(--error)", marginTop: 10 }}>−{formatCurrency(editingExp.amount)}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 18, height: 18, borderRadius: 4, background: editingExp.receipt ? "var(--success-bg)" : "var(--bg-elevated)", border: `1px solid ${editingExp.receipt ? "var(--success)" : "var(--border)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {editingExp.receipt && <Check size={11} style={{ color: "var(--success)" }} />}
                </div>
                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                  {editingExp.receipt ? "Receipt obtained" : "No receipt"}
                </span>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-danger" style={{ gap: 6 }} onClick={() => deleteExpense(editingExp.id)}>
                  <Trash2 size={14} /> Delete
                </button>
                <button className="btn btn-ghost" style={{ flex: 1, justifyContent: "center" }} onClick={() => setEditingExp(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, alignItems: "start" }}>
        <div>
          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 20 }}>
            {[
              { label: "Total Expenses", value: formatCurrency(totalExpenses), color: "var(--error)" },
              { label: "This Month", value: formatCurrency(expenses.filter(e => e.date.startsWith("2026-04")).reduce((s, e) => s + e.amount, 0)), color: "var(--gold)" },
              { label: "Records", value: filtered.length.toString(), color: "var(--text-primary)" },
            ].map(s => (
              <div key={s.label} className="card" style={{ padding: "16px 20px" }}>
                <p style={{ fontSize: 22, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
            <div style={{ position: "relative", flex: "0 0 220px" }}>
              <Search size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
              <input className="input" style={{ paddingLeft: 32, fontSize: 13 }} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search description, payee…" />
            </div>
            {["All", ...EXPENSE_CATEGORIES.slice(0, 6)].map(c => (
              <button key={c} onClick={() => setCategoryFilter(c)} style={{
                padding: "6px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer",
                background: categoryFilter === c ? "var(--gold-subtle)" : "var(--bg-elevated)",
                color: categoryFilter === c ? "var(--gold)" : "var(--text-secondary)",
                border: categoryFilter === c ? "1px solid var(--border-gold)" : "1px solid var(--border)",
              }}>{c}</button>
            ))}
          </div>

          {/* Expenses list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "64px 24px", color: "var(--text-muted)", background: "var(--bg-card)", borderRadius: 16, border: "1px solid var(--border)" }}>
                <TrendingDown size={32} style={{ margin: "0 auto 12px", display: "block", opacity: 0.4 }} />
                <p style={{ fontSize: 14 }}>No expenses found</p>
              </div>
            ) : filtered.map(exp => (
              <div key={exp.id} className="card" style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer" }}
                onClick={() => setEditingExp(exp)}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: `${CATEGORY_COLORS[exp.category] || "var(--text-muted)"}18`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: `1px solid ${CATEGORY_COLORS[exp.category] || "var(--border)"}30`,
                }}>
                  <TrendingDown size={17} style={{ color: CATEGORY_COLORS[exp.category] || "var(--text-muted)" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{exp.description}</p>
                    <span style={{
                      flexShrink: 0, fontSize: 10, fontWeight: 700, borderRadius: 999, padding: "2px 7px",
                      background: `${CATEGORY_COLORS[exp.category] || "var(--bg-elevated)"}20`,
                      color: CATEGORY_COLORS[exp.category] || "var(--text-muted)",
                      border: `1px solid ${CATEGORY_COLORS[exp.category] || "var(--border)"}30`,
                    }}>{exp.category}</span>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{exp.date} · {exp.paidTo} · {exp.paymentMethod}</p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontSize: 16, fontWeight: 800, color: "var(--error)" }}>−{formatCurrency(exp.amount)}</p>
                  {exp.receipt && (
                    <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end", marginTop: 3 }}>
                      <Receipt size={10} style={{ color: "var(--success)" }} />
                      <span style={{ fontSize: 10, color: "var(--success)", fontWeight: 600 }}>Receipt</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar — Category breakdown */}
        <div style={{ position: "sticky", top: 20 }}>
          <div className="card" style={{ padding: 20 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>By Category</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {byCategory.map(c => {
                const pct = totalExpenses > 0 ? (c.total / totalExpenses) * 100 : 0;
                return (
                  <div key={c.cat}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>{c.cat}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{formatCurrency(c.total)}</span>
                    </div>
                    <div style={{ height: 5, background: "var(--bg-elevated)", borderRadius: 999, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", borderRadius: 999, transition: "width 0.4s",
                        width: `${pct}%`,
                        background: CATEGORY_COLORS[c.cat] || "var(--gold)",
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
