"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Scissors, ChevronRight, ChevronLeft, Clock, Star, Check,
  Plus, User, Home, Tag, CreditCard, Banknote, Wallet,
  Calendar, MapPin, Phone, Mail, Timer, ArrowLeft,
  CheckCircle2, Sparkles
} from "lucide-react";
import { mockServices, mockAddons, mockBarbers, generateTimeSlots } from "@/lib/mock-data";
import { StepWizard } from "@/components/ui/StepWizard";
import { formatCurrency } from "@/lib/utils";

const WIZARD_STEPS = [
  { id: "service", label: "Service" },
  { id: "addons", label: "Add-ons" },
  { id: "barber", label: "Barber" },
  { id: "datetime", label: "Date & Time" },
  { id: "details", label: "Your Details" },
  { id: "confirm", label: "Confirm" },
];

const SERVICE_CATEGORIES = ["All", "Hair", "Beard", "Shave", "Kids", "Package", "Colour"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function getDaysInMonth(year: number, month: number) { return new Date(year, month + 1, 0).getDate(); }
function getFirstDayOfMonth(year: number, month: number) { return (new Date(year, month, 1).getDay() + 6) % 7; }

export default function BookingPage() {
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState<typeof mockServices[0] | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<number[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [homeService, setHomeService] = useState(false);
  const [serviceCategory, setServiceCategory] = useState("All");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", notes: "" });
  const [payMethod, setPayMethod] = useState<"card" | "cash" | "deposit">("card");
  const [confirmed, setConfirmed] = useState(false);
  const [bookingRef] = useState(`BK-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);
  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());

  const filteredServices = mockServices.filter(s => serviceCategory === "All" ? true : s.category === serviceCategory);
  const addonsList = selectedService ? mockAddons.filter(a => selectedService.addonIds.includes(a.id)) : [];
  const toggleAddon = (id: number) => setSelectedAddons(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const selectedAddonsList = mockAddons.filter(a => selectedAddons.includes(a.id));
  const servicePrice = selectedService?.price ?? 0;
  const addonPrice = selectedAddonsList.reduce((s, a) => s + a.extraPrice, 0);
  const travelFee = homeService ? 10 : 0;
  const discount = promoApplied ? Math.round((servicePrice + addonPrice) * 0.1) : 0;
  const total = servicePrice + addonPrice + travelFee - discount;
  const totalDuration = (selectedService?.duration ?? 0) + selectedAddonsList.reduce((s, a) => s + a.extraDuration, 0);
  const slots = selectedDate ? generateTimeSlots(selectedDate) : null;
  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);
  const today = new Date();

  const canNext = () => {
    if (step === 0) return selectedService !== null;
    if (step === 3) return selectedDate !== "" && selectedTime !== "";
    return true;
  };

  if (confirmed) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-base)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{
          background: "var(--bg-card)", border: "1px solid var(--border-gold)",
          borderRadius: 24, padding: "48px 40px", maxWidth: 480, width: "100%",
          textAlign: "center", boxShadow: "var(--shadow-gold)",
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: "var(--success-bg)", border: "2px solid var(--success)",
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px",
          }}>
            <CheckCircle2 size={32} style={{ color: "var(--success)" }} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>Booking Confirmed!</h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 24 }}>
            Your appointment has been booked. A confirmation has been sent.
          </p>
          <div style={{
            background: "var(--bg-elevated)", borderRadius: 14, padding: 20, marginBottom: 24,
            border: "1px solid var(--border)",
          }}>
            <p style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Booking Reference</p>
            <p style={{ fontSize: 24, fontWeight: 800, color: "var(--gold)", letterSpacing: "0.1em" }}>{bookingRef}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28, textAlign: "left" }}>
            {[
              { label: "Service", value: selectedService?.name },
              { label: "Date", value: selectedDate },
              { label: "Time", value: selectedTime },
              { label: "Barber", value: selectedBarber ? mockBarbers.find(b => b.id === selectedBarber)?.name : "Any Available" },
              { label: "Total", value: formatCurrency(total) },
            ].map(row => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{row.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{row.value}</span>
              </div>
            ))}
          </div>
          <Link href="/" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", display: "flex" }}>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      {/* Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 40,
        background: "rgba(8,12,20,0.9)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)", padding: "0 24px",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <ArrowLeft size={16} style={{ color: "var(--text-muted)" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Scissors size={14} style={{ color: "#0A0800" }} />
              </div>
              <span style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)" }}>Barber<span style={{ color: "var(--gold)" }}>OS</span></span>
            </div>
          </Link>
          {selectedService && (
            <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 13, color: "var(--text-muted)" }}>
              <span style={{ color: "var(--gold)", fontWeight: 600 }}>{selectedService.name}</span>
              {totalDuration > 0 && <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} />{totalDuration} min</span>}
              {total > 0 && <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>{formatCurrency(total)}</span>}
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ marginBottom: 40 }}>
          <StepWizard steps={WIZARD_STEPS} currentStep={step} />
        </div>

        {/* STEP 0 — Service */}
        {step === 0 && (
          <div className="animate-fade-up">
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>Choose a service</h2>
            <p style={{ fontSize: 13.5, color: "var(--text-muted)", marginBottom: 20 }}>What are you coming in for?</p>

            {/* Home service toggle */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "var(--bg-card)", border: homeService ? "1px solid var(--border-gold)" : "1px solid var(--border)",
              borderRadius: 12, padding: "14px 18px", marginBottom: 20,
              boxShadow: homeService ? "var(--shadow-gold)" : "none",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--bg-elevated)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Home size={16} style={{ color: "var(--text-muted)" }} />
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Home / House Service</p>
                  <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Barber comes to you. Travel fee +£10</p>
                </div>
              </div>
              <button
                onClick={() => setHomeService(!homeService)}
                style={{
                  width: 44, height: 24, borderRadius: 12, position: "relative", flexShrink: 0,
                  background: homeService ? "var(--gold)" : "var(--bg-elevated)",
                  border: homeService ? "none" : "1px solid var(--border-strong)",
                  cursor: "pointer", transition: "background 0.2s",
                }}
              >
                <span style={{
                  position: "absolute", top: 2, width: 20, height: 20, borderRadius: "50%",
                  background: "white", boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
                  transition: "left 0.2s ease", left: homeService ? 22 : 2,
                }} />
              </button>
            </div>

            {/* Category tabs */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
              {SERVICE_CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setServiceCategory(cat)} style={{
                  padding: "6px 14px", borderRadius: 999, fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                  background: serviceCategory === cat ? "var(--gold-subtle)" : "var(--bg-elevated)",
                  color: serviceCategory === cat ? "var(--gold)" : "var(--text-secondary)",
                  border: serviceCategory === cat ? "1px solid var(--border-gold)" : "1px solid var(--border)",
                  transition: "all 0.15s",
                }}>{cat}</button>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
              {filteredServices.map(svc => {
                const isSelected = selectedService?.id === svc.id;
                return (
                  <button key={svc.id} onClick={() => setSelectedService(svc)} style={{
                    background: "var(--bg-card)", border: isSelected ? "2px solid var(--gold)" : "1px solid var(--border)",
                    borderRadius: 16, padding: 20, cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                    boxShadow: isSelected ? "var(--shadow-gold)" : "none",
                    transform: isSelected ? "scale(1.01)" : "scale(1)", position: "relative",
                  }}>
                    {isSelected && (
                      <div style={{ position: "absolute", top: 12, right: 12, width: 22, height: 22, borderRadius: "50%", background: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Check size={13} style={{ color: "#0A0800" }} />
                      </div>
                    )}
                    <div style={{ fontSize: 26, marginBottom: 10 }}>{svc.icon}</div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>{svc.name}</p>
                    <p style={{ fontSize: 12.5, color: "var(--text-muted)", marginBottom: 12, lineHeight: 1.5 }}>{svc.description}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", gap: 12 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--text-secondary)" }}>
                          <Clock size={11} />{svc.duration}m
                        </span>
                        {svc.addonIds.length > 0 && (
                          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--text-muted)" }}>
                            <Plus size={11} />{svc.addonIds.length} add-ons
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: 17, fontWeight: 800, color: "var(--text-primary)" }}>{formatCurrency(svc.price)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 1 — Add-ons */}
        {step === 1 && selectedService && (
          <div className="animate-fade-up">
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>Enhance your experience</h2>
            <p style={{ fontSize: 13.5, color: "var(--text-muted)", marginBottom: 24 }}>Optional add-ons for your {selectedService.name}</p>
            {addonsList.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 24px" }}>
                <Sparkles size={32} style={{ color: "var(--text-muted)", margin: "0 auto 12px", display: "block" }} />
                <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No add-ons available for this service</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
                {addonsList.map(addon => {
                  const isOn = selectedAddons.includes(addon.id);
                  return (
                    <button key={addon.id} onClick={() => toggleAddon(addon.id)} style={{
                      background: "var(--bg-card)", border: isOn ? "2px solid var(--gold)" : "1px solid var(--border)",
                      borderRadius: 14, padding: "18px 20px", cursor: "pointer", textAlign: "left",
                      transition: "all 0.15s", boxShadow: isOn ? "var(--shadow-gold)" : "none",
                    }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                          background: isOn ? "var(--gold-subtle)" : "var(--bg-elevated)",
                          border: isOn ? "1px solid var(--border-gold)" : "1px solid var(--border)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          {isOn ? <Check size={16} style={{ color: "var(--gold)" }} /> : <Plus size={16} style={{ color: "var(--text-muted)" }} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 3 }}>{addon.name}</p>
                          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, lineHeight: 1.5 }}>{addon.description}</p>
                          <div style={{ display: "flex", gap: 12 }}>
                            <span style={{ fontSize: 12, color: "var(--gold)", fontWeight: 600 }}>+{formatCurrency(addon.extraPrice)}</span>
                            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>+{addon.extraDuration} min</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
            <div style={{
              marginTop: 24, background: "var(--bg-card)", border: "1px solid var(--border-gold)",
              borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 2 }}>Running total</p>
                <p style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)" }}>{formatCurrency(servicePrice + addonPrice)}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 2 }}>Duration</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-secondary)" }}>{totalDuration} min</p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 — Barber */}
        {step === 2 && (
          <div className="animate-fade-up">
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>Choose your barber</h2>
            <p style={{ fontSize: 13.5, color: "var(--text-muted)", marginBottom: 24 }}>All barbers are certified professionals</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
              {/* Any Available */}
              <button onClick={() => setSelectedBarber(null)} style={{
                background: "var(--bg-card)", border: selectedBarber === null ? "2px solid var(--gold)" : "1px solid var(--border)",
                borderRadius: 14, padding: "18px 20px", cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                boxShadow: selectedBarber === null ? "var(--shadow-gold)" : "none",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: "50%",
                    background: selectedBarber === null ? "var(--gold-subtle)" : "var(--bg-elevated)",
                    border: selectedBarber === null ? "2px solid var(--border-gold)" : "2px solid var(--border)",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <User size={20} style={{ color: selectedBarber === null ? "var(--gold)" : "var(--text-muted)" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>Any Available Barber</p>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>Best for earliest availability</p>
                    <span style={{ fontSize: 11, color: "var(--success)", fontWeight: 600 }}>Next: 9:00am today</span>
                  </div>
                </div>
              </button>

              {mockBarbers.filter(b => b.status !== "inactive").map(barber => {
                const isSelected = selectedBarber === barber.id;
                return (
                  <button key={barber.id} onClick={() => setSelectedBarber(barber.id)} style={{
                    background: "var(--bg-card)", border: isSelected ? "2px solid var(--gold)" : "1px solid var(--border)",
                    borderRadius: 14, padding: "18px 20px", cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                    boxShadow: isSelected ? "var(--shadow-gold)" : "none",
                  }}>
                    <div style={{ display: "flex", gap: 14 }}>
                      <div style={{ position: "relative", flexShrink: 0 }}>
                        <img src={barber.avatar} alt={barber.name} style={{ width: 48, height: 48, borderRadius: "50%", border: isSelected ? "2px solid var(--gold)" : "2px solid var(--border)" }} />
                        <div style={{
                          position: "absolute", bottom: 0, right: 0, width: 14, height: 14, borderRadius: "50%",
                          background: barber.status === "active" ? "var(--success)" : "var(--warning)",
                          border: "2px solid var(--bg-card)",
                        }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>{barber.name}</p>
                        <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>{barber.specialty}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 12, color: "var(--gold)", fontWeight: 600 }}>
                            <Star size={10} fill="var(--gold)" /> {barber.rating}
                          </span>
                          <span style={{ fontSize: 11, color: "var(--success)", fontWeight: 600 }}>{barber.nextAvailable}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3 — Date & Time */}
        {step === 3 && (
          <div className="animate-fade-up">
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>Pick a date & time</h2>
            <p style={{ fontSize: 13.5, color: "var(--text-muted)", marginBottom: 24 }}>Select when you&apos;d like to come in</p>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 24, alignItems: "start" }}>
              {/* Calendar */}
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: 20, width: 300 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <button className="btn btn-ghost" style={{ padding: "6px 10px" }}
                    onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); }}>
                    <ChevronLeft size={16} />
                  </button>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{MONTHS[calMonth]} {calYear}</span>
                  <button className="btn btn-ghost" style={{ padding: "6px 10px" }}
                    onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); }}>
                    <ChevronRight size={16} />
                  </button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 8 }}>
                  {["M","T","W","T","F","S","S"].map((d, i) => (
                    <div key={i} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", padding: "4px 0" }}>{d}</div>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
                  {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
                  {Array.from({ length: daysInMonth }).map((_, idx) => {
                    const day = idx + 1;
                    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const isPast = new Date(calYear, calMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                    const isSelected = selectedDate === dateStr;
                    const isToday = day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
                    const isSunday = (firstDay + idx) % 7 === 6;
                    return (
                      <button key={day} disabled={isPast || isSunday} onClick={() => { setSelectedDate(dateStr); setSelectedTime(""); }} style={{
                        height: 36, borderRadius: 8, fontSize: 13, fontWeight: isSelected ? 700 : 500,
                        cursor: (isPast || isSunday) ? "not-allowed" : "pointer",
                        opacity: (isPast || isSunday) ? 0.3 : 1,
                        background: isSelected ? "var(--gold)" : isToday ? "var(--gold-subtle)" : "transparent",
                        color: isSelected ? "#0A0800" : isToday ? "var(--gold)" : "var(--text-primary)",
                        border: isToday && !isSelected ? "1px solid var(--border-gold)" : "none",
                        transition: "all 0.12s",
                      }}>{day}</button>
                    );
                  })}
                </div>
              </div>

              {/* Slots */}
              <div>
                {!selectedDate ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 200, gap: 12, color: "var(--text-muted)" }}>
                    <Calendar size={32} />
                    <p style={{ fontSize: 13.5 }}>Select a date first</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {[
                      { label: "Morning", data: slots?.morning },
                      { label: "Afternoon", data: slots?.afternoon },
                      { label: "Evening", data: slots?.evening },
                    ].map(({ label, data }) => (
                      <div key={label}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>{label}</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {data?.map(slot => (
                            <button key={slot.time} disabled={!slot.available} onClick={() => setSelectedTime(slot.time)} style={{
                              padding: "8px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                              cursor: !slot.available ? "not-allowed" : "pointer",
                              opacity: !slot.available ? 0.3 : 1,
                              background: selectedTime === slot.time ? "var(--gold)" : "var(--bg-elevated)",
                              color: selectedTime === slot.time ? "#0A0800" : "var(--text-primary)",
                              border: selectedTime === slot.time ? "none" : "1px solid var(--border)",
                              transition: "all 0.12s",
                            }}>{slot.time}</button>
                          ))}
                        </div>
                      </div>
                    ))}
                    {selectedTime && (
                      <div style={{
                        background: "var(--warning-bg)", border: "1px solid rgba(245,158,11,0.3)",
                        borderRadius: 10, padding: "10px 14px", display: "flex", gap: 8, alignItems: "center",
                      }}>
                        <Timer size={14} style={{ color: "var(--warning)", flexShrink: 0 }} />
                        <p style={{ fontSize: 12.5, color: "var(--warning)" }}>
                          Slot held for <strong>10 minutes</strong>. Complete booking to secure it.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4 — Details */}
        {step === 4 && (
          <div className="animate-fade-up">
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>Your details</h2>
            <p style={{ fontSize: 13.5, color: "var(--text-muted)", marginBottom: 24 }}>All fields optional — you can book as a guest</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 560 }}>
              {[
                { key: "name", label: "Full name", placeholder: "John Smith", icon: <User size={14} /> },
                { key: "phone", label: "Phone number", placeholder: "+44 7700 900000", icon: <Phone size={14} /> },
                { key: "email", label: "Email address", placeholder: "john@example.com", icon: <Mail size={14} />, full: true },
              ].map(({ key, label, placeholder, icon, full }) => (
                <div key={key} style={{ gridColumn: full ? "1 / -1" : undefined }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>{label}</label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }}>{icon}</span>
                    <input className="input" style={{ paddingLeft: 36 }}
                      value={form[key as keyof typeof form]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder} />
                  </div>
                </div>
              ))}
              {homeService && (
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Service address</label>
                  <div style={{ position: "relative" }}>
                    <MapPin size={14} style={{ position: "absolute", left: 12, top: 12, color: "var(--text-muted)" }} />
                    <input className="input" style={{ paddingLeft: 36 }} value={form.address}
                      onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="123 High Street, London, W1 1AA" />
                  </div>
                </div>
              )}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Special requests</label>
                <textarea className="input" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Any preferences or things we should know…" rows={3} style={{ resize: "none", lineHeight: 1.6 }} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Promo code (optional)</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ position: "relative", flex: 1 }}>
                    <Tag size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                    <input className="input" style={{ paddingLeft: 36 }} value={promoCode}
                      onChange={e => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="WELCOME10" disabled={promoApplied} />
                  </div>
                  <button className="btn btn-secondary"
                    onClick={() => { if (promoCode === "WELCOME10") setPromoApplied(true); }}
                    disabled={promoApplied || !promoCode}>
                    {promoApplied ? <><Check size={14} /> Applied</> : "Apply"}
                  </button>
                </div>
                {promoApplied && <p style={{ fontSize: 12, color: "var(--success)", marginTop: 6 }}>✓ 10% discount applied</p>}
              </div>
            </div>
            <p style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 20 }}>
              Have an account? <Link href="/login" style={{ color: "var(--gold)", fontWeight: 600, textDecoration: "none" }}>Log in</Link> to earn loyalty points
            </p>
          </div>
        )}

        {/* STEP 5 — Confirm & Pay */}
        {step === 5 && (
          <div className="animate-fade-up">
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>Confirm your booking</h2>
            <p style={{ fontSize: 13.5, color: "var(--text-muted)", marginBottom: 24 }}>Review everything and choose how to pay</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>
              {/* Summary */}
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: 24 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 16 }}>Booking Summary</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { label: "Service", value: selectedService?.name },
                    ...(selectedAddonsList.length > 0 ? [{ label: "Add-ons", value: selectedAddonsList.map(a => a.name).join(", ") }] : []),
                    { label: "Barber", value: selectedBarber ? mockBarbers.find(b => b.id === selectedBarber)?.name : "Any Available" },
                    { label: "Date", value: selectedDate },
                    { label: "Time", value: selectedTime },
                    { label: "Duration", value: `${totalDuration} min` },
                  ].map(row => (
                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between", paddingBottom: 12, borderBottom: "1px solid var(--border)" }}>
                      <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{row.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", textAlign: "right", maxWidth: "60%" }}>{row.value}</span>
                    </div>
                  ))}
                  <div style={{ paddingTop: 4, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Service</span>
                      <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{formatCurrency(servicePrice)}</span>
                    </div>
                    {addonPrice > 0 && <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Add-ons</span>
                      <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{formatCurrency(addonPrice)}</span>
                    </div>}
                    {homeService && <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Travel fee</span>
                      <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>+{formatCurrency(travelFee)}</span>
                    </div>}
                    {discount > 0 && <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 13, color: "var(--success)" }}>Promo ({promoCode})</span>
                      <span style={{ fontSize: 13, color: "var(--success)", fontWeight: 600 }}>-{formatCurrency(discount)}</span>
                    </div>}
                    <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid var(--border)" }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>Total</span>
                      <span style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)" }}>{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: 24 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 16 }}>Payment Method</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                  {[
                    { id: "card" as const, label: "Card payment", desc: "Secure online payment", icon: <CreditCard size={18} /> },
                    { id: "cash" as const, label: "Cash on arrival", desc: "Pay when you arrive", icon: <Banknote size={18} /> },
                    { id: "deposit" as const, label: `Deposit only (25%)`, desc: `Pay ${formatCurrency(Math.round(total * 0.25))} now`, icon: <Wallet size={18} /> },
                  ].map(pm => (
                    <button key={pm.id} onClick={() => setPayMethod(pm.id)} style={{
                      display: "flex", alignItems: "center", gap: 12,
                      background: payMethod === pm.id ? "var(--gold-subtle)" : "var(--bg-elevated)",
                      border: payMethod === pm.id ? "1px solid var(--border-gold)" : "1px solid var(--border)",
                      borderRadius: 12, padding: "14px 16px", cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                    }}>
                      <div style={{ color: payMethod === pm.id ? "var(--gold)" : "var(--text-muted)", flexShrink: 0 }}>{pm.icon}</div>
                      <div>
                        <p style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-primary)" }}>{pm.label}</p>
                        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{pm.desc}</p>
                      </div>
                      {payMethod === pm.id && <Check size={16} style={{ color: "var(--gold)", marginLeft: "auto" }} />}
                    </button>
                  ))}
                </div>
                <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: 15, padding: "14px", marginBottom: 12 }}
                  onClick={() => setConfirmed(true)}>
                  {payMethod === "cash" ? "Confirm Booking" : `Pay ${payMethod === "deposit" ? formatCurrency(Math.round(total * 0.25)) : formatCurrency(total)}`}
                </button>
                <p style={{ fontSize: 11.5, color: "var(--text-muted)", textAlign: "center", lineHeight: 1.5 }}>
                  Free cancellation up to 24 hours before your appointment.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Nav buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 40, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
          <button className="btn btn-ghost" onClick={() => setStep(s => Math.max(0, s - 1))}
            style={{ gap: 8, visibility: step === 0 ? "hidden" : "visible" }}>
            <ChevronLeft size={16} /> Back
          </button>
          {step < 5 && (
            <button className="btn btn-primary" onClick={() => setStep(s => s + 1)}
              disabled={!canNext()} style={{ gap: 8, padding: "10px 24px" }}>
              {step === 4 ? "Review Booking" : "Continue"} <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
