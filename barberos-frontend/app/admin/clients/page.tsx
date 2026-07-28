"use client";
import { useState, useMemo } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { SlideOver } from "@/components/ui/SlideOver";
import { useToast } from "@/contexts/ToastContext";
import { mockClients, mockAppointments } from "@/lib/mock-data";
import { Plus, Search, Crown, MessageSquare, Mail, Star, Edit3, Ban, Save } from "lucide-react";

type Client = typeof mockClients[0];
const STATUS_CFG: Record<string, { bg: string; color: string; label: string }> = {
  vip: { bg: "var(--gold-subtle)", color: "var(--gold)", label: "VIP" },
  regular: { bg: "rgba(99,102,241,0.12)", color: "#6366F1", label: "Regular" },
  new: { bg: "var(--success-bg)", color: "var(--success)", label: "New" },
};
const APPT_STATUS: Record<string, { bg: string; color: string; label: string }> = {
  completed: { bg: "rgba(99,102,241,0.12)", color: "#6366F1", label: "Completed" },
  "in-progress": { bg: "var(--success-bg)", color: "var(--success)", label: "In Progress" },
  confirmed: { bg: "var(--gold-subtle)", color: "var(--gold)", label: "Confirmed" },
  pending: { bg: "var(--warning-bg)", color: "var(--warning)", label: "Pending" },
  cancelled: { bg: "var(--error-bg)", color: "var(--error)", label: "Cancelled" },
  "no-show": { bg: "var(--error-bg)", color: "#f97316", label: "No-Show" },
};

