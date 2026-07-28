"use client";
import { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { useToast } from "@/contexts/ToastContext";
import { mockProducts, mockStockAdjustments } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import {
  Plus, Minus, Search, X, Package, AlertTriangle, CheckCircle2,
  TrendingUp, Download, History, RefreshCw, Check, Truck,
  BarChart3, ShoppingBag, Eye, PenLine,
} from "lucide-react";

type Product = typeof mockProducts[0] & { lowStock?: boolean };
type AdjType = "delivery" | "sold" | "adjustment";

const CATEGORY_COLORS: Record<string, string> = {
  Styling: "#C9A84C",
  Shaving: "#6366f1",
  Beard: "#10b981",
  Treatment: "#f59e0b",
  Other: "var(--text-muted)",
};

function stockStatus(stock: number): { label: string; color: string; bg: string; icon: React.ReactNode } {
  if (stock <= 3) return { label: "Critical", color: "var(--error)", bg: "var(--error-bg)", icon: <AlertTriangle size={12} /> };
  if (stock <= 10) return { label: "Low", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", icon: <AlertTriangle size={12} /> };
  return { label: "In Stock", color: "var(--success)", bg: "var(--success-bg)", icon: <CheckCircle2 size={12} /> };
}

const emptyAdjForm = {
  productId: 0,
  type: "delivery" as AdjType,
  qty: "",
  note: "",
};

export default function StockPage() {
  const toast = useToast();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [adjustments, setAdjustments] = useState(mockStockAdjustments);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAdj, setShowAdj] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [adjForm, setAdjForm] = useState(emptyAdjForm);
  const [view, setView] = useState<"grid" | "list">("grid");

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    const matchCat = categoryFilter === "All" || p.category === categoryFilter;
    const matchStock =
      stockFilter === "all" ? true :
      stockFilter === "low" ? p.stock <= 10 :
      stockFilter === "critical" ? p.stock <= 3 :
      p.stock > 10;
    return matchSearch && matchCat && matchStock;
  });

  const totalValue = products.reduce((s, p) => s + p.stock * p.cost, 0);
  const totalRetail = products.reduce((s, p) => s + p.stock * p.price, 0);
  const lowCount = products.filter(p => p.stock <= 10 && p.stock > 3).length;
  const criticalCount = products.filter(p => p.stock <= 3).length;

  const openAdj = (p: Product, type: AdjType = "delivery") => {
    setAdjForm({ productId: p.id, type, qty: "", note: "" });
    setSelectedProduct(p);
    setShowAdj(true);
  };

  const saveAdj = () => {
    const qty = parseInt(adjForm.qty);
    if (!qty || qty <= 0) { toast.error("Enter a valid quantity"); return; }
    const p = products.find(x => x.id === adjForm.productId)!;
    const delta = adjForm.type === "sold" || (adjForm.type === "adjustment" && qty < 0) ? -qty : qty;
    const newStock = Math.max(0, p.stock + delta);
    setProducts(prev => prev.map(x => x.id === p.id ? { ...x, stock: newStock } : x));
    setAdjustments(prev => [{
      id: `ADJ-${String(prev.length + 1).padStart(3, "0")}`,
      productId: p.id, productName: p.name,
      type: adjForm.type, qty: delta,
      before: p.stock, after: newStock,
      date: new Date().toISOString().split("T")[0],
      note: adjForm.note || (adjForm.type === "delivery" ? "Manual stock delivery" : adjForm.type === "sold" ? "Manual sale adjustment" : "Manual adjustment"),
      user: "Admin",
    }, ...prev]);
    toast.success(`Stock updated — ${p.name} now ${newStock} units`);
    setShowAdj(false);
    setAdjForm(emptyAdjForm);
    setSelectedProduct(null);
  };

  const adjTypeMeta: Record<AdjType, { label: string; color: string; sign: string }> = {
    delivery: { label: "Stock Delivery", color: "var(--success)", sign: "+" },
    sold: { label: "Sale / Used", color: "var(--error)", sign: "−" },
    adjustment: { label: "Manual Adjustment", color: "#f59e0b", sign: "±" },
  };

  return (
    <DashboardShell role="admin">
      <PageHeader
        title="Stock & Inventory"
        subtitle={`${products.length} products · ${criticalCount > 0 ? `${criticalCount} critical` : lowCount > 0 ? `${lowCount} low` : "All levels healthy"}`}
        action={
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-ghost" style={{ gap: 6 }} onClick={() => setShowHistory(true)}>
              <History size={14} /> History
            </button>
            <button className="btn btn-secondary" style={{ gap: 6 }} onClick={() => toast.success("Exported")}>
              <Download size={14} /> Export
            </button>
            <button className="btn btn-primary" style={{ gap: 6 }} onClick={() => { setAdjForm({ ...emptyAdjForm, type: "delivery" }); setSelectedProduct(null); setShowAdj(true); }}>
              <Truck size={14} /> Record Delivery
            </button>
          </div>
        }
      />

      {/* Adj History Modal */}
      {showHistory && (
        <div className="modal-overlay" onClick={() => setShowHistory(false)}>
          <div className="modal-panel" style={{ maxWidth: 640, width: "100%" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid var(--border)" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>Stock Movement History</h3>
              <button className="btn btn-ghost" style={{ padding: "6px 8px" }} onClick={() => setShowHistory(false)}><X size={14} /></button>
            </div>
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 8, maxHeight: "70vh", overflowY: "auto" }} className="scrollable">
              {adjustments.map(adj => (
                <div key={adj.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", background: "var(--bg-elevated)", borderRadius: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                    background: adj.type === "delivery" ? "var(--success-bg)" : adj.type === "sold" ? "var(--error-bg)" : "rgba(245,158,11,0.1)",
                  }}>
                    {adj.type === "delivery" ? <Truck size={15} style={{ color: "var(--success)" }} />
                      : adj.type === "sold" ? <ShoppingBag size={15} style={{ color: "var(--error)" }} />
                      : <PenLine size={15} style={{ color: "#f59e0b" }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{adj.productName}</p>
                    <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{adj.date} · {adj.note} · {adj.user}</p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 800, color: adj.qty > 0 ? "var(--success)" : "var(--error)" }}>
                      {adj.qty > 0 ? "+" : ""}{adj.qty}
                    </p>
                    <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{adj.before} → {adj.after}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {showAdj && (
        <div className="modal-overlay" onClick={() => setShowAdj(false)}>
          <div className="modal-panel" style={{ maxWidth: 440, width: "100%" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid var(--border)" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>
                {selectedProduct ? `Adjust — ${selectedProduct.name}` : "Record Stock Delivery"}
              </h3>
              <button className="btn btn-ghost" style={{ padding: "6px 8px" }} onClick={() => setShowAdj(false)}><X size={14} /></button>
            </div>
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Product selector if not pre-selected */}
              {!selectedProduct && (
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Product *</label>
                  <select className="input" value={adjForm.productId} onChange={e => setAdjForm(f => ({ ...f, productId: parseInt(e.target.value) }))}>
                    <option value={0}>Select product…</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (Current: {p.stock})</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Current stock indicator */}
              {(selectedProduct || adjForm.productId > 0) && (() => {
                const p = selectedProduct || products.find(x => x.id === adjForm.productId)!;
                const st = stockStatus(p.stock);
                return (
                  <div style={{ background: "var(--bg-elevated)", borderRadius: 12, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 2 }}>Current Stock</p>
                      <p style={{ fontSize: 24, fontWeight: 900, color: "var(--text-primary)", lineHeight: 1 }}>{p.stock} <span style={{ fontSize: 13, fontWeight: 400, color: "var(--text-muted)" }}>units</span></p>
                    </div>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, borderRadius: 8, padding: "4px 10px", background: st.bg, color: st.color }}>
                      {st.icon}{st.label}
                    </span>
                  </div>
                );
              })()}

              {/* Type selector */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 8 }}>Type</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  {(["delivery", "sold", "adjustment"] as AdjType[]).map(t => (
                    <button key={t} onClick={() => setAdjForm(f => ({ ...f, type: t }))} style={{
                      padding: "10px 6px", borderRadius: 10, cursor: "pointer", textAlign: "center",
                      background: adjForm.type === t ? `${adjTypeMeta[t].color}15` : "var(--bg-elevated)",
                      border: adjForm.type === t ? `1.5px solid ${adjTypeMeta[t].color}` : "1.5px solid var(--border)",
                      transition: "all 0.15s",
                    }}>
                      <p style={{ fontSize: 16, marginBottom: 3 }}>{t === "delivery" ? "📦" : t === "sold" ? "🛒" : "✏️"}</p>
                      <p style={{ fontSize: 11, fontWeight: 700, color: adjForm.type === t ? adjTypeMeta[t].color : "var(--text-secondary)" }}>
                        {adjTypeMeta[t].label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Quantity *</label>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button className="btn btn-ghost" style={{ padding: "8px 14px", fontSize: 18, fontWeight: 700 }}
                    onClick={() => setAdjForm(f => ({ ...f, qty: String(Math.max(1, parseInt(f.qty || "1") - 1)) }))}>
                    <Minus size={14} />
                  </button>
                  <input className="input" type="number" style={{ textAlign: "center", fontSize: 22, fontWeight: 800, flex: 1 }}
                    value={adjForm.qty} onChange={e => setAdjForm(f => ({ ...f, qty: e.target.value }))} placeholder="0" min={1} />
                  <button className="btn btn-ghost" style={{ padding: "8px 14px", fontSize: 18, fontWeight: 700 }}
                    onClick={() => setAdjForm(f => ({ ...f, qty: String(parseInt(f.qty || "0") + 1) }))}>
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Note</label>
                <input className="input" value={adjForm.note} onChange={e => setAdjForm(f => ({ ...f, note: e.target.value }))}
                  placeholder={adjForm.type === "delivery" ? "e.g. Weekly delivery from Wahl Pro" : adjForm.type === "sold" ? "e.g. Sold via walk-in" : "e.g. Damaged / returned / write-off"} />
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 4 }}>
                <button className="btn btn-ghost" onClick={() => setShowAdj(false)}>Cancel</button>
                <button className="btn btn-primary" style={{ gap: 8 }} onClick={saveAdj}>
                  <Check size={14} /> Save Adjustment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Stock Value (Cost)", value: formatCurrency(totalValue), icon: <Package size={16} />, color: "var(--gold)" },
          { label: "Retail Value", value: formatCurrency(totalRetail), icon: <TrendingUp size={16} />, color: "var(--success)" },
          { label: "Low Stock Items", value: lowCount.toString(), icon: <AlertTriangle size={16} />, color: "#f59e0b" },
          { label: "Critical / Out", value: criticalCount.toString(), icon: <AlertTriangle size={16} />, color: "var(--error)" },
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

      {/* Filters + view toggle */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20, alignItems: "center" }}>
        <div style={{ position: "relative", flex: "0 0 240px" }}>
          <Search size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
          <input className="input" style={{ paddingLeft: 32, fontSize: 13 }} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search product, SKU…" />
        </div>
        {categories.map(c => (
          <button key={c} onClick={() => setCategoryFilter(c)} style={{
            padding: "6px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer",
            background: categoryFilter === c ? "var(--gold-subtle)" : "var(--bg-elevated)",
            color: categoryFilter === c ? "var(--gold)" : "var(--text-secondary)",
            border: categoryFilter === c ? "1px solid var(--border-gold)" : "1px solid var(--border)",
          }}>{c}</button>
        ))}
        <select className="input" style={{ width: "auto", fontSize: 13 }} value={stockFilter} onChange={e => setStockFilter(e.target.value)}>
          <option value="all">All Stock</option>
          <option value="healthy">Healthy</option>
          <option value="low">Low (&lt;10)</option>
          <option value="critical">Critical (&lt;3)</option>
        </select>
        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          {(["grid", "list"] as const).map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: "7px 12px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600,
              background: view === v ? "var(--gold-subtle)" : "var(--bg-elevated)",
              color: view === v ? "var(--gold)" : "var(--text-secondary)",
              border: view === v ? "1px solid var(--border-gold)" : "1px solid var(--border)",
            }}>{v === "grid" ? "⊞ Grid" : "≡ List"}</button>
          ))}
        </div>
      </div>

      {/* Grid View */}
      {view === "grid" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
          {filtered.map(product => {
            const st = stockStatus(product.stock);
            const margin = Math.round(((product.price - product.cost) / product.price) * 100);
            return (
              <div key={product.id} className="card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.name}</p>
                    <p style={{ fontSize: 11, fontFamily: "monospace", color: "var(--text-muted)" }}>{product.sku}</p>
                  </div>
                  <span style={{
                    flexShrink: 0, fontSize: 10, fontWeight: 700, borderRadius: 6, padding: "3px 8px",
                    background: `${CATEGORY_COLORS[product.category] || "var(--bg-elevated)"}20`,
                    color: CATEGORY_COLORS[product.category] || "var(--text-muted)",
                    border: `1px solid ${CATEGORY_COLORS[product.category] || "var(--border)"}30`,
                  }}>{product.category}</span>
                </div>

                {/* Stock level */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, borderRadius: 6, padding: "3px 8px", background: st.bg, color: st.color }}>
                      {st.icon}{st.label}
                    </span>
                    <span style={{ fontSize: 26, fontWeight: 900, color: "var(--text-primary)", lineHeight: 1 }}>{product.stock}</span>
                  </div>
                  <div style={{ height: 6, background: "var(--bg-elevated)", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 999, transition: "width 0.4s",
                      width: `${Math.min(100, (product.stock / 50) * 100)}%`,
                      background: product.stock <= 3 ? "var(--error)" : product.stock <= 10 ? "#f59e0b" : "var(--success)",
                    }} />
                  </div>
                </div>

                {/* Price / cost */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  {[
                    { label: "Cost", value: formatCurrency(product.cost) },
                    { label: "Price", value: formatCurrency(product.price) },
                    { label: "Margin", value: `${margin}%` },
                  ].map(f => (
                    <div key={f.label} style={{ background: "var(--bg-elevated)", borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1 }}>{f.value}</p>
                      <p style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>{f.label}</p>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                  <button className="btn btn-ghost" style={{ gap: 5, fontSize: 11, padding: "8px 6px", justifyContent: "center" }}
                    onClick={() => openAdj(product, "delivery")}>
                    <Truck size={12} /> Add
                  </button>
                  <button className="btn btn-ghost" style={{ gap: 5, fontSize: 11, padding: "8px 6px", justifyContent: "center" }}
                    onClick={() => openAdj(product, "sold")}>
                    <Minus size={12} /> Remove
                  </button>
                  <button className="btn btn-ghost" style={{ gap: 5, fontSize: 11, padding: "8px 6px", justifyContent: "center" }}
                    onClick={() => openAdj(product, "adjustment")}>
                    <PenLine size={12} /> Adjust
                  </button>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "64px 24px", color: "var(--text-muted)", background: "var(--bg-card)", borderRadius: 16, border: "1px solid var(--border)" }}>
              <Package size={32} style={{ margin: "0 auto 12px", display: "block", opacity: 0.4 }} />
              <p style={{ fontSize: 14 }}>No products match your filters</p>
            </div>
          )}
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Cost</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th style={{ width: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: "center", padding: "48px", color: "var(--text-muted)", fontSize: 14 }}>No products found</td></tr>
              ) : filtered.map(p => {
                const st = stockStatus(p.stock);
                return (
                  <tr key={p.id}>
                    <td style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{p.name}</td>
                    <td><span style={{ fontSize: 11, fontFamily: "monospace", color: "var(--text-muted)" }}>{p.sku}</span></td>
                    <td><span className="badge badge-gray" style={{ fontSize: 11 }}>{p.category}</span></td>
                    <td style={{ fontSize: 13, color: "var(--text-secondary)" }}>{formatCurrency(p.cost)}</td>
                    <td style={{ fontSize: 13, fontWeight: 600, color: "var(--gold)" }}>{formatCurrency(p.price)}</td>
                    <td style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)" }}>{p.stock}</td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, borderRadius: 6, padding: "3px 8px", background: st.bg, color: st.color }}>
                        {st.icon}{st.label}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button className="btn btn-ghost" style={{ padding: "5px 7px" }} title="Add stock" onClick={() => openAdj(p, "delivery")}><Truck size={13} /></button>
                        <button className="btn btn-ghost" style={{ padding: "5px 7px" }} title="Remove stock" onClick={() => openAdj(p, "sold")}><Minus size={13} /></button>
                        <button className="btn btn-ghost" style={{ padding: "5px 7px" }} title="Adjust" onClick={() => openAdj(p, "adjustment")}><PenLine size={13} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </DashboardShell>
  );
}
