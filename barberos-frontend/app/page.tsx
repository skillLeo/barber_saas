"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  Scissors, Calendar, CreditCard, BarChart3, MapPin, Palette,
  Brain, Star, CheckCircle2, ArrowRight, Zap, Shield,
  Globe2, TrendingUp, Menu, X, Users, Clock, ChevronDown,
} from "lucide-react";
import { mockTestimonials, mockFAQ } from "@/lib/mock-data";

// ── Always-dark palette ────────────────────────────────────────────────────
const C = {
  bg:           "#06080E",
  surface:      "#0C1019",
  card:         "#101520",
  elevated:     "#181F2E",
  border:       "rgba(255,255,255,0.06)",
  borderStrong: "rgba(255,255,255,0.11)",
  borderGold:   "rgba(212,175,55,0.28)",
  gold:         "#D4AF37",
  goldLight:    "#F0CC58",
  goldDark:     "#A88520",
  goldSubtle:   "rgba(212,175,55,0.11)",
  goldGlow:     "rgba(212,175,55,0.18)",
  text:         "#EEF0FF",
  text2:        "#7A8199",
  text3:        "#404560",
  success:      "#22C55E",
  info:         "#6366F1",
  warning:      "#F59E0B",
};

// ── 3-D tilt card ──────────────────────────────────────────────────────────
function TiltCard({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 });
  const [hov, setHov] = useState(false);

  return (
    <div
      ref={ref}
      onMouseMove={e => {
        const r = ref.current!.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        setT({ rx: (y - .5) * 18, ry: (x - .5) * -18, gx: x * 100, gy: y * 100 });
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setT({ rx: 0, ry: 0, gx: 50, gy: 50 }); setHov(false); }}
      style={{
        transform: `perspective(1000px) rotateX(${t.rx}deg) rotateY(${t.ry}deg)`,
        transition: hov ? "transform 0.1s ease" : "transform 0.7s ease",
        position: "relative", overflow: "hidden",
        ...style,
      }}
    >
      {hov && (
        <div style={{
          position: "absolute", inset: 0, borderRadius: "inherit", pointerEvents: "none", zIndex: 1,
          background: `radial-gradient(circle at ${t.gx}% ${t.gy}%, rgba(212,175,55,0.08) 0%, transparent 65%)`,
        }} />
      )}
      {children}
    </div>
  );
}

