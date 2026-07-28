"use client";
import { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { mockRevenueData, mockMonthlyRevenue, mockBarbers, mockServices } from "@/lib/mock-data";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, LineChart, Line, AreaChart, Area
} from "recharts";
import { TrendingUp, Download, Calendar, DollarSign, Users, ArrowUpRight } from "lucide-react";

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<"week" | "month" | "year">("week");

  const serviceChartData = mockServices.slice(0, 5).map(s => ({
    name: s.name.length > 14 ? s.name.slice(0, 14) + "…" : s.name,
    bookings: s.bookings,
    revenue: s.bookings * s.price,
  }));

  const stats = [
    { label: "Total Revenue", value: period === "week" ? "£8,642" : period === "month" ? "£34,850" : "£418,200", change: "+14%", icon: DollarSign },
    { label: "Total Bookings", value: period === "week" ? "244" : period === "month" ? "984" : "11,808", change: "+8%", icon: Calendar },
    { label: "New Clients", value: period === "week" ? "31" : period === "month" ? "124" : "1,488", change: "+21%", icon: Users },
    { label: "Avg. Revenue/Day", value: period === "week" ? "£1,234" : period === "month" ? "£1,161" : "£1,145", change: "+5%", icon: TrendingUp },
  ];

  return (
    <DashboardShell role="admin" title="Analytics" subtitle="Revenue, bookings, and performance insights"
      action={<button className="btn btn-ghost gap-1.5 text-[13px]"><Download size={13} /> Export CSV</button>}>
      <div className="space-y-5">

        {/* Period selector */}
        <div className="flex gap-1 p-1 rounded-[12px] w-fit" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
          {(["week", "month", "year"] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className="px-4 py-2 rounded-[9px] text-[13px] font-medium transition-all capitalize"
              style={{
                background: period === p ? "var(--bg-card)" : "transparent",
                color: period === p ? "var(--text-primary)" : "var(--text-muted)",
                border: period === p ? "1px solid var(--border)" : "1px solid transparent",
              }}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(card => (
            <div key={card.label} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ background: "var(--gold-subtle)" }}>
                  <card.icon size={16} style={{ color: "var(--gold)" }} />
                </div>
                <span className="text-[11.5px] font-medium flex items-center gap-0.5" style={{ color: "var(--success)" }}>
                  <ArrowUpRight size={12} />{card.change}
                </span>
              </div>
              <div className="text-[22px] font-bold leading-none mb-1" style={{ color: "var(--text-primary)" }}>{card.value}</div>
              <div className="text-[12px]" style={{ color: "var(--text-muted)" }}>{card.label}</div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="card p-5">
            <h3 className="text-[14px] font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Revenue Over Time</h3>
            <p className="text-[12px] mb-4" style={{ color: "var(--text-muted)" }}>Daily revenue this week</p>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={mockRevenueData}>
                <defs>
                  <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--gold)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--gold)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v: unknown) => `£${v}`} />
                <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 12 }}
                  formatter={(v: unknown) => [`£${v}`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="var(--gold)" fill="url(#goldGrad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-5">
            <h3 className="text-[14px] font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Monthly Revenue Trend</h3>
            <p className="text-[12px] mb-4" style={{ color: "var(--text-muted)" }}>Last 6 months</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={mockMonthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false}
                  tickFormatter={(v: unknown) => `£${(Number(v)/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 12 }}
                  formatter={(v: unknown) => [`£${Number(v).toLocaleString()}`, "Revenue"]} />
                <Line type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={2.5}
                  dot={{ fill: "#6366F1", strokeWidth: 0, r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Services & barbers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="card p-5">
            <h3 className="text-[14px] font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Top Services by Bookings</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={serviceChartData} layout="vertical" barSize={14}>
                <XAxis type="number" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
                <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 12 }} />
                <Bar dataKey="bookings" fill="var(--gold)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-5">
            <h3 className="text-[14px] font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Barber Performance</h3>
            <div className="space-y-4">
              {mockBarbers.map(barber => {
                const maxRevenue = Math.max(...mockBarbers.map(b => b.revenue));
                return (
                  <div key={barber.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: barber.color }} />
                        <span className="text-[13px]" style={{ color: "var(--text-secondary)" }}>{barber.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>{barber.bookings} bookings</span>
                        <span className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>£{barber.revenue}</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-elevated)" }}>
                      <div className="h-full rounded-full" style={{ width: `${(barber.revenue / maxRevenue) * 100}%`, background: barber.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: "Completion Rate", value: "87%", sub: "Of scheduled appointments", bar: 87, color: "var(--success)" },
            { title: "Cancellation Rate", value: "8%", sub: "Below industry avg (12%)", bar: 8, color: "var(--error)" },
            { title: "No-Show Rate", value: "5%", sub: "Tracked for client warnings", bar: 5, color: "var(--warning)" },
          ].map(m => (
            <div key={m.title} className="card p-5">
              <div className="text-[12px] mb-2" style={{ color: "var(--text-muted)" }}>{m.title}</div>
              <div className="text-[28px] font-bold mb-2" style={{ color: "var(--text-primary)" }}>{m.value}</div>
              <div className="h-1.5 rounded-full overflow-hidden mb-2" style={{ background: "var(--bg-elevated)" }}>
                <div className="h-full rounded-full" style={{ width: `${m.bar}%`, background: m.color }} />
              </div>
              <div className="text-[11.5px]" style={{ color: "var(--text-muted)" }}>{m.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