export default function ClientsPage() {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState<Client | null>(null);
  const [editNote, setEditNote] = useState("");
  const [showBlacklist, setShowBlacklist] = useState(false);
  const [blacklistReason, setBlacklistReason] = useState("");

  const filtered = useMemo(() => mockClients.filter(c => {
    const ms = c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search) || c.email.toLowerCase().includes(search.toLowerCase());
    const mst = filterStatus === "all" || c.status === filterStatus;
    return ms && mst;
  }), [search, filterStatus]);

  const clientBookings = selected ? mockAppointments.filter(a => a.client === selected.name).slice(0, 8) : [];

  function openClient(c: Client) {
    setSelected(c); setEditNote(c.notes ?? ""); setShowBlacklist(false);
  }

  return (
    <DashboardShell role="admin" title="Clients" subtitle={`${mockClients.length} registered clients`}
      action={<button className="btn btn-primary" style={{ fontSize: 13 }}><Plus size={14} /> Add Client</button>}>
      <SlideOver open={!!selected} onClose={() => setSelected(null)} title="Client Profile" width={500}>
        {selected && (
          <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: "var(--gold-subtle)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "var(--gold)", flexShrink: 0 }}>
                {selected.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: "var(--text-primary)" }}>{selected.name}</div>
                  {selected.status === "vip" && <Crown size={13} style={{ color: "var(--gold)" }} />}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{selected.email}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{selected.phone}</div>
              </div>
              <span style={{ padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700, background: STATUS_CFG[selected.status].bg, color: STATUS_CFG[selected.status].color }}>{STATUS_CFG[selected.status].label}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {[{ l: "Visits", v: selected.visits }, { l: "Spent", v: `£${selected.spent}` }, { l: "Avg", v: `£${Math.round(selected.spent / Math.max(selected.visits, 1))}` }, { l: "Points", v: selected.loyaltyPoints }].map(s => (
                <div key={s.l} style={{ padding: "11px 6px", borderRadius: 10, background: "var(--bg-elevated)", textAlign: "center" }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "var(--gold)" }}>{s.v}</div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1, display: "flex", justifyContent: "space-between", padding: "10px 12px", borderRadius: 10, background: "var(--bg-elevated)", fontSize: 12 }}><span style={{ color: "var(--text-muted)" }}>Favourite</span><span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{selected.favouriteService}</span></div>
              <div style={{ flex: 1, display: "flex", justifyContent: "space-between", padding: "10px 12px", borderRadius: 10, background: "var(--bg-elevated)", fontSize: 12 }}><span style={{ color: "var(--text-muted)" }}>Last Visit</span><span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{selected.lastVisit}</span></div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 10 }}>Booking History</div>
              {clientBookings.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {clientBookings.map(b => (
                    <div key={b.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)", fontSize: 12 }}>
                      <div>
                        <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{b.service}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{b.date} · {b.barber}</div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                        <span style={{ fontWeight: 700, color: "var(--gold)" }}>£{b.amount}</span>
                        <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 6, background: APPT_STATUS[b.status]?.bg ?? "var(--bg-elevated)", color: APPT_STATUS[b.status]?.color ?? "var(--text-muted)" }}>{APPT_STATUS[b.status]?.label ?? b.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: 16, textAlign: "center", color: "var(--text-muted)", fontSize: 12, borderRadius: 10, background: "var(--bg-elevated)" }}>No bookings found</div>
              )}
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Staff Notes</label>
              <textarea className="input" rows={3} placeholder="Internal notes…" value={editNote} onChange={e => setEditNote(e.target.value)} style={{ fontSize: 12, resize: "none" }} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-ghost" style={{ flex: 1, justifyContent: "center", fontSize: 12 }} onClick={() => toast.success("SMS sent")}><MessageSquare size={13} /> SMS</button>
              <button className="btn btn-ghost" style={{ flex: 1, justifyContent: "center", fontSize: 12 }} onClick={() => toast.success("Email sent")}><Mail size={13} /> Email</button>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: "center", fontSize: 12 }} onClick={() => toast.success("Notes saved")}><Save size={13} /> Save</button>
            </div>
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14 }}>
              {!showBlacklist ? (
                <button className="btn btn-danger" style={{ width: "100%", justifyContent: "center", fontSize: 12 }} onClick={() => setShowBlacklist(true)}><Ban size={13} /> Blacklist Client</button>
              ) : (
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--error)", marginBottom: 6 }}>Reason for blacklisting</label>
                  <textarea className="input" rows={2} placeholder="Reason…" value={blacklistReason} onChange={e => setBlacklistReason(e.target.value)} style={{ fontSize: 12, resize: "none", marginBottom: 8 }} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-ghost" style={{ flex: 1, justifyContent: "center", fontSize: 12 }} onClick={() => setShowBlacklist(false)}>Cancel</button>
                    <button className="btn btn-danger" style={{ flex: 1, justifyContent: "center", fontSize: 12 }} onClick={() => { toast.error("Client blacklisted"); setSelected(null); }}>Confirm</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </SlideOver>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: "1 1 220px" }}>
            <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input className="input" placeholder="Search name, phone, email…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 30, fontSize: 13 }} />
          </div>
          <select className="input" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ flex: "0 0 auto", fontSize: 12, minWidth: 130 }}>
            <option value="all">All Clients</option>
            <option value="vip">VIP</option>
            <option value="regular">Regular</option>
            <option value="new">New</option>
          </select>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
          {[
            { l: "Total Clients", v: mockClients.length, color: "var(--gold)" },
            { l: "VIP Clients", v: mockClients.filter(c => c.status === "vip").length, color: "#6366f1" },
            { l: "New Clients", v: mockClients.filter(c => c.status === "new").length, color: "var(--success)" },
            { l: "Avg Spend", v: `£${Math.round(mockClients.reduce((s, c) => s + c.spent, 0) / mockClients.length)}`, color: "var(--warning)" },
          ].map(s => (
            <div key={s.l} className="card" style={{ padding: "16px 18px" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.v}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>{s.l}</div>
            </div>
          ))}
        </div>
        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr><th>Client</th><th>Phone</th><th>Visits</th><th>Total Spent</th><th>Points</th><th>Last Visit</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} onClick={() => openClient(c)}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 9, background: "var(--gold-subtle)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "var(--gold)", flexShrink: 0 }}>{c.name.split(" ").map(n => n[0]).join("")}</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 5 }}>{c.name}{c.status === "vip" && <Crown size={10} style={{ color: "var(--gold)" }} />}</div>
                          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: 12 }}>{c.phone}</td>
                    <td><span style={{ fontSize: 13, fontWeight: 700 }}>{c.visits}</span></td>
                    <td><span style={{ fontSize: 13, fontWeight: 700, color: "var(--gold)" }}>£{c.spent}</span></td>
                    <td><div style={{ display: "flex", alignItems: "center", gap: 4 }}><Star size={11} fill="var(--gold)" style={{ color: "var(--gold)" }} /><span style={{ fontSize: 12, fontWeight: 600 }}>{c.loyaltyPoints}</span></div></td>
                    <td><span style={{ fontSize: 12 }}>{c.lastVisit}</span></td>
                    <td><span style={{ display: "inline-flex", alignItems: "center", padding: "3px 9px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: STATUS_CFG[c.status].bg, color: STATUS_CFG[c.status].color }}>{STATUS_CFG[c.status].label}</span></td>
                    <td>
                      <div style={{ display: "flex", gap: 4 }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => toast.success("SMS sent")} style={{ width: 26, height: 26, borderRadius: 7, border: "none", cursor: "pointer", background: "var(--bg-elevated)", color: "var(--text-secondary)", display: "flex", alignItems: "center", justifyContent: "center" }}><MessageSquare size={11} /></button>
                        <button onClick={() => toast.success("Email sent")} style={{ width: 26, height: 26, borderRadius: 7, border: "none", cursor: "pointer", background: "var(--bg-elevated)", color: "var(--text-secondary)", display: "flex", alignItems: "center", justifyContent: "center" }}><Mail size={11} /></button>
                        <button onClick={() => openClient(c)} style={{ width: 26, height: 26, borderRadius: 7, border: "none", cursor: "pointer", background: "var(--gold-subtle)", color: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center" }}><Edit3 size={11} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div style={{ padding: 40, textAlign: "center" }}>
                <Search size={28} style={{ color: "var(--border-strong)", marginBottom: 8 }} />
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>No clients found</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
