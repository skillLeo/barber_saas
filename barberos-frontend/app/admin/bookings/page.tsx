"use client";
import { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { SlideOver } from "@/components/ui/SlideOver";
import { useToast } from "@/contexts/ToastContext";
import { mockAppointments, mockBarbers, mockServices } from "@/lib/mock-data";
import { formatCurrency, formatTime } from "@/lib/utils";
import {
  Plus, Search, Calendar, List, ChevronLeft, ChevronRight,
  Clock, User, Scissors, CheckCircle2, XCircle, Phone,
  MoreHorizontal, ArrowRight, Tag, MessageSquare, Edit2
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";

type BookingStatus = "confirmed" | "pending" | "in-progress" | "completed" | "cancelled" | "no-show";

const STATUS_CONFIG: Record<BookingStatus, { label: string; badge: string }> = {
  confirmed:    { label: "Confirmed",    badge: "badge-blue"  },
  pending:      { label: "Pending",      badge: "badge-amber" },
  "in-progress":{ label: "In Progress",  badge: "badge-gold"  },
  completed:    { label: "Completed",    badge: "badge-green" },
  cancelled:    { label: "Cancelled",    badge: "badge-red"   },
  "no-show":    { label: "No Show",      badge: "badge-red"   },
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = Array.from({ length: 11 }, (_, i) => i + 8);

const VIEW_TABS = [
  { id: "list", label: "List", icon: <List size={13} /> },
  { id: "calendar", label: "Calendar", icon: <Calendar size={13} /> },
];

const STATUS_TABS = [
  { id: "all", label: "All", count: mockAppointments.length },
  { id: "confirmed", label: "Confirmed", count: mockAppointments.filter(a => a.status === "confirmed").length },
  { id: "pending", label: "Pending", count: mockAppointments.filter(a => a.status === "pending").length },
  { id: "in-progress", label: "In Progress", count: mockAppointments.filter(a => a.status === "in-progress").length },
  { id: "completed", label: "Completed", count: mockAppointments.filter(a => a.status === "completed").length },
];

export default function BookingsPage() {
  const toast = useToast();
  const [view, setView] = useState("list");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [barberFilter, setBarberFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<typeof mockAppointments[0] | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [weekStart, setWeekStart] = useState(new Date("2026-04-07"));

  const filtered = mockAppointments.filter(a => {
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    if (barberFilter !== "all" && a.barberId.toString() !== barberFilter) return false;
    if (search && !a.client.toLowerCase().includes(search.toLowerCase()) && !a.service.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => a.date > b.date ? -1 : a.date < b.date ? 1 : a.time < b.time ? -1 : 1);

  const updateStatus = (id: number, status: BookingStatus) => {
    toast.success(`Booking updated to ${status}`);
    setSelectedBooking(null);
  };

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const getBarberColor = (barberId: number) => mockBarbers.find(b => b.id === barberId)?.color ?? "var(--gold)";

  return (
    <DashboardShell role="admin">
      <PageHeader
        title="Bookings"
        subtitle="Manage appointments and schedule"
        action={<Button icon={<Plus size={14} />} onClick={() => setShowNewModal(true)}>New Booking</Button>}
      />

      <SlideOver open={!!selectedBooking} onClose={() => setSelectedBooking(null)} title="Booking Details">
        {selectedBooking && (
          <div>
            <div style={{ padding: "14px 24px", background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span className={`badge ${STATUS_CONFIG[selectedBooking.status as BookingStatus]?.badge ?? "badge-gray"}`}>
                {STATUS_CONFIG[selectedBooking.status as BookingStatus]?.label ?? selectedBooking.status}
              </span>
              <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "monospace" }}>#{selectedBooking.id.toString().padStart(4, "0")}</span>
            </div>
            <div style={{ padding: 24, borderBottom: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--gold-subtle)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: "var(--gold)" }}>{selectedBooking.client[0]}</span>
                </div>
                <div>
                  <p style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>{selectedBooking.client}</p>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6 }}>
                    <Phone size={12} />{selectedBooking.clientPhone}
                  </p>
                </div>
              </div>
            </div>
            <div style={{ padding: 24, borderBottom: "1px solid var(--border)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { icon: <Scissors size={14} />, label: "Service", value: selectedBooking.service },
                  ...(selectedBooking.addons.length > 0 ? [{ icon: <Tag size={14} />, label: "Add-ons", value: selectedBooking.addons.join(", ") }] : []),
                  { icon: <User size={14} />, label: "Barber", value: selectedBooking.barber },
                  { icon: <Calendar size={14} />, label: "Date", value: selectedBooking.date },
                  { icon: <Clock size={14} />, label: "Time", value: `${selectedBooking.time} · ${selectedBooking.duration} min` },
                  { icon: <Tag size={14} />, label: "Total", value: formatCurrency(selectedBooking.amount) },
                ].map(row => (
                  <div key={row.label} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <span style={{ color: "var(--text-muted)", flexShrink: 0 }}>{row.icon}</span>
                    <span style={{ fontSize: 13, color: "var(--text-muted)", minWidth: 64, flexShrink: 0 }}>{row.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{row.value}</span>
                  </div>
                ))}
                {selectedBooking.notes && (
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <MessageSquare size={14} style={{ color: "var(--text-muted)", marginTop: 2 }} />
                    <div>
                      <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 3 }}>Notes</p>
                      <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{selectedBooking.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 8 }}>
              {selectedBooking.status === "pending" && (
                <button className="btn btn-primary" style={{ justifyContent: "center", gap: 8 }} onClick={() => updateStatus(selectedBooking.id, "confirmed")}>
                  <CheckCircle2 size={14} /> Confirm Booking
                </button>
              )}
              {(selectedBooking.status === "confirmed" || selectedBooking.status === "pending") && (
                <button className="btn btn-secondary" style={{ justifyContent: "center", gap: 8 }} onClick={() => updateStatus(selectedBooking.id, "in-progress")}>
                  <ArrowRight size={14} /> Mark In Progress
                </button>
              )}
              {selectedBooking.status === "in-progress" && (
                <button className="btn btn-primary" style={{ justifyContent: "center", gap: 8 }} onClick={() => updateStatus(selectedBooking.id, "completed")}>
                  <CheckCircle2 size={14} /> Mark Completed
                </button>
              )}
              <button className="btn btn-ghost" style={{ justifyContent: "center", gap: 8 }}>
                <Edit2 size={14} /> Reschedule
              </button>
              {!["completed", "cancelled"].includes(selectedBooking.status) && (
                <button className="btn btn-danger" style={{ justifyContent: "center", gap: 8 }} onClick={() => updateStatus(selectedBooking.id, "cancelled")}>
                  <XCircle size={14} /> Cancel Booking
                </button>
              )}
            </div>
          </div>
        )}
      </SlideOver>

      {showNewModal && (
        <div className="modal-overlay" onClick={() => setShowNewModal(false)}>
          <div className="modal-panel" style={{ maxWidth: 520, width: "100%" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid var(--border)" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>New Booking</h3>
              <button onClick={() => setShowNewModal(false)} className="btn btn-ghost" style={{ padding: "6px 8px" }}><XCircle size={16} /></button>
            </div>
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
              <input className="input" placeholder="Client name or search existing…" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Service</label>
                  <select className="input">
                    <option>Select service…</option>
                    {mockServices.map(s => <option key={s.id}>{s.name} — {formatCurrency(s.price)}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Barber</label>
                  <select className="input">
                    <option>Any available</option>
                    {mockBarbers.map(b => <option key={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Date</label>
                  <input className="input" type="date" defaultValue="2026-04-12" />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Time</label>
                  <input className="input" type="time" defaultValue="09:00" />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 8 }}>Booking Source</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {["Walk-in", "Phone", "Online", "Home Service"].map(s => (
                    <button key={s} className="btn btn-secondary" style={{ fontSize: 12, flex: 1, justifyContent: "center" }}>{s}</button>
                  ))}
                </div>
              </div>
              <textarea className="input" placeholder="Admin notes…" rows={2} style={{ resize: "none" }} />
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button className="btn btn-ghost" onClick={() => setShowNewModal(false)}>Cancel</button>
                <button className="btn btn-primary" style={{ gap: 8 }} onClick={() => { toast.success("Booking created"); setShowNewModal(false); }}>
                  <Plus size={14} /> Create Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ position: "relative", flex: "0 0 240px" }}>
          <Search size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
          <input className="input" style={{ paddingLeft: 32, fontSize: 13 }} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search client or service…" />
        </div>
        <select className="input" style={{ flex: "0 0 160px", fontSize: 13 }} value={barberFilter} onChange={e => setBarberFilter(e.target.value)}>
          <option value="all">All Barbers</option>
          {mockBarbers.map(b => <option key={b.id} value={b.id.toString()}>{b.name}</option>)}
        </select>
        <div style={{ marginLeft: "auto" }}>
          <Tabs tabs={VIEW_TABS} active={view} onChange={setView} variant="button" />
        </div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <Tabs tabs={STATUS_TABS} active={statusFilter} onChange={setStatusFilter} variant="underline" />
      </div>

      {view === "list" && (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 24px", color: "var(--text-muted)" }}>
              <Calendar size={28} style={{ margin: "0 auto 10px", display: "block" }} />
              <p>No bookings match your filters</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Client</th><th>Service</th><th>Barber</th><th>Date & Time</th><th>Duration</th><th>Amount</th><th>Status</th><th style={{ width: 130 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(booking => {
                  const sc = STATUS_CONFIG[booking.status as BookingStatus];
                  return (
                    <tr key={booking.id} onClick={() => setSelectedBooking(booking)}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--gold-subtle)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--gold)" }}>{booking.client[0]}</span>
                          </div>
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{booking.client}</p>
                            <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{booking.clientPhone}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <p style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 500 }}>{booking.service}</p>
                        {booking.addons.length > 0 && <p style={{ fontSize: 11, color: "var(--gold)" }}>+{booking.addons.length} add-on{booking.addons.length > 1 ? "s" : ""}</p>}
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 7, height: 7, borderRadius: "50%", background: getBarberColor(booking.barberId) }} />
                          <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{booking.barber.split(" ")[0]}</span>
                        </div>
                      </td>
                      <td>
                        <p style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 500 }}>{booking.date}</p>
                        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{formatTime(booking.time)}</p>
                      </td>
                      <td style={{ fontSize: 13, color: "var(--text-secondary)" }}>{booking.duration}m</td>
                      <td style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{formatCurrency(booking.amount)}</td>
                      <td>{sc && <span className={`badge ${sc.badge}`}>{sc.label}</span>}</td>
                      <td onClick={e => e.stopPropagation()}>
                        <div style={{ display: "flex", gap: 4 }}>
                          {booking.status === "pending" && <button className="btn btn-secondary" style={{ padding: "5px 10px", fontSize: 11 }} onClick={() => updateStatus(booking.id, "confirmed")}>Confirm</button>}
                          {booking.status === "confirmed" && <button className="btn btn-secondary" style={{ padding: "5px 10px", fontSize: 11 }} onClick={() => updateStatus(booking.id, "completed")}>Complete</button>}
                          <button className="btn btn-ghost" style={{ padding: "5px 8px" }} onClick={() => setSelectedBooking(booking)}><MoreHorizontal size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {view === "calendar" && (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid var(--border)" }}>
            <button className="btn btn-ghost" style={{ padding: "6px 10px" }}
              onClick={() => { const d = new Date(weekStart); d.setDate(d.getDate() - 7); setWeekStart(d); }}>
              <ChevronLeft size={16} />
            </button>
            <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
              {weekDates[0].toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – {weekDates[6].toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-secondary" style={{ fontSize: 12 }} onClick={() => setWeekStart(new Date("2026-04-07"))}>Today</button>
              <button className="btn btn-ghost" style={{ padding: "6px 10px" }}
                onClick={() => { const d = new Date(weekStart); d.setDate(d.getDate() + 7); setWeekStart(d); }}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, padding: "8px 20px", borderBottom: "1px solid var(--border)" }}>
            {mockBarbers.filter(b => b.status !== "inactive").map(b => (
              <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-secondary)" }}>
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: b.color }} />
                {b.name.split(" ")[0]}
              </div>
            ))}
          </div>
          <div style={{ overflowX: "auto" }}>
            <div style={{ minWidth: 800, display: "grid", gridTemplateColumns: "52px repeat(7, 1fr)" }}>
              <div style={{ borderBottom: "1px solid var(--border)" }} />
              {weekDates.map((date, idx) => {
                const isToday = date.toISOString().slice(0, 10) === "2026-04-12";
                return (
                  <div key={idx} style={{
                    padding: "10px 6px", textAlign: "center", borderBottom: "1px solid var(--border)", borderLeft: "1px solid var(--border)",
                    background: isToday ? "var(--gold-subtle)" : "transparent",
                  }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>{DAYS[idx]}</p>
                    <p style={{ fontSize: 16, fontWeight: isToday ? 800 : 600, color: isToday ? "var(--gold)" : "var(--text-primary)" }}>{date.getDate()}</p>
                  </div>
                );
              })}
              {HOURS.map(hour => (
                <>
                  <div key={`h${hour}`} style={{ padding: "4px 6px", height: 52, display: "flex", alignItems: "flex-start", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600, whiteSpace: "nowrap" }}>
                      {hour > 12 ? `${hour - 12}pm` : `${hour}am`}
                    </span>
                  </div>
                  {weekDates.map((date, dIdx) => {
                    const ds = date.toISOString().slice(0, 10);
                    const dayBookings = mockAppointments.filter(a => parseInt(a.time.split(":")[0]) === hour && a.date === ds);
                    return (
                      <div key={`${hour}-${dIdx}`} style={{
                        height: 52, borderBottom: "1px solid var(--border)", borderLeft: "1px solid var(--border)",
                        padding: "3px", overflow: "hidden",
                      }}>
                        {dayBookings.map(booking => {
                          const c = getBarberColor(booking.barberId);
                          return (
                            <button key={booking.id} onClick={() => setSelectedBooking(booking)} style={{
                              width: "100%", textAlign: "left", cursor: "pointer",
                              background: `${c}22`, border: `1px solid ${c}55`,
                              borderLeft: `3px solid ${c}`, borderRadius: 5,
                              padding: "2px 6px", fontSize: 10, fontWeight: 600, color: "var(--text-primary)",
                              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block", marginBottom: 2,
                            }}>
                              {booking.time} {booking.client.split(" ")[0]}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </>
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
