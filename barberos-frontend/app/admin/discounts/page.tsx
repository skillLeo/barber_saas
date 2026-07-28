"use client";
import { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Plus, Search, Tag, Copy, Trash2, ToggleLeft, ToggleRight, X, Check } from "lucide-react";

const discounts = [
  { id: 1, code: "WELCOME20", type: "percentage", value: 20, uses: 34, maxUses: 100, minSpend: 0, expires: "Mar 31, 2026", active: true, description: "New client welcome discount" },
  { id: 2, code: "VIP50", type: "percentage", value: 50, uses: 8, maxUses: 20, minSpend: 50, expires: "Dec 31, 2026", active: true, description: "VIP client exclusive" },
  { id: 3, code: "FLAT10", type: "fixed", value: 10, uses: 57, maxUses: null, minSpend: 30, expires: null, active: true, description: "£10 off orders over £30" },
  { id: 4, code: "SUMMER25", type: "percentage", value: 25, uses: 200, maxUses: 200, minSpend: 0, expires: "Sep 1, 2025", active: false, description: "Summer promotion" },
  { id: 5, code: "REFER15", type: "percentage", value: 15, uses: 19, maxUses: null, minSpend: 0, expires: null, active: true, description: "Referral reward" },
];

function DiscountModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid var(--border)" }}>
          <h3 className="text-[15px] font-semibold" style={{ color: "var(--text-primary)" }}>Create Discount Code</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "var(--bg-elevated)" }}>
            <X size={14} style={{ color: "var(--text-muted)" }} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Discount Code</label>
            <input className="input w-full text-[13px] uppercase tracking-wider" placeholder="e.g. SUMMER25" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Type</label>
              <select className="input w-full text-[13px]">
                <option>Percentage (%)</option>
                <option>Fixed Amount (£)</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Value</label>
              <input className="input w-full text-[13px]" placeholder="20" type="number" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Min Spend (£)</label>
              <input className="input w-full text-[13px]" placeholder="0" type="number" />
            </div>
            <div>
              <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Max Uses</label>
              <input className="input w-full text-[13px]" placeholder="Unlimited" type="number" />
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Expiry Date</label>
            <input className="input w-full text-[13px]" type="date" />
          </div>
          <div>
            <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Description</label>
            <input className="input w-full text-[13px]" placeholder="Internal note..." />
          </div>
        </div>
        <div className="flex gap-2 p-5" style={{ borderTop: "1px solid var(--border)" }}>
          <button onClick={onClose} className="btn btn-ghost flex-1 text-[13px]">Cancel</button>
          <button className="btn btn-primary flex-1 gap-1.5 text-[13px]">
            <Check size={13} /> Create Code
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DiscountsPage() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 1500);
  };

  const filtered = discounts.filter(d => d.code.toLowerCase().includes(search.toLowerCase()) || d.description.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardShell role="admin" title="Discounts" subtitle="Manage promotional codes and offers">
      {showModal && <DiscountModal onClose={() => setShowModal(false)} />}
      <div className="space-y-5">

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Codes", value: discounts.length },
            { label: "Active", value: discounts.filter(d => d.active).length, gold: true },
            { label: "Total Redemptions", value: discounts.reduce((s, d) => s + d.uses, 0) },
            { label: "Expired", value: discounts.filter(d => !d.active).length },
          ].map((s) => (
            <div key={s.label} className="card p-4 text-center">
              <div className="text-[24px] font-bold mb-1" style={{ color: s.gold ? "var(--gold)" : "var(--text-primary)" }}>{s.value}</div>
              <div className="text-[12px]" style={{ color: "var(--text-muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-3" style={{ borderBottom: "1px solid var(--border)" }}>
            <div className="flex-1">
              <h3 className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>Discount Codes</h3>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                <input className="input pl-8 text-[13px] h-8 w-48" placeholder="Search..."
                  value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <button onClick={() => setShowModal(true)} className="btn btn-primary gap-1.5 text-[13px] h-8 px-3">
                <Plus size={13} /> New Code
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Description</th>
                  <th>Value</th>
                  <th>Usage</th>
                  <th>Min Spend</th>
                  <th>Expires</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => {
                  const usagePct = d.maxUses ? Math.round((d.uses / d.maxUses) * 100) : null;
                  return (
                    <tr key={d.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-[6px] font-mono text-[12px] font-bold"
                            style={{ background: "var(--bg-elevated)", color: "var(--gold)" }}>
                            <Tag size={10} />
                            {d.code}
                          </div>
                          <button onClick={() => copy(d.code)} className="w-6 h-6 rounded flex items-center justify-center transition-colors"
                            style={{ background: "transparent" }}
                            onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-elevated)")}
                            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                            {copied === d.code ? <Check size={11} style={{ color: "var(--success)" }} /> : <Copy size={11} style={{ color: "var(--text-muted)" }} />}
                          </button>
                        </div>
                      </td>
                      <td className="text-[12.5px]" style={{ color: "var(--text-secondary)" }}>{d.description}</td>
                      <td className="font-semibold text-[13px]" style={{ color: "var(--text-primary)" }}>
                        {d.type === "percentage" ? `${d.value}%` : `£${d.value}`}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className="text-[12px]" style={{ color: "var(--text-secondary)" }}>
                            {d.uses}{d.maxUses ? `/${d.maxUses}` : ""}
                          </span>
                          {usagePct !== null && (
                            <div className="w-14 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-elevated)" }}>
                              <div className="h-full rounded-full" style={{ width: `${usagePct}%`, background: usagePct > 80 ? "var(--warning)" : "var(--gold)" }} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="text-[12.5px]" style={{ color: "var(--text-secondary)" }}>
                        {d.minSpend > 0 ? `£${d.minSpend}` : "None"}
                      </td>
                      <td className="text-[12px]" style={{ color: d.expires ? "var(--text-secondary)" : "var(--text-muted)" }}>
                        {d.expires || "Never"}
                      </td>
                      <td>
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full"
                          style={{ background: d.active ? "var(--success-bg)" : "var(--bg-elevated)", color: d.active ? "var(--success)" : "var(--text-muted)" }}>
                          {d.active ? <Check size={10} /> : <X size={10} />}
                          {d.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                            style={{ background: "var(--bg-elevated)" }}>
                            {d.active ? <ToggleRight size={13} style={{ color: "var(--success)" }} /> : <ToggleLeft size={13} style={{ color: "var(--text-muted)" }} />}
                          </button>
                          <button className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                            style={{ background: "var(--bg-elevated)" }}>
                            <Trash2 size={13} style={{ color: "var(--error)" }} />
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
