"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/Button";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  DollarSign, TrendingUp, Scissors, Star, Clock,
  Download, Calendar, ChevronDown, ArrowUpRight,
} from "lucide-react";
import { mockAppointments, mockBarbers, mockRevenueData } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

const ME = mockBarbers[0];
const myAppts = mockAppointments.filter(a => a.barberId === ME.id && a.status === "completed");

// Aggregate by date for trend
const dailyMap: Record<string, number> = {};
myAppts.forEach(a => {
  dailyMap[a.date] = (dailyMap[a.date] ?? 0) + a.amount;
});
const dailyTrend = Object.entries(dailyMap)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([date, revenue]) => ({ date: date.slice(5), revenue }));

// Mock monthly earnings
const monthlyEarnings = [
  { month: "Oct", revenue: 2840, bookings: 68 },
  { month: "Nov", revenue: 3120, bookings: 74 },
  { month: "Dec", revenue: 3680, bookings: 88 },
  { month: "Jan", revenue: 2960, bookings: 71 },
  { month: "Feb", revenue: 3210, bookings: 77 },
  { month: "Mar", revenue: 3485, bookings: 83 },
];

const COMMISSION = 0.65; // 65% to barber

const totalEarned = myAppts.reduce((s, a) => s + a.amount, 0);
const thisMonthRevenue = myAppts.filter(a => a.date.startsWith("2026-04")).reduce((s, a) => s + a.amount, 0);
const thisWeekRevenue = myAppts.filter(a => a.date >= "2026-04-06").reduce((s, a) => s + a.amount, 0);
const todayRevenue = myAppts.filter(a => a.date === "2026-04-12").reduce((s, a) => s + a.amount, 0);
const avgTicket = myAppts.length ? totalEarned / myAppts.length : 0;

function StatBox({ label, value, sub, trend, icon, color }: {
  label: string; value: string; sub?: string; trend?: string; icon: React.ReactNode; color: string;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: color + "22" }}
        >
          <span style={{ color }}>{icon}</span>
        </div>
        {trend && (
          <span className="flex items-center gap-0.5 text-xs font-semibold" style={{ color: "#10b981" }}>
            <TrendingUp size={11} />{trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{value}</p>
      <p className="text-xs font-medium mt-0.5" style={{ color: "var(--text-muted)" }}>{label}</p>
      {sub && <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{sub}</p>}
    </div>
  );
}

export default function BarberEarnings() {
  const [period, setPeriod] = useState<"week" | "month" | "all">("month");

  const chartData = period === "week"
    ? dailyTrend.slice(-7)
    : period === "month"
      ? dailyTrend
      : monthlyEarnings.map(m => ({ date: m.month, revenue: m.revenue }));

  return (
    <DashboardShell
      role="barber"
      title="My Earnings"
      subtitle="Track your income and performance"
      action={
        <Button variant="secondary" size="sm" icon={<Download size={14} />}>
          Export CSV
        </Button>
      }
    >
      {/* ── Stats row ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatBox
          label="Today"
          value={formatCurrency(todayRevenue)}
          trend="+18%"
          icon={<DollarSign size={18} />}
          color="#C9A84C"
        />
        <StatBox
          label="This Week"
          value={formatCurrency(thisWeekRevenue)}
          trend="+7%"
          icon={<Calendar size={18} />}
          color="#6366f1"
        />
        <StatBox
          label="This Month"
          value={formatCurrency(thisMonthRevenue)}
          trend="+12%"
          icon={<TrendingUp size={18} />}
          color="#10b981"
        />
        <StatBox
          label="Avg Ticket"
          value={formatCurrency(avgTicket)}
          sub={`${myAppts.length} bookings total`}
          icon={<Scissors size={18} />}
          color="#f59e0b"
        />
      </div>

      {/* ── Main chart ────────────────────────────────────────────────── */}
      <div className="card p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>Revenue Trend</h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Your commissionable earnings</p>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: "var(--bg-surface)" }}>
            {(["week", "month", "all"] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className="px-3 py-1 text-xs font-medium rounded-md capitalize transition-all"
                style={{
                  background: period === p ? "var(--bg-card)" : "transparent",
                  color: period === p ? "var(--gold)" : "var(--text-muted)",
                  boxShadow: period === p ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                }}
              >
                {p === "all" ? "6 months" : p}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="date"
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
            <Tooltip
              contentStyle={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
                color: "var(--text-primary)",
              }}
              formatter={(v) => [formatCurrency(Number(v)), "Revenue"]}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#C9A84C"
              strokeWidth={2}
              fill="url(#goldGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── Bottom grid ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Commission breakdown */}
        <div className="card p-5">
          <h3 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Commission Breakdown</h3>
          <div className="space-y-3">
            {[
              { label: "Gross Revenue (This Month)", value: thisMonthRevenue, highlight: false },
              { label: `Shop Commission (${Math.round((1 - COMMISSION) * 100)}%)`, value: -thisMonthRevenue * (1 - COMMISSION), highlight: false },
              { label: `Your Earnings (${Math.round(COMMISSION * 100)}%)`, value: thisMonthRevenue * COMMISSION, highlight: true },
            ].map(r => (
              <div
                key={r.label}
                className="flex items-center justify-between py-2 border-b last:border-0"
                style={{ borderColor: "var(--border)" }}
              >
                <span className="text-sm" style={{ color: r.highlight ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: r.highlight ? 600 : 400 }}>
                  {r.label}
                </span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: r.highlight ? "var(--gold)" : r.value < 0 ? "var(--error)" : "var(--text-primary)" }}
                >
                  {r.value < 0 ? `-${formatCurrency(Math.abs(r.value))}` : formatCurrency(r.value)}
                </span>
              </div>
            ))}
          </div>
          <div
            className="mt-4 p-3 rounded-xl flex items-center justify-between"
            style={{ background: "var(--gold-subtle)" }}
          >
            <span className="text-sm font-medium" style={{ color: "var(--gold)" }}>Next payout</span>
            <span className="text-sm font-bold" style={{ color: "var(--gold)" }}>
              {formatCurrency(thisMonthRevenue * COMMISSION)} on Apr 30
            </span>
          </div>
        </div>

        {/* Recent transactions */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>Recent Transactions</h3>
            <a href="/barber/bookings" className="text-xs font-medium flex items-center gap-0.5 hover:underline" style={{ color: "var(--gold)" }}>
              All bookings <ArrowUpRight size={12} />
            </a>
          </div>
          <div className="space-y-2">
            {myAppts.slice(0, 6).map(a => (
              <div
                key={a.id}
                className="flex items-center gap-3 py-2 border-b last:border-0"
                style={{ borderColor: "var(--border)" }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: "var(--gold-subtle)", color: "var(--gold)" }}
                >
                  {a.client[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{a.client}</p>
                  <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{a.service} · {a.date}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold" style={{ color: "var(--gold)" }}>{formatCurrency(a.amount)}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    +{formatCurrency(a.amount * COMMISSION)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardShell>
  );
}
