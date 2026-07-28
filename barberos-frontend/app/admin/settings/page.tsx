"use client";
import { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Store, Globe, CreditCard, Bell, Shield, Save, Check, Palette, Upload, Eye, Scissors, Key, EyeOff, Plus, CheckCircle2, XCircle, Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const settingLanguages = [
  { code: "en", name: "English", flag: "🇬🇧", region: "United Kingdom" },
  { code: "ar", name: "العربية", flag: "🇸🇦", region: "Arabic", rtl: true },
  { code: "fr", name: "Français", flag: "🇫🇷", region: "French" },
  { code: "de", name: "Deutsch", flag: "🇩🇪", region: "German" },
  { code: "es", name: "Español", flag: "🇪🇸", region: "Spanish" },
  { code: "it", name: "Italiano", flag: "🇮🇹", region: "Italian" },
  { code: "nl", name: "Nederlands", flag: "🇳🇱", region: "Dutch" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷", region: "Turkish" },
  { code: "pl", name: "Polski", flag: "🇵🇱", region: "Polish" },
  { code: "pt", name: "Português", flag: "🇵🇹", region: "Portuguese" },
  { code: "ru", name: "Русский", flag: "🇷🇺", region: "Russian" },
  { code: "ur", name: "اردو", flag: "🇵🇰", region: "Urdu", rtl: true },
];

const currencies = [
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal" },
  { code: "PKR", symbol: "₨", name: "Pakistani Rupee" },
];

const tabs = [
  { id: "general", label: "General", icon: Store },
  { id: "branding", label: "Branding", icon: Palette },
  { id: "language", label: "Language", icon: Globe },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "api-keys", label: "API Keys", icon: Key },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
];

const TENANT_API_SERVICES = [
  { id: "stripe", name: "Stripe", desc: "Payment processing", category: "Payments", docsUrl: "#", placeholder: "sk_live_..." },
  { id: "paypal", name: "PayPal", desc: "PayPal checkout", category: "Payments", docsUrl: "#", placeholder: "ART..." },
  { id: "openai", name: "OpenAI", desc: "AI hairstyle suggestions", category: "AI", docsUrl: "#", placeholder: "sk-..." },
  { id: "twilio", name: "Twilio SMS", desc: "SMS notifications", category: "Messaging", docsUrl: "#", placeholder: "AC..." },
  { id: "google_maps", name: "Google Maps", desc: "Address autocomplete", category: "Maps", docsUrl: "#", placeholder: "AIza..." },
  { id: "google_calendar", name: "Google Calendar", desc: "Calendar sync", category: "Calendar", docsUrl: "#", placeholder: "AIza..." },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    shopName: "The Gentleman's Quarter",
    address: "45 King Street, London, W1K 4NE",
    phone: "+44 20 7946 0958",
    email: "info@gentlemansquarter.com",
    currency: "GBP",
    timezone: "Europe/London",
    language: "en",
    additionalLanguages: ["ar"],
    bookingDeposit: "20",
    cancellationWindow: "24",
    taxRate: "20",
    notifications: { newBooking: true, reminder24h: true, reminder2h: true, cancellation: true, lowStock: true, dailySummary: true }
  });
  const [apiKeys, setApiKeys] = useState<Record<string, string>>(
    Object.fromEntries(TENANT_API_SERVICES.map(s => [s.id, ""]))
  );
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [branding, setBranding] = useState({
    primaryColor: "#C9A84C",
    accentColor: "#0D1020",
    fontFamily: "inter",
    shopTagline: "Premium Barbershop Experience",
    bookingWelcome: "Welcome! Book your next appointment below.",
    logoUploaded: false,
    faviconUploaded: false,
    showRatings: true,
    showPrices: true,
    allowGuestBooking: true,
    requireDeposit: true,
    homeServiceEnabled: true,
  });

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };
  const toggleLang = (code: string) => setSettings(s => ({
    ...s, additionalLanguages: s.additionalLanguages.includes(code)
      ? s.additionalLanguages.filter(l => l !== code)
      : [...s.additionalLanguages, code]
  }));

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button onClick={onChange} className="relative flex-shrink-0 rounded-full transition-colors"
      style={{ width: 44, height: 24, background: checked ? "var(--gold)" : "var(--bg-elevated)", border: "1px solid var(--border)" }}>
      <span className="absolute top-0.5 w-[20px] h-[20px] rounded-full bg-white transition-all shadow-sm"
        style={{ left: checked ? 21 : 2 }} />
    </button>
  );

  return (
    <DashboardShell role="admin" title="Settings" subtitle="Shop configuration and preferences"
      action={
        <button onClick={handleSave}
          className={`btn gap-1.5 text-[13px] ${saved ? "btn-ghost" : "btn-primary"}`}
          style={saved ? { color: "var(--success)", borderColor: "var(--success)" } : {}}>
          {saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Changes</>}
        </button>
      }>
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Tab sidebar */}
        <div className="lg:w-52 flex-shrink-0">
          <div className="card p-2">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%",
                  padding: "10px 12px", borderRadius: 10, fontSize: 13, fontWeight: 500,
                  textAlign: "left", transition: "all 0.15s", cursor: "pointer", border: "none",
                  background: activeTab === tab.id ? "var(--gold-subtle)" : "transparent",
                  color: activeTab === tab.id ? "var(--gold)" : "var(--text-secondary)",
                }}>
                <tab.icon size={15} style={{ flexShrink: 0 }} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          {activeTab === "general" && (
            <>
              <div className="card p-5">
                <h3 className="text-[14px] font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Shop Information</h3>
                <div className="space-y-4">
                  {[
                    { label: "Shop name", key: "shopName", val: settings.shopName },
                    { label: "Address", key: "address", val: settings.address },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>{f.label}</label>
                      <input className="input w-full text-[13px]" value={f.val} onChange={e => setSettings(s => ({ ...s, [f.key]: e.target.value }))} />
                    </div>
                  ))}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Phone</label>
                      <input className="input w-full text-[13px]" value={settings.phone} onChange={e => setSettings(s => ({ ...s, phone: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Email</label>
                      <input type="email" className="input w-full text-[13px]" value={settings.email} onChange={e => setSettings(s => ({ ...s, email: e.target.value }))} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="card p-5">
                <h3 className="text-[14px] font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Booking Rules</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Deposit required (%)", key: "bookingDeposit", val: settings.bookingDeposit },
                    { label: "Cancellation window (hrs)", key: "cancellationWindow", val: settings.cancellationWindow },
                    { label: "VAT rate (%)", key: "taxRate", val: settings.taxRate },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>{f.label}</label>
                      <input type="number" className="input w-full text-[13px]" value={f.val} onChange={e => setSettings(s => ({ ...s, [f.key]: e.target.value }))} />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === "branding" && (
            <>
              {/* Color & Font */}
              <div className="card p-5">
                <h3 className="text-[14px] font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Brand Colors</h3>
                <p className="text-[12px] mb-4" style={{ color: "var(--text-muted)" }}>Customize the look of your public booking page</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[12px] font-medium mb-2" style={{ color: "var(--text-muted)" }}>Primary Color (Accent)</label>
                    <div className="flex items-center gap-3">
                      <input type="color" value={branding.primaryColor}
                        onChange={e => setBranding(b => ({ ...b, primaryColor: e.target.value }))}
                        style={{ width: 40, height: 40, borderRadius: 10, border: "1px solid var(--border)", cursor: "pointer", padding: 3 }} />
                      <div className="flex-1">
                        <input className="input w-full text-[13px] font-mono" value={branding.primaryColor}
                          onChange={e => setBranding(b => ({ ...b, primaryColor: e.target.value }))} placeholder="#C9A84C" />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {["#C9A84C","#6366F1","#10B981","#F59E0B","#EC4899","#EF4444"].map(c => (
                        <button key={c} onClick={() => setBranding(b => ({ ...b, primaryColor: c }))}
                          style={{ width: 22, height: 22, borderRadius: 6, background: c, border: branding.primaryColor === c ? "2px solid var(--text-primary)" : "2px solid transparent" }} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium mb-2" style={{ color: "var(--text-muted)" }}>Background Color</label>
                    <div className="flex items-center gap-3">
                      <input type="color" value={branding.accentColor}
                        onChange={e => setBranding(b => ({ ...b, accentColor: e.target.value }))}
                        style={{ width: 40, height: 40, borderRadius: 10, border: "1px solid var(--border)", cursor: "pointer", padding: 3 }} />
                      <div className="flex-1">
                        <input className="input w-full text-[13px] font-mono" value={branding.accentColor}
                          onChange={e => setBranding(b => ({ ...b, accentColor: e.target.value }))} placeholder="#0D1020" />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-medium mb-2" style={{ color: "var(--text-muted)" }}>Font Family</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "inter", label: "Inter", sample: "Aa" },
                      { id: "geist", label: "Geist", sample: "Aa" },
                      { id: "jakarta", label: "Plus Jakarta", sample: "Aa" },
                    ].map(f => (
                      <button key={f.id} onClick={() => setBranding(b => ({ ...b, fontFamily: f.id }))}
                        className="p-3 rounded-xl text-center transition-all"
                        style={{
                          border: branding.fontFamily === f.id ? "1px solid var(--border-gold)" : "1px solid var(--border)",
                          background: branding.fontFamily === f.id ? "var(--gold-subtle)" : "var(--bg-elevated)",
                        }}>
                        <div className="text-[18px] font-bold" style={{ color: branding.fontFamily === f.id ? "var(--gold)" : "var(--text-primary)" }}>{f.sample}</div>
                        <div className="text-[11px] mt-1" style={{ color: "var(--text-muted)" }}>{f.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Logo & Favicon */}
              <div className="card p-5">
                <h3 className="text-[14px] font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Logo & Favicon</h3>
                <p className="text-[12px] mb-4" style={{ color: "var(--text-muted)" }}>Upload your shop logo — shown on booking page and receipts</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Shop Logo", sub: "Recommended: 400×120px, PNG or SVG", key: "logoUploaded" as const },
                    { label: "Favicon", sub: "Recommended: 32×32px, ICO or PNG", key: "faviconUploaded" as const },
                  ].map(item => (
                    <div key={item.key}>
                      <div className="text-[12px] font-medium mb-2" style={{ color: "var(--text-muted)" }}>{item.label}</div>
                      <div className="relative rounded-xl overflow-hidden flex flex-col items-center justify-center gap-2 py-8 transition-all cursor-pointer"
                        style={{ border: "2px dashed var(--border)", background: "var(--bg-elevated)" }}
                        onClick={() => setBranding(b => ({ ...b, [item.key]: true }))}>
                        {branding[item.key] ? (
                          <>
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--gold-subtle)" }}>
                              <Scissors size={18} style={{ color: "var(--gold)" }} />
                            </div>
                            <div className="text-[12px] font-medium" style={{ color: "var(--success)" }}>Logo uploaded ✓</div>
                          </>
                        ) : (
                          <>
                            <Upload size={20} style={{ color: "var(--text-muted)" }} />
                            <div className="text-[12px]" style={{ color: "var(--text-muted)" }}>Click to upload</div>
                            <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>{item.sub}</div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Booking Page Text */}
              <div className="card p-5">
                <h3 className="text-[14px] font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Booking Page Content</h3>
                <p className="text-[12px] mb-4" style={{ color: "var(--text-muted)" }}>Text shown to clients on your public booking page</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Shop Tagline</label>
                    <input className="input w-full text-[13px]" value={branding.shopTagline}
                      onChange={e => setBranding(b => ({ ...b, shopTagline: e.target.value }))} placeholder="Premium Barbershop Experience" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Booking Welcome Message</label>
                    <textarea className="input w-full text-[13px] resize-none" rows={3} value={branding.bookingWelcome}
                      onChange={e => setBranding(b => ({ ...b, bookingWelcome: e.target.value }))} />
                  </div>
                </div>
              </div>

              {/* Booking Options */}
              <div className="card p-5">
                <h3 className="text-[14px] font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Booking Page Options</h3>
                <div className="space-y-0.5">
                  {[
                    { key: "showRatings" as const, label: "Show barber ratings", desc: "Display star ratings on barber selection" },
                    { key: "showPrices" as const, label: "Show prices publicly", desc: "Show service prices on the booking page" },
                    { key: "allowGuestBooking" as const, label: "Allow guest booking", desc: "Clients can book without creating an account" },
                    { key: "requireDeposit" as const, label: "Require deposit to confirm", desc: "Client must pay deposit to secure booking" },
                    { key: "homeServiceEnabled" as const, label: "Enable home service option", desc: "Show home/house service toggle on booking" },
                  ].map((n, i) => (
                    <div key={n.key} className="flex items-center justify-between py-3"
                      style={{ borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
                      <div>
                        <div className="text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>{n.label}</div>
                        <div className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>{n.desc}</div>
                      </div>
                      <Toggle checked={branding[n.key]} onChange={() => setBranding(b => ({ ...b, [n.key]: !b[n.key] }))} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Booking URL */}
              <div className="card p-5">
                <h3 className="text-[14px] font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Booking Page URL</h3>
                <p className="text-[12px] mb-3" style={{ color: "var(--text-muted)" }}>Share this link with your clients to accept bookings online</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 10, background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 12, color: "var(--gold)", fontWeight: 600, flex: 1, wordBreak: "break-all" }}>
                    gentlemans-quarter.barberos.io/book
                  </span>
                  <button className="btn btn-secondary" style={{ fontSize: 11, padding: "5px 10px", flexShrink: 0 }}>Copy</button>
                </div>
              </div>

              {/* Live Preview */}
              <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>Live Preview</h3>
                    <p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>How your booking page header will look</p>
                  </div>
                  <button className="btn btn-ghost gap-1.5 text-[12px]">
                    <Eye size={12} /> View Full Page
                  </button>
                </div>
                <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                  <div style={{ background: branding.accentColor, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: branding.primaryColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Scissors size={18} color="#fff" />
                      </div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{settings.shopName}</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>{branding.shopTagline}</div>
                      </div>
                    </div>
                    <div style={{ background: branding.primaryColor, padding: "7px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600, color: "#fff" }}>
                      Book Now
                    </div>
                  </div>
                  <div style={{ background: "var(--bg-base)", padding: "16px 20px" }}>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{branding.bookingWelcome}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "language" && (
            <>
              <div className="card p-5">
                <h3 className="text-[14px] font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Primary Language</h3>
                <p className="text-[12px] mb-4" style={{ color: "var(--text-muted)" }}>Select your shop's main display language</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {settingLanguages.slice(0, 6).map(lang => {
                    const active = settings.language === lang.code;
                    return (
                      <button key={lang.code} onClick={() => setSettings(s => ({ ...s, language: lang.code }))}
                        className="flex items-center gap-2 p-2.5 rounded-[10px] text-left transition-all"
                        style={{
                          border: active ? "1px solid var(--border-gold)" : "1px solid var(--border)",
                          background: active ? "var(--gold-subtle)" : "var(--bg-elevated)",
                        }}>
                        <span className="text-[18px]">{lang.flag}</span>
                        <div>
                          <div className="text-[12px] font-medium" style={{ color: active ? "var(--gold)" : "var(--text-primary)" }}>{lang.name}</div>
                          <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{lang.region}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="card p-5">
                <h3 className="text-[14px] font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Currency & Timezone</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                  {currencies.map(c => {
                    const active = settings.currency === c.code;
                    return (
                      <button key={c.code} onClick={() => setSettings(s => ({ ...s, currency: c.code }))}
                        className="flex items-center gap-2 p-2.5 rounded-[10px] text-left transition-all"
                        style={{
                          border: active ? "1px solid var(--border-gold)" : "1px solid var(--border)",
                          background: active ? "var(--gold-subtle)" : "var(--bg-elevated)",
                        }}>
                        <span className="text-[15px] font-bold" style={{ color: active ? "var(--gold)" : "var(--text-muted)" }}>{c.symbol}</span>
                        <div>
                          <div className="text-[12px] font-medium" style={{ color: active ? "var(--gold)" : "var(--text-primary)" }}>{c.code}</div>
                          <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{c.name}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div>
                  <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Timezone</label>
                  <select className="input w-full text-[13px]" value={settings.timezone} onChange={e => setSettings(s => ({ ...s, timezone: e.target.value }))}>
                    <option value="Europe/London">🇬🇧 Europe/London (GMT)</option>
                    <option value="Europe/Berlin">🇩🇪 Europe/Berlin (CET)</option>
                    <option value="Europe/Paris">🇫🇷 Europe/Paris (CET)</option>
                    <option value="Asia/Dubai">🇦🇪 Asia/Dubai (GST)</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {activeTab === "api-keys" && (
            <>
              <div className="card p-5">
                <h3 className="text-[14px] font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Your API Keys</h3>
                <p className="text-[12px] mb-4" style={{ color: "var(--text-muted)" }}>
                  Add your own API keys to use your own quotas. If empty, BarberOS platform keys are used.
                  Keys are encrypted at rest and never exposed in API responses.
                </p>
                <div className="space-y-3">
                  {TENANT_API_SERVICES.map((svc, i) => {
                    const hasKey = apiKeys[svc.id]?.length > 0;
                    const isVisible = showKey[svc.id];
                    return (
                      <div
                        key={svc.id}
                        className="flex items-center gap-3 p-3 rounded-xl"
                        style={{
                          background: hasKey ? "var(--gold-subtle)" : "var(--bg-surface)",
                          border: hasKey ? "1px solid rgba(201,168,76,0.25)" : "1px solid transparent",
                        }}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>{svc.name}</p>
                            <span
                              className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                              style={{ background: "var(--bg-elevated)", color: "var(--text-muted)" }}
                            >
                              {svc.category}
                            </span>
                            {hasKey ? (
                              <span className="flex items-center gap-1 text-[10px] font-medium" style={{ color: "#10b981" }}>
                                <CheckCircle2 size={10} /> Using your key
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[10px]" style={{ color: "var(--text-muted)" }}>
                                Using platform key
                              </span>
                            )}
                          </div>
                          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{svc.desc}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="relative">
                            <input
                              type={isVisible ? "text" : "password"}
                              value={apiKeys[svc.id]}
                              onChange={e => setApiKeys(k => ({ ...k, [svc.id]: e.target.value }))}
                              placeholder={svc.placeholder}
                              className="input text-[12px] font-mono pr-8"
                              style={{ width: 200 }}
                            />
                            <button
                              type="button"
                              className="absolute right-2.5 top-1/2 -translate-y-1/2"
                              onClick={() => setShowKey(v => ({ ...v, [svc.id]: !v[svc.id] }))}
                            >
                              {isVisible
                                ? <EyeOff size={13} style={{ color: "var(--text-muted)" }} />
                                : <Eye size={13} style={{ color: "var(--text-muted)" }} />}
                            </button>
                          </div>
                          {hasKey && (
                            <button
                              onClick={() => setApiKeys(k => ({ ...k, [svc.id]: "" }))}
                              style={{ color: "var(--error)" }}
                            >
                              <XCircle size={15} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[11px] mt-4" style={{ color: "var(--text-muted)" }}>
                  🔒 Keys are stored with AES-256 encryption. They are never shown in logs or API responses.
                </p>
              </div>
            </>
          )}

          {activeTab === "notifications" && (
            <div className="card p-5">
              <h3 className="text-[14px] font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Notification Preferences</h3>
              <div className="space-y-0.5">
                {[
                  { key: "newBooking", label: "New booking received", desc: "Instant email + in-app notification" },
                  { key: "reminder24h", label: "24-hour reminder", desc: "Sent to client and barber" },
                  { key: "reminder2h", label: "2-hour reminder", desc: "SMS + push notification" },
                  { key: "cancellation", label: "Cancellation alerts", desc: "When a client cancels" },
                  { key: "lowStock", label: "Low stock alerts", desc: "When product stock is low" },
                  { key: "dailySummary", label: "Daily summary report", desc: "End-of-day revenue summary" },
                ].map((n, i) => (
                  <div key={n.key} className="flex items-center justify-between py-3"
                    style={{ borderBottom: i < 5 ? "1px solid var(--border)" : "none" }}>
                    <div>
                      <div className="text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>{n.label}</div>
                      <div className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>{n.desc}</div>
                    </div>
                    <Toggle
                      checked={settings.notifications[n.key as keyof typeof settings.notifications]}
                      onChange={() => setSettings(s => ({ ...s, notifications: { ...s.notifications, [n.key]: !s.notifications[n.key as keyof typeof s.notifications] } }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "payments" && (
            <div className="card p-5">
              <h3 className="text-[14px] font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Payment Gateways</h3>
              <div className="space-y-0.5">
                {[
                  { name: "Stripe", desc: "Cards, Apple Pay, Google Pay", status: "connected", emoji: "💳" },
                  { name: "PayPal", desc: "PayPal and PayPal Credit", status: "disconnected", emoji: "🅿️" },
                  { name: "Stripe Terminal", desc: "In-person card payments", status: "connected", emoji: "🖨️" },
                ].map((gw, i) => (
                  <div key={gw.name} className="flex items-center justify-between py-3"
                    style={{ borderBottom: i < 2 ? "1px solid var(--border)" : "none" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[10px] flex items-center justify-center text-[18px]" style={{ background: "var(--bg-elevated)" }}>{gw.emoji}</div>
                      <div>
                        <div className="text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>{gw.name}</div>
                        <div className="text-[12px]" style={{ color: "var(--text-muted)" }}>{gw.desc}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[12px] font-medium" style={{ color: gw.status === "connected" ? "var(--success)" : "var(--text-muted)" }}>
                        {gw.status === "connected" ? "● Connected" : "○ Not connected"}
                      </span>
                      <button className="btn btn-ghost text-[12px] h-8 px-3">{gw.status === "connected" ? "Configure" : "Connect"}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="card p-5">
              <h3 className="text-[14px] font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Security Settings</h3>
              <div className="space-y-0.5">
                {[
                  { label: "Two-Factor Authentication", desc: "Extra layer of security for your account", action: "Enable 2FA", danger: false },
                  { label: "Change Password", desc: "Last changed 3 months ago", action: "Update", danger: false },
                  { label: "Active Sessions", desc: "2 active sessions across devices", action: "Revoke All", danger: true },
                ].map((item, i) => (
                  <div key={item.label} className="flex items-center justify-between py-3"
                    style={{ borderBottom: i < 2 ? "1px solid var(--border)" : "none" }}>
                    <div>
                      <div className="text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>{item.label}</div>
                      <div className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>{item.desc}</div>
                    </div>
                    <button className={`btn text-[12px] h-8 px-3 ${item.danger ? "btn-danger" : item.label.includes("2FA") ? "btn-primary" : "btn-ghost"}`}>
                      {item.action}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
