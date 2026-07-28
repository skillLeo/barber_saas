"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";
import { ColorPicker } from "@/components/ui/ColorPicker";
import {
  Scissors, Building2, Users, Calendar, Palette, CheckCircle2,
  ChevronRight, ChevronLeft, MapPin, Phone, Mail, Clock, Plus,
  X, Globe, Sparkles, ArrowRight, Check,
} from "lucide-react";

// ─── Steps ────────────────────────────────────────────────────────────────────
const STEPS = [
  { id: "shop",     label: "Shop Details",   icon: <Building2 size={18} />,  desc: "Tell us about your barbershop" },
  { id: "services", label: "Services",       icon: <Scissors size={18} />,   desc: "Add your core services" },
  { id: "staff",    label: "Your Team",      icon: <Users size={18} />,      desc: "Invite your barbers" },
  { id: "hours",    label: "Opening Hours",  icon: <Clock size={18} />,      desc: "Set your schedule" },
  { id: "branding", label: "Branding",       icon: <Palette size={18} />,    desc: "Customise your look" },
  { id: "done",     label: "You're Live!",   icon: <Sparkles size={18} />,   desc: "Confirm and launch" },
];

const DEFAULT_SERVICES = [
  { id: 1, name: "Classic Haircut", price: "25", duration: "30", enabled: true },
  { id: 2, name: "Skin Fade", price: "32", duration: "45", enabled: true },
  { id: 3, name: "Beard Trim", price: "18", duration: "20", enabled: true },
  { id: 4, name: "Hot Towel Shave", price: "28", duration: "30", enabled: false },
  { id: 5, name: "Full Groom Package", price: "55", duration: "75", enabled: false },
];

