"use client";

import { useState, useMemo } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { SearchInput } from "@/components/ui/SearchInput";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import {
  Users, Phone, Mail, Calendar, DollarSign, Star,
  Scissors, StickyNote, ChevronRight, X, Crown, Heart,
} from "lucide-react";
import { mockClients, mockAppointments, mockBarbers } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

const ME = mockBarbers[0];

// My clients = clients who have had an appointment with me
const myClientIds = new Set(
  mockAppointments.filter(a => a.barberId === ME.id).map(a => a.client)
);
const myClients = mockClients.filter(c => myClientIds.has(c.name));
const myAppts = mockAppointments.filter(a => a.barberId === ME.id);

const STATUS_BADGE: Record<string, string> = {
  vip: "badge badge-gold",
  regular: "badge badge-blue",
  new: "badge badge-green",
};

export default function BarberClients() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<typeof myClients[0] | null>(null);
  const [filter, setFilter] = useState<"all" | "vip" | "regular">("all");

  const filtered = useMemo(() => {
    let list = myClients;
    if (filter !== "all") list = list.filter(c => c.status === filter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q)
      );
    }
    return list.sort((a, b) => b.visits - a.visits);
  }, [search, filter]);

  function clientHistory(name: string) {
    return myAppts.filter(a => a.client === name).sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
  }

  return (
    <DashboardShell
      role="barber"
      title="My Clients"
      subtitle={`${myClients.length} clients in your chair`}
    >
      {/* ── Filters ────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search name, email, phone..."
          className="w-full sm:w-72"
        />
        <div className="flex items-center gap-2">
          {(["all", "vip", "regular"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all"
              style={{
                background: filter === f ? "var(--gold)" : "var(--bg-surface)",
                color: filter === f ? "#0a0a0a" : "var(--text-secondary)",
              }}
            >
              {f === "vip" && <Crown size={11} className="inline mr-1" />}
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid ───────────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users size={28} />}
          title="No clients found"
          description="Try adjusting your search or filter."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(c => {
            const history = clientHistory(c.name);
            const lastSvc = history[0];
            return (
              <div
                key={c.id}
                className="card-interactive p-4 cursor-pointer"
                onClick={() => setSelected(c)}
              >
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-base font-bold shrink-0"
                    style={{ background: "var(--gold-subtle)", color: "var(--gold)" }}
                  >
                    {c.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold truncate" style={{ color: "var(--text-primary)" }}>{c.name}</p>
                      {c.status !== "regular" && (
                        <span className={STATUS_BADGE[c.status] ?? "badge badge-gray"}>{c.status.toUpperCase()}</span>
                      )}
                    </div>
                    <p className="text-xs mt-0.5 truncate" style={{ color: "var(--text-muted)" }}>{c.email}</p>
                  </div>
                </div>
                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-center mb-3">
                  {[
                    { label: "Visits", value: c.visits },
                    { label: "Spent", value: formatCurrency(c.spent) },
                    { label: "Points", value: c.loyaltyPoints },
                  ].map(s => (
                    <div key={s.label} className="rounded-lg p-2" style={{ background: "var(--bg-surface)" }}>
                      <p className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>{s.value}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{s.label}</p>
                    </div>
                  ))}
                </div>
                {/* Last visit */}
                {lastSvc && (
                  <div className="text-xs flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
                    <Scissors size={11} style={{ color: "var(--gold)" }} />
                    Last: {lastSvc.service} · {lastSvc.date}
                  </div>
                )}
                {c.favouriteService && (
                  <div className="text-xs flex items-center gap-1.5 mt-1" style={{ color: "var(--text-muted)" }}>
                    <Heart size={11} style={{ color: "#EC4899" }} />
                    Favourite: {c.favouriteService}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Client detail slide-over ────────────────────────────────────── */}
      {selected && (
        <div className="fixed inset-0 z-40 flex">
          <div className="flex-1 bg-black/40" onClick={() => setSelected(null)} />
          <div
            className="w-full max-w-md overflow-y-auto"
            style={{ background: "var(--bg-card)", borderLeft: "1px solid var(--border)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "var(--border)" }}>
              <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Client Profile</h2>
              <button
                className="w-8 h-8 flex items-center justify-center rounded-lg"
                style={{ background: "var(--bg-surface)", color: "var(--text-muted)" }}
                onClick={() => setSelected(null)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Identity */}
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shrink-0"
                  style={{ background: "var(--gold-subtle)", color: "var(--gold)" }}
                >
                  {selected.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{selected.name}</h3>
                    {selected.status !== "regular" && (
                      <span className={STATUS_BADGE[selected.status]}>{selected.status.toUpperCase()}</span>
                    )}
                  </div>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>{selected.email}</p>
                </div>
              </div>

              {/* Contact */}
              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" size="sm" icon={<Phone size={14} />} fullWidth>
                  {selected.phone.slice(0, 14)}
                </Button>
                <Button variant="secondary" size="sm" icon={<Mail size={14} />} fullWidth>
                  Email
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Total Visits", value: selected.visits, icon: <Calendar size={14} /> },
                  { label: "Total Spent", value: formatCurrency(selected.spent), icon: <DollarSign size={14} /> },
                  { label: "Loyalty Pts", value: selected.loyaltyPoints, icon: <Star size={14} /> },
                ].map(s => (
                  <div key={s.label} className="p-3 rounded-xl text-center" style={{ background: "var(--bg-surface)" }}>
                    <div className="flex justify-center mb-1" style={{ color: "var(--gold)" }}>{s.icon}</div>
                    <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{s.value}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Preferences */}
              {(selected.favouriteService || selected.notes) && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Preferences & Notes</p>
                  {selected.favouriteService && (
                    <div className="flex items-center gap-2 text-sm mb-1.5" style={{ color: "var(--text-secondary)" }}>
                      <Scissors size={13} style={{ color: "var(--gold)" }} />
                      Favourite: <span className="font-medium">{selected.favouriteService}</span>
                    </div>
                  )}
                  {selected.notes && (
                    <p className="text-sm italic" style={{ color: "var(--text-muted)" }}>"{selected.notes}"</p>
                  )}
                </div>
              )}

              {/* Booking history */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Booking History</p>
                <div className="space-y-2">
                  {clientHistory(selected.name).slice(0, 6).map(a => (
                    <div
                      key={a.id}
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ background: "var(--bg-surface)" }}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{a.service}</p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{a.date} · {a.time}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold" style={{ color: "var(--gold)" }}>{formatCurrency(a.amount)}</p>
                        <span className={`badge badge-${a.status === "completed" ? "green" : a.status === "cancelled" ? "red" : "amber"}`}>
                          {a.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Book again */}
              <Button variant="primary" fullWidth icon={<Calendar size={14} />}>
                Book Again
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
