"use client";
import { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Search, Filter, Check, X, AlertCircle, CreditCard, TrendingUp, Users, DollarSign } from "lucide-react";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 29,
    billing: "monthly",
    features: ["1 location", "Up to 3 staff", "Basic bookings", "Email support"],
    color: "#6B7280",
    tenants: 89,
    mrr: 2581,
  },
  {
    id: "professional",
    name: "Professional",
    price: 79,
    billing: "monthly",
    features: ["Up to 5 locations", "Unlimited staff", "POS + Analytics", "AI Stylist", "Priority support"],
    color: "#D4AF37",
    tenants: 142,
    mrr: 11218,
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 199,
    billing: "monthly",
    features: ["Unlimited locations", "White-label", "Custom integrations", "Dedicated support", "SLA guarantee"],
    color: "#6366F1",
    tenants: 37,
    mrr: 7363,
  },
];

const invoices = [
  { id: "INV-2401", tenant: "Fade Kings London", plan: "Professional", amount: 79, status: "paid", date: "Jan 1, 2026" },
  { id: "INV-2402", tenant: "The Barber District", plan: "Enterprise", amount: 199, status: "paid", date: "Jan 1, 2026" },
  { id: "INV-2403", tenant: "Classic Cuts Berlin", plan: "Starter", amount: 29, status: "paid", date: "Jan 1, 2026" },
  { id: "INV-2404", tenant: "Urban Blade Paris", plan: "Professional", amount: 79, status: "overdue", date: "Dec 28, 2025" },
  { id: "INV-2405", tenant: "Sharp & Styled", plan: "Professional", amount: 79, status: "paid", date: "Jan 1, 2026" },
  { id: "INV-2406", tenant: "The Gentleman's Cut", plan: "Starter", amount: 29, status: "failed", date: "Jan 2, 2026" },
  { id: "INV-2407", tenant: "Madrid Barber Co.", plan: "Enterprise", amount: 199, status: "paid", date: "Jan 1, 2026" },
];

const statusStyle: Record<string, { bg: string; color: string; label: string }> = {
  paid: { bg: "var(--success-bg)", color: "var(--success)", label: "Paid" },
  overdue: { bg: "var(--warning-bg)", color: "var(--warning)", label: "Overdue" },
  failed: { bg: "var(--error-bg)", color: "var(--error)", label: "Failed" },
};

export default function SubscriptionsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const totalMRR = plans.reduce((sum, p) => sum + p.mrr, 0);
  const totalTenants = plans.reduce((sum, p) => sum + p.tenants, 0);

  const filtered = invoices.filter(inv => {
    const matchSearch = inv.tenant.toLowerCase().includes(search.toLowerCase()) || inv.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <DashboardShell role="super-admin" title="Subscriptions" subtitle="Plan management and billing overview">
      <div className="space-y-6">

        {/* Summary stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total MRR", value: `£${totalMRR.toLocaleString()}`, icon: DollarSign },
            { label: "Active Tenants", value: totalTenants, icon: Users },
            { label: "Avg Revenue / Tenant", value: `£${Math.round(totalMRR / totalTenants)}`, icon: TrendingUp },
            { label: "Overdue Invoices", value: invoices.filter(i => i.status !== "paid").length, icon: AlertCircle },
          ].map((s) => (
            <div key={s.label} className="card p-5">
              <div className="w-9 h-9 rounded-[10px] flex items-center justify-center mb-3" style={{ background: "var(--gold-subtle)" }}>
                <s.icon size={16} style={{ color: "var(--gold)" }} />
              </div>
              <div className="text-[22px] font-bold leading-none mb-1" style={{ color: "var(--text-primary)" }}>{s.value}</div>
              <div className="text-[12px]" style={{ color: "var(--text-muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Plan cards */}
        <div>
          <h2 className="text-[14px] font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div key={plan.id} className="card p-5 relative overflow-hidden"
                style={{ border: plan.popular ? `1px solid ${plan.color}40` : undefined }}>
                {plan.popular && (
                  <div className="absolute top-3 right-3">
                    <span className="badge badge-gold text-[10px]">Most Popular</span>
                  </div>
                )}
                <div className="w-2.5 h-2.5 rounded-full mb-3" style={{ background: plan.color }} />
                <div className="text-[18px] font-bold mb-0.5" style={{ color: "var(--text-primary)" }}>{plan.name}</div>
                <div className="text-[13px] mb-4" style={{ color: "var(--text-muted)" }}>
                  <span className="text-[26px] font-bold" style={{ color: plan.color }}>£{plan.price}</span> / month
                </div>
                <ul className="space-y-2 mb-5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-[12.5px]" style={{ color: "var(--text-secondary)" }}>
                      <Check size={13} style={{ color: plan.color }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="pt-4 flex justify-between text-[12px]" style={{ borderTop: "1px solid var(--border)" }}>
                  <div>
                    <div className="font-semibold" style={{ color: "var(--text-primary)" }}>{plan.tenants}</div>
                    <div style={{ color: "var(--text-muted)" }}>Tenants</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold" style={{ color: "var(--text-primary)" }}>£{plan.mrr.toLocaleString()}</div>
                    <div style={{ color: "var(--text-muted)" }}>MRR</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="card overflow-hidden">
          <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-3" style={{ borderBottom: "1px solid var(--border)" }}>
            <div className="flex-1">
              <h3 className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>Recent Invoices</h3>
              <p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>Latest billing activity</p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                <input className="input pl-8 text-[13px] h-8 w-52" placeholder="Search invoices..."
                  value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <select className="input text-[13px] h-8 pr-8"
                value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Tenant</th>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv) => {
                  const s = statusStyle[inv.status];
                  return (
                    <tr key={inv.id}>
                      <td className="font-mono text-[12px]" style={{ color: "var(--text-muted)" }}>{inv.id}</td>
                      <td className="font-medium text-[13px]" style={{ color: "var(--text-primary)" }}>{inv.tenant}</td>
                      <td className="text-[13px]" style={{ color: "var(--text-secondary)" }}>{inv.plan}</td>
                      <td className="font-semibold text-[13px]" style={{ color: "var(--text-primary)" }}>£{inv.amount}</td>
                      <td>
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full"
                          style={{ background: s.bg, color: s.color }}>
                          {inv.status === "paid" ? <Check size={10} /> : <X size={10} />}
                          {s.label}
                        </span>
                      </td>
                      <td className="text-[12px]" style={{ color: "var(--text-muted)" }}>{inv.date}</td>
                      <td>
                        <button className="btn btn-ghost text-[12px] h-7 px-3">View</button>
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