const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// ─── Sub-components ───────────────────────────────────────────────────────────
function StepIndicator({ steps, current }: { steps: typeof STEPS; current: number }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={s.id} className="flex items-center flex-1 last:flex-none">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all"
              style={{
                background: done ? "#10b981" : active ? "var(--gold)" : "var(--bg-elevated)",
                color: done || active ? (done ? "#fff" : "#0a0800") : "var(--text-muted)",
                boxShadow: active ? "0 0 0 4px var(--gold-subtle)" : "none",
              }}
            >
              {done ? <Check size={14} /> : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div
                className="h-0.5 flex-1 mx-1 transition-all"
                style={{ background: done ? "#10b981" : "var(--border)" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [completing, setCompleting] = useState(false);

  // Step 0 — shop details
  const [shop, setShop] = useState({
    name: "",
    tagline: "",
    address: "",
    city: "London",
    country: "GB",
    phone: "",
    email: "",
    website: "",
  });

  // Step 1 — services
  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [newServiceName, setNewServiceName] = useState("");

  // Step 2 — staff
  const [staff, setStaff] = useState([
    { id: 1, name: "", email: "", role: "barber" as "barber" | "receptionist" | "manager" },
  ]);

  // Step 3 — hours
  const [hours, setHours] = useState(
    WEEK_DAYS.map(day => ({
      day,
      open: !["Sunday"].includes(day),
      start: "09:00",
      end: "18:00",
    }))
  );

  // Step 4 — branding
  const [branding, setBranding] = useState({
    primaryColor: "#C9A84C",
    logoText: "",
    allowGuestBooking: true,
    requireDeposit: false,
    homeService: false,
  });

  function canAdvance() {
    if (step === 0) return shop.name.trim().length > 0 && shop.email.includes("@");
    if (step === 1) return services.some(s => s.enabled);
    return true;
  }

  async function handleFinish() {
    setCompleting(true);
    await new Promise(r => setTimeout(r, 1800));
    router.push("/admin");
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      {/* ── Top bar ───────────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-[10px] flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, var(--gold) 0%, #b8912b 100%)" }}
          >
            <Scissors size={15} color="#0A0800" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>BarberOS</span>
        </div>
        <div className="text-xs" style={{ color: "var(--text-muted)" }}>
          Step {step + 1} of {STEPS.length}
        </div>
        <button
          className="text-xs font-medium hover:underline"
          style={{ color: "var(--text-muted)" }}
          onClick={() => router.push("/admin")}
        >
          Skip setup →
        </button>
      </div>

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-4 py-10">
        <StepIndicator steps={STEPS} current={step} />

        {/* Step heading */}
        <div className="mb-6">
          <div className="flex items-center gap-2.5 mb-1">
            <span style={{ color: "var(--gold)" }}>{STEPS[step].icon}</span>
            <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{STEPS[step].label}</h1>
          </div>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>{STEPS[step].desc}</p>
        </div>

        {/* ── Step 0: Shop Details ───────────────────────────────────── */}
        {step === 0 && (
          <div className="card p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Input
                  label="Shop Name *"
                  placeholder="The Gentleman's Quarter"
                  value={shop.name}
                  onChange={e => setShop(s => ({ ...s, name: e.target.value }))}
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  label="Tagline"
                  placeholder="Premium barbershop experience"
                  value={shop.tagline}
                  onChange={e => setShop(s => ({ ...s, tagline: e.target.value }))}
                />
              </div>
              <Input
                label="Email *"
                type="email"
                icon={<Mail size={15} />}
                placeholder="info@yourshop.com"
                value={shop.email}
                onChange={e => setShop(s => ({ ...s, email: e.target.value }))}
              />
              <Input
                label="Phone"
                type="tel"
                icon={<Phone size={15} />}
                placeholder="+44 20 7946 0100"
                value={shop.phone}
                onChange={e => setShop(s => ({ ...s, phone: e.target.value }))}
              />
              <div className="sm:col-span-2">
                <Input
                  label="Address"
                  icon={<MapPin size={15} />}
                  placeholder="12 Barbers Row, Soho"
                  value={shop.address}
                  onChange={e => setShop(s => ({ ...s, address: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                  City
                </label>
                <input
                  className="input w-full"
                  value={shop.city}
                  onChange={e => setShop(s => ({ ...s, city: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                  Country
                </label>
                <select
                  className="input w-full"
                  value={shop.country}
                  onChange={e => setShop(s => ({ ...s, country: e.target.value }))}
                >
                  {[
                    { value: "GB", label: "🇬🇧 United Kingdom" },
                    { value: "DE", label: "🇩🇪 Germany" },
                    { value: "FR", label: "🇫🇷 France" },
                    { value: "ES", label: "🇪🇸 Spain" },
                    { value: "AE", label: "🇦🇪 UAE" },
                  ].map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <Input
                  label="Website (optional)"
                  icon={<Globe size={15} />}
                  placeholder="https://yourshop.com"
                  value={shop.website}
                  onChange={e => setShop(s => ({ ...s, website: e.target.value }))}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Step 1: Services ──────────────────────────────────────── */}
        {step === 1 && (
          <div className="card p-6">
            <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
              Toggle the services your shop offers. You can edit prices and add more later.
            </p>
            <div className="space-y-2 mb-4">
              {services.map(s => (
                <div
                  key={s.id}
                  className="flex items-center gap-3 p-3 rounded-xl transition-all"
                  style={{ background: s.enabled ? "var(--gold-subtle)" : "var(--bg-surface)" }}
                >
                  <Toggle
                    checked={s.enabled}
                    onChange={() => setServices(prev => prev.map(x => x.id === s.id ? { ...x, enabled: !x.enabled } : x))}
                    size="sm"
                  />
                  <p className="flex-1 font-medium text-sm" style={{ color: "var(--text-primary)" }}>{s.name}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>£</span>
                      <input
                        type="number"
                        value={s.price}
                        onChange={e => setServices(prev => prev.map(x => x.id === s.id ? { ...x, price: e.target.value } : x))}
                        className="input text-xs text-right"
                        style={{ width: 60 }}
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={s.duration}
                        onChange={e => setServices(prev => prev.map(x => x.id === s.id ? { ...x, duration: e.target.value } : x))}
                        className="input text-xs text-right"
                        style={{ width: 52 }}
                      />
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>min</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Add custom service */}
            <div className="flex gap-2">
              <input
                className="input flex-1 text-sm"
                placeholder="Add custom service..."
                value={newServiceName}
                onChange={e => setNewServiceName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && newServiceName.trim()) {
                    setServices(prev => [...prev, {
                      id: Date.now(), name: newServiceName.trim(), price: "25", duration: "30", enabled: true,
                    }]);
                    setNewServiceName("");
                  }
                }}
              />
              <Button
                size="sm"
                variant="secondary"
                icon={<Plus size={14} />}
                onClick={() => {
                  if (newServiceName.trim()) {
                    setServices(prev => [...prev, {
                      id: Date.now(), name: newServiceName.trim(), price: "25", duration: "30", enabled: true,
                    }]);
                    setNewServiceName("");
                  }
                }}
              >
                Add
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 2: Staff ─────────────────────────────────────────── */}
        {step === 2 && (
          <div className="card p-6">
            <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
              Invite your team. They'll receive an email to set their password and access their portal.
            </p>
            <div className="space-y-3 mb-4">
              {staff.map((m, i) => (
                <div key={m.id} className="flex items-center gap-2 p-3 rounded-xl" style={{ background: "var(--bg-surface)" }}>
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <input
                      className="input text-sm"
                      placeholder="Full name"
                      value={m.name}
                      onChange={e => setStaff(prev => prev.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
                    />
                    <input
                      className="input text-sm"
                      type="email"
                      placeholder="email@shop.com"
                      value={m.email}
                      onChange={e => setStaff(prev => prev.map((x, j) => j === i ? { ...x, email: e.target.value } : x))}
                    />
                  </div>
                  <select
                    className="input text-sm"
                    style={{ width: 120 }}
                    value={m.role}
                    onChange={e => setStaff(prev => prev.map((x, j) => j === i ? { ...x, role: e.target.value as "barber" | "receptionist" | "manager" } : x))}
                  >
                    <option value="barber">Barber</option>
                    <option value="manager">Manager</option>
                    <option value="receptionist">Receptionist</option>
                  </select>
                  {staff.length > 1 && (
                    <button
                      className="text-xs shrink-0"
                      style={{ color: "var(--error)" }}
                      onClick={() => setStaff(prev => prev.filter((_, j) => j !== i))}
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <Button
              size="sm"
              variant="secondary"
              icon={<Plus size={14} />}
              onClick={() => setStaff(prev => [...prev, { id: Date.now(), name: "", email: "", role: "barber" }])}
            >
              Add another
            </Button>
            <p className="text-xs mt-3" style={{ color: "var(--text-muted)" }}>
              You can skip this and invite staff from Settings later.
            </p>
          </div>
        )}

        {/* ── Step 3: Opening Hours ─────────────────────────────────── */}
        {step === 3 && (
          <div className="card p-6">
            <div className="space-y-3">
              {hours.map(h => (
                <div
                  key={h.day}
                  className="flex items-center gap-4 py-2.5 border-b last:border-0"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="w-28 shrink-0">
                    <Toggle
                      checked={h.open}
                      onChange={() => setHours(prev => prev.map(x => x.day === h.day ? { ...x, open: !x.open } : x))}
                      label={h.day.slice(0, 3)}
                      size="sm"
                    />
                  </div>
                  {h.open ? (
                    <div className="flex items-center gap-2 flex-wrap">
                      <input
                        type="time"
                        value={h.start}
                        onChange={e => setHours(prev => prev.map(x => x.day === h.day ? { ...x, start: e.target.value } : x))}
                        className="input text-sm"
                        style={{ width: 110 }}
                      />
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>to</span>
                      <input
                        type="time"
                        value={h.end}
                        onChange={e => setHours(prev => prev.map(x => x.day === h.day ? { ...x, end: e.target.value } : x))}
                        className="input text-sm"
                        style={{ width: 110 }}
                      />
                    </div>
                  ) : (
                    <span className="text-sm" style={{ color: "var(--text-muted)" }}>Closed</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 4: Branding ─────────────────────────────────────── */}
        {step === 4 && (
          <div className="card p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Accent Colour
              </label>
              <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
                This colour appears on your booking page and client-facing materials.
              </p>
              <ColorPicker
                value={branding.primaryColor}
                onChange={c => setBranding(b => ({ ...b, primaryColor: c }))}
              />
            </div>
            <div>
              <Input
                label="Shop slogan (optional)"
                placeholder="Precision cuts, premium experience"
                value={branding.logoText}
                onChange={e => setBranding(b => ({ ...b, logoText: e.target.value }))}
              />
            </div>
            <div className="space-y-3">
              {[
                { key: "allowGuestBooking" as const, label: "Allow guest bookings", desc: "Clients can book without an account" },
                { key: "requireDeposit" as const, label: "Require deposit to book", desc: "Charge 20% upfront (configurable)" },
                { key: "homeService" as const, label: "Offer home service", desc: "Barbers travel to clients" },
              ].map(opt => (
                <div key={opt.key} className="flex items-start justify-between gap-4 py-2 border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{opt.label}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{opt.desc}</p>
                  </div>
                  <Toggle
                    checked={branding[opt.key]}
                    onChange={() => setBranding(b => ({ ...b, [opt.key]: !b[opt.key] }))}
                    size="sm"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 5: Done ─────────────────────────────────────────── */}
        {step === 5 && (
          <div className="card p-8 text-center">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5"
              style={{ background: "linear-gradient(135deg, var(--gold) 0%, #b8912b 100%)", boxShadow: "0 8px 32px var(--gold-glow)" }}
            >
              <Sparkles size={36} color="#0A0800" />
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              {shop.name || "Your shop"} is ready!
            </h2>
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
              Your booking page is live and your team can start accepting appointments.
            </p>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-3 mb-6 text-left">
              {[
                { label: "Services", value: services.filter(s => s.enabled).length + " enabled", icon: <Scissors size={16} /> },
                { label: "Staff", value: staff.filter(m => m.name).length + " invited", icon: <Users size={16} /> },
                { label: "Hours", value: hours.filter(h => h.open).length + " days/week", icon: <Clock size={16} /> },
              ].map(s => (
                <div key={s.label} className="p-3 rounded-xl" style={{ background: "var(--bg-surface)" }}>
                  <span style={{ color: "var(--gold)" }}>{s.icon}</span>
                  <p className="font-semibold text-sm mt-1" style={{ color: "var(--text-primary)" }}>{s.value}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{s.label}</p>
                </div>
              ))}
            </div>

            <div
              className="p-4 rounded-xl mb-6 text-left"
              style={{ background: "var(--gold-subtle)", border: "1px solid var(--gold)" }}
            >
              <p className="text-xs font-semibold mb-1" style={{ color: "var(--gold)" }}>Your booking URL</p>
              <p className="text-sm font-mono font-medium" style={{ color: "var(--text-primary)" }}>
                {shop.name
                  ? `https://${shop.name.toLowerCase().replace(/\s+/g, "-")}.barberos.io`
                  : "https://your-shop.barberos.io"}
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              icon={<ArrowRight size={16} />}
              loading={completing}
              onClick={handleFinish}
            >
              Go to Dashboard
            </Button>
          </div>
        )}

        {/* ── Navigation ────────────────────────────────────────────── */}
        {step < STEPS.length - 1 && (
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="ghost"
              icon={<ChevronLeft size={16} />}
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
            >
              Back
            </Button>
            <Button
              variant="primary"
              iconRight={<ChevronRight size={16} />}
              onClick={() => setStep(s => s + 1)}
              disabled={!canAdvance()}
            >
              {step === STEPS.length - 2 ? "Review & Launch" : "Continue"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
