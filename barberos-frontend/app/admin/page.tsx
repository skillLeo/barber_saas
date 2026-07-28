"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  TrendingUp, TrendingDown, Calendar, Users, DollarSign, Clock,
  ChevronRight, ArrowUpRight, Scissors, Star, AlertTriangle,
  CheckCircle2, Circle, Loader2, XCircle, RefreshCw, Download,
  Package, MoreHorizontal, Phone,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  mockStats, mockBarbers, mockRevenueData, mockAppointments,
  mockTopServices, mockTopBarbers, mockProducts,
} from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

// ─── Status config ───────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; icon: React.ReactNode; badgeClass: string; color: string }> = {
  completed:    { label: "Completed",   icon: <CheckCircle2 size={13} />, badgeClass: "badge badge-green",  color: "#10b981" },
  "in-progress":{ label: "In Progress", icon: <Loader2 size={13} className="animate-spin" />, badgeClass: "badge badge-blue", color: "#6366f1" },
  confirmed:    { label: "Confirmed",   icon: <CheckCircle2 size={13} />, badgeClass: "badge badge-gold",   color: "#C9A84C" },
  pending:      { label: "Pending",     icon: <Circle size={13} />,       badgeClass: "badge badge-amber",  color: "#f59e0b" },
  cancelled:    { label: "Cancelled",   icon: <XCircle size={13} />,      badgeClass: "badge badge-red",    color: "#ef4444" },
  "no-show":    { label: "No Show",     icon: <XCircle size={13} />,      badgeClass: "badge badge-gray",   color: "#6b7280" },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const BARBER_COLORS: Record<number, string> = {
  1: "#C9A84C", 2: "#6366f1", 3: "#10b981", 4: "#f59e0b", 5: "#EC4899", 6: "#8B5CF6",
};

const DONUT_DATA = [
  { name: "Completed",   value: 31, color: "#10b981" },
  { name: "In Progress", value: 2,  color: "#6366f1" },
  { name: "Confirmed",   value: 8,  color: "#C9A84C" },
  { name: "Pending",     value: 5,  color: "#f59e0b" },
  { name: "Cancelled",   value: 1,  color: "#ef4444" },
];

const todayAppts = mockAppointments.filter(a => a.date === "2026-04-12").sort((a, b) => a.time.localeCompare(b.time));
const recentTransactions = mockAppointments
  .filter(a => a.status === "completed")
  .slice(0, 6);
