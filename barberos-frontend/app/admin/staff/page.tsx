"use client";
import { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useToast } from "@/contexts/ToastContext";
import { mockBarbers, mockServices, mockSchedules } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import {
  Plus, Search, Mail, Phone, Star, Clock, Calendar, Scissors, Edit2,
  X, ChevronDown, Check, Briefcase, DollarSign,
  Award, User, Globe, TrendingUp
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { Tabs } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/Badge";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const ROLES = ["Barber", "Manager", "Receptionist", "Cashier", "Shop Owner"];

const STATUS_CONFIG = {
  active:   { label: "Active",    badge: "badge-green" },
  break:    { label: "On Break",  badge: "badge-amber" },
  inactive: { label: "Inactive",  badge: "badge-gray"  },
};

const DETAIL_TABS = [
  { id: "profile",   label: "Profile" },
  { id: "schedule",  label: "Schedule" },
  { id: "services",  label: "Services" },
  { id: "earnings",  label: "Earnings" },
];

export default function StaffPage() {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [selectedBarber, setSelectedBarber] = useState<typeof mockBarbers[0] | null>(null);
  const [detailTab, setDetailTab] = useState("profile");
  const [showInvite, setShowInvite] = useState(false);
  const [schedule, setSchedule] = useState(mockSchedules[1] ?? mockSchedules[2] ?? DAYS.map(d => ({
    day: d, open: ["Mon","Tue","Wed","Thu","Fri","Sat"].includes(d), startTime: "09:00", endTime: "18:00", breaks: [],
  })));

  const [serviceOverrides, setServiceOverrides] = useState<Record<number, number>>({});

  const filtered = mockBarbers.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.specialty.toLowerCase().includes(search.toLowerCase())
  );

  const openDetail = (b: typeof mockBarbers[0]) => {
    setSelectedBarber(b);
    setDetailTab("profile");
    const s = mockSchedules[b.id];
    if (s) setSchedule(s);
    else setSchedule(DAYS.map(d => ({ day: d, open: ["Mon","Tue","Wed","Thu","Fri","Sat"].includes(d), startTime: "09:00", endTime: "18:00", breaks: [] })));
  };

  const toggleDay = (dayIdx: number) => {
    setSchedule(prev => prev.map((d, i) => i === dayIdx ? { ...d, open: !d.open } : d));
  };

  const updateTime = (dayIdx: number, field: "startTime" | "endTime", value: string) => {
    setSchedule(prev => prev.map((d, i) => i === dayIdx ? { ...d, [field]: value } : d));
  };

  return (
    <DashboardShell role="admin">
      <PageHeader
        title="Staff"
        subtitle={`${mockBarbers.filter(b => b.status === "active").length} active · ${mockBarbers.filter(b => b.status === "break").length} on break`}
        action={<Button icon={<Plus size={14} />} onClick={() => setShowInvite(true)}>Invite Staff</Button>}
      />

      {/* Invite modal */}
      {showInvite && (
        <div className="modal-overlay" onClick={() => setShowInvite(false)}>
          <div className="modal-panel" style={{ maxWidth: 460, width: "100%" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid var(--border)" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>Invite Staff Member</h3>
              <button onClick={() => setShowInvite(false)} className="btn btn-ghost" style={{ padding: "6px 8px" }}><X size={14} /></button>
            </div>
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>First name</label>
                  <input className="input" placeholder="James" />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Last name</label>
                  <input className="input" placeholder="Okafor" />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Email address</label>
                <input className="input" type="email" placeholder="james@yourshop.com" />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Role</label>
                <select className="input">
                  {ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div style={{ background: "var(--info-bg)", borderRadius: 10, padding: "10px 14px", fontSize: 12.5, color: "var(--info)" }}>
                They&apos;ll receive an email with a link to set their password.
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button className="btn btn-ghost" onClick={() => setShowInvite(false)}>Cancel</button>
                <button className="btn btn-primary" style={{ gap: 8 }} onClick={() => { toast.success("Invitation sent!"); setShowInvite(false); }}>
                  <Mail size={14} /> Send Invitation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Staff detail panel */}
      {selectedBarber && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 50,
          display: "flex", alignItems: "stretch",
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
        }} onClick={() => setSelectedBarber(null)}>
          <div style={{ marginLeft: "auto", width: "100%", maxWidth: 680, background: "var(--bg-card)", display: "flex", flexDirection: "column", overflow: "hidden" }}
            onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{
              display: "flex", alignItems: "center", gap: 16, padding: "20px 24px",
              borderBottom: "1px solid var(--border)", background: "var(--bg-elevated)",
            }}>
              <div style={{ position: "relative" }}>
                <img src={selectedBarber.avatar} alt={selectedBarber.name} style={{ width: 52, height: 52, borderRadius: "50%", border: "2px solid var(--border-gold)" }} />
                <div style={{
                  position: "absolute", bottom: 0, right: 0, width: 14, height: 14, borderRadius: "50%",
                  background: selectedBarber.status === "active" ? "var(--success)" : "var(--warning)",
                  border: "2px solid var(--bg-elevated)",
                }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 17, fontWeight: 700, color: "var(--text-primary)" }}>{selectedBarber.name}</p>
                <p style={{ fontSize: 13, color: "var(--text-muted)" }}>{selectedBarber.specialty}</p>
              </div>
              <span className={`badge ${STATUS_CONFIG[selectedBarber.status as keyof typeof STATUS_CONFIG]?.badge ?? "badge-gray"}`}>
                {STATUS_CONFIG[selectedBarber.status as keyof typeof STATUS_CONFIG]?.label ?? selectedBarber.status}
              </span>
              <button onClick={() => setSelectedBarber(null)} className="btn btn-ghost" style={{ padding: "6px 8px" }}><X size={14} /></button>
            </div>

            {/* Tabs */}
            <div style={{ padding: "0 24px", borderBottom: "1px solid var(--border)" }}>
              <Tabs tabs={DETAIL_TABS} active={detailTab} onChange={setDetailTab} variant="underline" />
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: 24 }} className="scrollable">
              {/* PROFILE TAB */}
              {detailTab === "profile" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {[
                      { label: "Full Name", value: selectedBarber.name, icon: <User size={14} /> },
                      { label: "Phone", value: selectedBarber.phone, icon: <Phone size={14} /> },
                      { label: "Email", value: selectedBarber.email, icon: <Mail size={14} /> },
                      { label: "Rating", value: `${selectedBarber.rating} / 5.0`, icon: <Star size={14} /> },
                    ].map(f => (
                      <div key={f.label}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                          <span style={{ color: "var(--text-muted)" }}>{f.icon}</span>{f.label}
                        </label>
                        <input className="input" defaultValue={f.value} style={{ fontSize: 13 }} />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Bio</label>
                    <textarea className="input" defaultValue={selectedBarber.bio} rows={3} style={{ resize: "none", lineHeight: 1.6, fontSize: 13 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 8 }}>Specialties</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {selectedBarber.specialties.map(s => (
                        <span key={s} className="badge badge-gold" style={{ gap: 6 }}>
                          {s} <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gold)", padding: 0 }}>×</button>
                        </span>
                      ))}
                      <button className="badge badge-gray" style={{ gap: 4, cursor: "pointer" }}><Plus size={10} /> Add</button>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 8 }}>Languages</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {selectedBarber.languages.map(l => (
                        <span key={l} className="badge badge-blue">{l}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "var(--bg-elevated)", borderRadius: 12, border: "1px solid var(--border)" }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Also works as barber</p>
                      <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Show in barber selection for bookings</p>
                    </div>
                    <Toggle checked size="sm" onChange={() => {}} />
                  </div>
                  <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                    <button className="btn btn-ghost" onClick={() => setSelectedBarber(null)}>Cancel</button>
                    <button className="btn btn-primary" style={{ gap: 8 }} onClick={() => toast.success("Profile saved")}>
                      <Check size={14} /> Save Changes
                    </button>
                  </div>
                </div>
              )}

              {/* SCHEDULE TAB */}
              {detailTab === "schedule" && (
                <div>
                  <p style={{ fontSize: 13.5, color: "var(--text-muted)", marginBottom: 20 }}>Set working hours for each day. Closed days won&apos;t appear in booking availability.</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {schedule.map((day, idx) => (
                      <div key={day.day} style={{
                        display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
                        background: day.open ? "var(--bg-elevated)" : "var(--bg-card)",
                        border: "1px solid var(--border)", borderRadius: 12,
                        opacity: day.open ? 1 : 0.55,
                      }}>
                        <Toggle checked={day.open} onChange={() => toggleDay(idx)} size="sm" />
                        <span style={{ width: 32, fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{day.day}</span>
                        {day.open ? (
                          <>
                            <input type="time" className="input" value={day.startTime} onChange={e => updateTime(idx, "startTime", e.target.value)}
                              style={{ width: 100, fontSize: 13 }} />
                            <span style={{ color: "var(--text-muted)", fontSize: 13 }}>to</span>
                            <input type="time" className="input" value={day.endTime} onChange={e => updateTime(idx, "endTime", e.target.value)}
                              style={{ width: 100, fontSize: 13 }} />
                            {day.breaks.length > 0 && (
                              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>· {day.breaks[0].start}–{day.breaks[0].end} break</span>
                            )}
                            <button className="btn btn-ghost" style={{ marginLeft: "auto", padding: "4px 8px", fontSize: 11 }}>+ Break</button>
                          </>
                        ) : (
                          <span style={{ fontSize: 13, color: "var(--text-muted)", marginLeft: 4 }}>Closed</span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
                    <button className="btn btn-primary" style={{ gap: 8 }} onClick={() => toast.success("Schedule saved")}>
                      <Check size={14} /> Save Schedule
                    </button>
                  </div>
                </div>
              )}

              {/* SERVICES TAB */}
              {detailTab === "services" && (
                <div>
                  <p style={{ fontSize: 13.5, color: "var(--text-muted)", marginBottom: 20 }}>
                    Select which services this barber offers. You can set custom pricing per service.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {mockServices.map(svc => (
                      <div key={svc.id} style={{
                        display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
                        background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 12,
                      }}>
                        <input type="checkbox" defaultChecked style={{ accentColor: "var(--gold)", width: 16, height: 16, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{svc.name}</p>
                          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{svc.duration} min · default {formatCurrency(svc.price)}</p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Custom price:</span>
                          <div style={{ position: "relative" }}>
                            <span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "var(--text-muted)" }}>£</span>
                            <input type="number" className="input" style={{ width: 72, paddingLeft: 18, fontSize: 13, padding: "6px 8px 6px 18px" }}
                              placeholder={svc.price.toString()}
                              value={serviceOverrides[svc.id] ?? ""}
                              onChange={e => setServiceOverrides(p => ({ ...p, [svc.id]: parseFloat(e.target.value) }))} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
                    <button className="btn btn-primary" style={{ gap: 8 }} onClick={() => toast.success("Services updated")}>
                      <Check size={14} /> Save
                    </button>
                  </div>
                </div>
              )}

              {/* EARNINGS TAB */}
              {detailTab === "earnings" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                    {[
                      { label: "This Month", value: formatCurrency(selectedBarber.revenue * 1.3), icon: <TrendingUp size={16} /> },
                      { label: "This Week", value: formatCurrency(selectedBarber.revenue), icon: <Calendar size={16} /> },
                      { label: "Today", value: formatCurrency(Math.round(selectedBarber.revenue * 0.2)), icon: <Clock size={16} /> },
                    ].map(stat => (
                      <div key={stat.label} style={{
                        background: "var(--bg-elevated)", borderRadius: 12, padding: 16, border: "1px solid var(--border)", textAlign: "center",
                      }}>
                        <div style={{ color: "var(--gold)", marginBottom: 8 }}>{stat.icon}</div>
                        <p style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)" }}>{stat.value}</p>
                        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{stat.label}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: "var(--bg-elevated)", borderRadius: 12, padding: 16, border: "1px solid var(--border)" }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 14 }}>Commission Settings</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Commission Rate (%)</label>
                        <input className="input" type="number" defaultValue="40" max="100" min="0" style={{ fontSize: 14, fontFamily: "monospace" }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Payout Method</label>
                        <select className="input">
                          <option>Bank Transfer</option>
                          <option>Cash</option>
                          <option>Cheque</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center" }}>Payouts are calculated based on completed bookings at end of each pay period.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div style={{ position: "relative", maxWidth: 360, marginBottom: 24 }}>
        <Search size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
        <input className="input" style={{ paddingLeft: 32 }} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search staff…" />
      </div>

      {/* Staff grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {filtered.map(barber => {
          const sc = STATUS_CONFIG[barber.status as keyof typeof STATUS_CONFIG];
          return (
            <div
              key={barber.id}
              className="card card-interactive"
              style={{ padding: 20, cursor: "pointer" }}
              onClick={() => openDetail(barber)}
            >
              {/* Header */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <img src={barber.avatar} alt={barber.name} style={{ width: 48, height: 48, borderRadius: "50%", border: "2px solid var(--border)" }} />
                  <div style={{
                    position: "absolute", bottom: 0, right: 0, width: 13, height: 13, borderRadius: "50%",
                    background: barber.status === "active" ? "var(--success)" : barber.status === "break" ? "var(--warning)" : "var(--border-strong)",
                    border: "2px solid var(--bg-card)",
                  }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 2 }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{barber.name}</p>
                    {sc && <span className={`badge ${sc.badge}`}>{sc.label}</span>}
                  </div>
                  <p style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{barber.specialty}</p>
                </div>
              </div>

              {/* Specialties */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                {barber.specialties.slice(0, 3).map(s => (
                  <span key={s} className="badge badge-gray" style={{ fontSize: 10 }}>{s}</span>
                ))}
              </div>

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
                {[
                  { label: "Bookings", value: barber.bookings },
                  { label: "Revenue", value: formatCurrency(barber.revenue) },
                  { label: "Rating", value: barber.rating },
                ].map(stat => (
                  <div key={stat.label} style={{ background: "var(--bg-elevated)", borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
                    <p style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)" }}>{stat.value}</p>
                    <p style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600 }}>{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Contact */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 12, color: "var(--text-muted)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Phone size={11} />{barber.phone.slice(-8)}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Star size={11} fill="var(--gold)" style={{ color: "var(--gold)" }} />{barber.rating}</span>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardShell>
  );
}
