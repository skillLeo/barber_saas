"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/Button";
import {
  Calendar, DollarSign, Clock, Star, CheckCircle2, Loader2,
  Circle, XCircle, ChevronRight, Phone, MessageSquare, Scissors,
  TrendingUp, ArrowRight, Bell, User,
} from "lucide-react";
import { mockAppointments, mockBarbers, mockStats } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

// ─── Constants ────────────────────────────────────────────────────────────────
const ME = mockBarbers[0]; // James Okafor = logged-in barber
const TODAY = "2026-04-12";

const STATUS_CFG: Record<string, { label: string; badgeClass: string; icon: React.ReactNode }> = {
  completed:     { label: "Completed",   badgeClass: "badge badge-green",  icon: <CheckCircle2 size={12} /> },
  "in-progress": { label: "In Progress", badgeClass: "badge badge-blue",   icon: <Loader2 size={12} className="animate-spin" /> },
  confirmed:     { label: "Confirmed",   badgeClass: "badge badge-gold",   icon: <CheckCircle2 size={12} /> },
  pending:       { label: "Pending",     badgeClass: "badge badge-amber",  icon: <Circle size={12} /> },
  cancelled:     { label: "Cancelled",   badgeClass: "badge badge-red",    icon: <XCircle size={12} /> },
  "no-show":     { label: "No Show",     badgeClass: "badge badge-gray",   icon: <XCircle size={12} /> },
};

const myAppts = mockAppointments.filter(a => a.barberId === ME.id);
const todayAppts = myAppts.filter(a => a.date === TODAY).sort((a, b) => a.time.localeCompare(b.time));
const upcomingAppts = myAppts.filter(a => a.date > TODAY).slice(0, 4);
const todayRevenue = todayAppts.filter(a => a.status === "completed").reduce((s, a) => s + a.amount, 0);
const todayCompleted = todayAppts.filter(a => a.status === "completed").length;
const todayPending = todayAppts.filter(a => ["pending", "confirmed"].includes(a.status)).length;

// ─── Next appointment helper ──────────────────────────────────────────────────
const nextAppt = todayAppts.find(a => ["pending", "confirmed", "in-progress"].includes(a.status));

// ─── Sub-components ───────────────────────────────────────────────────────────
function QuickStat({ label, value, sub, icon, color }: {
  label: string; value: string; sub?: string; icon: React.ReactNode; color: string;
}) {
  return (
    <div className="card p-4 flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: color + "22" }}
      >
        <span style={{ color }}>{icon}</span>
      </div>
      <div>
        <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{label}</p>
        <p className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{value}</p>
        {sub && <p className="text-xs" style={{ color: "var(--text-muted)" }}>{sub}</p>}
      </div>
    </div>
  );
}

