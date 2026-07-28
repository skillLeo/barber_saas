"use client";
import { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useToast } from "@/contexts/ToastContext";
import { mockServices, mockAddons, mockBarbers } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import {
  Plus, Search, Clock, Edit2, Trash2, X, Check,
  ToggleLeft, ToggleRight, Package, ChevronRight,
  Eye, EyeOff, GripVertical, ArrowLeft
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { Tabs } from "@/components/ui/Tabs";

const CATEGORIES = ["All", "Hair", "Beard", "Shave", "Kids", "Package", "Colour"];

const MAIN_TABS = [
  { id: "services", label: "Services" },
  { id: "addons", label: "Add-on Library" },
];

type ServiceState = typeof mockServices[0] & { online?: boolean };
type AddonState = typeof mockAddons[0] & { icon?: string };

export default function ServicesPage() {
  const toast = useToast();
  const [tab, setTab] = useState("services");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [editingService, setEditingService] = useState<ServiceState | null>(null);
  const [editingAddon, setEditingAddon] = useState<AddonState | null>(null);
  const [services, setServices] = useState<ServiceState[]>(mockServices.map(s => ({ ...s, online: true })));
  const [addons, setAddons] = useState<AddonState[]>(mockAddons);
  const [showNewService, setShowNewService] = useState(false);
  const [showNewAddon, setShowNewAddon] = useState(false);
  const [newService, setNewService] = useState({ name: "", category: "Hair", duration: 30, price: "", description: "" });
  const [newAddon, setNewAddon] = useState({ name: "", extraPrice: "", extraDuration: 10, description: "" });

  const filtered = services.filter(s =>
    (category === "All" ? true : s.category === category) &&
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleOnline = (id: number) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, online: !s.online } : s));
    toast.success("Service visibility updated");
  };

  const saveService = () => {
    if (!editingService) return;
    setServices(prev => prev.map(s => s.id === editingService.id ? editingService : s));
    toast.success("Service saved");
    setEditingService(null);
  };

  const deleteService = (id: number) => {
    setServices(prev => prev.filter(s => s.id !== id));
    toast.success("Service deleted");
    setEditingService(null);
  };

  const createService = () => {
    if (!newService.name || !newService.price) return;
    const id = Math.max(...services.map(s => s.id)) + 1;
    setServices(prev => [...prev, {
      id, name: newService.name, category: newService.category,
      duration: newService.duration, price: parseFloat(newService.price),
      description: newService.description, bookings: 0, icon: "✂️", addonIds: [], online: true,
    }]);
    toast.success("Service created");
    setShowNewService(false);
    setNewService({ name: "", category: "Hair", duration: 30, price: "", description: "" });
  };

  const createAddon = () => {
    if (!newAddon.name || !newAddon.extraPrice) return;
    const id = Math.max(...addons.map(a => a.id)) + 1;
    setAddons(prev => [...prev, {
      id, name: newAddon.name, extraPrice: parseFloat(newAddon.extraPrice),
      extraDuration: newAddon.extraDuration, description: newAddon.description,
    }]);
    toast.success("Add-on created");
    setShowNewAddon(false);
    setNewAddon({ name: "", extraPrice: "", extraDuration: 10, description: "" });
  };

  return (
    <DashboardShell role="admin">
      <PageHeader
        title="Services"
        subtitle={`${services.length} services · ${addons.length} add-ons`}
        action={
          <Button icon={<Plus size={14} />} onClick={() => tab === "addons" ? setShowNewAddon(true) : setShowNewService(true)}>
            {tab === "addons" ? "New Add-on" : "New Service"}
          </Button>
        }
      />

      {/* Service edit modal */}
      {editingService && (
        <div className="modal-overlay" onClick={() => setEditingService(null)}>
          <div className="modal-panel" style={{ maxWidth: 560, width: "100%" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid var(--border)" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>Edit Service</h3>
              <button onClick={() => setEditingService(null)} className="btn btn-ghost" style={{ padding: "6px 8px" }}><X size={14} /></button>
            </div>
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16, maxHeight: "80vh", overflowY: "auto" }} className="scrollable">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Service Name</label>
                  <input className="input" value={editingService.name} onChange={e => setEditingService(s => s ? { ...s, name: e.target.value } : s)} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Category</label>
                  <select className="input" value={editingService.category} onChange={e => setEditingService(s => s ? { ...s, category: e.target.value } : s)}>
                    {["Hair","Beard","Shave","Kids","Package","Colour"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Price (£)</label>
                  <input className="input" type="number" value={editingService.price}
                    onChange={e => setEditingService(s => s ? { ...s, price: parseFloat(e.target.value) || 0 } : s)} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Duration (min)</label>
                  <input className="input" type="number" value={editingService.duration}
                    onChange={e => setEditingService(s => s ? { ...s, duration: parseInt(e.target.value) || 0 } : s)} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Description</label>
                <textarea className="input" value={editingService.description}
                  onChange={e => setEditingService(s => s ? { ...s, description: e.target.value } : s)}
                  rows={2} style={{ resize: "none" }} />
              </div>

              {/* Add-ons for this service */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 10 }}>Available Add-ons</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {addons.map(addon => {
                    const isLinked = editingService.addonIds.includes(addon.id);
                    return (
                      <button key={addon.id}
                        onClick={() => setEditingService(s => s ? {
                          ...s, addonIds: isLinked ? s.addonIds.filter(id => id !== addon.id) : [...s.addonIds, addon.id]
                        } : s)}
                        style={{
                          display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                          background: isLinked ? "var(--gold-subtle)" : "var(--bg-elevated)",
                          border: isLinked ? "1px solid var(--border-gold)" : "1px solid var(--border)",
                          borderRadius: 10, cursor: "pointer", textAlign: "left", width: "100%", transition: "all 0.12s",
                        }}>
                        <div style={{
                          width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                          background: isLinked ? "var(--gold)" : "transparent",
                          border: `2px solid ${isLinked ? "var(--gold)" : "var(--border-strong)"}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          {isLinked && <Check size={11} style={{ color: "#0A0800" }} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{addon.name}</p>
                          <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{addon.description}</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ fontSize: 12, fontWeight: 700, color: isLinked ? "var(--gold)" : "var(--text-secondary)" }}>+{formatCurrency(addon.extraPrice)}</p>
                          <p style={{ fontSize: 11, color: "var(--text-muted)" }}>+{addon.extraDuration}min</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Toggle checked={editingService.online ?? true} onChange={v => setEditingService(s => s ? { ...s, online: v } : s)}
                  label="Show in online booking" description="Clients can book this service online" />
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "space-between" }}>
                <button className="btn btn-danger" style={{ gap: 8 }} onClick={() => deleteService(editingService.id)}>
                  <Trash2 size={14} /> Delete
                </button>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-ghost" onClick={() => setEditingService(null)}>Cancel</button>
                  <button className="btn btn-primary" style={{ gap: 8 }} onClick={saveService}>
                    <Check size={14} /> Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New service modal */}
      {showNewService && (
        <div className="modal-overlay" onClick={() => setShowNewService(false)}>
          <div className="modal-panel" style={{ maxWidth: 480, width: "100%" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid var(--border)" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>New Service</h3>
              <button onClick={() => setShowNewService(false)} className="btn btn-ghost" style={{ padding: "6px 8px" }}><X size={14} /></button>
            </div>
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
              <input className="input" placeholder="Service name" value={newService.name} onChange={e => setNewService(s => ({ ...s, name: e.target.value }))} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Category</label>
                  <select className="input" value={newService.category} onChange={e => setNewService(s => ({ ...s, category: e.target.value }))}>
                    {["Hair","Beard","Shave","Kids","Package","Colour"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Price (£)</label>
                  <input className="input" type="number" value={newService.price} onChange={e => setNewService(s => ({ ...s, price: e.target.value }))} placeholder="25" />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Duration (min)</label>
                  <input className="input" type="number" value={newService.duration} onChange={e => setNewService(s => ({ ...s, duration: parseInt(e.target.value) }))} />
                </div>
              </div>
              <textarea className="input" placeholder="Short description…" rows={2} style={{ resize: "none" }} value={newService.description} onChange={e => setNewService(s => ({ ...s, description: e.target.value }))} />
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button className="btn btn-ghost" onClick={() => setShowNewService(false)}>Cancel</button>
                <button className="btn btn-primary" style={{ gap: 8 }} onClick={createService} disabled={!newService.name || !newService.price}>
                  <Plus size={14} /> Create Service
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New addon modal */}
      {showNewAddon && (
        <div className="modal-overlay" onClick={() => setShowNewAddon(false)}>
          <div className="modal-panel" style={{ maxWidth: 440, width: "100%" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid var(--border)" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>New Add-on</h3>
              <button onClick={() => setShowNewAddon(false)} className="btn btn-ghost" style={{ padding: "6px 8px" }}><X size={14} /></button>
            </div>
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
              <input className="input" placeholder="Add-on name" value={newAddon.name} onChange={e => setNewAddon(a => ({ ...a, name: e.target.value }))} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Extra Price (£)</label>
                  <input className="input" type="number" value={newAddon.extraPrice} onChange={e => setNewAddon(a => ({ ...a, extraPrice: e.target.value }))} placeholder="5" />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Extra Duration (min)</label>
                  <input className="input" type="number" value={newAddon.extraDuration} onChange={e => setNewAddon(a => ({ ...a, extraDuration: parseInt(e.target.value) }))} />
                </div>
              </div>
              <textarea className="input" placeholder="Short description…" rows={2} style={{ resize: "none" }} value={newAddon.description} onChange={e => setNewAddon(a => ({ ...a, description: e.target.value }))} />
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button className="btn btn-ghost" onClick={() => setShowNewAddon(false)}>Cancel</button>
                <button className="btn btn-primary" style={{ gap: 8 }} onClick={createAddon} disabled={!newAddon.name || !newAddon.extraPrice}>
                  <Plus size={14} /> Create Add-on
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main tabs */}
      <div style={{ marginBottom: 20 }}>
        <Tabs tabs={MAIN_TABS} active={tab} onChange={setTab} variant="underline" />
      </div>

      {tab === "services" && (
        <>
          {/* Filters */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
            <div style={{ position: "relative", flex: "0 0 240px" }}>
              <Search size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
              <input className="input" style={{ paddingLeft: 32, fontSize: 13 }} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search services…" />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)} style={{
                  padding: "6px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer",
                  background: category === cat ? "var(--gold-subtle)" : "var(--bg-elevated)",
                  color: category === cat ? "var(--gold)" : "var(--text-secondary)",
                  border: category === cat ? "1px solid var(--border-gold)" : "1px solid var(--border)",
                  transition: "all 0.15s",
                }}>{cat}</button>
              ))}
            </div>
          </div>

          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Category</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Add-ons</th>
                  <th>Bookings</th>
                  <th>Online</th>
                  <th style={{ width: 80 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(svc => (
                  <tr key={svc.id} onClick={() => setEditingService(svc)}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--bg-elevated)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                          {svc.icon}
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{svc.name}</p>
                          <p style={{ fontSize: 11, color: "var(--text-muted)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{svc.description}</p>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-gray" style={{ fontSize: 11 }}>{svc.category}</span></td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "var(--text-secondary)" }}>
                        <Clock size={12} />{svc.duration} min
                      </div>
                    </td>
                    <td style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{formatCurrency(svc.price)}</td>
                    <td>
                      {svc.addonIds.length > 0 ? (
                        <span className="badge badge-gold" style={{ fontSize: 10 }}>{svc.addonIds.length} add-ons</span>
                      ) : (
                        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>—</span>
                      )}
                    </td>
                    <td style={{ fontSize: 13, color: "var(--text-secondary)" }}>{svc.bookings}</td>
                    <td onClick={e => e.stopPropagation()}>
                      <Toggle checked={svc.online ?? true} onChange={() => toggleOnline(svc.id)} size="sm" />
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <button className="btn btn-ghost" style={{ padding: "5px 8px" }} onClick={() => setEditingService(svc)}>
                        <Edit2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "addons" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
          {addons.map(addon => (
            <div key={addon.id} className="card" style={{ padding: 20 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--gold-subtle)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 18 }}>
                  ✨
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>{addon.name}</p>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10, lineHeight: 1.5 }}>{addon.description}</p>
                  <div style={{ display: "flex", gap: 10 }}>
                    <span className="badge badge-gold" style={{ fontSize: 11 }}>+{formatCurrency(addon.extraPrice)}</span>
                    <span className="badge badge-gray" style={{ fontSize: 11 }}>+{addon.extraDuration} min</span>
                  </div>
                </div>
                <button className="btn btn-ghost" style={{ padding: "5px 8px", flexShrink: 0 }}
                  onClick={() => setEditingAddon(addon)}><Edit2 size={14} /></button>
              </div>
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>Linked to services:</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {services.filter(s => s.addonIds.includes(addon.id)).map(s => (
                    <span key={s.id} className="badge badge-gray" style={{ fontSize: 10 }}>{s.name}</span>
                  ))}
                  {services.filter(s => s.addonIds.includes(addon.id)).length === 0 && (
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Not linked to any service</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
