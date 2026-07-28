"use client";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, Building2, CreditCard, Activity, ArrowUpRight, ArrowDownRight, Globe } from "lucide-react";

const monthlyRevenue = [
  { month: "Jul", revenue: 38200, tenants: 142 },
  { month: "Aug", revenue: 42100, tenants: 157 },
  { month: "Sep", revenue: 45800, tenants: 171 },
  { month: "Oct", revenue: 51200, tenants: 184 },
  { month: "Nov", revenue: 48900, tenants: 196 },
  { month: "Dec", revenue: 56700, tenants: 210 },
  { month: "Jan", revenue: 61300, tenants: 228 },
];

const planDist = [
  { name: "Starter", value: 89, color: "#6B7280" },
  { name: "Professional", value: 142, color: "#D4AF37" },
  { name: "Enterprise", value: 37, color: "#6366F1" },
];

const regionData = [
  { region: "United Kingdom", tenants: 98, revenue: 24300 },
  { region: "Germany", tenants: 64, revenue: 18700 },
  { region: "France", tenants: 52, revenue: 14100 },
  { region: "Netherlands", tenants: 38, revenue: 9800 },
  { region: "Spain", tenants: 29, revenue: 7600 },
  { region: "Italy", tenants: 21, revenue: 5400 },
  { region: "Other", tenants: 56, revenue: 12400 },
];

const churnData = [
  { month: "Aug", churn: 2.1, growth: 8.4 },
  { month: "Sep", churn: 1.8, growth: 9.1 },
  { month: "Oct", churn: 2.4, growth: 7.6 },
  { month: "Nov", churn: 1.9, growth: 6.8 },
  { month: "Dec", churn: 1.6, growth: 10.2 },
  { month: "Jan", churn: 1.4, growth: 11.8 },
];

const stats = [
  { label: "Total MRR", value: "£61,300", change: "+12.4%", up: true, icon: CreditCard },
  { label: "Active Tenants", value: "228", change: "+8.6%", up: true, icon: Building2 },
  { label: "Avg Revenue/Tenant", value: "£268", change: "+3.7%", up: true, icon: TrendingUp },
  { label: "Monthly Churn", value: "1.4%", change: "-0.5%", up: true, icon: Activity },
];

export default function SuperAdminAnalytics() {
  return (
    <DashboardShell role="super-admin" title="Platform Analytics" subtitle="Revenue, growth, and tenant metrics">
      <div className="space-y-6">

        {/* KPI Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--gold-subtle)" }}>
                  <s.icon size={16} style={{ color: "var(--gold)" }} />
                </div>
                <span className={`text-[11.5px] font-medium flex items-center gap-0.5 ${s.up ? "text-[var(--success)]" : "text-[var(--error)]"}`}>
                  {s.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {s.change}
                </span>
              </div>
              <div className="text-[22px] font-bold leading-none mb-1" style={{ color: "var(--text-primary)" }}>{s.value}</div>
              <div className="text-[12px]" style={{ color: "var(--text-muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Revenue + Churn row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* MRR Chart */}
          <div className="card p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>Monthly Recurring Revenue</h3>
                <p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>Platform MRR over last 7 months</p>
              </div>
              <span className="badge badge-gold text-[11px]">+12.4% MoM</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyRevenue}>
                <defs>
                  <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--gold)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--gold)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v: unknown) => `£${Number(v) / 1000}k`} />
                <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 12 }}
                  formatter={(v: unknown) => [`£${Number(v).toLocaleString()}`, "MRR"]} />
                <Area type="monotone" dataKey="revenue" stroke="var(--gold)" strokeWidth={2} fill="url(#mrrGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Plan distribution */}
          <div className="card p-5">
            <h3 className="text-[14px] font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Plan Distribution</h3>
            <p className="text-[12px] mb-4" style={{ color: "var(--text-muted)" }}>Active tenants by plan</p>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={planDist} dataKey="value" cx="50%" cy="50%" outerRadius={60} innerRadius={35} paddingAngle={3}>
                  {planDist.map((p, i) => <Cell key={i} fill={p.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {planDist.map((p) => (
                <div key={p.name} className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                    <span style={{ color: "var(--text-secondary)" }}>{p.name}</span>
                  </div>
                  <span className="font-medium" style={{ color: "var(--text-primary)" }}>{p.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Growth vs Churn */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card p-5">
            <h3 className="text-[14px] font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Growth vs Churn Rate</h3>
            <p className="text-[12px] mb-4" style={{ color: "var(--text-muted)" }}>Monthly percentages (%)</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={churnData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v: unknown) => `${v}%`} />
                <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 12 }}
                  formatter={(v: unknown) => [`${v}%`]} />
                <Line type="monotone" dataKey="growth" stroke="var(--success)" strokeWidth={2} dot={false} name="Growth" />
                <Line type="monotone" dataKey="churn" stroke="var(--error)" strokeWidth={2} dot={false} name="Churn" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue by region */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-1">
              <Globe size={15} style={{ color: "var(--gold)" }} />
              <h3 className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>Revenue by Region</h3>
            </div>
            <p className="text-[12px] mb-4" style={{ color: "var(--text-muted)" }}>Top performing markets</p>
            <div className="space-y-3">
              {regionData.map((r) => {
                const maxRev = 24300;
                const pct = Math.round((r.revenue / maxRev) * 100);
                return (
                  <div key={r.region}>
                    <div className="flex items-center justify-between text-[12px] mb-1">
                      <span style={{ color: "var(--text-primary)" }}>{r.region}</span>
                      <div className="flex items-center gap-3">
                        <span style={{ color: "var(--text-muted)" }}>{r.tenants} tenants</span>
                        <span className="font-semibold" style={{ color: "var(--text-primary)" }}>£{r.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-elevated)" }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: "var(--gold)" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tenant growth bar chart */}
        <div className="card p-5">
          <h3 className="text-[14px] font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Tenant Acquisition</h3>
          <p className="text-[12px] mb-4" style={{ color: "var(--text-muted)" }}>Cumulative active tenants per month</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyRevenue} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 12 }} />
              <Bar dataKey="tenants" fill="var(--gold)" radius={[4, 4, 0, 0]} name="Tenants" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </DashboardShell>
  );
}
