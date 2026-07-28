"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Scissors, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"admin" | "super-admin" | "barber">("admin");
  const [form, setForm] = useState({ email: "", password: "", remember: false });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    if (role === "super-admin") router.push("/super-admin");
    else if (role === "barber") router.push("/barber");
    else router.push("/admin");
  };

  const demoLogins = [
    { role: "admin" as const, label: "Shop Owner", email: "owner@theshop.com", color: "#6366F1" },
    { role: "barber" as const, label: "Barber", email: "james@theshop.com", color: "var(--success)" },
    { role: "super-admin" as const, label: "Super Admin", email: "superadmin@barberos.io", color: "var(--gold)" },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg-base)" }}>
      {/* Left: form */}
      <div className="flex-1 flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-10">
            <div className="w-10 h-10 rounded-[12px] flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)", boxShadow: "0 2px 12px var(--gold-glow)" }}>
              <Scissors size={17} color="#0A0800" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-[17px] font-bold" style={{ color: "var(--text-primary)" }}>BarberOS</div>
              <div className="text-[11px] font-medium" style={{ color: "var(--gold)" }}>Management Platform</div>
            </div>
          </div>

          <h1 className="text-[24px] font-bold mb-1" style={{ color: "var(--text-primary)" }}>Welcome back</h1>
          <p className="text-[14px] mb-8" style={{ color: "var(--text-muted)" }}>Sign in to your account</p>

          {/* Demo quick access */}
          <div className="p-4 rounded-[14px] mb-6" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
            <p className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>Quick demo access</p>
            <div className="flex gap-2">
              {demoLogins.map(d => {
                const active = role === d.role;
                return (
                  <button key={d.role} onClick={() => { setRole(d.role); setForm(f => ({ ...f, email: d.email, password: "demo123" })); }}
                    className="flex-1 py-1.5 px-2 rounded-[8px] text-[11.5px] font-medium transition-all"
                    style={{
                      background: active ? `${d.color}18` : "transparent",
                      color: active ? d.color : "var(--text-muted)",
                      border: active ? `1px solid ${d.color}50` : "1px solid transparent",
                    }}>
                    {d.label}
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Email address</label>
              <input type="email" className="input w-full" placeholder="you@example.com"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} className="input w-full pr-10" placeholder="••••••••"
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showPass ? <EyeOff size={15} style={{ color: "var(--text-muted)" }} /> : <Eye size={15} style={{ color: "var(--text-muted)" }} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" checked={form.remember}
                  onChange={e => setForm(f => ({ ...f, remember: e.target.checked }))} />
                <span className="text-[12.5px]" style={{ color: "var(--text-secondary)" }}>Remember me</span>
              </label>
              <Link href="#" className="text-[12.5px] font-medium" style={{ color: "var(--gold)" }}>Forgot password?</Link>
            </div>

            <button type="submit" disabled={loading}
              className="btn btn-primary w-full justify-center gap-2 py-2.5 text-[14px]"
              style={{ marginTop: 8 }}>
              {loading ? (
                <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <p className="text-center text-[13px] mt-6" style={{ color: "var(--text-muted)" }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium" style={{ color: "var(--gold)" }}>Start free trial</Link>
          </p>
        </div>
      </div>

      {/* Right: illustration panel */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #080C14 0%, #1a2040 100%)" }}>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full" style={{ background: "var(--gold)", filter: "blur(80px)" }} />
          <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full" style={{ background: "#6366F1", filter: "blur(60px)" }} />
        </div>
        <div className="relative z-10 max-w-sm text-center">
          <div className="w-16 h-16 rounded-[20px] mx-auto mb-8 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)", boxShadow: "0 8px 32px var(--gold-glow)" }}>
            <Scissors size={28} color="#0A0800" strokeWidth={2.5} />
          </div>
          <h2 className="text-[28px] font-bold mb-4 text-white">The platform for modern barbershops</h2>
          <p className="text-[15px] text-white/60 leading-relaxed mb-8">
            Bookings, POS, AI styling, analytics — everything your shop needs in one elegant platform.
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: "2,400+", label: "Barbershops" },
              { value: "£70M+", label: "Processed" },
              { value: "98%", label: "Satisfaction" },
            ].map(s => (
              <div key={s.label} className="p-3 rounded-[12px]" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div className="text-[18px] font-bold text-white">{s.value}</div>
                <div className="text-[11px] text-white/50 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
