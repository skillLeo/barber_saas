"use client";
import { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { useToast } from "@/contexts/ToastContext";
import { mockPurchases } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import {
  Plus, Search, X, Eye, Download, PackageCheck,
  Clock, CheckCircle2, AlertCircle, Truck, Edit2, Trash2, Check
} from "lucide-react";

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string; icon: React.ReactNode }> = {
  received: { bg: "var(--success-bg)", color: "var(--success)", label: "Received", icon: <CheckCircle2 size={11} /> },
  partial: { bg: "rgba(245,158,11,0.12)", color: "#f59e0b", label: "Partial", icon: <AlertCircle size={11} /> },
  pending: { bg: "var(--bg-elevated)", color: "var(--text-muted)", label: "Pending", icon: <Clock size={11} /> },
};

type Purchase = typeof mockPurchases[0];

const CATEGORIES = ["All", "Equipment", "Products", "Consumables", "Services"];
const PAYMENT_METHODS = ["Bank Transfer", "Card", "Cash", "Credit"];

const emptyForm = {
  supplier: "", category: "Products", paymentMethod: "Card",
  notes: "", items: [{ name: "", qty: 1, unitCost: "" as string | number }],
};

export default function PurchasesPage() {
  const toast = useToast();
  const [purchases, setPurchases] = useState<Purchase[]>(mockPurchases);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPO, setSelectedPO] = useState<Purchase | null>(null);
  const [showNewPO, setShowNewPO] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const filtered = purchases.filter(p => {
    const matchSearch = p.supplier.toLowerCase().includes(search.toLowerCase()) || p.ref.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "All" || p.category === categoryFilter;
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  const totalSpend = filtered.reduce((s, p) => s + p.total, 0);
  const pendingCount = filtered.filter(p => p.status === "pending").length;
  const partialCount = filtered.filter(p => p.status === "partial").length;

  const addFormItem = () => setForm(f => ({ ...f, items: [...f.items, { name: "", qty: 1, unitCost: "" }] }));
  const removeFormItem = (i: number) => setForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));
  const updateFormItem = (i: number, field: string, value: string | number) =>
    setForm(f => ({ ...f, items: f.items.map((item, idx) => idx === i ? { ...item, [field]: value } : item) }));

  const formTotal = form.items.reduce((s, i) => s + (i.qty * (parseFloat(i.unitCost as string) || 0)), 0);

  const createPO = () => {
    if (!form.supplier || form.items.some(i => !i.name || !i.unitCost)) {
      toast.error("Please fill in all required fields");
      return;
    }
    const newPO: Purchase = {
      id: `PO-${String(purchases.length + 7).padStart(3, "0")}`,
      ref: `PO-${String(purchases.length + 7).padStart(3, "0")}`,
      date: new Date().toISOString().split("T")[0],
      supplier: form.supplier,
      category: form.category,
      paymentMethod: form.paymentMethod,
      notes: form.notes,
      status: "pending",
      total: formTotal,
      items: form.items.map(i => ({ name: i.name, qty: i.qty, unitCost: parseFloat(i.unitCost as string) || 0 })),
    };
    setPurchases(prev => [newPO, ...prev]);
    toast.success("Purchase order created");
    setShowNewPO(false);
    setForm(emptyForm);
  };

  const markReceived = (id: string) => {
    setPurchases(prev => prev.map(p => p.id === id ? { ...p, status: "received" } : p));
    setSelectedPO(null);
    toast.success("Marked as received");
  };

  return (
    <DashboardShell role="admin">
      <PageHeader
        title="Purchases"
        subtitle={`${filtered.length} purchase orders`}
        action={
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-secondary" style={{ gap: 6 }} onClick={() => toast.success("Exported")}>
              <Download size={14} /> Export
            </button>
            <button className="btn btn-primary" style={{ gap: 6 }} onClick={() => setShowNewPO(true)}>
              <Plus size={14} /> New Purchase
            </button>
          </div>
        }
      />

      {/* New PO Modal */}
      {showNewPO && (
        <div className="modal-overlay" onClick={() => setShowNewPO(false)}>
          <div className="modal-panel" style={{ maxWidth: 560, width: "100%" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid var(--border)" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>New Purchase Order</h3>
              <button className="btn btn-ghost" style={{ padding: "6px 8px" }} onClick={() => setShowNewPO(false)}><X size={14} /></button>
            </div>
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16, maxHeight: "75vh", overflowY: "auto" }} className="scrollable">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Supplier Name *</label>
                  <input className="input" value={form.supplier} onChange={e => setForm(f => ({ ...f, supplier: e.target.value }))} placeholder="e.g. Wahl Professional" />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Category</label>
                  <select className="input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {["Equipment", "Products", "Consumables", "Services", "Other"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Payment Method</label>
                  <select className="input" value={form.paymentMethod} onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value }))}>
                    {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>Items *</label>
                  <button className="btn btn-ghost" style={{ gap: 4, fontSize: 11, padding: "4px 8px" }} onClick={addFormItem}>
                    <Plus size={11} /> Add Item
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {form.items.map((item, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: 8, alignItems: "center" }}>
                      <input className="input" placeholder="Item name" value={item.name}
                        onChange={e => updateFormItem(i, "name", e.target.value)} style={{ fontSize: 13 }} />
                      <input className="input" type="number" placeholder="Qty" value={item.qty} min={1}
                        onChange={e => updateFormItem(i, "qty", parseInt(e.target.value) || 1)}
                        style={{ width: 60, fontSize: 13, textAlign: "center" }} />
                      <input className="input" type="number" placeholder="Cost £" value={item.unitCost}
                        onChange={e => updateFormItem(i, "unitCost", e.target.value)}
                        style={{ width: 90, fontSize: 13 }} />
                      {form.items.length > 1 && (
                        <button className="btn btn-ghost" style={{ padding: "5px 6px", color: "var(--error)" }} onClick={() => removeFormItem(i)}>
                          <X size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 10, padding: "10px 12px", background: "var(--bg-elevated)", borderRadius: 10, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Total</span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: "var(--gold)" }}>{formatCurrency(formTotal)}</span>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Notes</label>
                <textarea className="input" rows={2} style={{ resize: "none" }} value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Optional notes…" />
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button className="btn btn-ghost" onClick={() => setShowNewPO(false)}>Cancel</button>
                <button className="btn btn-primary" style={{ gap: 8 }} onClick={createPO}>
                  <Check size={14} /> Create Purchase Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PO Detail Modal */}
      {selectedPO && (
        <div className="modal-overlay" onClick={() => setSelectedPO(null)}>
          <div className="modal-panel" style={{ maxWidth: 480, width: "100%" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid var(--border)" }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>{selectedPO.ref}</h3>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{selectedPO.date} · {selectedPO.supplier}</p>
              </div>
              <button className="btn btn-ghost" style={{ padding: "6px 8px" }} onClick={() => setSelectedPO(null)}><X size={14} /></button>
            </div>
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {[
                  { label: "Category", value: selectedPO.category },
                  { label: "Payment", value: selectedPO.paymentMethod },
                  { label: "Status", value: STATUS_STYLES[selectedPO.status]?.label },
                ].map(f => (
                  <div key={f.label} style={{ background: "var(--bg-elevated)", borderRadius: 10, padding: "10px 12px" }}>
                    <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 3 }}>{f.label}</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{f.value}</p>
                  </div>
                ))}
              </div>
              <div style={{ background: "var(--bg-elevated)", borderRadius: 12, padding: "14px 16px" }}>
                {selectedPO.items.map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{item.name}</p>
                      <p style={{ fontSize: 11, color: "var(--text-muted)" }}>× {item.qty} @ {formatCurrency(item.unitCost)} each</p>
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{formatCurrency(item.qty * item.unitCost)}</p>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: 10, marginTop: 4, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>Total</span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: "var(--gold)" }}>{formatCurrency(selectedPO.total)}</span>
                </div>
              </div>
              {selectedPO.notes && (
                <div style={{ background: "var(--bg-elevated)", borderRadius: 10, padding: "10px 14px" }}>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 3 }}>Notes</p>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{selectedPO.notes}</p>
                </div>
              )}
              {selectedPO.status !== "received" && (
                <button className="btn btn-primary" style={{ gap: 8, justifyContent: "center" }}
                  onClick={() => markReceived(selectedPO.id)}>
                  <Truck size={14} /> Mark as Received
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total Spend", value: formatCurrency(totalSpend), color: "var(--gold)", icon: <PackageCheck size={16} /> },
          { label: "Orders", value: filtered.length.toString(), color: "var(--text-primary)", icon: <PackageCheck size={16} /> },
          { label: "Pending", value: pendingCount.toString(), color: "#f59e0b", icon: <Clock size={16} /> },
          { label: "Partial", value: partialCount.toString(), color: "var(--warning)", icon: <AlertCircle size={16} /> },
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
          <input className="input" style={{ paddingLeft: 32, fontSize: 13 }} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search supplier, ref…" />
        </div>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategoryFilter(c)} style={{
            padding: "6px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer",
            background: categoryFilter === c ? "var(--gold-subtle)" : "var(--bg-elevated)",
            color: categoryFilter === c ? "var(--gold)" : "var(--text-secondary)",
            border: categoryFilter === c ? "1px solid var(--border-gold)" : "1px solid var(--border)",
          }}>{c}</button>
        ))}
        <select className="input" style={{ width: "auto", fontSize: 13 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="received">Received</option>
          <option value="partial">Partial</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Ref</th>
              <th>Date</th>
              <th>Supplier</th>
              <th>Category</th>
              <th>Items</th>
              <th>Payment</th>
              <th>Total</th>
              <th>Status</th>
              <th style={{ width: 60 }}>View</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={9} style={{ textAlign: "center", padding: "48px", color: "var(--text-muted)", fontSize: 14 }}>No purchases found</td></tr>
            ) : filtered.map(po => (
              <tr key={po.id} onClick={() => setSelectedPO(po)} style={{ cursor: "pointer" }}>
                <td><span style={{ fontSize: 12, fontWeight: 700, fontFamily: "monospace", color: "var(--text-secondary)" }}>{po.ref}</span></td>
                <td style={{ fontSize: 13, color: "var(--text-primary)" }}>{po.date}</td>
                <td style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{po.supplier}</td>
                <td><span className="badge badge-gray" style={{ fontSize: 11 }}>{po.category}</span></td>
                <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{po.items.length} item{po.items.length !== 1 ? "s" : ""}</td>
                <td style={{ fontSize: 13, color: "var(--text-secondary)" }}>{po.paymentMethod}</td>
                <td style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)" }}>{formatCurrency(po.total)}</td>
                <td>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    fontSize: 11, fontWeight: 700, borderRadius: 6, padding: "3px 8px",
                    background: STATUS_STYLES[po.status]?.bg, color: STATUS_STYLES[po.status]?.color,
                  }}>
                    {STATUS_STYLES[po.status]?.icon}{STATUS_STYLES[po.status]?.label}
                  </span>
                </td>
                <td>
                  <button className="btn btn-ghost" style={{ padding: "5px 8px" }} onClick={e => { e.stopPropagation(); setSelectedPO(po); }}>
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
