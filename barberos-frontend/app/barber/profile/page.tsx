"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";
import { Tabs } from "@/components/ui/Tabs";
import { ImageUpload } from "@/components/ui/ImageUpload";
import {
  Camera, Save, Star, Scissors, Clock, Award, Plus, X,
  Globe, Phone, Mail, MapPin, Calendar, Bell, Shield,
} from "lucide-react";
import { mockBarbers, mockSchedules, mockServices } from "@/lib/mock-data";

const ME = { ...mockBarbers[0] };

const TABS = [
  { id: "profile", label: "Profile" },
  { id: "schedule", label: "Schedule" },
  { id: "services", label: "Services" },
  { id: "notifications", label: "Notifications" },
];

const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const DEFAULT_SCHEDULE = WEEK_DAYS.map(day => ({
  day,
  open: !["Saturday", "Sunday"].includes(day) ? true : day === "Saturday",
  startTime: "09:00",
  endTime: "18:00",
}));

type DaySchedule = { day: string; open: boolean; startTime: string; endTime: string };

export default function BarberProfile() {
  const [tab, setTab] = useState("profile");
  const [saved, setSaved] = useState(false);

  // Profile state
  const [form, setForm] = useState({
    firstName: ME.name.split(" ")[0],
    lastName: ME.name.split(" ")[1] ?? "",
    email: ME.email,
    phone: ME.phone,
    bio: ME.bio,
  });
  const [specialties, setSpecialties] = useState<string[]>([...ME.specialties]);
  const [newSpecialty, setNewSpecialty] = useState("");
  const [languages, setLanguages] = useState<string[]>([...ME.languages]);
  const [newLang, setNewLang] = useState("");

  // Schedule state
  const [schedule, setSchedule] = useState<DaySchedule[]>(
    () => {
      const saved = mockSchedules[ME.id];
      if (!saved) return DEFAULT_SCHEDULE;
      return WEEK_DAYS.map(day => {
        const found = saved.find(s => s.day === day);
        return found ? { day, open: found.open, startTime: found.startTime, endTime: found.endTime } : { day, open: false, startTime: "09:00", endTime: "18:00" };
      });
    }
  );

  // Services state
  const [enabledServices, setEnabledServices] = useState<Set<number>>(
    new Set(mockServices.map(s => s.id))
  );

  // Notification state
  const [notifs, setNotifs] = useState({
    newBooking: true,
    cancellation: true,
    reminder1h: true,
    dailySummary: true,
    weeklySummary: false,
    smsEnabled: false,
    emailEnabled: true,
    pushEnabled: true,
  });

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function toggleDay(day: string) {
    setSchedule(s => s.map(d => d.day === day ? { ...d, open: !d.open } : d));
  }

  function setTime(day: string, field: "startTime" | "endTime", val: string) {
    setSchedule(s => s.map(d => d.day === day ? { ...d, [field]: val } : d));
  }

  return (
    <DashboardShell
      role="barber"
      title="My Profile"
      subtitle="Manage your personal details and preferences"
      action={
        <Button
          variant="primary"
          size="sm"
          icon={<Save size={14} />}
          onClick={handleSave}
        >
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      }
    >
      {/* ── Profile header ────────────────────────────────────────────── */}
      <div className="card p-5 mb-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative">
          <img
            src={ME.avatar}
            alt={ME.name}
            className="w-20 h-20 rounded-2xl object-cover"
          />
          <button
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: "var(--gold)", color: "#0a0a0a" }}
          >
            <Camera size={13} />
          </button>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{ME.name}</h2>
            <span className="badge badge-gold">Active</span>
          </div>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>{ME.specialty}</p>
          <div className="flex items-center gap-4 mt-2 flex-wrap">
            <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
              <Star size={12} style={{ color: "#f59e0b" }} />
              {ME.rating} rating
            </span>
            <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
              <Scissors size={12} style={{ color: "var(--gold)" }} />
              {ME.bookings} bookings
            </span>
            <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
              <Clock size={12} style={{ color: "var(--gold)" }} />
              {ME.nextAvailable}
            </span>
          </div>
        </div>
      </div>

      {/* ── Tabs ──────────────────────────────────────────────────────── */}
      <div className="mb-5">
        <Tabs tabs={TABS} active={tab} onChange={setTab} variant="underline" />
      </div>

      {/* ── Profile tab ───────────────────────────────────────────────── */}
      {tab === "profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-5 space-y-4">
            <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>Personal Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="First Name"
                value={form.firstName}
                onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
              />
              <Input
                label="Last Name"
                value={form.lastName}
                onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
              />
            </div>
            <Input
              label="Email"
              type="email"
              icon={<Mail size={15} />}
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
            <Input
              label="Phone"
              type="tel"
              icon={<Phone size={15} />}
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            />
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Bio
              </label>
              <textarea
                value={form.bio}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                rows={3}
                className="input w-full resize-none"
                placeholder="Tell clients about yourself..."
              />
            </div>
          </div>

          <div className="space-y-4">
            {/* Specialties */}
            <div className="card p-5">
              <h3 className="font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Specialties</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {specialties.map(s => (
                  <span
                    key={s}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{ background: "var(--gold-subtle)", color: "var(--gold)" }}
                  >
                    {s}
                    <button onClick={() => setSpecialties(prev => prev.filter(x => x !== s))}>
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={newSpecialty}
                  onChange={e => setNewSpecialty(e.target.value)}
                  placeholder="Add specialty..."
                  className="input flex-1 text-sm"
                  onKeyDown={e => {
                    if (e.key === "Enter" && newSpecialty.trim()) {
                      setSpecialties(s => [...s, newSpecialty.trim()]);
                      setNewSpecialty("");
                    }
                  }}
                />
                <Button
                  size="sm"
                  variant="secondary"
                  icon={<Plus size={14} />}
                  onClick={() => {
                    if (newSpecialty.trim()) {
                      setSpecialties(s => [...s, newSpecialty.trim()]);
                      setNewSpecialty("");
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            </div>

            {/* Languages */}
            <div className="card p-5">
              <h3 className="font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Languages Spoken</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {languages.map(l => (
                  <span
                    key={l}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{ background: "var(--bg-surface)", color: "var(--text-secondary)" }}
                  >
                    <Globe size={10} />
                    {l}
                    <button onClick={() => setLanguages(prev => prev.filter(x => x !== l))}>
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={newLang}
                  onChange={e => setNewLang(e.target.value)}
                  placeholder="Add language..."
                  className="input flex-1 text-sm"
                  onKeyDown={e => {
                    if (e.key === "Enter" && newLang.trim()) {
                      setLanguages(l => [...l, newLang.trim()]);
                      setNewLang("");
                    }
                  }}
                />
                <Button
                  size="sm"
                  variant="secondary"
                  icon={<Plus size={14} />}
                  onClick={() => {
                    if (newLang.trim()) {
                      setLanguages(l => [...l, newLang.trim()]);
                      setNewLang("");
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            </div>

            {/* Photo upload */}
            <div className="card p-5">
              <h3 className="font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Profile Photo</h3>
              <ImageUpload aspect="square" maxSizeMB={5} onChange={() => {}} />
            </div>
          </div>
        </div>
      )}

      {/* ── Schedule tab ──────────────────────────────────────────────── */}
      {tab === "schedule" && (
        <div className="card p-5">
          <h3 className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Weekly Availability</h3>
          <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>Set the days and hours you're available to take bookings.</p>
          <div className="space-y-3">
            {schedule.map(d => (
              <div
                key={d.day}
                className="flex items-center gap-4 py-3 border-b last:border-0"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="w-28 shrink-0">
                  <Toggle
                    checked={d.open}
                    onChange={() => toggleDay(d.day)}
                    label={d.day.slice(0, 3)}
                    size="sm"
                  />
                </div>
                {d.open ? (
                  <div className="flex items-center gap-2 flex-1 flex-wrap">
                    <input
                      type="time"
                      value={d.startTime}
                      onChange={e => setTime(d.day, "startTime", e.target.value)}
                      className="input text-sm"
                      style={{ width: 110 }}
                    />
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>to</span>
                    <input
                      type="time"
                      value={d.endTime}
                      onChange={e => setTime(d.day, "endTime", e.target.value)}
                      className="input text-sm"
                      style={{ width: 110 }}
                    />
                  </div>
                ) : (
                  <span className="text-sm" style={{ color: "var(--text-muted)" }}>Day off</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Services tab ──────────────────────────────────────────────── */}
      {tab === "services" && (
        <div className="card p-5">
          <h3 className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Services I Offer</h3>
          <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>Toggle which services appear on your booking profile.</p>
          <div className="space-y-2">
            {mockServices.map(s => (
              <div
                key={s.id}
                className="flex items-center gap-4 p-3 rounded-xl"
                style={{ background: enabledServices.has(s.id) ? "var(--gold-subtle)" : "var(--bg-surface)" }}
              >
                <Toggle
                  checked={enabledServices.has(s.id)}
                  onChange={() =>
                    setEnabledServices(prev => {
                      const next = new Set(prev);
                      if (next.has(s.id)) next.delete(s.id); else next.add(s.id);
                      return next;
                    })
                  }
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>{s.name}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{s.duration}min</p>
                </div>
                <span className="font-semibold text-sm shrink-0" style={{ color: "var(--gold)" }}>£{s.price}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Notifications tab ─────────────────────────────────────────── */}
      {tab === "notifications" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-5">
            <h3 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Booking Alerts</h3>
            <div className="space-y-4">
              {[
                { key: "newBooking", label: "New booking received", desc: "When a client books with you" },
                { key: "cancellation", label: "Booking cancelled", desc: "When a client cancels" },
                { key: "reminder1h", label: "1-hour reminder", desc: "Before upcoming appointment" },
                { key: "dailySummary", label: "Daily summary", desc: "End of day earnings summary" },
                { key: "weeklySummary", label: "Weekly report", desc: "Weekly performance report" },
              ].map(n => (
                <div key={n.key} className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{n.label}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{n.desc}</p>
                  </div>
                  <Toggle
                    checked={notifs[n.key as keyof typeof notifs]}
                    onChange={() => setNotifs(prev => ({ ...prev, [n.key]: !prev[n.key as keyof typeof notifs] }))}
                    size="sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Notification Channels</h3>
            <div className="space-y-4">
              {[
                { key: "emailEnabled", label: "Email notifications", icon: <Mail size={15} /> },
                { key: "smsEnabled", label: "SMS notifications", icon: <Phone size={15} /> },
                { key: "pushEnabled", label: "Push notifications", icon: <Bell size={15} /> },
              ].map(n => (
                <div key={n.key} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <span style={{ color: "var(--gold)" }}>{n.icon}</span>
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{n.label}</p>
                  </div>
                  <Toggle
                    checked={notifs[n.key as keyof typeof notifs]}
                    onChange={() => setNotifs(prev => ({ ...prev, [n.key]: !prev[n.key as keyof typeof notifs] }))}
                    size="sm"
                  />
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
              <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Security</h4>
              <div className="space-y-3">
                <Button variant="secondary" size="sm" fullWidth icon={<Shield size={14} />}>
                  Change Password
                </Button>
                <Button variant="secondary" size="sm" fullWidth icon={<Shield size={14} />}>
                  Enable Two-Factor Auth
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </DashboardShell>
  );
}
