"use client";

import { useState, useMemo } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Tabs } from "@/components/ui/Tabs";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Calendar, CheckCircle2, Circle, XCircle, Loader2,
  Phone, MessageSquare, ChevronLeft, ChevronRight,
  Clock, DollarSign, User, Scissors, StickyNote, X,
} from "lucide-react";
import { mockAppointments, mockBarbers } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

const ME = mockBarbers[0];

const STATUS_CFG: Record<string, { label: string; badgeClass: string; icon: React.ReactNode; actionLabel?: string; nextStatus?: string }> = {
  completed:     { label: "Completed",   badgeClass: "badge badge-green",  icon: <CheckCircle2 size={12} /> },
  "in-progress": { label: "In Progress", badgeClass: "badge badge-blue",   icon: <Loader2 size={12} className="animate-spin" />, actionLabel: "Complete", nextStatus: "completed" },
  confirmed:     { label: "Confirmed",   badgeClass: "badge badge-gold",   icon: <CheckCircle2 size={12} />, actionLabel: "Start", nextStatus: "in-progress" },
  pending:       { label: "Pending",     badgeClass: "badge badge-amber",  icon: <Circle size={12} />, actionLabel: "Confirm", nextStatus: "confirmed" },
  cancelled:     { label: "Cancelled",   badgeClass: "badge badge-red",    icon: <XCircle size={12} /> },
  "no-show":     { label: "No Show",     badgeClass: "badge badge-gray",   icon: <XCircle size={12} /> },
};