function ApptCard({ appt, compact }: { appt: typeof todayAppts[0]; compact?: boolean }) {
  const cfg = STATUS_CFG[appt.status] ?? STATUS_CFG.pending;
  return (
    <div
      className="card-interactive flex items-start gap-3 p-3"
      style={{ borderLeft: `3px solid ${ME.color}` }}
    >
      <div className="w-12 shrink-0 text-center">
        <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{appt.time}</p>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{appt.duration}m</p>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{appt.client}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              {appt.service}{appt.addons.length > 0 ? ` · ${appt.addons.join(", ")}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm font-semibold" style={{ color: "var(--gold)" }}>{formatCurrency(appt.amount)}</span>
            <span className={cfg.badgeClass}>{cfg.label}</span>
          </div>
        </div>
        {!compact && appt.notes && (
          <p className="text-xs mt-1.5 italic" style={{ color: "var(--text-muted)" }}>
            "{appt.notes}"
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function BarberDashboard() {
  const [notifOpen, setNotifOpen] = useState(false);
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <DashboardShell
      role="barber"
      title={`${greeting}, ${ME.name.split(" ")[0]}`}
      subtitle="Here's your day at a glance."
      action={
        <Button
          variant="secondary"
          size="sm"
          icon={<Bell size={14} />}
          onClick={() => setNotifOpen(v => !v)}
        >
          3 alerts
        </Button>
      }
    >
      {/* ── Next appointment hero card ─────────────────────────────────── */}
      {nextAppt ? (
        <div
          className="rounded-2xl p-5 mb-6 flex flex-col sm:flex-row sm:items-center gap-4"
          style={{
            background: "linear-gradient(135deg, var(--gold) 0%, #b8912b 100%)",
            color: "#0a0a0a",
          }}
        >
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-widest opacity-70">Next Appointment</p>
            <p className="text-2xl font-bold mt-1">{nextAppt.client}</p>
            <p className="text-sm font-medium opacity-80 mt-0.5">
              {nextAppt.service} · {nextAppt.time} · {nextAppt.duration}min
            </p>
            {nextAppt.notes && (
              <p className="text-xs opacity-70 mt-1.5 italic">"{nextAppt.notes}"</p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="secondary"
              size="sm"
              icon={<Phone size={14} />}
              style={{ background: "rgba(0,0,0,0.15)", border: "none", color: "#0a0a0a" }}
            >
              Call
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<MessageSquare size={14} />}
              style={{ background: "rgba(0,0,0,0.15)", border: "none", color: "#0a0a0a" }}
            >
              Message
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<ArrowRight size={14} />}
              style={{ background: "rgba(0,0,0,0.25)", border: "none", color: "#0a0a0a" }}
            >
              Start Service
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="rounded-2xl p-5 mb-6 text-center"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          <CheckCircle2 size={32} className="mx-auto mb-2" style={{ color: "#10b981" }} />
          <p className="font-semibold" style={{ color: "var(--text-primary)" }}>All caught up!</p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>No more bookings scheduled for today.</p>
        </div>
      )}

      {/* ── Quick stats ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <QuickStat
          label="Today's Earnings"
          value={formatCurrency(todayRevenue)}
          sub="from completed jobs"
          icon={<DollarSign size={18} />}
          color="#C9A84C"
        />
        <QuickStat
          label="Completed"
          value={String(todayCompleted)}
          sub="bookings today"
          icon={<CheckCircle2 size={18} />}
          color="#10b981"
        />
        <QuickStat
          label="Upcoming"
          value={String(todayPending)}
          sub="left today"
          icon={<Clock size={18} />}
          color="#6366f1"
        />
        <QuickStat
          label="Rating"
          value={String(ME.rating)}
          sub="overall avg"
          icon={<Star size={18} />}
          color="#f59e0b"
        />
      </div>

      {/* ── Today's full schedule + upcoming ─────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Schedule — 2/3 */}
        <div className="xl:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>Today's Schedule</h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                {todayAppts.length} bookings · {formatCurrency(todayAppts.reduce((s, a) => s + a.amount, 0))} potential
              </p>
            </div>
            <a href="/barber/bookings" className="text-xs font-medium flex items-center gap-0.5 hover:underline" style={{ color: "var(--gold)" }}>
              View all <ChevronRight size={13} />
            </a>
          </div>

          {todayAppts.length === 0 ? (
            <div className="text-center py-10">
              <Calendar size={32} className="mx-auto mb-2 opacity-30" style={{ color: "var(--text-muted)" }} />
              <p style={{ color: "var(--text-muted)" }}>No bookings scheduled today.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {todayAppts.map(a => <ApptCard key={a.id} appt={a} />)}
            </div>
          )}
        </div>

        {/* Upcoming + personal stats — 1/3 */}
        <div className="flex flex-col gap-4">

          {/* Upcoming */}
          <div className="card p-5 flex-1">
            <h3 className="font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Upcoming Bookings</h3>
            {upcomingAppts.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Nothing scheduled yet.</p>
            ) : (
              <div className="space-y-2">
                {upcomingAppts.map(a => (
                  <div key={a.id} className="flex items-center gap-3 py-2 border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ME.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{a.client}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {a.date.slice(5).replace("-", "/")} · {a.time} · {a.service}
                      </p>
                    </div>
                    <span className="text-xs font-semibold shrink-0" style={{ color: "var(--gold)" }}>
                      {formatCurrency(a.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Personal stats card */}
          <div className="card p-5">
            <h3 className="font-semibold mb-3" style={{ color: "var(--text-primary)" }}>My Stats</h3>
            <div className="space-y-3">
              {[
                { label: "Total Bookings", value: String(ME.bookings), icon: <Scissors size={14} /> },
                { label: "Revenue (Today)", value: formatCurrency(ME.revenue), icon: <DollarSign size={14} /> },
                { label: "Rating", value: `${ME.rating} / 5.0`, icon: <Star size={14} /> },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <span style={{ color: "var(--gold)" }}>{s.icon}</span>
                    {s.label}
                  </div>
                  <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{s.value}</span>
                </div>
              ))}
            </div>
            <a href="/barber/earnings" className="flex items-center gap-1 text-xs font-medium mt-4 hover:underline" style={{ color: "var(--gold)" }}>
              View detailed earnings <TrendingUp size={12} />
            </a>
          </div>

        </div>
      </div>

    </DashboardShell>
  );
}
