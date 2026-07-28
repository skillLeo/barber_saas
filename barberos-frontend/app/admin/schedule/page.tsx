"use client";
import { useState, useCallback } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { SlideOver } from "@/components/ui/SlideOver";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Toggle } from "@/components/ui/Toggle";
import { useToast } from "@/contexts/ToastContext";
import {
  mockAdminSchedule, mockSlotSettings, mockDateOverrides, mockTodaySlots, mockDateAvailability,
  type DayKey, type DaySchedule, type BreakSlot,
} from "@/lib/mock-data";
import {
  CalendarDays, Clock, Plus, Trash2, Check, ChevronLeft, ChevronRight,
  Calendar, Coffee, Ban, User, Phone, Mail, CreditCard, Edit3,
  Star, FileText, XCircle, RefreshCw, CheckCircle2, AlertCircle,
  Printer, Zap, Info,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type SlotStatus = "confirmed" | "in-progress" | "pending" | "completed" | null;
type PaymentMethod = "card" | "cash" | "online" | "phone" | null;
type OverrideType = "dayoff" | "custom-hours";
type Slot = typeof mockTodaySlots[0];
type DateAvail = typeof mockDateAvailability[0];

// ─── Constants ────────────────────────────────────────────────────────────────
const DAYS: { key: DayKey; label: string }[] = [
  { key: "monday",    label: "Monday" },
  { key: "tuesday",   label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday",  label: "Thursday" },
  { key: "friday",    label: "Friday" },
  { key: "saturday",  label: "Saturday" },
  { key: "sunday",    label: "Sunday" },
];

const TIME_OPTIONS: string[] = [];
for (let h = 6; h <= 23; h++) {
  for (const m of ["00", "15", "30", "45"]) {
    if (h === 23 && m !== "00") continue;
    TIME_OPTIONS.push(`${String(h).padStart(2, "0")}:${m}`);
  }
}

const SLOT_DURATION_OPTIONS = [15, 20, 30, 45, 60];
const BUFFER_OPTIONS = [0, 5, 10, 15];
const ADVANCE_LIMIT_OPTIONS = [
  { value: 7,  label: "1 week" },
  { value: 14, label: "2 weeks" },
  { value: 30, label: "1 month" },
  { value: 60, label: "2 months" },
  { value: 90, label: "3 months" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function timeToMins(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function formatDisplay(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const d = h % 12 || 12;
  return `${d}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function calcSlots(day: DaySchedule, slotDur: number, buffer: number): number {
  if (!day.active) return 0;
  const total = timeToMins(day.end) - timeToMins(day.start);
  const breakMins = day.breaks.reduce((s, b) => s + (timeToMins(b.end) - timeToMins(b.start)), 0);
  const working = total - breakMins;
  return Math.max(0, Math.floor(working / (slotDur + buffer)));
}

function initials(name: string) {
  return name.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase();
}

function statusConfig(s: SlotStatus) {
  switch (s) {
    case "confirmed":    return { label: "Confirmed",    border: "#C9A84C", bg: "rgba(201,168,76,0.06)",   badge: "badge-gold" };
    case "in-progress":  return { label: "In Progress",  border: "#3B82F6", bg: "rgba(59,130,246,0.06)",   badge: "badge-blue" };
    case "pending":      return { label: "Pending",      border: "#F59E0B", bg: "rgba(245,158,11,0.06)",   badge: "badge-amber" };
    case "completed":    return { label: "Completed",    border: "#888",    bg: "transparent",             badge: "badge-gray" };
    default:             return { label: "",             border: "transparent", bg: "transparent",         badge: "" };
  }
}

function paymentLabel(p: PaymentMethod) {
  switch (p) {
    case "card":   return "Card";
    case "cash":   return "Cash";
    case "online": return "Online";
    case "phone":  return "Phone";
    default:       return "—";
  }
}

function methodLabel(m: string | null) {
  switch (m) {
    case "online":  return "Online";
    case "walk-in": return "Walk-in";
    case "phone":   return "Phone";
    default:        return "—";
  }
}

function dotColor(status: DateAvail["status"]) {
  switch (status) {
    case "full":      return "#EF4444";
    case "partial":   return "#F59E0B";
    case "available": return "#22C55E";
    default:          return null;
  }
}

// ─── Custom Select ────────────────────────────────────────────────────────────
function Select({ value, onChange, options, small }: {
  value: string | number;
  onChange: (v: string) => void;
  options: { value: string | number; label: string }[];
  small?: boolean;
}) {
  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
      <Clock size={12} style={{ position: "absolute", left: 8, color: "var(--text-muted)", pointerEvents: "none", zIndex: 1 }} />
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          appearance: "none",
          WebkitAppearance: "none",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          color: "var(--text-primary)",
          fontSize: small ? 12 : 13,
          fontWeight: 500,
          padding: small ? "5px 28px 5px 24px" : "7px 32px 7px 26px",
          cursor: "pointer",
          outline: "none",
          transition: "border-color 0.15s",
          minWidth: small ? 90 : 110,
        }}
        onFocus={e => (e.target.style.borderColor = "var(--gold)")}
        onBlur={e => (e.target.style.borderColor = "var(--border)")}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronRight size={10} style={{
        position: "absolute", right: 8, color: "var(--text-muted)",
        pointerEvents: "none", transform: "rotate(90deg)",
      }} />
    </div>
  );
}

// ─── Break Row ────────────────────────────────────────────────────────────────
function BreakRow({ brk, onRemove, onChange }: {
  brk: BreakSlot;
  onRemove: () => void;
  onChange: (updated: BreakSlot) => void;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "6px 0 6px 20px",
      animation: "fadeInDown 0.2s ease",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        background: "var(--bg-elevated)", borderRadius: 8,
        padding: "4px 10px", border: "1px solid var(--border)",
      }}>
        <Coffee size={11} style={{ color: "var(--text-muted)" }} />
        <select
          value={brk.start}
          onChange={e => onChange({ ...brk, start: e.target.value })}
          style={{ background: "transparent", border: "none", color: "var(--text-secondary)", fontSize: 12, fontWeight: 500, outline: "none", cursor: "pointer" }}
        >
          {TIME_OPTIONS.map(t => <option key={t} value={t}>{formatDisplay(t)}</option>)}
        </select>
        <span style={{ color: "var(--text-muted)", fontSize: 11 }}>–</span>
        <select
          value={brk.end}
          onChange={e => onChange({ ...brk, end: e.target.value })}
          style={{ background: "transparent", border: "none", color: "var(--text-secondary)", fontSize: 12, fontWeight: 500, outline: "none", cursor: "pointer" }}
        >
          {TIME_OPTIONS.map(t => <option key={t} value={t}>{formatDisplay(t)}</option>)}
        </select>
      </div>
      <button
        onClick={onRemove}
        style={{
          width: 22, height: 22, borderRadius: 6, border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "var(--error-bg)", color: "var(--error)",
        }}
      >
        <XCircle size={12} />
      </button>
    </div>
  );
}

// ─── Day Row ──────────────────────────────────────────────────────────────────
function DayRow({ dayKey, schedule, onChange, slotDur, buffer }: {
  dayKey: DayKey;
  schedule: DaySchedule;
  onChange: (updated: DaySchedule) => void;
  slotDur: number;
  buffer: number;
}) {
  const label = DAYS.find(d => d.key === dayKey)!.label;
  const slots = calcSlots(schedule, slotDur, buffer);

  const addBreak = () => {
    const newBreak: BreakSlot = { id: `b${Date.now()}`, start: "13:00", end: "14:00" };
    onChange({ ...schedule, breaks: [...schedule.breaks, newBreak] });
  };

  const removeBreak = (id: string) => {
    onChange({ ...schedule, breaks: schedule.breaks.filter(b => b.id !== id) });
  };

  const updateBreak = (id: string, updated: BreakSlot) => {
    onChange({ ...schedule, breaks: schedule.breaks.map(b => b.id === id ? updated : b) });
  };

  return (
    <div style={{
      borderRadius: 12,
      border: "1px solid var(--border)",
      borderLeft: schedule.active ? "4px solid var(--gold)" : "4px solid transparent",
      background: "var(--bg-card)",
      opacity: schedule.active ? 1 : 0.42,
      transition: "opacity 0.25s ease, border-color 0.25s ease",
      overflow: "hidden",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px" }}>
        {/* Toggle + day name */}
        <Toggle
          checked={schedule.active}
          onChange={active => onChange({ ...schedule, active })}
          size="sm"
        />
        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", minWidth: 92 }}>{label}</span>

        {/* Times */}
        {schedule.active && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
              <span style={{ fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap" }}>Opens</span>
              <Select
                value={schedule.start}
                onChange={v => onChange({ ...schedule, start: v })}
                options={TIME_OPTIONS.map(t => ({ value: t, label: formatDisplay(t) }))}
                small
              />
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>–</span>
              <span style={{ fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap" }}>Closes</span>
              <Select
                value={schedule.end}
                onChange={v => onChange({ ...schedule, end: v })}
                options={TIME_OPTIONS.map(t => ({ value: t, label: formatDisplay(t) }))}
                small
              />
            </div>

            {/* Slot count */}
            <span style={{
              fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap",
              background: "var(--bg-elevated)", borderRadius: 6, padding: "3px 8px",
            }}>
              ~{slots} slots
            </span>

            {/* Add break */}
            <button
              onClick={addBreak}
              style={{
                display: "flex", alignItems: "center", gap: 4,
                fontSize: 11, fontWeight: 500, color: "var(--text-secondary)",
                background: "var(--bg-elevated)", border: "1px solid var(--border)",
                borderRadius: 7, padding: "5px 10px", cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              <Plus size={11} />
              Break
            </button>
          </>
        )}

        {!schedule.active && (
          <span style={{ fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>Day off</span>
        )}
      </div>

      {/* Breaks */}
      {schedule.active && schedule.breaks.length > 0 && (
        <div style={{ paddingBottom: 8, borderTop: "1px solid var(--border)" }}>
          {schedule.breaks.map(brk => (
            <BreakRow
              key={brk.id}
              brk={brk}
              onRemove={() => removeBreak(brk.id)}
              onChange={updated => updateBreak(brk.id, updated)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Weekly Schedule Builder ──────────────────────────────────────────────────
function WeeklyScheduleBuilder({ schedule, onChange, slotDur, buffer }: {
  schedule: Record<DayKey, DaySchedule>;
  onChange: (s: Record<DayKey, DaySchedule>) => void;
  slotDur: number;
  buffer: number;
}) {
  const applyPreset = (preset: "weekdays" | "mon-sat" | "all") => {
    const active = new Set<DayKey>(
      preset === "weekdays" ? ["monday","tuesday","wednesday","thursday","friday"] :
      preset === "mon-sat"  ? ["monday","tuesday","wednesday","thursday","friday","saturday"] :
      DAYS.map(d => d.key)
    );
    const updated = { ...schedule };
    DAYS.forEach(({ key }) => {
      updated[key] = { ...updated[key], active: active.has(key), start: "09:00", end: "18:00" };
    });
    onChange(updated);
  };

  const updateDay = (key: DayKey, day: DaySchedule) => {
    onChange({ ...schedule, [key]: day });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header + presets */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>Weekly Availability</h2>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Set your working hours for each day of the week</p>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[
            { label: "Mon – Fri", preset: "weekdays" as const },
            { label: "Mon – Sat", preset: "mon-sat" as const },
            { label: "All 7 Days", preset: "all" as const },
          ].map(({ label, preset }) => (
            <button
              key={preset}
              onClick={() => applyPreset(preset)}
              style={{
                fontSize: 11, fontWeight: 600, padding: "5px 12px", borderRadius: 999,
                border: "1px solid var(--border)",
                background: "var(--bg-elevated)", color: "var(--text-secondary)",
                cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--gold)";
                (e.currentTarget as HTMLElement).style.color = "var(--gold)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Day rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {DAYS.map(({ key }) => (
          <DayRow
            key={key}
            dayKey={key}
            schedule={schedule[key]}
            onChange={day => updateDay(key, day)}
            slotDur={slotDur}
            buffer={buffer}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Slot Settings ────────────────────────────────────────────────────────────
function SlotSettings({ settings, onChange, schedule }: {
  settings: { slotDuration: number; bufferTime: number; advanceLimit: number };
  onChange: (s: typeof settings) => void;
  schedule: Record<DayKey, DaySchedule>;
}) {
  const monday = schedule.monday;
  const approxSlots = calcSlots(monday, settings.slotDuration, settings.bufferTime);

  return (
    <div className="card" style={{ padding: 20 }}>
      <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>Appointment Slot Settings</h2>
      <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 20 }}>Configure how your calendar is divided</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 20 }}>
        {/* Slot length */}
        <div style={{ background: "var(--bg-elevated)", borderRadius: 10, padding: "14px 16px" }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Slot Length</p>
          <select
            value={settings.slotDuration}
            onChange={e => onChange({ ...settings, slotDuration: Number(e.target.value) })}
            style={{
              width: "100%", background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: 8, color: "var(--text-primary)", fontSize: 13, fontWeight: 600,
              padding: "8px 12px", cursor: "pointer", outline: "none",
            }}
          >
            {SLOT_DURATION_OPTIONS.map(v => (
              <option key={v} value={v}>{v} min</option>
            ))}
          </select>
        </div>

        {/* Buffer */}
        <div style={{ background: "var(--bg-elevated)", borderRadius: 10, padding: "14px 16px" }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Buffer Between</p>
          <select
            value={settings.bufferTime}
            onChange={e => onChange({ ...settings, bufferTime: Number(e.target.value) })}
            style={{
              width: "100%", background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: 8, color: "var(--text-primary)", fontSize: 13, fontWeight: 600,
              padding: "8px 12px", cursor: "pointer", outline: "none",
            }}
          >
            {BUFFER_OPTIONS.map(v => (
              <option key={v} value={v}>{v === 0 ? "No buffer" : `${v} min`}</option>
            ))}
          </select>
        </div>

        {/* Advance limit */}
        <div style={{ background: "var(--bg-elevated)", borderRadius: 10, padding: "14px 16px" }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Advance Booking</p>
          <select
            value={settings.advanceLimit}
            onChange={e => onChange({ ...settings, advanceLimit: Number(e.target.value) })}
            style={{
              width: "100%", background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: 8, color: "var(--text-primary)", fontSize: 13, fontWeight: 600,
              padding: "8px 12px", cursor: "pointer", outline: "none",
            }}
          >
            {ADVANCE_LIMIT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Info row */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        background: "var(--gold-subtle)", border: "1px solid var(--border-gold)",
        borderRadius: 10, padding: "10px 14px",
      }}>
        <Info size={14} style={{ color: "var(--gold)", flexShrink: 0 }} />
        <p style={{ fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.5 }}>
          Based on your settings, you can take approximately{" "}
          <strong style={{ color: "var(--text-primary)" }}>{approxSlots} appointments per day</strong>
          {" "}on a standard working day (Mon: {monday.active ? `${formatDisplay(monday.start)} – ${formatDisplay(monday.end)}` : "Day off"}).
        </p>
      </div>
    </div>
  );
}

// ─── Date Overrides ───────────────────────────────────────────────────────────
function DateOverrides() {
  type Override = { id: number; date: string; type: OverrideType; customStart: string | null; customEnd: string | null; reason: string };
  const [overrides, setOverrides] = useState<Override[]>(mockDateOverrides as Override[]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: "", type: "dayoff" as OverrideType, customStart: "09:00", customEnd: "17:00", reason: "" });
  const toast = useToast();

  const addOverride = () => {
    if (!form.date) return;
    const newOverride: Override = {
      id: Date.now(),
      date: form.date,
      type: form.type,
      customStart: form.type === "custom-hours" ? form.customStart : null,
      customEnd:   form.type === "custom-hours" ? form.customEnd   : null,
      reason: form.reason,
    };
    setOverrides(prev => [...prev, newOverride].sort((a, b) => a.date < b.date ? -1 : 1));
    setForm({ date: "", type: "dayoff", customStart: "09:00", customEnd: "17:00", reason: "" });
    setShowForm(false);
    toast.success("Date override added");
  };

  const remove = (id: number) => {
    setOverrides(prev => prev.filter(o => o.id !== id));
    toast.success("Override removed");
  };

  const formatDateLabel = (d: string) => {
    return new Date(d + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", weekday: "short" });
  };

  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>Date Overrides</h2>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Block specific dates or set custom hours</p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            fontSize: 12, fontWeight: 600, padding: "7px 12px",
            borderRadius: 8, border: "1px solid var(--border-gold)",
            background: "var(--gold-subtle)", color: "var(--gold)", cursor: "pointer",
          }}
        >
          <Plus size={12} />
          Add Override
        </button>
      </div>

      {/* Inline add form */}
      {showForm && (
        <div style={{
          background: "var(--bg-elevated)", borderRadius: 10, padding: 14,
          border: "1px solid var(--border)", marginBottom: 14,
          animation: "fadeInDown 0.18s ease",
        }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
            <input
              type="date"
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              style={{
                background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8,
                color: "var(--text-primary)", fontSize: 13, padding: "7px 10px", outline: "none",
              }}
            />
            <div style={{ display: "flex", gap: 6 }}>
              {(["dayoff", "custom-hours"] as OverrideType[]).map(t => (
                <button
                  key={t}
                  onClick={() => setForm(f => ({ ...f, type: t }))}
                  style={{
                    fontSize: 12, fontWeight: 600, padding: "7px 12px", borderRadius: 8, cursor: "pointer",
                    border: `1px solid ${form.type === t ? "var(--gold)" : "var(--border)"}`,
                    background: form.type === t ? "var(--gold-subtle)" : "transparent",
                    color: form.type === t ? "var(--gold)" : "var(--text-secondary)",
                  }}
                >
                  {t === "dayoff" ? "Day Off" : "Custom Hours"}
                </button>
              ))}
            </div>
            {form.type === "custom-hours" && (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <select
                  value={form.customStart}
                  onChange={e => setForm(f => ({ ...f, customStart: e.target.value }))}
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text-primary)", fontSize: 12, padding: "7px 10px", outline: "none" }}
                >
                  {TIME_OPTIONS.map(t => <option key={t} value={t}>{formatDisplay(t)}</option>)}
                </select>
                <span style={{ color: "var(--text-muted)", fontSize: 11 }}>to</span>
                <select
                  value={form.customEnd}
                  onChange={e => setForm(f => ({ ...f, customEnd: e.target.value }))}
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text-primary)", fontSize: 12, padding: "7px 10px", outline: "none" }}
                >
                  {TIME_OPTIONS.map(t => <option key={t} value={t}>{formatDisplay(t)}</option>)}
                </select>
              </div>
            )}
            <input
              type="text"
              placeholder="Reason (optional)"
              value={form.reason}
              onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
              style={{
                background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8,
                color: "var(--text-primary)", fontSize: 13, padding: "7px 10px", outline: "none", flex: 1, minWidth: 160,
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={addOverride}
              style={{
                fontSize: 12, fontWeight: 600, padding: "7px 16px", borderRadius: 8, cursor: "pointer",
                background: "var(--gold)", color: "#0A0800", border: "none",
              }}
            >
              Add
            </button>
            <button
              onClick={() => setShowForm(false)}
              style={{
                fontSize: 12, fontWeight: 500, padding: "7px 12px", borderRadius: 8, cursor: "pointer",
                background: "var(--bg-card)", color: "var(--text-secondary)", border: "1px solid var(--border)",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {overrides.length === 0 && (
          <p style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center", padding: "20px 0", fontStyle: "italic" }}>
            No date overrides yet
          </p>
        )}
        {overrides.map(o => (
          <div key={o.id} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
            background: "var(--bg-elevated)", borderRadius: 10, border: "1px solid var(--border)",
          }}>
            <CalendarDays size={15} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{formatDateLabel(o.date)}</p>
              {o.reason && <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{o.reason}</p>}
            </div>
            {o.type === "custom-hours" ? (
              <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: "rgba(59,130,246,0.12)", color: "#3B82F6", flexShrink: 0 }}>
                {formatDisplay(o.customStart!)} – {formatDisplay(o.customEnd!)}
              </span>
            ) : (
              <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: "var(--error-bg)", color: "var(--error)", flexShrink: 0 }}>
                Day Off
              </span>
            )}
            <button
              onClick={() => remove(o.id)}
              style={{
                width: 28, height: 28, borderRadius: 8, border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "transparent", color: "var(--text-muted)",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = "var(--error-bg)";
                (e.currentTarget as HTMLElement).style.color = "var(--error)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
              }}
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Availability Preview ─────────────────────────────────────────────────────
function AvailabilityPreview({ schedule, slotDur, buffer }: {
  schedule: Record<DayKey, DaySchedule>;
  slotDur: number;
  buffer: number;
}) {
  // Week starting Monday Apr 13
  const weekDates = [
    { key: "monday" as DayKey,    label: "Mon", date: "Apr 14" },
    { key: "tuesday" as DayKey,   label: "Tue", date: "Apr 15" },
    { key: "wednesday" as DayKey, label: "Wed", date: "Apr 16" },
    { key: "thursday" as DayKey,  label: "Thu", date: "Apr 17" },
    { key: "friday" as DayKey,    label: "Fri", date: "Apr 18" },
    { key: "saturday" as DayKey,  label: "Sat", date: "Apr 19" },
    { key: "sunday" as DayKey,    label: "Sun", date: "Apr 20" },
  ];

  return (
    <div className="card" style={{ padding: 20 }}>
      <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>This Week's Preview</h2>
      <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>Live view of your availability</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {weekDates.map(({ key, label, date }) => {
          const day = schedule[key];
          const slots = calcSlots(day, slotDur, buffer);
          const totalMins = day.active ? timeToMins(day.end) - timeToMins(day.start) : 0;

          return (
            <div key={key} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 12px", borderRadius: 10, background: "var(--bg-elevated)",
            }}>
              <div style={{ width: 36, flexShrink: 0 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-primary)" }}>{label}</p>
                <p style={{ fontSize: 10, color: "var(--text-muted)" }}>{date}</p>
              </div>

              {day.active ? (
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>
                      {formatDisplay(day.start)} – {formatDisplay(day.end)}
                    </span>
                    <span style={{ fontSize: 10, color: "#22C55E", fontWeight: 600 }}>{slots} slots</span>
                  </div>
                  {/* Bar */}
                  <div style={{ height: 6, borderRadius: 3, background: "var(--bg-card)", position: "relative", overflow: "hidden" }}>
                    {/* Working bar */}
                    <div style={{
                      position: "absolute",
                      left: `${((timeToMins(day.start) - 6*60) / (17*60)) * 100}%`,
                      width: `${(totalMins / (17*60)) * 100}%`,
                      top: 0, bottom: 0,
                      background: "#22C55E",
                      borderRadius: 3,
                    }} />
                    {/* Break gaps */}
                    {day.breaks.map(brk => {
                      const bStart = timeToMins(brk.start);
                      const bEnd   = timeToMins(brk.end);
                      return (
                        <div key={brk.id} style={{
                          position: "absolute",
                          left: `${((bStart - 6*60) / (17*60)) * 100}%`,
                          width: `${((bEnd - bStart) / (17*60)) * 100}%`,
                          top: 0, bottom: 0,
                          background: "var(--bg-elevated)",
                        }} />
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", fontStyle: "italic" }}>Unavailable</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Schedule Tab ─────────────────────────────────────────────────────────────
function ScheduleTab() {
  const toast = useToast();
  const [schedule, setSchedule] = useState({ ...mockAdminSchedule });
  const [settings, setSettings] = useState({ ...mockSlotSettings });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1200));
    setSaving(false);
    setSaved(true);
    toast.success("Schedule saved successfully");
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }} className="lg:grid-cols-[1fr_320px] grid-cols-1">
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="card" style={{ padding: 20 }}>
            <WeeklyScheduleBuilder
              schedule={schedule}
              onChange={setSchedule}
              slotDur={settings.slotDuration}
              buffer={settings.bufferTime}
            />
          </div>
          <SlotSettings schedule={schedule} settings={settings} onChange={setSettings} />
          <DateOverrides />

          {/* Save button */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "11px 28px", borderRadius: 10, border: "none", cursor: saving ? "wait" : "pointer",
                background: saved ? "var(--success)" : "var(--gold)",
                color: saved ? "#fff" : "#0A0800",
                fontSize: 14, fontWeight: 700,
                transition: "all 0.3s ease",
                minWidth: 160, justifyContent: "center",
              }}
            >
              {saving ? (
                <>
                  <div style={{ width: 14, height: 14, border: "2px solid rgba(0,0,0,0.3)", borderTopColor: "#0A0800", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  Saving…
                </>
              ) : saved ? (
                <><Check size={15} /> Saved</>
              ) : (
                "Save Schedule"
              )}
            </button>
          </div>
        </div>

        {/* Preview panel */}
        <div style={{ position: "sticky", top: 20 }}>
          <AvailabilityPreview schedule={schedule} slotDur={settings.slotDuration} buffer={settings.bufferTime} />
        </div>
      </div>
    </div>
  );
}

// ─── Date Strip ───────────────────────────────────────────────────────────────
function DateStrip({ dates, selectedDate, onSelect }: {
  dates: DateAvail[];
  selectedDate: string;
  onSelect: (date: string) => void;
}) {
  const [offset, setOffset] = useState(0);
  const visible = dates.slice(offset, offset + 7);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <button
        onClick={() => setOffset(o => Math.max(0, o - 7))}
        disabled={offset === 0}
        style={{
          width: 30, height: 30, borderRadius: 8, border: "1px solid var(--border)",
          background: "var(--bg-elevated)", display: "flex", alignItems: "center", justifyContent: "center",
          cursor: offset === 0 ? "not-allowed" : "pointer", opacity: offset === 0 ? 0.4 : 1, flexShrink: 0,
        }}
      >
        <ChevronLeft size={14} style={{ color: "var(--text-secondary)" }} />
      </button>

      <div style={{ display: "flex", gap: 5, flex: 1, overflowX: "auto" }}>
        {visible.map(d => {
          const isSelected = d.date === selectedDate;
          const dot = dotColor(d.status);
          const isOff = d.status === "off" || d.status === "holiday";
          const dateNum = new Date(d.date + "T00:00:00").getDate();

          return (
            <button
              key={d.date}
              onClick={() => onSelect(d.date)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                padding: "8px 10px", minWidth: 54, borderRadius: 10, cursor: "pointer",
                border: `1px solid ${isSelected ? "var(--gold)" : "var(--border)"}`,
                background: isSelected ? "var(--gold-subtle)" : "var(--bg-elevated)",
                transition: "all 0.15s",
                opacity: isOff ? 0.5 : 1,
              }}
            >
              <span style={{ fontSize: 18, fontWeight: 800, lineHeight: 1, color: isSelected ? "var(--gold)" : isOff ? "var(--text-muted)" : "var(--text-primary)" }}>
                {dateNum}
              </span>
              <span style={{ fontSize: 10, fontWeight: 600, color: isSelected ? "var(--gold)" : "var(--text-muted)", textTransform: "uppercase" }}>
                {d.day}
              </span>
              {dot ? (
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: dot }} />
              ) : (
                <div style={{ width: 6, height: 6 }} />
              )}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => setOffset(o => Math.min(dates.length - 7, o + 7))}
        disabled={offset + 7 >= dates.length}
        style={{
          width: 30, height: 30, borderRadius: 8, border: "1px solid var(--border)",
          background: "var(--bg-elevated)", display: "flex", alignItems: "center", justifyContent: "center",
          cursor: offset + 7 >= dates.length ? "not-allowed" : "pointer",
          opacity: offset + 7 >= dates.length ? 0.4 : 1, flexShrink: 0,
        }}
      >
        <ChevronRight size={14} style={{ color: "var(--text-secondary)" }} />
      </button>
    </div>
  );
}

// ─── Day Summary Bar ──────────────────────────────────────────────────────────
function DaySummaryBar({ date, slots }: { date: string; slots: Slot[] }) {
  const total    = slots.filter(s => s.type !== "break").length;
  const booked   = slots.filter(s => s.type === "booked").length;
  const available= slots.filter(s => s.type === "available").length;
  const breaks   = slots.filter(s => s.type === "break").length;
  const dateLabel = new Date(date + "T00:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
      padding: "10px 16px", borderRadius: 10, background: "var(--bg-elevated)",
      border: "1px solid var(--border)",
    }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", flex: 1 }}>{dateLabel}</span>
      <div style={{ display: "flex", gap: 16 }}>
        {[
          { label: "Total",     value: total,     color: "var(--text-muted)" },
          { label: "Booked",    value: booked,    color: "var(--gold)" },
          { label: "Available", value: available, color: "#22C55E" },
          { label: "Breaks",    value: breaks,    color: "var(--text-muted)" },
        ].map(s => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: s.color }}>{s.value}</span>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Slot Card ────────────────────────────────────────────────────────────────
function SlotCard({ slot, onClick, blocked }: { slot: Slot; onClick?: () => void; blocked?: boolean }) {
  if (slot.type === "break") {
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
        borderRadius: 12, borderLeft: "4px solid #444",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid var(--border)",
      }}>
        <Coffee size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
        <span style={{ fontSize: 15, fontWeight: 800, color: "var(--text-muted)", minWidth: 100 }}>
          {slot.time} – {slot.end}
        </span>
        <span style={{ fontSize: 13, color: "var(--text-muted)", fontStyle: "italic" }}>
          {slot.service ?? "Break"}
        </span>
      </div>
    );
  }

  if (slot.type === "available") {
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: 12, padding: "11px 16px",
        borderRadius: 12,
        borderLeft: blocked ? "4px solid #555" : "4px dashed #22C55E",
        background: blocked ? "rgba(255,255,255,0.01)" : "rgba(34,197,94,0.04)",
        border: `1px solid ${blocked ? "var(--border)" : "rgba(34,197,94,0.2)"}`,
        opacity: blocked ? 0.5 : 1,
      }}>
        <span style={{ fontSize: 15, fontWeight: 800, color: "var(--text-muted)", minWidth: 100 }}>
          {slot.time} – {slot.end}
        </span>
        <span style={{ fontSize: 13, color: blocked ? "var(--text-muted)" : "#22C55E", fontWeight: 600, flex: 1 }}>
          {blocked ? "Blocked" : "Available"}
        </span>
        {!blocked && (
          <button style={{
            fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 7, cursor: "pointer",
            border: "1px solid var(--border-gold)", background: "var(--gold-subtle)", color: "var(--gold)",
          }}>
            + Book Now
          </button>
        )}
      </div>
    );
  }

  // Booked
  const cfg = statusConfig(slot.status as SlotStatus);
  const isInProgress = slot.status === "in-progress";

  return (
    <div
      onClick={onClick}
      style={{
        display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 16px",
        borderRadius: 12, cursor: "pointer",
        borderLeft: `4px solid ${cfg.border}`,
        background: cfg.bg,
        border: `1px solid var(--border)`,
        transition: "transform 0.1s, box-shadow 0.1s",
        opacity: slot.status === "completed" ? 0.65 : 1,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {/* Time */}
      <div style={{ flexShrink: 0, minWidth: 100 }}>
        <p style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)" }}>{slot.time}</p>
        <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{slot.end}</p>
      </div>

      {/* Client avatar */}
      <div style={{
        width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
        background: "var(--gold-subtle)", border: "1px solid var(--border-gold)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, fontWeight: 800, color: "var(--gold)",
      }}>
        {slot.client ? initials(slot.client) : "?"}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {slot.client}
          </p>
          {isInProgress && (
            <span style={{
              width: 8, height: 8, borderRadius: "50%", background: "#3B82F6", flexShrink: 0,
              animation: "pulse 1.4s ease-in-out infinite",
            }} />
          )}
        </div>
        <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 4 }}>{slot.service}</p>
        {slot.addons && slot.addons.length > 0 && (
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {slot.addons.map((a, i) => (
              <span key={i} style={{
                fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 5,
                background: "var(--bg-elevated)", color: "var(--text-muted)", border: "1px solid var(--border)",
              }}>
                {a}
              </span>
            ))}
          </div>
        )}
        {slot.notes && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
            <FileText size={11} style={{ color: "var(--text-muted)" }} />
            <span style={{ fontSize: 11, color: "var(--text-muted)", fontStyle: "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {slot.notes}
            </span>
          </div>
        )}
      </div>

      {/* Right side */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
        <span style={{ fontSize: 16, fontWeight: 900, color: "var(--gold)" }}>£{slot.amount}</span>
        <span className={`badge ${cfg.badge}`} style={{ fontSize: 10 }}>{cfg.label}</span>
        <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{slot.phone}</span>
      </div>
    </div>
  );
}

// ─── Booking Slide-Over ───────────────────────────────────────────────────────
function BookingSlideOver({ slot, open, onClose }: { slot: Slot | null; open: boolean; onClose: () => void }) {
  const toast = useToast();
  const [adminNote, setAdminNote] = useState("");
  const [status, setStatus] = useState<SlotStatus>(slot?.status as SlotStatus ?? null);

  const handleStatusChange = (newStatus: SlotStatus) => {
    setStatus(newStatus);
    toast.success(`Status updated to ${newStatus}`);
  };

  if (!slot || slot.type !== "booked") return null;
  const cfg = statusConfig(status);

  return (
    <SlideOver open={open} onClose={onClose} title="Booking Details" width={500}>
      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Client header */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%", flexShrink: 0,
            background: "var(--gold-subtle)", border: "2px solid var(--border-gold)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, fontWeight: 900, color: "var(--gold)",
          }}>
            {slot.client ? initials(slot.client) : "?"}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <p style={{ fontSize: 17, fontWeight: 800, color: "var(--text-primary)" }}>{slot.client}</p>
              {slot.isVip && (
                <span style={{
                  display: "flex", alignItems: "center", gap: 3,
                  fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 5,
                  background: "var(--gold-subtle)", color: "var(--gold)", border: "1px solid var(--border-gold)",
                }}>
                  <Star size={9} fill="var(--gold)" />VIP
                </span>
              )}
            </div>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{slot.visits} visits with you</p>
            <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--text-secondary)" }}>
                <Phone size={11} />{slot.phone}
              </span>
              {slot.email && (
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--text-secondary)" }}>
                  <Mail size={11} />{slot.email}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Booking info */}
        <div style={{ background: "var(--bg-elevated)", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: 4 }}>Booking Info</p>
          {[
            { label: "Service",  value: slot.service ?? "—" },
            { label: "Add-ons",  value: slot.addons?.join(", ") || "None" },
            { label: "Barber",   value: "You" },
            { label: "Time",     value: `${slot.time} – ${slot.end}` },
            { label: "Via",      value: methodLabel(slot.method) },
            { label: "Ref",      value: slot.ref ?? "—", mono: true },
          ].map(row => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{row.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", fontFamily: row.mono ? "monospace" : undefined }}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* Payment */}
        <div style={{ background: "var(--bg-elevated)", borderRadius: 12, padding: 16 }}>
          <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: 12 }}>Payment</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <CreditCard size={14} style={{ color: "var(--text-muted)" }} />
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{paymentLabel(slot.payment as PaymentMethod)}</span>
            </div>
            <span style={{ fontSize: 20, fontWeight: 900, color: "var(--gold)" }}>£{slot.amount}</span>
          </div>
          <div style={{ marginTop: 8 }}>
            {slot.status === "completed" ? (
              <span className="badge badge-green" style={{ fontSize: 11 }}>Paid</span>
            ) : (
              <span className="badge badge-amber" style={{ fontSize: 11 }}>Pending</span>
            )}
          </div>
        </div>

        {/* Status */}
        <div style={{ background: "var(--bg-elevated)", borderRadius: 12, padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)" }}>Status</p>
            <span className={`badge ${cfg.badge}`}>{cfg.label}</span>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {(["in-progress", "completed", "pending"] as SlotStatus[]).map(s => s && (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                style={{
                  fontSize: 11, fontWeight: 600, padding: "6px 12px", borderRadius: 8, cursor: "pointer",
                  border: `1px solid ${status === s ? "var(--gold)" : "var(--border)"}`,
                  background: status === s ? "var(--gold-subtle)" : "var(--bg-card)",
                  color: status === s ? "var(--gold)" : "var(--text-secondary)",
                }}
              >
                {s === "in-progress" ? "In Progress" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
            <button
              onClick={() => handleStatusChange("completed")}
              style={{
                fontSize: 11, fontWeight: 600, padding: "6px 12px", borderRadius: 8, cursor: "pointer",
                border: "1px solid var(--success)", background: "var(--success-bg)", color: "var(--success)",
                display: "flex", alignItems: "center", gap: 4,
              }}
            >
              <CheckCircle2 size={11} /> Mark Complete
            </button>
          </div>
        </div>

        {/* Notes */}
        <div>
          <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: 8 }}>Notes</p>
          {slot.notes && (
            <div style={{ marginBottom: 8, padding: 10, background: "var(--bg-elevated)", borderRadius: 8, fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
              <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>Client: </span>{slot.notes}
            </div>
          )}
          <textarea
            placeholder="Add an admin note…"
            value={adminNote}
            onChange={e => setAdminNote(e.target.value)}
            onBlur={() => adminNote && toast.success("Note saved")}
            rows={3}
            style={{
              width: "100%", background: "var(--bg-elevated)", border: "1px solid var(--border)",
              borderRadius: 10, color: "var(--text-primary)", fontSize: 13, padding: "10px 12px",
              outline: "none", resize: "vertical", fontFamily: "inherit", lineHeight: 1.6,
              boxSizing: "border-box",
            }}
            onFocus={e => (e.target.style.borderColor = "var(--gold)")}
          />
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
          <button
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "10px 16px", borderRadius: 10, border: "1px solid var(--border)",
              background: "var(--bg-elevated)", color: "var(--text-secondary)", fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}
          >
            <RefreshCw size={13} /> Reschedule
          </button>
          <button
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "10px 16px", borderRadius: 10,
              border: "1px solid var(--error)", background: "var(--error-bg)",
              color: "var(--error)", fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}
            onClick={() => { toast.error("Booking cancelled"); onClose(); }}
          >
            <XCircle size={13} /> Cancel
          </button>
        </div>
      </div>
    </SlideOver>
  );
}

// ─── Quick Actions Toolbar ────────────────────────────────────────────────────
function QuickActionsToolbar({ onBlockAll, onAddWalkin }: { onBlockAll: () => void; onAddWalkin: () => void }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <button
        onClick={onBlockAll}
        style={{
          display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
          borderRadius: 8, border: "1px solid var(--border)",
          background: "var(--bg-elevated)", color: "var(--text-secondary)",
          fontSize: 12, fontWeight: 600, cursor: "pointer",
        }}
      >
        <Ban size={13} /> Block Remaining Slots
      </button>
      <button
        onClick={onAddWalkin}
        style={{
          display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
          borderRadius: 8, border: "1px solid var(--border-gold)",
          background: "var(--gold-subtle)", color: "var(--gold)",
          fontSize: 12, fontWeight: 600, cursor: "pointer",
        }}
      >
        <Zap size={13} /> Add Walk-in
      </button>
      <button
        style={{
          display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
          borderRadius: 8, border: "1px solid var(--border)",
          background: "var(--bg-elevated)", color: "var(--text-secondary)",
          fontSize: 12, fontWeight: 600, cursor: "pointer",
        }}
      >
        <Printer size={13} /> Export Day
      </button>
    </div>
  );
}

// ─── Slot View Tab ────────────────────────────────────────────────────────────
function SlotViewTab() {
  const toast = useToast();
  const [selectedDate, setSelectedDate] = useState("2026-04-13");
  const [slots, setSlots] = useState<Slot[]>(mockTodaySlots);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [blocked, setBlocked] = useState<Set<string>>(new Set());
  const [showConfirmBlock, setShowConfirmBlock] = useState(false);

  const selectedDateInfo = mockDateAvailability.find(d => d.date === selectedDate);
  const isOff = selectedDateInfo?.status === "off" || selectedDateInfo?.status === "holiday";

  const handleBlockAll = () => setShowConfirmBlock(true);
  const confirmBlock = () => {
    const now = "13:00"; // mock "current time"
    const toBlock = new Set<string>();
    slots.forEach(s => { if (s.type === "available" && s.time >= now) toBlock.add(s.time); });
    setBlocked(toBlock);
    setShowConfirmBlock(false);
    toast.success(`${toBlock.size} remaining slots blocked`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Date strip */}
      <div className="card" style={{ padding: 16 }}>
        <DateStrip
          dates={mockDateAvailability}
          selectedDate={selectedDate}
          onSelect={(d) => {
            setSelectedDate(d);
            setBlocked(new Set());
          }}
        />
      </div>

      {/* Day summary */}
      <DaySummaryBar date={selectedDate} slots={slots} />

      {/* Quick actions */}
      <QuickActionsToolbar
        onBlockAll={handleBlockAll}
        onAddWalkin={() => toast.success("Walk-in booking opened")}
      />

      {/* Slots */}
      {isOff ? (
        <div style={{
          textAlign: "center", padding: "40px 20px",
          background: "var(--bg-card)", borderRadius: 14, border: "1px solid var(--border)",
        }}>
          <p style={{ fontSize: 28, marginBottom: 12 }}>🏖</p>
          <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>You have this day off. No slots available.</p>
          <button style={{
            fontSize: 12, color: "var(--gold)", background: "none", border: "none", cursor: "pointer",
            textDecoration: "underline",
          }}>
            Override and add availability →
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {slots.map((slot, i) => (
            <SlotCard
              key={i}
              slot={slot}
              blocked={slot.type === "available" && blocked.has(slot.time)}
              onClick={slot.type === "booked" ? () => setSelectedSlot(slot) : undefined}
            />
          ))}
        </div>
      )}

      {/* Slide-over */}
      <BookingSlideOver
        slot={selectedSlot}
        open={!!selectedSlot}
        onClose={() => setSelectedSlot(null)}
      />

      {/* Confirm block dialog */}
      <ConfirmDialog
        open={showConfirmBlock}
        onClose={() => setShowConfirmBlock(false)}
        onConfirm={confirmBlock}
        title="Block Remaining Slots"
        message="This will mark all available slots from now until end of day as blocked. Clients won't be able to book these. Continue?"
        confirmLabel="Block Slots"
        variant="warning"
      />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SchedulePage() {
  const [activeTab, setActiveTab] = useState<"schedule" | "slots">("schedule");

  return (
    <DashboardShell role="admin">
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.85); }
        }
      `}</style>

      <PageHeader
        title="My Schedule"
        subtitle="Set your working hours and availability"
      />

      {/* Tab switcher */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "var(--bg-elevated)", borderRadius: 12, padding: 4, width: "fit-content" }}>
        {[
          { id: "schedule" as const, label: "My Schedule", icon: <CalendarDays size={14} /> },
          { id: "slots"    as const, label: "Slot View",   icon: <Clock size={14} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "8px 18px", borderRadius: 9, border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 600,
              background: activeTab === tab.id ? "var(--bg-card)" : "transparent",
              color: activeTab === tab.id ? "var(--gold)" : "var(--text-secondary)",
              boxShadow: activeTab === tab.id ? "var(--shadow-sm)" : "none",
              transition: "all 0.15s",
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "schedule" ? <ScheduleTab /> : <SlotViewTab />}
    </DashboardShell>
  );
}