const lowStockProducts = mockProducts.filter(p => p.stock <= 10);

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, trend, trendUp, icon, iconColor,
}: {
  label: string; value: string; sub?: string; trend?: string; trendUp?: boolean;
  icon: React.ReactNode; iconColor: string;
}) {
  return (
    <div className="card p-5 flex gap-4 items-start">
      <div
        className="flex items-center justify-center rounded-xl shrink-0"
        style={{ width: 44, height: 44, background: iconColor + "22" }}
      >
        <span style={{ color: iconColor }}>{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{label}</p>
        <p className="text-2xl font-bold mt-0.5" style={{ color: "var(--text-primary)" }}>{value}</p>
        {(trend || sub) && (
          <div className="flex items-center gap-2 mt-1">
            {trend && (
              <span
                className="flex items-center gap-0.5 text-xs font-semibold"
                style={{ color: trendUp ? "#10b981" : "#ef4444" }}
              >
                {trendUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {trend}
              </span>
            )}
            {sub && (
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{sub}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TimelineCard({ appt }: { appt: typeof todayAppts[0] }) {
  const cfg = STATUS_CONFIG[appt.status] ?? STATUS_CONFIG.pending;
  const barberColor = BARBER_COLORS[appt.barberId] ?? "var(--gold)";
  return (
    <div className="flex gap-3 py-3 border-b" style={{ borderColor: "var(--border)" }}>
      {/* time */}
      <div className="w-14 shrink-0 text-right">
        <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>{appt.time}</span>
      </div>
      {/* color bar */}
      <div className="w-1 rounded-full shrink-0" style={{ background: barberColor, minHeight: 48 }} />
      {/* content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>{appt.client}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{appt.service}{appt.addons.length > 0 ? ` + ${appt.addons.join(", ")}` : ""}</p>
          </div>
          <span className={cfg.badgeClass}>{cfg.label}</span>
        </div>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="text-xs font-medium" style={{ color: barberColor }}>{appt.barber.split(" ")[0]}</span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>{appt.duration}min</span>
          <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>{formatCurrency(appt.amount)}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Custom tooltip for bar chart ────────────────────────────────────────────
function RevenueTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3 py-2 text-sm">
      <p className="font-semibold" style={{ color: "var(--text-primary)" }}>{label}</p>
      <p style={{ color: "var(--gold)" }}>{formatCurrency(payload[0].value)}</p>
      {payload[1] && (
        <p style={{ color: "var(--text-muted)" }}>{payload[1].value} bookings</p>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [chartPeriod, setChartPeriod] = useState<"week" | "month">("week");

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const staffOnDuty = mockBarbers.filter(b => b.status !== "inactive").length;

  return (
    <DashboardShell
      role="admin"
      title="Dashboard"
      subtitle={today}
      action={
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" icon={<Download size={14} />}>
            Export
          </Button>
          <Button variant="primary" size="sm" icon={<Calendar size={14} />}>
            New Booking
          </Button>
        </div>
      }
    >
      {/* ── Low stock alert ───────────────────────────────────────────────── */}
      {lowStockProducts.length > 0 && (
        <div
          className="flex items-center gap-3 rounded-xl px-4 py-3 mb-6 text-sm"
          style={{ background: "var(--warning-bg)", border: "1px solid var(--warning)", color: "var(--warning)" }}
        >
          <AlertTriangle size={16} className="shrink-0" />
          <span className="font-medium">
            {lowStockProducts.length} product{lowStockProducts.length > 1 ? "s" : ""} low on stock:
          </span>
          <span className="text-xs opacity-80">
            {lowStockProducts.map(p => p.name).join(", ")}
          </span>
          <Button variant="ghost" size="xs" className="ml-auto" style={{ color: "var(--warning)" }}>
            View Inventory
          </Button>
        </div>
      )}

      {/* ── Stat cards row ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Today's Revenue"
          value={formatCurrency(mockStats.todayRevenue)}
          trend="+12.4%"
          trendUp
          sub="vs yesterday"
          icon={<DollarSign size={20} />}
          iconColor="#C9A84C"
        />
        <StatCard
          label="Bookings Today"
          value={String(mockStats.totalBookings)}
          trend="+3"
          trendUp
          sub="vs yesterday"
          icon={<Calendar size={20} />}
          iconColor="#6366f1"
        />
        <StatCard
          label="Avg Ticket"
          value={formatCurrency(mockStats.avgServiceValue)}
          trend="+£2.10"
          trendUp
          sub="vs last week"
          icon={<TrendingUp size={20} />}
          iconColor="#10b981"
        />
        <StatCard
          label="Staff On Duty"
          value={String(staffOnDuty)}
          sub={`of ${mockBarbers.length} staff`}
          icon={<Users size={20} />}
          iconColor="#f59e0b"
        />
      </div>

      {/* ── Main grid: charts + timeline ─────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">

        {/* Revenue chart — 2/3 */}
        <div className="card p-5 xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>Revenue Overview</h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                Weekly total: {formatCurrency(mockStats.weeklyRevenue)}
              </p>
            </div>
            <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: "var(--bg-surface)" }}>
              {(["week", "month"] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setChartPeriod(p)}
                  className="px-3 py-1 text-xs font-medium rounded-md transition-all"
                  style={{
                    background: chartPeriod === p ? "var(--bg-card)" : "transparent",
                    color: chartPeriod === p ? "var(--gold)" : "var(--text-muted)",
                    boxShadow: chartPeriod === p ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                  }}
                >
                  {p === "week" ? "This Week" : "This Month"}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mockRevenueData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => `£${v}`}
              />
              <Tooltip content={<RevenueTooltip />} cursor={{ fill: "rgba(201,168,76,0.06)" }} />
              <Bar dataKey="revenue" fill="var(--gold)" radius={[4, 4, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Booking status donut — 1/3 */}
        <div className="card p-5">
          <h3 className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Today's Bookings</h3>
          <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>By status breakdown</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={DONUT_DATA}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
              >
                {DONUT_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                  color: "var(--text-primary)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-3">
            {DONUT_DATA.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                  <span style={{ color: "var(--text-secondary)" }}>{d.name}</span>
                </div>
                <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom grid: timeline + top performers + transactions ─────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Today's schedule timeline */}
        <div className="card p-5 xl:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>Today's Schedule</h3>
            <a
              href="/admin/bookings"
              className="text-xs font-medium flex items-center gap-0.5 hover:underline"
              style={{ color: "var(--gold)" }}
            >
              View all <ChevronRight size={13} />
            </a>
          </div>
          <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
            {mockStats.completedToday} completed · {mockStats.pendingToday} upcoming
          </p>

          {todayAppts.length === 0 ? (
            <EmptyState
              compact
              icon={<Calendar size={24} />}
              title="No bookings today"
              description="Schedule is clear."
            />
          ) : (
            <div className="max-h-[400px] overflow-y-auto -mr-1 pr-1" style={{ scrollbarWidth: "thin" }}>
              {todayAppts.map(a => <TimelineCard key={a.id} appt={a} />)}
            </div>
          )}
        </div>

        {/* Right column: top barbers + top services */}
        <div className="flex flex-col gap-6 xl:col-span-2">

          {/* Top barbers */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>Top Barbers</h3>
              <a
                href="/admin/staff"
                className="text-xs font-medium flex items-center gap-0.5 hover:underline"
                style={{ color: "var(--gold)" }}
              >
                Manage Staff <ChevronRight size={13} />
              </a>
            </div>
            <div className="space-y-3">
              {mockTopBarbers.slice(0, 4).map((b, i) => {
                const barberObj = mockBarbers.find(mb => mb.name === b.name);
                const color = barberObj ? BARBER_COLORS[barberObj.id] : "var(--gold)";
                const maxRev = mockTopBarbers[0].revenue;
                const pct = Math.round((b.revenue / maxRev) * 100);
                return (
                  <div key={b.name} className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ background: color + "22", color }}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{b.name}</span>
                        <span className="text-xs font-semibold shrink-0 ml-2" style={{ color: "var(--text-secondary)" }}>
                          {formatCurrency(b.revenue)}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-surface)" }}>
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, background: color }}
                        />
                      </div>
                    </div>
                    <div className="text-right shrink-0 w-14">
                      <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{b.bookings} jobs</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{b.completionRate}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent transactions */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>Recent Transactions</h3>
              <a
                href="/admin/pos"
                className="text-xs font-medium flex items-center gap-0.5 hover:underline"
                style={{ color: "var(--gold)" }}
              >
                Open POS <ArrowUpRight size={13} />
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="data-table w-full text-sm">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Service</th>
                    <th>Barber</th>
                    <th>Time</th>
                    <th className="text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map(t => (
                    <tr key={t.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                            style={{ background: "var(--gold-subtle)", color: "var(--gold)" }}
                          >
                            {t.client[0]}
                          </div>
                          <span className="font-medium">{t.client}</span>
                        </div>
                      </td>
                      <td style={{ color: "var(--text-muted)" }}>{t.service}</td>
                      <td>
                        <span
                          className="text-xs font-medium"
                          style={{ color: BARBER_COLORS[t.barberId] ?? "var(--gold)" }}
                        >
                          {t.barber.split(" ")[0]}
                        </span>
                      </td>
                      <td style={{ color: "var(--text-muted)" }}>{t.time}</td>
                      <td className="text-right font-semibold" style={{ color: "var(--text-primary)" }}>
                        {formatCurrency(t.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* ── Top services bar ─────────────────────────────────────────────── */}
      <div className="card p-5 mt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>Top Services This Month</h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>By booking volume</p>
          </div>
          <a
            href="/admin/services"
            className="text-xs font-medium flex items-center gap-0.5 hover:underline"
            style={{ color: "var(--gold)" }}
          >
            Manage Services <ChevronRight size={13} />
          </a>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={mockTopServices}
            layout="vertical"
            margin={{ top: 0, right: 60, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: "var(--text-muted)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={130}
              tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
                color: "var(--text-primary)",
              }}
              formatter={(value, name) =>
                name === "revenue" ? [formatCurrency(Number(value)), "Revenue"] : [value, "Bookings"]
              }
            />
            <Bar dataKey="bookings" fill="var(--gold)" radius={[0, 4, 4, 0]} maxBarSize={18} />
            <Bar dataKey="revenue" fill="#6366f1" radius={[0, 4, 4, 0]} maxBarSize={18} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
            <span className="w-3 h-3 rounded-sm" style={{ background: "var(--gold)" }} /> Bookings
          </div>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
            <span className="w-3 h-3 rounded-sm" style={{ background: "#6366f1" }} /> Revenue (£)
          </div>
        </div>
      </div>

    </DashboardShell>
  );
}
