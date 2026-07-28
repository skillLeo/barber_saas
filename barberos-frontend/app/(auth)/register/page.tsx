"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Scissors, ArrowRight, Check, Building2, User } from "lucide-react";

const steps = ["Account type", "Business details", "Personal info", "Review"];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"owner" | "barber" | "">("");
  const [form, setForm] = useState({
    businessName: "", country: "GB", city: "", email: "", phone: "",
    firstName: "", lastName: "", password: "", plan: "professional",
  });

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    router.push("/admin");
  };

  const countries = [
    { value: "GB", label: "🇬🇧 United Kingdom" },
    { value: "DE", label: "🇩🇪 Germany" },
    { value: "FR", label: "🇫🇷 France" },
    { value: "ES", label: "🇪🇸 Spain" },
    { value: "IT", label: "🇮🇹 Italy" },
    { value: "NL", label: "🇳🇱 Netherlands" },
    { value: "AE", label: "🇦🇪 UAE" },
    { value: "US", label: "🇺🇸 United States" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "var(--bg-base)" }}>
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)" }}>
              <Scissors size={16} style={{ color: "#0A0800" }} />
            </div>
            <span className="text-[16px] font-bold" style={{ color: "var(--text-primary)" }}>BarberOS</span>
          </Link>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-semibold flex-shrink-0"
                style={{
                  background: i < step ? "var(--success)" : i === step ? "var(--gold)" : "var(--bg-elevated)",
                  color: i < step ? "#fff" : i === step ? "#0A0800" : "var(--text-muted)",
                }}>
                {i < step ? <Check size={12} /> : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 h-0.5" style={{ background: i < step ? "var(--success)" : "var(--border)" }} />
              )}
            </div>
          ))}
        </div>

        <div className="card p-6 sm:p-8">

          {/* Step 0: Account type */}
          {step === 0 && (
            <div>
              <h2 className="text-xl font-bold mb-1.5" style={{ color: "var(--text-primary)" }}>Choose account type</h2>
              <p className="text-[13px] mb-6" style={{ color: "var(--text-muted)" }}>Are you registering as a shop owner or an individual barber?</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { value: "owner" as const, icon: Building2, title: "Shop Owner / Manager", desc: "Register your barbershop and manage your team, bookings, and revenue." },
                  { value: "barber" as const, icon: User, title: "Individual Barber", desc: "Join an existing shop or manage your own single-chair operation." },
                ].map((t) => {
                  const active = type === t.value;
                  return (
                    <button key={t.value} onClick={() => setType(t.value)}
                      className="p-5 rounded-xl text-left transition-all"
                      style={{
                        border: active ? "1px solid var(--border-gold)" : "1px solid var(--border)",
                        background: active ? "var(--gold-subtle)" : "var(--bg-base)",
                      }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                        style={{ background: active ? "var(--gold-subtle)" : "var(--bg-elevated)" }}>
                        <t.icon size={18} style={{ color: active ? "var(--gold)" : "var(--text-muted)" }} />
                      </div>
                      <div className="text-[14px] font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{t.title}</div>
                      <div className="text-[12px] leading-relaxed" style={{ color: "var(--text-muted)" }}>{t.desc}</div>
                    </button>
                  );
                })}
              </div>
              <button onClick={() => type && setStep(1)} disabled={!type}
                className="btn btn-primary w-full justify-center mt-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed">
                Continue <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* Step 1: Business details */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold mb-1.5" style={{ color: "var(--text-primary)" }}>Business details</h2>
              <p className="text-[13px] mb-6" style={{ color: "var(--text-muted)" }}>Tell us about your barbershop</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Business name *</label>
                  <input className="input w-full" placeholder="e.g. The Gentleman's Quarter" value={form.businessName} onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Country *</label>
                    <select className="input w-full" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))}>
                      {countries.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>City *</label>
                    <input className="input w-full" placeholder="e.g. London" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Business phone</label>
                  <input className="input w-full" placeholder="+44 7700 900000" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(0)} className="btn btn-ghost flex-1 justify-center py-2.5">Back</button>
                <button onClick={() => form.businessName && setStep(2)} disabled={!form.businessName}
                  className="btn btn-primary flex-1 justify-center py-2.5 disabled:opacity-50">
                  Continue <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Personal info */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold mb-1.5" style={{ color: "var(--text-primary)" }}>Personal information</h2>
              <p className="text-[13px] mb-6" style={{ color: "var(--text-muted)" }}>Your account credentials</p>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>First name *</label>
                    <input className="input w-full" placeholder="John" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Last name *</label>
                    <input className="input w-full" placeholder="Smith" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Email address *</label>
                  <input type="email" className="input w-full" placeholder="john@yourshop.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Password *</label>
                  <input type="password" className="input w-full" placeholder="Minimum 8 characters" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                  <div className="flex gap-2 mt-2">
                    {[
                      { label: "8+ chars", met: form.password.length >= 8 },
                      { label: "Uppercase", met: /[A-Z]/.test(form.password) },
                      { label: "Number", met: /[0-9]/.test(form.password) },
                    ].map((req) => (
                      <div key={req.label} className="flex items-center gap-1 text-[11px]"
                        style={{ color: req.met ? "var(--success)" : "var(--text-muted)" }}>
                        <span>{req.met ? "✓" : "○"}</span> {req.label}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-medium mb-2" style={{ color: "var(--text-muted)" }}>Choose plan</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "starter", label: "Starter", price: "£29/mo" },
                      { value: "professional", label: "Professional", price: "£79/mo" },
                      { value: "business", label: "Business", price: "£149/mo" },
                    ].map((p) => {
                      const active = form.plan === p.value;
                      return (
                        <button key={p.value} onClick={() => setForm(f => ({ ...f, plan: p.value }))}
                          className="p-2.5 rounded-xl text-center transition-all"
                          style={{
                            border: active ? "1px solid var(--border-gold)" : "1px solid var(--border)",
                            background: active ? "var(--gold-subtle)" : "transparent",
                          }}>
                          <div className="text-[12px] font-semibold" style={{ color: active ? "var(--gold)" : "var(--text-secondary)" }}>{p.label}</div>
                          <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{p.price}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="btn btn-ghost flex-1 justify-center py-2.5">Back</button>
                <button onClick={() => form.email && form.firstName && setStep(3)} disabled={!form.email || !form.firstName}
                  className="btn btn-primary flex-1 justify-center py-2.5 disabled:opacity-50">
                  Review <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold mb-1.5" style={{ color: "var(--text-primary)" }}>Review & confirm</h2>
              <p className="text-[13px] mb-6" style={{ color: "var(--text-muted)" }}>Check your details before starting your trial</p>
              <div className="rounded-xl p-4 space-y-3 mb-4"
                style={{ background: "var(--bg-base)", border: "1px solid var(--border)" }}>
                {[
                  { label: "Business", value: form.businessName },
                  { label: "Name", value: `${form.firstName} ${form.lastName}` },
                  { label: "Email", value: form.email },
                  { label: "Location", value: `${form.city}, ${form.country}` },
                  { label: "Plan", value: form.plan.charAt(0).toUpperCase() + form.plan.slice(1) + " (14-day free trial)" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-[13px]" style={{ color: "var(--text-muted)" }}>{label}</span>
                    <span className="text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>{value || "—"}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-xl p-3 mb-5" style={{ background: "var(--gold-subtle)", border: "1px solid var(--border-gold)" }}>
                <div className="flex items-start gap-2">
                  <Check size={14} style={{ color: "var(--gold)", marginTop: 2, flexShrink: 0 }} />
                  <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    Your 14-day free trial starts now. No credit card required. You can upgrade or cancel at any time.
                  </p>
                </div>
              </div>
              <label className="flex items-start gap-2.5 mb-4 cursor-pointer">
                <input type="checkbox" className="mt-0.5" required />
                <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                  I agree to the{" "}
                  <a href="#" style={{ color: "var(--gold)" }}>Terms of Service</a>{" "}
                  and{" "}
                  <a href="#" style={{ color: "var(--gold)" }}>Privacy Policy</a>
                </span>
              </label>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="btn btn-ghost flex-1 justify-center py-2.5">Back</button>
                <button onClick={handleSubmit} disabled={loading}
                  className="btn btn-primary flex-1 justify-center py-2.5 disabled:opacity-60">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Creating account...
                    </span>
                  ) : <>Start free trial <ArrowRight size={15} /></>}
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-[13px] mt-5" style={{ color: "var(--text-muted)" }}>
          Already have an account?{" "}
          <Link href="/login" className="font-medium transition-colors" style={{ color: "var(--gold)" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