// ── Animated counter ───────────────────────────────────────────────────────
function Counter({ to, prefix = "", suffix = "", fixed = 0 }: {
  to: number; prefix?: string; suffix?: string; fixed?: number;
}) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !done.current) {
        done.current = true;
        const start = Date.now(), dur = 1800;
        const tick = () => {
          const progress = Math.min((Date.now() - start) / dur, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          setVal(ease * to);
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  const display = fixed > 0 ? val.toFixed(fixed) : Math.round(val).toLocaleString();
  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}

// ── Scroll reveal ──────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, style = {}, className = "" }: {
  children: React.ReactNode; delay?: number; style?: React.CSSProperties; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.08, rootMargin: "0px 0px -60px 0px" });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(32px)",
      transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms`,
      ...style,
    }}>{children}</div>
  );
}

// ── Inline FAQ accordion ───────────────────────────────────────────────────
function FAQAccordion({ items }: { items: { id: string; question: string; answer: string }[] }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map(item => (
        <div key={item.id} style={{
          background: C.card, border: `1px solid ${open === item.id ? C.borderGold : C.border}`,
          borderRadius: 16, overflow: "hidden",
          transition: "border-color 0.25s ease",
        }}>
          <button
            onClick={() => setOpen(open === item.id ? null : item.id)}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "20px 24px", background: "none", border: "none", cursor: "pointer",
              color: C.text, textAlign: "left", gap: 16,
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 600 }}>{item.question}</span>
            <ChevronDown size={18} color={C.text2} style={{
              flexShrink: 0,
              transform: open === item.id ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.25s ease",
            }} />
          </button>
          {open === item.id && (
            <div style={{ padding: "0 24px 20px" }}>
              <p style={{ fontSize: 14.5, color: C.text2, lineHeight: 1.75 }}>{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Data ───────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const FEATURES = [
  { icon: Brain,      color: "#6366F1", title: "AI Hairstyle Advisor",   desc: "Upload a selfie — GPT-4o Vision recommends the perfect style. Clients book the exact look they want, zero guesswork." },
  { icon: Calendar,   color: "#10B981", title: "Smart Booking Engine",   desc: "Real-time slots, instant confirmations, 10-min Redis hold locks. Zero double-bookings, ever, guaranteed." },
  { icon: CreditCard, color: "#D4AF37", title: "Touch-Fast POS",         desc: "Cash, card, split — process a payment in 4 taps. Hold carts, quick discounts, instant digital receipts." },
  { icon: BarChart3,  color: "#3B82F6", title: "Advanced Analytics",     desc: "Revenue trends, peak-hour heatmaps, barber performance league tables. Export CSV or PDF in one click." },
  { icon: MapPin,     color: "#EC4899", title: "Multi-Branch Control",   desc: "One dashboard for every location. Per-branch staff, schedules, and KPIs — fully independent reporting." },
  { icon: Palette,    color: "#F59E0B", title: "White-Label Branding",   desc: "Your logo, your colours, your booking URL. Clients only ever see your brand — never BarberOS." },
];

const PLANS = [
  {
    name: "Starter", price: 29, desc: "Solo barbers & chair renters",
    features: ["1 branch", "Up to 3 staff", "Online booking", "Basic POS", "Email notifications", "Basic analytics"],
    popular: false,
  },
  {
    name: "Professional", price: 79, desc: "Growing independent shops",
    features: ["Up to 3 branches", "Up to 10 staff", "Everything in Starter", "AI Hairstyle Advisor", "Advanced analytics", "SMS notifications", "Loyalty points", "Custom booking page"],
    popular: true,
  },
  {
    name: "Business", price: 149, desc: "Established barbershop brands",
    features: ["Up to 10 branches", "Unlimited staff", "Everything in Professional", "White-label branding", "Multi-currency POS", "Priority support", "CSV/PDF export", "API access"],
    popular: false,
  },
];

const STATS = [
  { icon: Scissors,   label: "Barbershops",       to: 2400, prefix: "",  suffix: "+",  fixed: 0 },
  { icon: Globe2,     label: "Countries",         to: 12,   prefix: "",  suffix: "",   fixed: 0 },
  { icon: TrendingUp, label: "Processed monthly", to: 4.2,  prefix: "£", suffix: "M",  fixed: 1 },
  { icon: Zap,        label: "Uptime SLA",        to: 98,   prefix: "",  suffix: "%",  fixed: 0 },
];

const SHOPS = [
  "The Gentleman's Quarter, London",
  "Blade & Thread, Manchester",
  "The Urban Barber Co., Birmingham",
  "Crown Fades, Dubai",
  "Soho Cuts, London",
  "Nordic Barbers, Stockholm",
  "La Coupe Royale, Paris",
  "King's Chair, Edinburgh",
  "Sharp & Styled, Dublin",
  "Apex Barbers, Amsterdam",
  "The Ritual, Barcelona",
  "Metro Cuts, Berlin",
];

const BAR_H = [40, 58, 35, 72, 50, 88, 62, 80, 42, 68, 84, 60, 92, 70];

// ─────────────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [menuOpen, setMenuOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [barsIn,   setBarsIn]     = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { const t = setTimeout(() => setBarsIn(true), 500); return () => clearTimeout(t); }, []);

  return (
    <>
      {/* ── Keyframes ─────────────────────────────────────────────────── */}
      <style>{`
        @keyframes orb1 {
          0%,100%{transform:translate(0,0)scale(1)}
          30%{transform:translate(40px,-30px)scale(1.06)}
          60%{transform:translate(-20px,40px)scale(0.94)}
        }
        @keyframes orb2 {
          0%,100%{transform:translate(0,0)scale(1)}
          25%{transform:translate(-50px,20px)scale(1.08)}
          55%{transform:translate(30px,-40px)scale(0.92)}
        }
        @keyframes orb3 {
          0%,100%{transform:translate(0,0)scale(1)}
          40%{transform:translate(20px,50px)scale(1.04)}
          70%{transform:translate(-40px,-20px)scale(0.97)}
        }
        @keyframes floatBob {
          0%,100%{transform:translateY(0)rotate(0deg)}
          50%{transform:translateY(-14px)rotate(7deg)}
        }
        @keyframes shimmerGold {
          0%{background-position:-200% center}
          100%{background-position:200% center}
        }
        @keyframes marqueeScroll {
          from{transform:translateX(0)}
          to{transform:translateX(-50%)}
        }
        @keyframes borderPulse {
          0%,100%{box-shadow:0 0 30px rgba(212,175,55,0.14),0 0 60px rgba(212,175,55,0.07)}
          50%{box-shadow:0 0 55px rgba(212,175,55,0.35),0 0 100px rgba(212,175,55,0.16)}
        }
        @keyframes fadeUp {
          from{opacity:0;transform:translateY(20px)}
          to{opacity:1;transform:translateY(0)}
        }
        @keyframes badgePulse {
          0%,100%{box-shadow:0 0 0 0 rgba(212,175,55,0)}
          50%{box-shadow:0 0 18px 4px rgba(212,175,55,0.22)}
        }
        .gold-shimmer {
          background: linear-gradient(
            90deg,
            #A88520 0%, #D4AF37 30%, #F0CC58 50%, #D4AF37 70%, #A88520 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmerGold 4s linear infinite;
        }
        .scissors-float { animation: floatBob 4s ease-in-out infinite; }
        .marquee-wrap { overflow: hidden; width: 100%; }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marqueeScroll 34s linear infinite;
        }
        .marquee-track:hover { animation-play-state: paused; }
        .hero-bar {
          transform-origin: bottom;
          transform: scaleY(0);
          transition: transform 1.1s cubic-bezier(0.34,1.56,0.64,1);
        }
        .hero-bar.in { transform: scaleY(1); }
        .plan-glow { animation: borderPulse 3.5s ease-in-out infinite; }
        .cta-card { animation: borderPulse 4s ease-in-out infinite; }
      `}</style>

      <div style={{ background: C.bg, minHeight: "100vh", color: C.text }}>

        {/* ═══ NAV ══════════════════════════════════════════════════════ */}
        <nav style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: scrolled ? "rgba(6,8,14,0.93)" : "transparent",
          backdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
          borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
          transition: "all 0.4s ease",
        }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>

              <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 12,
                  background: `linear-gradient(135deg, ${C.gold} 0%, ${C.goldDark} 100%)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: `0 4px 14px ${C.goldGlow}`,
                }}>
                  <Scissors size={18} color="#0A0800" />
                </div>
                <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.025em", color: C.text }}>
                  Barber<span style={{ color: C.gold }}>OS</span>
                </span>
              </Link>

              <div className="hidden md:flex" style={{ alignItems: "center", gap: 2 }}>
                {NAV_LINKS.map(l => (
                  <a key={l.href} href={l.href} style={{
                    padding: "8px 14px", borderRadius: 10, fontSize: 14, fontWeight: 500,
                    color: C.text2, textDecoration: "none", transition: "all 0.2s",
                  }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = C.text; el.style.background = C.elevated; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = C.text2; el.style.background = "transparent"; }}
                  >{l.label}</a>
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Link href="/login" className="hidden md:inline-flex" style={{
                  padding: "8px 16px", borderRadius: 10, fontSize: 13.5, fontWeight: 600,
                  color: C.text2, textDecoration: "none", border: `1px solid ${C.border}`, transition: "all 0.2s",
                }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = C.text; el.style.borderColor = C.borderStrong; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = C.text2; el.style.borderColor = C.border; }}
                >Log in</Link>
                <Link href="/register" style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "9px 20px", borderRadius: 10, fontSize: 13.5, fontWeight: 700,
                  background: `linear-gradient(135deg, ${C.gold} 0%, ${C.goldDark} 100%)`,
                  color: "#0A0800", textDecoration: "none",
                  boxShadow: `0 2px 14px ${C.goldGlow}`, transition: "all 0.2s",
                }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = `0 4px 24px rgba(212,175,55,0.42)`; el.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = `0 2px 14px ${C.goldGlow}`; el.style.transform = "none"; }}
                >Start Free Trial</Link>
                <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden" style={{
                  background: "none", border: `1px solid ${C.border}`, borderRadius: 8,
                  padding: 8, color: C.text2, cursor: "pointer",
                }}>
                  {menuOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
              </div>
            </div>

            {menuOpen && (
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12, paddingBottom: 16, animation: "fadeUp 0.2s ease" }}>
                {NAV_LINKS.map(l => (
                  <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} style={{
                    display: "block", padding: "10px 8px", fontSize: 14, color: C.text2, textDecoration: "none",
                  }}>{l.label}</a>
                ))}
                <Link href="/register" onClick={() => setMenuOpen(false)} style={{
                  display: "block", marginTop: 8, padding: "12px 16px", borderRadius: 10, textAlign: "center",
                  background: `linear-gradient(135deg, ${C.gold} 0%, ${C.goldDark} 100%)`,
                  color: "#0A0800", textDecoration: "none", fontWeight: 700, fontSize: 14,
                }}>Start Free Trial</Link>
              </div>
            )}
          </div>
        </nav>

        {/* ═══ HERO ═════════════════════════════════════════════════════ */}
        <section style={{
          position: "relative", overflow: "hidden",
          minHeight: "100vh",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: "120px 24px 80px",
        }}>
          {/* Animated orbs */}
          <div style={{
            position: "absolute", top: "-5%", left: "5%", width: 650, height: 600,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(212,175,55,0.10) 0%, transparent 70%)",
            animation: "orb1 22s ease-in-out infinite", pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", top: "10%", right: "-8%", width: 700, height: 550,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)",
            animation: "orb2 28s ease-in-out infinite", pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", bottom: "0", left: "20%", width: 500, height: 400,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(16,185,129,0.05) 0%, transparent 70%)",
            animation: "orb3 20s ease-in-out infinite", pointerEvents: "none",
          }} />
          {/* Subtle grid */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%)",
          }} />

          <div style={{ maxWidth: 900, width: "100%", textAlign: "center", position: "relative", zIndex: 2 }}>
            {/* Floating scissors */}
            <div className="scissors-float" style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 68, height: 68, borderRadius: 22,
              background: `linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(168,133,32,0.08) 100%)`,
              border: `1px solid ${C.borderGold}`,
              marginBottom: 24,
              boxShadow: `0 8px 36px ${C.goldGlow}`,
            }}>
              <Scissors size={30} color={C.gold} />
            </div>

            {/* Badge */}
            <div style={{ opacity: 0, animation: "fadeUp 0.65s ease 0.1s forwards" }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "6px 18px", borderRadius: 999,
                background: C.goldSubtle, border: `1px solid ${C.borderGold}`,
                fontSize: 11.5, fontWeight: 700, color: C.gold, letterSpacing: "0.07em",
                marginBottom: 28,
                animation: "badgePulse 3.5s ease-in-out infinite",
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.gold, display: "inline-block", flexShrink: 0 }} />
                LOVED BY 2,400+ BARBERSHOPS IN 12 COUNTRIES
              </span>
            </div>

            {/* H1 */}
            <h1 style={{
              fontSize: "clamp(3.2rem, 8.5vw, 6rem)", fontWeight: 900,
              letterSpacing: "-0.045em", lineHeight: 1.03, marginBottom: 28,
              opacity: 0, animation: "fadeUp 0.75s ease 0.2s forwards",
            }}>
              <span style={{ display: "block", color: C.text }}>The Premium</span>
              <span className="gold-shimmer" style={{ display: "block" }}>Barbershop OS</span>
            </h1>

            <p style={{
              fontSize: "clamp(16px, 2.2vw, 20px)", color: C.text2, lineHeight: 1.8,
              maxWidth: 580, margin: "0 auto 44px",
              opacity: 0, animation: "fadeUp 0.75s ease 0.35s forwards",
            }}>
              Bookings, POS, AI hairstyle suggestions, multi-branch management, and deep analytics — everything a world-class barbershop needs, so beautifully designed your barbers will brag about it.
            </p>

            {/* CTAs */}
            <div style={{
              display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", marginBottom: 20,
              opacity: 0, animation: "fadeUp 0.7s ease 0.5s forwards",
            }}>
              <Link href="/register" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "16px 34px", borderRadius: 14, fontSize: 16, fontWeight: 800,
                background: `linear-gradient(135deg, ${C.gold} 0%, ${C.goldDark} 100%)`,
                color: "#0A0800", textDecoration: "none",
                boxShadow: `0 4px 28px rgba(212,175,55,0.38)`,
                transition: "all 0.25s ease", letterSpacing: "-0.01em",
              }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-3px) scale(1.02)"; el.style.boxShadow = `0 10px 48px rgba(212,175,55,0.55)`; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "none"; el.style.boxShadow = `0 4px 28px rgba(212,175,55,0.38)`; }}
              >
                Start Free Trial — No Card Needed <ArrowRight size={18} />
              </Link>
              <Link href="/book" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "16px 28px", borderRadius: 14, fontSize: 16, fontWeight: 600,
                color: C.text2, textDecoration: "none",
                border: `1px solid ${C.borderStrong}`,
                background: "rgba(255,255,255,0.025)",
                transition: "all 0.2s ease",
              }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = C.text; el.style.borderColor = C.borderGold; el.style.background = C.goldSubtle; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = C.text2; el.style.borderColor = C.borderStrong; el.style.background = "rgba(255,255,255,0.025)"; }}
              >
                See Live Demo
              </Link>
            </div>

            <p style={{
              fontSize: 13, color: C.text3, marginBottom: 60,
              opacity: 0, animation: "fadeUp 0.6s ease 0.65s forwards",
            }}>
              14-day free trial &nbsp;·&nbsp; No credit card &nbsp;·&nbsp; Setup in 15 min &nbsp;·&nbsp; Cancel anytime
            </p>

            {/* Dashboard mockup */}
            <div style={{ opacity: 0, animation: "fadeUp 0.9s ease 0.85s forwards" }}>
              <div style={{
                background: C.card, border: `1px solid ${C.borderStrong}`,
                borderRadius: 24, overflow: "hidden", maxWidth: 820, margin: "0 auto",
                boxShadow: `0 40px 120px rgba(0,0,0,0.75), 0 0 0 1px ${C.border}, 0 0 100px rgba(212,175,55,0.05)`,
              }}>
                {/* Browser chrome */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "12px 18px",
                  background: C.elevated, borderBottom: `1px solid ${C.border}`,
                }}>
                  {["#FF5F57","#FFBD2E","#28C840"].map(c => (
                    <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c, flexShrink: 0 }} />
                  ))}
                  <div style={{
                    flex: 1, maxWidth: 260, margin: "0 auto", height: 27, borderRadius: 8,
                    background: C.card, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11.5, color: C.text3, gap: 5,
                  }}>
                    <Shield size={10} color={C.gold} /> app.barberos.io/admin
                  </div>
                </div>

                <div style={{ padding: "18px 18px 0" }}>
                  {/* Header row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div>
                      <p style={{ fontSize: 9.5, color: C.text3, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 2 }}>GOOD MORNING</p>
                      <p style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Sunday, 12 April 2026</p>
                    </div>
                    <div style={{
                      padding: "4px 12px", borderRadius: 999, fontSize: 9.5, fontWeight: 800,
                      background: C.goldSubtle, color: C.gold, border: `1px solid ${C.borderGold}`, letterSpacing: "0.05em",
                    }}>● LIVE</div>
                  </div>

                  {/* KPI cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 10 }}>
                    {[
                      { l: "Revenue",    v: "£1,284",  d: "+12%",   c: C.success },
                      { l: "Bookings",   v: "47",       d: "+5",     c: C.info },
                      { l: "Avg Ticket", v: "£42.80",  d: "+3%",    c: C.gold },
                      { l: "Staff",      v: "5 / 6",   d: "on duty", c: C.warning },
                    ].map(s => (
                      <div key={s.l} style={{
                        background: C.elevated, borderRadius: 10, padding: "10px 10px",
                        border: `1px solid ${C.border}`,
                      }}>
                        <p style={{ fontSize: 8, color: C.text3, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{s.l}</p>
                        <p style={{ fontSize: 16, fontWeight: 900, color: C.text, letterSpacing: "-0.02em" }}>{s.v}</p>
                        <p style={{ fontSize: 9, color: s.c, fontWeight: 600, marginTop: 2 }}>{s.d}</p>
                      </div>
                    ))}
                  </div>

                  {/* Animated chart */}
                  <div style={{
                    height: 108, background: C.elevated, borderRadius: 12,
                    border: `1px solid ${C.border}`, padding: "10px 12px 0",
                    display: "flex", alignItems: "flex-end", gap: 3, overflow: "hidden",
                    position: "relative",
                  }}>
                    <p style={{ position: "absolute", top: 8, left: 12, fontSize: 8.5, color: C.text3, fontWeight: 700, letterSpacing: "0.05em" }}>
                      REVENUE — LAST 14 DAYS
                    </p>
                    {BAR_H.map((h, i) => (
                      <div
                        key={i}
                        className={`hero-bar${barsIn ? " in" : ""}`}
                        style={{
                          flex: 1, borderRadius: "3px 3px 0 0",
                          transitionDelay: `${i * 0.055 + 0.5}s`,
                          height: `${h}%`,
                          background: i === BAR_H.length - 1
                            ? `linear-gradient(to top, ${C.gold}, ${C.goldLight})`
                            : `linear-gradient(to top, rgba(212,175,55,0.30), rgba(212,175,55,0.05))`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Tab strip */}
                <div style={{
                  display: "flex", gap: 4, padding: "10px 18px",
                  borderTop: `1px solid ${C.border}`, background: C.elevated,
                }}>
                  {["Bookings","Staff","POS","Analytics","AI Stylist","Settings"].map((t, i) => (
                    <div key={t} style={{
                      padding: "4px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600,
                      background: i === 0 ? C.goldSubtle : "transparent",
                      color: i === 0 ? C.gold : C.text3,
                      border: i === 0 ? `1px solid ${C.borderGold}` : "none",
                      whiteSpace: "nowrap",
                    }}>{t}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ MARQUEE ══════════════════════════════════════════════════ */}
        <div style={{ background: C.surface, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "18px 0" }}>
          <p style={{ textAlign: "center", fontSize: 10.5, color: C.text3, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>
            TRUSTED BY THE BEST BARBERSHOPS ACROSS EUROPE &amp; THE MIDDLE EAST
          </p>
          <div className="marquee-wrap">
            <div className="marquee-track">
              {[...SHOPS, ...SHOPS].map((shop, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "0 38px",
                  fontSize: 13.5, fontWeight: 600, color: C.text2, whiteSpace: "nowrap", flexShrink: 0,
                }}>
                  <Scissors size={12} color={C.gold} />{shop}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ STATS ════════════════════════════════════════════════════ */}
        <section style={{ padding: "88px 24px" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 28 }}>
              {STATS.map(({ icon: Icon, label, to, prefix = "", suffix = "", fixed = 0 }) => (
                <Reveal key={label} style={{ textAlign: "center" }}>
                  <div style={{
                    width: 54, height: 54, borderRadius: 16, margin: "0 auto 18px",
                    background: C.goldSubtle, border: `1px solid ${C.borderGold}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: `0 4px 18px ${C.goldGlow}`,
                  }}>
                    <Icon size={22} color={C.gold} />
                  </div>
                  <p style={{ fontSize: "clamp(2.2rem, 4vw, 3rem)", fontWeight: 900, letterSpacing: "-0.04em", color: C.text, lineHeight: 1 }}>
                    <Counter to={to} prefix={prefix} suffix={suffix} fixed={fixed} />
                  </p>
                  <p style={{ fontSize: 13.5, color: C.text2, marginTop: 8, fontWeight: 500 }}>{label}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ FEATURES ════════════════════════════════════════════════ */}
        <section id="features" style={{ padding: "96px 24px", background: C.surface, borderTop: `1px solid ${C.border}` }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <Reveal style={{ textAlign: "center", marginBottom: 68 }}>
              <p style={{ fontSize: 11.5, fontWeight: 700, color: C.gold, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>EVERYTHING YOU NEED</p>
              <h2 style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.75rem)", fontWeight: 900, letterSpacing: "-0.035em", marginBottom: 18, color: C.text }}>
                Built for the way barbershops actually work
              </h2>
              <p style={{ fontSize: 16, color: C.text2, maxWidth: 500, margin: "0 auto", lineHeight: 1.75 }}>
                Every feature designed by talking to hundreds of barbers. No bloat, no learning curve — just tools that make your day run smoother.
              </p>
            </Reveal>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18 }}>
              {FEATURES.map(({ icon: Icon, title, desc, color }, i) => (
                <Reveal key={title} delay={i * 75}>
                  <TiltCard style={{
                    background: C.card, border: `1px solid ${C.border}`,
                    borderRadius: 20, padding: "32px 28px", cursor: "default",
                    transition: "border-color 0.3s ease",
                  }}>
                    <div style={{
                      position: "absolute", top: 0, right: 0, width: 130, height: 130,
                      borderRadius: "0 20px 0 100%",
                      background: `radial-gradient(ellipse at top right, ${color}12 0%, transparent 70%)`,
                      pointerEvents: "none",
                    }} />
                    <div style={{
                      width: 54, height: 54, borderRadius: 16,
                      background: `${color}16`, border: `1px solid ${color}26`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      marginBottom: 22, boxShadow: `0 4px 18px ${color}18`,
                      position: "relative", zIndex: 2,
                    }}>
                      <Icon size={24} color={color} />
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 10, position: "relative", zIndex: 2 }}>{title}</h3>
                    <p style={{ fontSize: 14, color: C.text2, lineHeight: 1.75, position: "relative", zIndex: 2 }}>{desc}</p>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ HOW IT WORKS ════════════════════════════════════════════ */}
        <section id="how-it-works" style={{ padding: "96px 24px" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <Reveal style={{ textAlign: "center", marginBottom: 72 }}>
              <p style={{ fontSize: 11.5, fontWeight: 700, color: C.gold, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>GET STARTED IN MINUTES</p>
              <h2 style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.75rem)", fontWeight: 900, letterSpacing: "-0.035em", color: C.text }}>
                From sign-up to first booking in one afternoon
              </h2>
            </Reveal>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 40 }}>
              {([
                { step: "01", icon: Users,    color: C.gold,    title: "Sign up in 60 seconds",        desc: "Create your account, pick your plan, get your unique booking URL instantly. No credit card for the free trial." },
                { step: "02", icon: Clock,    color: "#6366F1", title: "Configure your shop in 15 min", desc: "Add services, set pricing, upload photos, invite staff. Our wizard guides every step — even the least techy barber nails it." },
                { step: "03", icon: Zap,      color: "#10B981", title: "Go live and watch it grow",     desc: "Share your link. Clients book 24/7, payments run automatically, and you just focus on giving great cuts." },
              ] as const).map(({ step, icon: Icon, color, title, desc }, i) => (
                <Reveal key={step} delay={i * 120} style={{ textAlign: "center" }}>
                  <div style={{ position: "relative", display: "inline-flex", marginBottom: 26 }}>
                    <div style={{
                      width: 76, height: 76, borderRadius: 24,
                      background: `${color}12`, border: `1px solid ${color}28`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: `0 8px 36px ${color}16`,
                    }}>
                      <Icon size={30} color={color} />
                    </div>
                    <div style={{
                      position: "absolute", top: -9, right: -9,
                      width: 28, height: 28, borderRadius: 8,
                      background: C.card, border: `1px solid ${C.borderGold}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 10, fontWeight: 900, color: C.gold,
                    }}>{step}</div>
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 12 }}>{title}</h3>
                  <p style={{ fontSize: 14.5, color: C.text2, lineHeight: 1.78 }}>{desc}</p>
                </Reveal>
              ))}
            </div>

            <Reveal style={{ textAlign: "center", marginTop: 68 }}>
              <Link href="/register" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "15px 34px", borderRadius: 14, fontSize: 16, fontWeight: 700,
                background: `linear-gradient(135deg, ${C.gold} 0%, ${C.goldDark} 100%)`,
                color: "#0A0800", textDecoration: "none",
                boxShadow: `0 4px 24px rgba(212,175,55,0.32)`, transition: "all 0.25s ease",
              }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = `0 8px 44px rgba(212,175,55,0.48)`; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "none"; el.style.boxShadow = `0 4px 24px rgba(212,175,55,0.32)`; }}
              >
                Get Started Free <ArrowRight size={17} />
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ═══ PRICING ══════════════════════════════════════════════════ */}
        <section id="pricing" style={{ padding: "96px 24px", background: C.surface, borderTop: `1px solid ${C.border}` }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <Reveal style={{ textAlign: "center", marginBottom: 68 }}>
              <p style={{ fontSize: 11.5, fontWeight: 700, color: C.gold, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>TRANSPARENT PRICING</p>
              <h2 style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.75rem)", fontWeight: 900, letterSpacing: "-0.035em", marginBottom: 14, color: C.text }}>
                Plans that grow with your shop
              </h2>
              <p style={{ fontSize: 15, color: C.text2 }}>14-day free trial on all plans. No card required. Cancel anytime.</p>
            </Reveal>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 20, alignItems: "start" }}>
              {PLANS.map((plan, i) => (
                <Reveal key={plan.name} delay={i * 90}>
                  <div
                    className={plan.popular ? "plan-glow" : ""}
                    style={{
                      background: plan.popular ? C.card : C.elevated,
                      border: `1px solid ${plan.popular ? C.borderGold : C.border}`,
                      borderRadius: 24, padding: "36px 30px",
                      position: "relative",
                      transform: plan.popular ? "scale(1.04)" : "scale(1)",
                      transition: "transform 0.25s ease",
                    }}>
                    {plan.popular && (
                      <div style={{
                        position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                        background: `linear-gradient(135deg, ${C.gold} 0%, ${C.goldDark} 100%)`,
                        color: "#0A0800", fontSize: 10.5, fontWeight: 900,
                        padding: "5px 18px", borderRadius: 999, whiteSpace: "nowrap",
                        boxShadow: `0 4px 16px ${C.goldGlow}`, letterSpacing: "0.05em",
                      }}>✦ MOST POPULAR</div>
                    )}
                    <p style={{ fontSize: 19, fontWeight: 800, color: C.text, marginBottom: 4 }}>{plan.name}</p>
                    <p style={{ fontSize: 13, color: C.text2, marginBottom: 22 }}>{plan.desc}</p>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 26 }}>
                      <span style={{ fontSize: 52, fontWeight: 900, color: C.text, letterSpacing: "-0.05em", lineHeight: 1 }}>£{plan.price}</span>
                      <span style={{ fontSize: 14, color: C.text2 }}>/mo</span>
                    </div>
                    <Link href="/register" style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      padding: "13px 0", borderRadius: 12, fontSize: 14, fontWeight: 700,
                      marginBottom: 26, textDecoration: "none",
                      background: plan.popular ? `linear-gradient(135deg, ${C.gold} 0%, ${C.goldDark} 100%)` : "transparent",
                      color: plan.popular ? "#0A0800" : C.text2,
                      border: plan.popular ? "none" : `1px solid ${C.borderStrong}`,
                      transition: "all 0.2s ease",
                    }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLElement;
                        if (plan.popular) { el.style.transform = "translateY(-1px)"; el.style.boxShadow = `0 4px 20px ${C.goldGlow}`; }
                        else { el.style.borderColor = C.borderGold; el.style.color = C.gold; el.style.background = C.goldSubtle; }
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.transform = "none"; el.style.boxShadow = "none";
                        if (!plan.popular) { el.style.borderColor = C.borderStrong; el.style.color = C.text2; el.style.background = "transparent"; }
                      }}
                    >Start Free Trial</Link>
                    <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                      {plan.features.map(f => (
                        <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <CheckCircle2 size={15} color={C.gold} style={{ flexShrink: 0 }} />
                          <span style={{ fontSize: 13.5, color: C.text2 }}>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal>
              <p style={{ textAlign: "center", fontSize: 14, color: C.text2, marginTop: 36 }}>
                Need more?{" "}
                <a href="mailto:enterprise@barberos.io" style={{ color: C.gold, fontWeight: 700, textDecoration: "none" }}>
                  Contact us for Enterprise pricing
                </a>{" "}
                — unlimited branches, white-label, dedicated SLA &amp; custom integrations.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ═══ TESTIMONIALS ════════════════════════════════════════════ */}
        <section style={{ padding: "96px 24px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <Reveal style={{ textAlign: "center", marginBottom: 68 }}>
              <p style={{ fontSize: 11.5, fontWeight: 700, color: C.gold, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>REAL STORIES</p>
              <h2 style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.75rem)", fontWeight: 900, letterSpacing: "-0.035em", color: C.text }}>
                Loved by shops across Europe
              </h2>
            </Reveal>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
              {mockTestimonials.map((t, i) => (
                <Reveal key={t.id} delay={i * 90}>
                  <div style={{
                    background: C.card, border: `1px solid ${C.border}`,
                    borderRadius: 20, padding: "32px 28px", position: "relative", overflow: "hidden",
                    transition: "border-color 0.3s, transform 0.3s, box-shadow 0.3s",
                  }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = C.borderGold; el.style.transform = "translateY(-5px)"; el.style.boxShadow = `0 16px 50px rgba(212,175,55,0.12)`; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = C.border; el.style.transform = "none"; el.style.boxShadow = "none"; }}
                  >
                    <div style={{
                      position: "absolute", top: 16, right: 20, fontSize: 72, fontWeight: 900,
                      color: "rgba(212,175,55,0.08)", lineHeight: 1, userSelect: "none", pointerEvents: "none",
                    }}>"</div>
                    <div style={{ display: "flex", gap: 3, marginBottom: 18 }}>
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} size={14} fill={C.gold} color={C.gold} />
                      ))}
                    </div>
                    <p style={{ fontSize: 15, color: C.text2, lineHeight: 1.8, marginBottom: 24, fontStyle: "italic", position: "relative", zIndex: 1 }}>
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <img src={t.avatar} alt={t.name} style={{ width: 46, height: 46, borderRadius: "50%", border: `2px solid ${C.borderGold}` }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{t.name}</p>
                        <p style={{ fontSize: 12, color: C.text3 }}>{t.role}</p>
                      </div>
                      <span style={{
                        padding: "3px 10px", borderRadius: 999, fontSize: 10.5, fontWeight: 700,
                        background: C.goldSubtle, color: C.gold, border: `1px solid ${C.borderGold}`,
                      }}>{t.plan}</span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ FAQ ══════════════════════════════════════════════════════ */}
        <section id="faq" style={{ padding: "96px 24px", background: C.surface, borderTop: `1px solid ${C.border}` }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <Reveal style={{ textAlign: "center", marginBottom: 56 }}>
              <p style={{ fontSize: 11.5, fontWeight: 700, color: C.gold, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>FAQ</p>
              <h2 style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.75rem)", fontWeight: 900, letterSpacing: "-0.035em", color: C.text }}>
                Questions answered
              </h2>
            </Reveal>
            <Reveal><FAQAccordion items={mockFAQ} /></Reveal>
          </div>
        </section>

        {/* ═══ FINAL CTA ════════════════════════════════════════════════ */}
        <section style={{ padding: "100px 24px" }}>
          <Reveal>
            <div className="cta-card" style={{
              maxWidth: 820, margin: "0 auto", textAlign: "center",
              position: "relative", overflow: "hidden",
              background: `linear-gradient(135deg, #0E1422 0%, #141A2E 50%, #0E1422 100%)`,
              borderRadius: 28, padding: "76px 48px",
              border: `1px solid ${C.borderGold}`,
            }}>
              <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(212,175,55,0.07) 0%, transparent 70%)",
              }} />
              {/* Grid inside CTA */}
              <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
                backgroundSize: "48px 48px",
                maskImage: "radial-gradient(ellipse 90% 90% at 50% 50%, black 0%, transparent 100%)",
                WebkitMaskImage: "radial-gradient(ellipse 90% 90% at 50% 50%, black 0%, transparent 100%)",
              }} />

              <div className="scissors-float" style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 70, height: 70, borderRadius: 22,
                background: C.goldSubtle, border: `1px solid ${C.borderGold}`,
                marginBottom: 28, position: "relative", zIndex: 1,
                boxShadow: `0 8px 36px ${C.goldGlow}`,
              }}>
                <Scissors size={30} color={C.gold} />
              </div>

              <h2 style={{
                fontSize: "clamp(1.9rem, 4vw, 3rem)", fontWeight: 900, letterSpacing: "-0.035em",
                marginBottom: 16, color: C.text, position: "relative", zIndex: 1,
              }}>
                Ready to transform your barbershop?
              </h2>
              <p style={{
                fontSize: 17, color: C.text2, lineHeight: 1.78, marginBottom: 44,
                maxWidth: 540, margin: "0 auto 44px", position: "relative", zIndex: 1,
              }}>
                Join 2,400+ barbershops already running on BarberOS. Start your free 14-day trial today — no card, no commitment.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", position: "relative", zIndex: 1 }}>
                <Link href="/register" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "17px 38px", borderRadius: 14, fontSize: 17, fontWeight: 800,
                  background: `linear-gradient(135deg, ${C.gold} 0%, ${C.goldDark} 100%)`,
                  color: "#0A0800", textDecoration: "none", letterSpacing: "-0.01em",
                  boxShadow: `0 4px 30px rgba(212,175,55,0.42)`, transition: "all 0.25s ease",
                }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-3px) scale(1.03)"; el.style.boxShadow = `0 12px 55px rgba(212,175,55,0.58)`; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "none"; el.style.boxShadow = `0 4px 30px rgba(212,175,55,0.42)`; }}
                >
                  Start Free Trial <ArrowRight size={18} />
                </Link>
                <Link href="/book" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "17px 28px", borderRadius: 14, fontSize: 17, fontWeight: 600,
                  color: C.text2, textDecoration: "none",
                  border: `1px solid ${C.borderStrong}`, background: "rgba(255,255,255,0.025)",
                  transition: "all 0.2s ease",
                }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = C.borderGold; el.style.color = C.text; el.style.background = C.goldSubtle; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = C.borderStrong; el.style.color = C.text2; el.style.background = "rgba(255,255,255,0.025)"; }}
                >
                  View Live Demo
                </Link>
              </div>
              <p style={{ fontSize: 13, color: C.text3, marginTop: 26, position: "relative", zIndex: 1 }}>
                14-day free trial &nbsp;·&nbsp; No credit card &nbsp;·&nbsp; Cancel anytime
              </p>
            </div>
          </Reveal>
        </section>

        {/* ═══ FOOTER ═══════════════════════════════════════════════════ */}
        <footer style={{ borderTop: `1px solid ${C.border}`, padding: "52px 24px 32px", background: C.surface }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 44, marginBottom: 52 }}>
              <div style={{ maxWidth: 280 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: `linear-gradient(135deg, ${C.gold} 0%, ${C.goldDark} 100%)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: `0 2px 10px ${C.goldGlow}`,
                  }}>
                    <Scissors size={17} color="#0A0800" />
                  </div>
                  <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-0.025em", color: C.text }}>
                    Barber<span style={{ color: C.gold }}>OS</span>
                  </span>
                </div>
                <p style={{ fontSize: 13.5, color: C.text2, lineHeight: 1.8 }}>
                  The premium operating system for modern barbershops. Built for UK &amp; Europe.
                </p>
              </div>
              {[
                { title: "Product", links: ["Features","Pricing","Changelog","Roadmap"] },
                { title: "Company", links: ["About","Blog","Careers","Press"] },
                { title: "Legal",   links: ["Privacy","Terms","Cookies","GDPR"] },
              ].map(col => (
                <div key={col.title}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: C.text2, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 18 }}>{col.title}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {col.links.map(l => (
                      <a key={l} href="#" style={{ fontSize: 13.5, color: C.text3, textDecoration: "none", transition: "color 0.18s" }}
                        onMouseEnter={e => (e.currentTarget.style.color = C.gold)}
                        onMouseLeave={e => (e.currentTarget.style.color = C.text3)}
                      >{l}</a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={{
              display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center",
              gap: 12, paddingTop: 24, borderTop: `1px solid ${C.border}`,
            }}>
              <p style={{ fontSize: 13, color: C.text3 }}>© 2026 BarberOS. All rights reserved.</p>
              <div style={{ display: "flex", gap: 22 }}>
                {["Instagram","Twitter","LinkedIn"].map(s => (
                  <a key={s} href="#" style={{ fontSize: 13, color: C.text3, textDecoration: "none", transition: "color 0.18s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = C.gold)}
                    onMouseLeave={e => (e.currentTarget.style.color = C.text3)}
                  >{s}</a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
