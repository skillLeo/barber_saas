"use client";
import { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { useToast } from "@/contexts/ToastContext";
import { mockSalesHistory } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import {
  Search, Download, Filter, X, Receipt, CheckCircle2,
  RotateCcw, CreditCard, Banknote, Split, Eye, TrendingUp,
  ShoppingBag, ArrowUpRight, Clock, ChevronDown, Printer, Mail
} from "lucide-react";

const STATUS_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  completed: { bg: "var(--success-bg)", color: "var(--success)", label: "Completed" },
  refunded: { bg: "var(--error-bg)", color: "var(--error)", label: "Refunded" },
  voided: { bg: "var(--bg-elevated)", color: "var(--text-muted)", label: "Voided" },
};

const PAYMENT_ICONS: Record<string, React.ReactNode> = {
  CARD: <CreditCard size={12} />,
  CASH: <Banknote size={12} />,
  SPLIT: <Split size={12} />,
};

export default function SalesHistoryPage() {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [selectedTxn, setSelectedTxn] = useState<typeof mockSalesHistory[0] | null>(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filtered = mockSalesHistory.filter(t => {
    const matchSearch =
      t.client.toLowerCase().includes(search.toLowerCase()) ||
      t.barber.toLowerCase().includes(search.toLowerCase()) ||
      t.ref.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    const matchPayment = paymentFilter === "all" || t.payment === paymentFilter;
    const matchFrom = !dateFrom || t.date >= dateFrom;
    const matchTo = !dateTo || t.date <= dateTo;
    return matchSearch && matchStatus && matchPayment && matchFrom && matchTo;
  });

  const totalRevenue = filtered.filter(t => t.status === "completed").reduce((s, t) => s + t.total, 0);
  const totalRefunded = filtered.filter(t => t.status === "refunded").reduce((s, t) => s + t.total, 0);
  const avgTicket = filtered.filter(t => t.status === "completed").length > 0
    ? totalRevenue / filtered.filter(t => t.status === "completed").length
    : 0;

  return (
    <DashboardShell role="admin">
      <PageHeader
        title="Sales History"
        subtitle={`${filtered.length} transactions`}
        action={
          <button className="btn btn-secondary" style={{ gap: 6 }}
            onClick={() => toast.success("Exported to CSV")}>
            <Download size={14} /> Export
          </button>
        }
      />

      {/* Receipt detail modal */}
      {selectedTxn && (
        <div className="modal-overlay" onClick={() => setSelectedTxn(null)}>
          <div className="modal-panel" style={{ maxWidth: 420, width: "100%" }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: "20px 20px 0" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                  <p style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>Transaction {selectedTxn.ref}</p>
                  <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{selectedTxn.date} at {selectedTxn.time}</p>
                </div>
                <button className="btn btn-ghost" style={{ padding: "6px 8px" }} onClick={() => setSelectedTxn(null)}><X size={14} /></button>
              </div>

              <div style={{ background: "var(--bg-elevated)", borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid var(--border)" }}>
                  <div>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 2 }}>Client</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{selectedTxn.client}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 2 }}>Barber</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{selectedTxn.barber}</p>
                  </div>
                </div>
                {selectedTxn.items.map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{item.qty}× {item.name}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{formatCurrency(item.price * item.qty)}</span>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: 10, marginTop: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Subtotal</span>
                    <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{formatCurrency(selectedTxn.subtotal)}</span>
                  </div>
                  {selectedTxn.discount > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: "var(--success)" }}>Discount</span>
                      <span style={{ fontSize: 12, color: "var(--success)" }}>−{formatCurrency(selectedTxn.discount)}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>VAT (20%)</span>
                    <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{formatCurrency(selectedTxn.tax)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>Total</span>
                    <span style={{ fontSize: 16, fontWeight: 800, color: "var(--gold)" }}>{formatCurrency(selectedTxn.total)}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                <div style={{ flex: 1, background: "var(--bg-elevated)", borderRadius: 10, padding: "10px 12px" }}>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 3 }}>Payment</p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{selectedTxn.payment}</p>
                </div>
                <div style={{ flex: 1, background: "var(--bg-elevated)", borderRadius: 10, padding: "10px 12px" }}>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 3 }}>Status</p>
                  <span style={{
                    fontSize: 11, fontWeight: 700, borderRadius: 6, padding: "2px 8px",
                    background: STATUS_COLORS[selectedTxn.status]?.bg,
                    color: STATUS_COLORS[selectedTxn.status]?.color,
                  }}>{STATUS_COLORS[selectedTxn.status]?.label}</span>
                </div>
              </div>
            </div>
            <div style={{ padding: "14px 20px 20px", display: "flex", gap: 8 }}>
              {selectedTxn.status === "completed" && (
                <button className="btn btn-ghost" style={{ flex: 1, gap: 6, justifyContent: "center", fontSize: 12 }}
                  onClick={() => toast.info("Refund initiated")}>
                  <RotateCcw size={13} /> Refund
                </button>
              )}
              <button className="btn btn-secondary" style={{ flex: 1, gap: 6, justifyContent: "center", fontSize: 12 }}
                onClick={() => toast.success("Receipt printed")}>
                <Printer size={13} /> Print
              </button>
              <button className="btn btn-primary" style={{ flex: 1, gap: 6, justifyContent: "center", fontSize: 12 }}
                onClick={() => toast.success("Receipt emailed")}>
                <Mail size={13} /> Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total Revenue", value: formatCurrency(totalRevenue), icon: <TrendingUp size={16} />, color: "var(--success)" },
          { label: "Transactions", value: filtered.filter(t => t.status === "completed").length.toString(), icon: <Receipt size={16} />, color: "var(--gold)" },
          { label: "Avg. Ticket", value: formatCurrency(avgTicket), icon: <ShoppingBag size={16} />, color: "var(--gold)" },
          { label: "Refunded", value: formatCurrency(totalRefunded), icon: <RotateCcw size={16} />, color: "var(--error)" },
        ].map(stat => (
          <div key={stat.label} className="card" style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--bg-elevated)", display: "flex", alignItems: "center", justifyContent: "center", color: stat.color, flexShrink: 0 }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ fontSize: 20, fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.value}</p>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 3 }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
        <div style={{ position: "relative", flex: "0 0 240px" }}>
          <Search size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
          <input className="input" style={{ paddingLeft: 32, fontSize: 13 }} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search client, barber, ref…" />
        </div>
        <select className="input" style={{ width: "auto", fontSize: 13 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="refunded">Refunded</option>
          <option value="voided">Voided</option>
        </select>
        <select className="input" style={{ width: "auto", fontSize: 13 }} value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)}>
          <option value="all">All Payment</option>
          <option value="CASH">Cash</option>
          <option value="CARD">Card</option>
          <option value="SPLIT">Split</option>
        </select>
        <input className="input" style={{ width: "auto", fontSize: 13 }} type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
        <input className="input" style={{ width: "auto", fontSize: 13 }} type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
        {(search || statusFilter !== "all" || paymentFilter !== "all" || dateFrom || dateTo) && (
          <button className="btn btn-ghost" style={{ gap: 6, fontSize: 13 }}
            onClick={() => { setSearch(""); setStatusFilter("all"); setPaymentFilter("all"); setDateFrom(""); setDateTo(""); }}>
            <X size={13} /> Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Date & Time</th>
              <th>Client</th>
              <th>Barber</th>
              <th>Items</th>
              <th>Payment</th>
              <th>Total</th>
              <th>Status</th>
              <th style={{ width: 60 }}>View</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: "center", padding: "48px 24px", color: "var(--text-muted)", fontSize: 14 }}>
                  No transactions match your filters
                </td>
              </tr>
            ) : filtered.map(txn => (
              <tr key={txn.id} onClick={() => setSelectedTxn(txn)} style={{ cursor: "pointer" }}>
                <td>
                  <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "monospace", color: "var(--text-secondary)" }}>{txn.ref}</span>
                </td>
                <td>
                  <div style={{ fontSize: 13, color: "var(--text-primary)" }}>{txn.date}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 3 }}>
                    <Clock size={10} />{txn.time}
                  </div>
                </td>
                <td style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{txn.client}</td>
                <td style={{ fontSize: 13, color: "var(--text-secondary)" }}>{txn.barber}</td>
                <td>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{txn.items.length} item{txn.items.length !== 1 ? "s" : ""}</span>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--text-secondary)" }}>
                    {PAYMENT_ICONS[txn.payment]}{txn.payment}
                  </div>
                </td>
                <td style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)" }}>{formatCurrency(txn.total)}</td>
                <td>
                  <span style={{
                    fontSize: 11, fontWeight: 700, borderRadius: 6, padding: "3px 8px",
                    background: STATUS_COLORS[txn.status]?.bg,
                    color: STATUS_COLORS[txn.status]?.color,
                  }}>{STATUS_COLORS[txn.status]?.label}</span>
                </td>
                <td>
                  <button className="btn btn-ghost" style={{ padding: "5px 8px" }} onClick={e => { e.stopPropagation(); setSelectedTxn(txn); }}>
                    <Eye size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
