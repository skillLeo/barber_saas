"use client";
import { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { mockProducts } from "@/lib/mock-data";
import { Plus, Search, AlertTriangle, Edit, Trash2, X, Check } from "lucide-react";

function AddProductModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid var(--border)" }}>
          <h3 className="text-[15px] font-semibold" style={{ color: "var(--text-primary)" }}>Add Product</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--bg-elevated)" }}>
            <X size={14} style={{ color: "var(--text-muted)" }} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          {[
            { label: "Product Name", placeholder: "e.g. American Crew Pomade" },
            { label: "SKU", placeholder: "e.g. SKU-001" },
            { label: "Category", placeholder: "e.g. Hair Care" },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>{f.label}</label>
              <input className="input w-full text-[13px]" placeholder={f.placeholder} />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            {[{ label: "Cost Price (£)", placeholder: "0.00" }, { label: "Sale Price (£)", placeholder: "0.00" }].map(f => (
              <div key={f.label}>
                <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>{f.label}</label>
                <input type="number" className="input w-full text-[13px]" placeholder={f.placeholder} />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Stock Quantity</label>
            <input type="number" className="input w-full text-[13px]" placeholder="0" />
          </div>
        </div>
        <div className="flex gap-2 p-5" style={{ borderTop: "1px solid var(--border)" }}>
          <button onClick={onClose} className="btn btn-ghost flex-1 text-[13px]">Cancel</button>
          <button onClick={onClose} className="btn btn-primary flex-1 gap-1.5 text-[13px]"><Check size={13} /> Add Product</button>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const filtered = mockProducts.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  const lowStockCount = mockProducts.filter(p => p.lowStock).length;

  return (
    <DashboardShell role="admin" title="Products" subtitle="Inventory & retail sales"
      action={<button onClick={() => setShowModal(true)} className="btn btn-primary gap-1.5 text-[13px]"><Plus size={13} /> Add Product</button>}>
      {showModal && <AddProductModal onClose={() => setShowModal(false)} />}
      <div className="space-y-5">
        {lowStockCount > 0 && (
          <div className="flex items-center gap-3 p-4 rounded-[12px]"
            style={{ background: "var(--error-bg)", border: "1px solid rgba(244,63,94,0.25)" }}>
            <AlertTriangle size={16} style={{ color: "var(--error)", flexShrink: 0 }} />
            <p className="text-[13px]" style={{ color: "var(--error)" }}>
              <span className="font-semibold">{lowStockCount} products</span> are running low on stock — please reorder soon.
            </p>
          </div>
        )}

        <div className="relative max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
          <input className="input pl-9 text-[13px] h-9" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th>Product</th>
                  <th className="hidden sm:table-cell">SKU</th>
                  <th>Stock</th>
                  <th className="hidden md:table-cell">Cost</th>
                  <th>Price</th>
                  <th className="hidden lg:table-cell">Sold</th>
                  <th className="hidden lg:table-cell">Margin</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => {
                  const margin = Math.round(((p.price - p.cost) / p.price) * 100);
                  return (
                    <tr key={p.id}>
                      <td>
                        <div className="text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>{p.name}</div>
                        <div className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>{p.category}</div>
                      </td>
                      <td className="hidden sm:table-cell text-[12px] font-mono" style={{ color: "var(--text-muted)" }}>{p.sku}</td>
                      <td>
                        <span className="inline-flex items-center gap-1 text-[12px] font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            background: p.lowStock ? "var(--error-bg)" : "var(--success-bg)",
                            color: p.lowStock ? "var(--error)" : "var(--success)",
                          }}>
                          {p.lowStock && <AlertTriangle size={10} />}
                          {p.stock}
                        </span>
                      </td>
                      <td className="hidden md:table-cell text-[13px]" style={{ color: "var(--text-secondary)" }}>£{p.cost}</td>
                      <td className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>£{p.price}</td>
                      <td className="hidden lg:table-cell text-[13px]" style={{ color: "var(--text-secondary)" }}>{p.sold}</td>
                      <td className="hidden lg:table-cell">
                        <span className="text-[12px] font-semibold" style={{ color: margin > 40 ? "var(--success)" : "var(--warning)" }}>{margin}%</span>
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-1">
                          <button className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--bg-elevated)" }}>
                            <Edit size={12} style={{ color: "var(--text-muted)" }} />
                          </button>
                          <button className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--error-bg)" }}>
                            <Trash2 size={12} style={{ color: "var(--error)" }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