const STATUS_TABS = [
  { id: "all", label: "All" },
  { id: "upcoming", label: "Upcoming" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

const VIEW_TABS = [
  { id: "list", label: "List" },
  { id: "calendar", label: "Calendar" },
];

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = Array.from({ length: 10 }, (_, i) => `${i + 8}:00`);

export default function BarberBookings() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [view, setView] = useState("list");
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [appts, setAppts] = useState(mockAppointments.filter(a => a.barberId === ME.id));

  const filtered = useMemo(() => {
    let list = appts;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(a =>
        a.client.toLowerCase().includes(q) ||
        a.service.toLowerCase().includes(q)
      );
    }
    if (statusFilter === "upcoming") list = list.filter(a => ["pending", "confirmed", "in-progress"].includes(a.status));
    else if (statusFilter === "completed") list = list.filter(a => a.status === "completed");
    else if (statusFilter === "cancelled") list = list.filter(a => ["cancelled", "no-show"].includes(a.status));
    return list.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  }, [appts, search, statusFilter]);

  const selected = appts.find(a => a.id === selectedId);

  function advanceStatus(id: number) {
    setAppts(prev => prev.map(a => {
      if (a.id !== id) return a;
      const next = STATUS_CFG[a.status]?.nextStatus;
      return next ? { ...a, status: next } : a;
    }));
  }

  // Calendar helpers
  const getWeekDates = () => {
    const d = new Date("2026-04-12");
    d.setDate(d.getDate() - d.getDay() + 1 + weekOffset * 7); // Mon
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(d);
      day.setDate(d.getDate() + i);
      return day.toISOString().slice(0, 10);
    });
  };
  const weekDates = getWeekDates();
  const weekLabel = `${weekDates[0].slice(5).replace("-", "/")} – ${weekDates[6].slice(5).replace("-", "/")}`;

  const statusCounts = useMemo(() => {
    const total = appts.length;
    const upcoming = appts.filter(a => ["pending", "confirmed", "in-progress"].includes(a.status)).length;
    const completed = appts.filter(a => a.status === "completed").length;
    const cancelled = appts.filter(a => ["cancelled", "no-show"].includes(a.status)).length;
    return { all: total, upcoming, completed, cancelled };
  }, [appts]);

  const tabsWithCounts = STATUS_TABS.map(t => ({ ...t, count: statusCounts[t.id as keyof typeof statusCounts] }));

  return (
    <DashboardShell
      role="barber"
      title="My Bookings"
      subtitle="Manage your appointments"
    >
      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search client or service..."
          className="w-full sm:w-72"
        />
        <div className="ml-auto">
          <Tabs
            tabs={VIEW_TABS}
            active={view}
            onChange={setView}
            variant="button"
          />
        </div>
      </div>

      {/* ── Status tabs ──────────────────────────────────────────────────── */}
      <div className="mb-4">
        <Tabs
          tabs={tabsWithCounts}
          active={statusFilter}
          onChange={setStatusFilter}
          variant="underline"
        />
      </div>

      {/* ── Views ────────────────────────────────────────────────────────── */}
      {view === "list" ? (
        filtered.length === 0 ? (
          <EmptyState
            icon={<Calendar size={28} />}
            title="No bookings found"
            description="Try adjusting your search or filter."
          />
        ) : (
          <div className="space-y-2">
            {filtered.map(a => {
              const cfg = STATUS_CFG[a.status] ?? STATUS_CFG.pending;
              return (
                <div
                  key={a.id}
                  className="card-interactive flex items-start gap-3 p-4 cursor-pointer"
                  style={{ borderLeft: `3px solid ${ME.color}` }}
                  onClick={() => setSelectedId(a.id === selectedId ? null : a.id)}
                >
                  <div className="w-16 shrink-0 text-center">
                    <p className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
                      {a.date.slice(5).replace("-", "/")}
                    </p>
                    <p className="text-base font-bold" style={{ color: "var(--text-primary)" }}>{a.time}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold" style={{ color: "var(--text-primary)" }}>{a.client}</p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                          {a.service}{a.addons.length > 0 ? ` · ${a.addons.join(", ")}` : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-semibold text-sm" style={{ color: "var(--gold)" }}>
                          {formatCurrency(a.amount)}
                        </span>
                        <span className={cfg.badgeClass}>{cfg.label}</span>
                      </div>
                    </div>
                    {/* expanded */}
                    {selectedId === a.id && (
                      <div className="mt-3 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                          <div className="flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
                            <Clock size={12} style={{ color: "var(--gold)" }} />
                            {a.duration} minutes
                          </div>
                          <div className="flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
                            <Phone size={12} style={{ color: "var(--gold)" }} />
                            {a.clientPhone}
                          </div>
                          {a.notes && (
                            <div className="col-span-2 flex items-start gap-1.5" style={{ color: "var(--text-muted)" }}>
                              <StickyNote size={12} className="mt-0.5 shrink-0" style={{ color: "var(--gold)" }} />
                              <span className="italic">"{a.notes}"</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {cfg.actionLabel && (
                            <Button
                              size="xs"
                              variant="primary"
                              onClick={e => { e.stopPropagation(); advanceStatus(a.id); }}
                            >
                              {cfg.actionLabel}
                            </Button>
                          )}
                          <Button
                            size="xs"
                            variant="secondary"
                            icon={<Phone size={12} />}
                            onClick={e => e.stopPropagation()}
                          >
                            Call
                          </Button>
                          <Button
                            size="xs"
                            variant="secondary"
                            icon={<MessageSquare size={12} />}
                            onClick={e => e.stopPropagation()}
                          >
                            Message
                          </Button>
                          {!["completed", "cancelled", "no-show"].includes(a.status) && (
                            <Button
                              size="xs"
                              variant="danger"
                              onClick={e => {
                                e.stopPropagation();
                                setAppts(prev => prev.map(x => x.id === a.id ? { ...x, status: "cancelled" } : x));
                              }}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* ── Calendar view ──────────────────────────────────────────── */
        <div className="card overflow-hidden">
          {/* Week nav */}
          <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "var(--border)" }}>
            <Button variant="ghost" size="sm" icon={<ChevronLeft size={16} />} onClick={() => setWeekOffset(w => w - 1)} />
            <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{weekLabel}</span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setWeekOffset(0)}>Today</Button>
              <Button variant="ghost" size="sm" icon={<ChevronRight size={16} />} onClick={() => setWeekOffset(w => w + 1)} />
            </div>
          </div>
          {/* Grid */}
          <div className="overflow-x-auto">
            <div style={{ minWidth: 640 }}>
              {/* Header */}
              <div className="grid border-b" style={{ gridTemplateColumns: "60px repeat(7, 1fr)", borderColor: "var(--border)" }}>
                <div />
                {WEEK_DAYS.map((d, i) => {
                  const isToday = weekDates[i] === "2026-04-12";
                  return (
                    <div key={d} className="p-2 text-center border-l" style={{ borderColor: "var(--border)" }}>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{d}</p>
                      <p
                        className="text-sm font-semibold w-7 h-7 flex items-center justify-center mx-auto rounded-full"
                        style={{
                          background: isToday ? "var(--gold)" : "transparent",
                          color: isToday ? "#0a0a0a" : "var(--text-primary)",
                        }}
                      >
                        {weekDates[i].slice(8)}
                      </p>
                    </div>
                  );
                })}
              </div>
              {/* Hour rows */}
              {HOURS.map(h => (
                <div key={h} className="grid border-b" style={{ gridTemplateColumns: "60px repeat(7, 1fr)", borderColor: "var(--border)" }}>
                  <div className="p-2 text-right pr-3">
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>{h}</span>
                  </div>
                  {weekDates.map((date, di) => {
                    const cellAppts = appts.filter(a =>
                      a.date === date && a.time.startsWith(h.slice(0, 2))
                    );
                    return (
                      <div
                        key={di}
                        className="border-l min-h-[52px] p-0.5"
                        style={{ borderColor: "var(--border)" }}
                      >
                        {cellAppts.map(a => {
                          const cfg = STATUS_CFG[a.status];
                          return (
                            <button
                              key={a.id}
                              className="w-full text-left rounded p-1 mb-0.5 text-xs leading-tight transition-opacity hover:opacity-80"
                              style={{ background: ME.color + "30", borderLeft: `2px solid ${ME.color}` }}
                              onClick={() => setSelectedId(a.id)}
                            >
                              <p className="font-semibold truncate" style={{ color: "var(--text-primary)" }}>{a.client}</p>
                              <p className="truncate" style={{ color: "var(--text-muted)" }}>{a.service}</p>
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Slide-over detail ────────────────────────────────────────────── */}
      {selected && (
        <div className="fixed inset-0 z-40 flex">
          <div
            className="flex-1 bg-black/40"
            onClick={() => setSelectedId(null)}
          />
          <div
            className="w-full max-w-md overflow-y-auto"
            style={{ background: "var(--bg-card)", borderLeft: "1px solid var(--border)" }}
          >
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "var(--border)" }}>
              <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Booking Details</h2>
              <button
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-opacity-80 transition-colors"
                style={{ background: "var(--bg-surface)", color: "var(--text-muted)" }}
                onClick={() => setSelectedId(null)}
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {/* Status badge */}
              <div className="flex items-center gap-2">
                <span className={STATUS_CFG[selected.status]?.badgeClass}>{STATUS_CFG[selected.status]?.label}</span>
              </div>
              {/* Client */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Client</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ background: "var(--gold-subtle)", color: "var(--gold)" }}>
                    {selected.client[0]}
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: "var(--text-primary)" }}>{selected.client}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{selected.clientPhone}</p>
                  </div>
                </div>
              </div>
              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Service", value: selected.service, icon: <Scissors size={14} /> },
                  { label: "Date & Time", value: `${selected.date} · ${selected.time}`, icon: <Calendar size={14} /> },
                  { label: "Duration", value: `${selected.duration} min`, icon: <Clock size={14} /> },
                  { label: "Amount", value: formatCurrency(selected.amount), icon: <DollarSign size={14} /> },
                ].map(d => (
                  <div key={d.label} className="p-3 rounded-xl" style={{ background: "var(--bg-surface)" }}>
                    <div className="flex items-center gap-1.5 text-xs mb-1" style={{ color: "var(--text-muted)" }}>
                      <span style={{ color: "var(--gold)" }}>{d.icon}</span>
                      {d.label}
                    </div>
                    <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{d.value}</p>
                  </div>
                ))}
              </div>
              {/* Add-ons */}
              {selected.addons.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Add-ons</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.addons.map(ad => (
                      <span key={ad} className="badge badge-gold">{ad}</span>
                    ))}
                  </div>
                </div>
              )}
              {/* Notes */}
              {selected.notes && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Notes</p>
                  <p className="text-sm italic" style={{ color: "var(--text-secondary)" }}>"{selected.notes}"</p>
                </div>
              )}
              {/* Actions */}
              <div className="pt-2 flex flex-col gap-2">
                {STATUS_CFG[selected.status]?.actionLabel && (
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => { advanceStatus(selected.id); setSelectedId(null); }}
                  >
                    {STATUS_CFG[selected.status].actionLabel}
                  </Button>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="secondary" icon={<Phone size={14} />}>Call Client</Button>
                  <Button variant="secondary" icon={<MessageSquare size={14} />}>Message</Button>
                </div>
                {!["completed", "cancelled", "no-show"].includes(selected.status) && (
                  <Button
                    variant="danger"
                    fullWidth
                    onClick={() => {
                      setAppts(prev => prev.map(x => x.id === selected.id ? { ...x, status: "cancelled" } : x));
                      setSelectedId(null);
                    }}
                  >
                    Cancel Booking
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
