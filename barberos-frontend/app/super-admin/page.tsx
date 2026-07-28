"use client";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { mockTenants } from "@/lib/mock-data";
import {
  Building2, CreditCard, DollarSign, TrendingUp,
  ChevronRight, AlertCircle, CheckCircle, Clock, ArrowUpRight
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

const platformData = [
  { month: "Oct", tenants: 1820, revenue: 52600 },
  { month: "Nov", tenants: 2010, revenue: 58200 },
  { month: "Dec", tenants: 2180, revenue: 63100 },
  { month: "Jan", tenants: 2290, revenue: 66300 },
  { month: "Feb", tenants: 2350, revenue: 68000 },
  { month: "Mar", tenants: 2420, revenue: 70100 },
];

const planConfig: Record<string, { color: string; bg: string }> = {
  Starter: { color: "#A3A3A3", bg: "rgba(163,163,163,0.12)" },
  Professional: { color: "var(--gold)", bg: "var(--gold-subtle)" },
  Business: { color: "#6366F1", bg: "rgba(99,102,241,0.12)" },
  Enterprise: { color: "var(--success)", bg: "var(--success-bg)" },
};

const statusStyle: Record<string, { bg: string; color: string; label: string }> = {
  active: { bg: "var(--success-bg)", color: "var(--success)", label: "Active" },
  trial: { bg: "var(--gold-subtle)", color: "var(--gold)", label: "Trial" },
  suspended: { bg: "var(--error-bg)", color: "var(--error)", label: "Suspended" },
};

export default function SuperAdminDashboard() {
  return (
    <DashboardShell role="super-admin" title="Platform Overview" subtitle="All tenants, subscriptions, and platform health">
      <div className="space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Tenants", value: "2,420", change: "+70 this month", up: true, icon: Building2 },
            { label: "Monthly Revenue", value: "£70,100", change: "+3% vs last month", up: true, icon: DollarSign },
            { label: "Active Subscriptions", value: "2,186", change: "90.3% of tenants", up: null, icon: CreditCard },
            { label: "Trials Active", value: "234", change: "48 expiring soon", up: null, icon: Clock },
          ].map((s) => (
            <div key={s.label} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ background: "var(--gold-subtle)" }}>
                  <s.icon size={16} style={{ color: "var(--gold)" }} />
                </div>
                {s.up !== null && (
                  <span className="text-[11.5px] font-medium flex items-center gap-0.5" style={{ color: s.up ? "var(--success)" : "var(--text-muted)" }}>
                    {s.up && <ArrowUpRight size={12} />}{s.change}
                  </span>
                )}
              </div>
              <div className="text-[24px] font-bold leading-none mb-1" style={{ color: "var(--text-primary)" }}>{s.value}</div>
              <div className="text-[12px]" style={{ color: "var(--text-muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Revenue chart */}
          <div className="lg:col-span-2 card p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>Platform Revenue</h3>
                <p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>Subscription revenue (last 6 months)</p>
              </div>
              <div className="text-right">
                <div className="text-[18px] font-bold" style={{ color: "var(--text-primary)" }}>£70,100</div>
                <div className="text-[12px] font-medium" style={{ color: "var(--success)" }}>↑ 3% vs last month</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={platformData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--gold)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--gold)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v: unknown) => `£${(Number(v)/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 12 }}
                  formatter={(v: unknown) => [`£${Number(v).toLocaleString()}`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="var(--gold)" fill="url(#revGrad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Plan distribution */}
          <div className="card p-5">
            <h3 className="text-[14px] font-semibold mb-5" style={{ color: "var(--text-primary)" }}>Plan Distribution</h3>
            <div className="space-y-4">
              {[
                { plan: "Professional", count: 1020, pct: 42 },
                { plan: "Starter", count: 890, pct: 37 },
                { plan: "Business", count: 460, pct: 19 },
                { plan: "Enterprise", count: 50, pct: 2 },
              ].map(({ plan, count, pct }) => {
                const cfg = planConfig[plan] || planConfig.Starter;
                return (
                  <div key={plan}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[12.5px] font-medium" style={{ color: cfg.color }}>{plan}</span>
                      <span className="text-[11.5px]" style={{ color: "var(--text-muted)" }}>{count} · {pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-elevated)" }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: cfg.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent tenants */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <h3 className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>Recent Tenants</h3>
            <a href="/super-admin/tenants" className="text-[12px] font-medium flex items-center gap-0.5" style={{ color: "var(--gold)" }}>
              View all <ChevronRight size={12} />
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th>Shop Name</th>
                  <th>Owner</th>
                  <th className="hidden sm:table-cell">Plan</th>
                  <th className="hidden md:table-cell">Branches</th>
                  <th className="hidden md:table-cell">Monthly Rev.</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {mockTenants.map(t => {
                  const plan = planConfig[t.plan] || planConfig.Starter;
                  const status = statusStyle[t.status] || statusStyle.active;
                  return (
                    <tr key={t.id} className="cursor-pointer">
                      <td>
                        <div className="text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>{t.name}</div>
                        <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                          Joined {new Date(t.joined).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                        </div>
                      </td>
                      <td className="text-[13px]" style={{ color: "var(--text-secondary)" }}>{t.owner}</td>
                      <td className="hidden sm:table-cell">
                        <span className="text-[12px] font-medium px-2 py-0.5 rounded-full"
                          style={{ color: plan.color, background: plan.bg }}>{t.plan}</span>
                      </td>
                      <td className="hidden md:table-cell text-[13px]" style={{ color: "var(--text-secondary)" }}>{t.branches}</td>
                      <td className="hidden md:table-cell text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
                        {t.revenue > 0 ? `£${t.revenue.toLocaleString()}` : "—"}
                      </td>
                      <td>
                        <span className="inline-flex text-[11px] font-medium px-2 py-0.5 rounded-full"
                          style={{ background: status.bg, color: status.color }}>
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alerts */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: AlertCircle, color: "var(--warning)", bg: "var(--warning-bg)", title: "Trials Expiring", desc: "48 trial accounts expiring in the next 7 days" },
            { icon: CheckCircle, color: "var(--success)", bg: "var(--success-bg)", title: "All Systems Normal", desc: "API uptime 99.98% · No incidents in past 30 days" },
            { icon: CreditCard, color: "var(--error)", bg: "var(--error-bg)", title: "Failed Payments", desc: "12 failed subscription renewals pending" },
          ].map(alert => (
            <div key={alert.title} className="card p-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ background: alert.bg }}>
                  <alert.icon size={16} style={{ color: alert.color }} />
                </div>
                <div>
                  <div className="text-[13px] font-semibold mb-0.5" style={{ color: "var(--text-primary)" }}>{alert.title}</div>
                  <div className="text-[12px] mb-2" style={{ color: "var(--text-muted)" }}>{alert.desc}</div>
                  <button className="text-[12px] font-medium flex items-center gap-0.5" style={{ color: alert.color }}>
                    Review <ChevronRight size={11} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
