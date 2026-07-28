"use client";
import { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useToast } from "@/contexts/ToastContext";
import {
  mockServices, mockProducts, mockBarbers, mockClients,
  mockAddons, mockDiscounts, mockAppointments, mockStats,
} from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import {
  Search, Minus, Plus, X, User, CreditCard,
  CheckCircle2, Clock, Layers, Calculator,
  Calendar, Sparkles, Check, Landmark,
  TrendingDown, Star, Zap, PenLine, Printer, Mail,
  MessageSquare, FileText, TrendingUp, Package,
  Scissors, Timer, Tag,
  RefreshCw, MoreHorizontal, ChevronDown, ChevronUp,
  Delete, Wallet, RotateCcw,
} from "lucide-react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
type PayMethod = "CASH" | "CARD" | "TAP" | "CREDIT" | "SPLIT";
type ClientMode = null | "walkin" | "search";

interface AddonItem { id: number; name: string; price: number; duration: number; emoji?: string }
interface TicketItem {
  id: string; name: string; price: number; basePrice: number;
  qty: number; type: "service" | "product" | "custom";
  svcId?: number | null; addons: AddonItem[];
}
interface HeldTicket {
  id: string; label: string; items: TicketItem[];
  client: string; clientMode: ClientMode; barber: string; createdAt: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const ADDONS_LIB: AddonItem[] = mockAddons.map((a, i) => ({
  id: a.id, name: a.name, price: a.extraPrice, duration: a.extraDuration,
  emoji: ["🔥", "🧴", "💆", "🌿", "✨", "💈"][i] || "➕",
}));

const QUICK_ADDONS = ADDONS_LIB.slice(0, 3);

const TODAY_APPTS = mockAppointments
  .filter(a => ["confirmed", "pending", "in-progress"].includes(a.status))
  .slice(0, 8);

const SERVICE_CATEGORIES = ["All", "Hair", "Beard", "Shave", "Kids", "Colour", "Package"];
const CAT_ICONS: Record<string, string> = {
  All: "✦", Hair: "✂️", Beard: "🧔", Shave: "🪒", Kids: "👦", Colour: "🎨", Package: "⭐",
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function POSPage() {
  const toast = useToast();

  // Ticket
  const [ticket, setTicket] = useState<TicketItem[]>([]);
  const [barber, setBarber] = useState("");
  const [clientMode, setClientMode] = useState<ClientMode>(null);
  const [client, setClient] = useState("");
  const [clientSearch, setClientSearch] = useState("");
  const [showClientDrop, setShowClientDrop] = useState(false);

  // Item browser
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [mobilePanel, setMobilePanel] = useState<"items" | "ticket">("items");

  // Add-on sheet (appears after service tap)
  const [showAddonSheet, setShowAddonSheet] = useState(false);
  const [pendingService, setPendingService] = useState<typeof allItems[0] | null>(null);
  const [sheetAddons, setSheetAddons] = useState<AddonItem[]>([]);

  // Discount / notes / tip
  const [showDiscountRow, setShowDiscountRow] = useState(false);
  const [discountTab, setDiscountTab] = useState<"pct" | "fixed" | "promo">("pct");
  const [discountPct, setDiscountPct] = useState("");
  const [discountFixed, setDiscountFixed] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [orderNotes, setOrderNotes] = useState("");
  const [showTip, setShowTip] = useState(false);
  const [tipAmount, setTipAmount] = useState(0);
  const [customTip, setCustomTip] = useState("");

  // Price editing
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState("");

  // Payment screen
  const [showPaymentScreen, setShowPaymentScreen] = useState(false);
  const [payMethod, setPayMethod] = useState<PayMethod>("CASH");
  const [cashGiven, setCashGiven] = useState("");
  const [splitCash, setSplitCash] = useState("");
  const [splitCard, setSplitCard] = useState("");

  // Receipt / success
  const [showReceipt, setShowReceipt] = useState(false);

  // Hold / recall
  const [heldTickets, setHeldTickets] = useState<HeldTicket[]>([]);
  const [showHeld, setShowHeld] = useState(false);

  // Modals
  const [showApptQueue, setShowApptQueue] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [customItem, setCustomItem] = useState({ name: "", price: "" });
  const [eodModal, setEodModal] = useState(false);
  const [eodCash, setEodCash] = useState("");
  const [refundMode, setRefundMode] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showQuickRecord, setShowQuickRecord] = useState(false);
  const [quickMode, setQuickMode] = useState<"expense" | "loan">("expense");
  const [expForm, setExpForm] = useState({ desc: "", amount: "", cat: "Utilities", paidTo: "" });
  const [loanForm, setLoanForm] = useState({ party: "", amount: "", reason: "", type: "given" as "given" | "taken" });
  const [showSummary, setShowSummary] = useState(false);

  // ── Derived ────────────────────────────────────────────────────────────────
  const allItems = [
    ...mockServices.map(s => ({ id: `svc-${s.id}`, name: s.name, price: s.price, type: "service" as const, svcId: s.id, icon: s.icon, duration: s.duration, category: s.category, stock: null, sku: null })),
    ...mockProducts.map(p => ({ id: `prod-${p.id}`, name: p.name, price: p.price, type: "product" as const, svcId: null, icon: "📦", duration: 0, category: p.category, stock: (p as any).stock, sku: (p as any).sku })),
  ];

  const quickServices = allItems.filter(i => i.type === "service").slice(0, 3);

  const filtered = allItems.filter(item => {
    const q = search.toLowerCase();
    const matchQ = item.name.toLowerCase().includes(q) || item.sku?.toLowerCase().includes(q);
    if (!matchQ) return false;
    if (category === "All") return true;
    if (category === "Products") return item.type === "product";
    return item.type === "service" && item.category === category;
  });

  const filteredClients = clientSearch.length > 0
    ? mockClients.filter(c => c.name.toLowerCase().includes(clientSearch.toLowerCase()) || c.phone.includes(clientSearch)).slice(0, 5)
    : [];

  const serviceItems = filtered.filter(i => i.type === "service");
  const productItems = filtered.filter(i => i.type === "product");

  const subtotal = ticket.reduce((s, i) => s + i.price * i.qty, 0);
  const discountAmt = discountPct
    ? Math.round(subtotal * parseFloat(discountPct) / 100 * 100) / 100
    : discountFixed ? parseFloat(discountFixed) || 0 : 0;
  const afterDiscount = Math.max(0, subtotal - discountAmt);
  const tax = Math.round(afterDiscount * 0.20 * 100) / 100;
  const total = afterDiscount + tax + tipAmount;
  const cashChange = payMethod === "CASH" && cashGiven ? parseFloat(cashGiven) - total : null;
  const splitRemaining = total - (parseFloat(splitCash) || 0) - (parseFloat(splitCard) || 0);
  const ticketCount = ticket.reduce((s, i) => s + i.qty, 0);
  const hasOrder = ticket.length > 0;
  const canCharge = hasOrder && !!barber;

  // ── Quick cash amounts ─────────────────────────────────────────────────────
  const quickCashAmounts = (() => {
    const t = total;
    const exact = Math.ceil(t);
    const next5 = Math.ceil(t / 5) * 5;
    const next10 = Math.ceil(t / 10) * 10;
    const next20 = Math.ceil(t / 20) * 20;
    return [...new Set([exact, next5, next10, next20])].slice(0, 4);
  })();

  // ── Actions ────────────────────────────────────────────────────────────────
  const handleServiceTap = (item: typeof allItems[0]) => {
    if (item.type === "product") {
      addToTicket(item, []);
      if (mobilePanel === "items") setMobilePanel("ticket");
      return;
    }
    setPendingService(item);
    setSheetAddons([]);
    setShowAddonSheet(true);
  };

  const confirmAddonSheet = () => {
    if (!pendingService) return;
    addToTicket(pendingService, sheetAddons);
    setShowAddonSheet(false);
    setPendingService(null);
    setSheetAddons([]);
    if (mobilePanel === "items") setMobilePanel("ticket");
  };

  const skipAddons = () => {
    if (!pendingService) return;
    addToTicket(pendingService, []);
    setShowAddonSheet(false);
    setPendingService(null);
    setSheetAddons([]);
    if (mobilePanel === "items") setMobilePanel("ticket");
  };

  const toggleSheetAddon = (addon: AddonItem) =>
    setSheetAddons(prev => prev.some(a => a.id === addon.id) ? prev.filter(a => a.id !== addon.id) : [...prev, addon]);

  const addToTicket = (item: typeof allItems[0], addons: AddonItem[]) => {
    const addonPrice = addons.reduce((s, a) => s + a.price, 0);
    const id = `${item.id}-${Date.now()}`;
    if (item.type === "product") {
      setTicket(prev => {
        const ex = prev.find(c => c.name === item.name && c.type === "product");
        if (ex) return prev.map(c => c.id === ex.id ? { ...c, qty: c.qty + 1 } : c);
        return [...prev, { id, name: item.name, price: item.price, basePrice: item.price, qty: 1, type: "product", svcId: null, addons: [] }];
      });
    } else {
      setTicket(prev => [...prev, { id, name: item.name, price: item.price + addonPrice, basePrice: item.price, qty: 1, type: item.type as "service", svcId: item.svcId, addons }]);
    }
  };

  const toggleQuickAddon = (addon: AddonItem) => {
    const existingId = ticket.find(t => t.id.startsWith(`qa-${addon.id}`))?.id;
    if (existingId) {
      setTicket(prev => prev.filter(t => t.id !== existingId));
    } else {
      setTicket(prev => [...prev, { id: `qa-${addon.id}-${Date.now()}`, name: addon.name, price: addon.price, basePrice: addon.price, qty: 1, type: "service", svcId: null, addons: [] }]);
    }
  };

  const addCustom = () => {
    if (!customItem.name || !customItem.price) return;
    const id = `custom-${Date.now()}`;
    setTicket(prev => [...prev, { id, name: customItem.name, price: parseFloat(customItem.price), basePrice: parseFloat(customItem.price), qty: 1, type: "custom", addons: [] }]);
    toast.success("Custom item added");
    setShowCustom(false);
    setCustomItem({ name: "", price: "" });
  };

  const updateQty = (id: string, delta: number) =>
    setTicket(prev => prev.map(c => c.id === id ? { ...c, qty: Math.max(1, c.qty + delta) } : c));

  const removeItem = (id: string) => setTicket(prev => prev.filter(c => c.id !== id));

  const startEditPrice = (item: TicketItem) => {
    setEditingPriceId(item.id);
    setEditingPrice(item.price.toFixed(2));
  };

  const confirmEditPrice = (id: string) => {
    const p = parseFloat(editingPrice);
    if (!isNaN(p) && p >= 0) setTicket(prev => prev.map(t => t.id === id ? { ...t, price: p } : t));
    setEditingPriceId(null);
  };

  const clearTicket = () => {
    setTicket([]); setClient(""); setClientMode(null); setBarber("");
    setDiscountPct(""); setDiscountFixed(""); setPromoCode("");
    setOrderNotes(""); setCashGiven(""); setSplitCash(""); setSplitCard("");
    setShowDiscountRow(false); setShowNotes(false);
    setTipAmount(0); setCustomTip(""); setShowTip(false);
  };

  const applyPromo = () => {
    const found = mockDiscounts.find(d => d.code === promoCode.toUpperCase());
    if (found && found.type === "percent") {
      setDiscountPct(found.value.toString()); setDiscountFixed("");
      toast.success(`${found.value}% discount applied`); setShowDiscountRow(false);
    } else toast.error("Invalid promo code");
  };

  const holdTicket = () => {
    if (!hasOrder) { toast.error("Ticket is empty"); return; }
    setHeldTickets(prev => [...prev, { id: Date.now().toString(), label: client || `Ticket ${prev.length + 1}`, items: [...ticket], client, clientMode, barber, createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    clearTicket(); toast.info("Ticket saved — tap Recall to restore");
  };

  const recallTicket = (held: HeldTicket) => {
    setTicket(held.items); setClient(held.client); setClientMode(held.clientMode); setBarber(held.barber);
    setHeldTickets(prev => prev.filter(h => h.id !== held.id));
    setShowHeld(false); toast.info("Ticket restored");
  };

  const loadFromAppt = (appt: typeof TODAY_APPTS[0]) => {
    const svc = mockServices.find(s => s.name === appt.service);
    const items: TicketItem[] = [];
    if (svc) items.push({ id: `svc-${svc.id}-${Date.now()}`, name: svc.name, price: svc.price, basePrice: svc.price, qty: 1, type: "service", svcId: svc.id, addons: [] });
    setTicket(items); setClient(appt.client); setClientMode("search"); setBarber(appt.barber);
    setShowApptQueue(false); toast.success(`Loaded — ${appt.client}`);
  };

  const handleCharge = () => {
    if (!hasOrder) { toast.error("Ticket is empty"); return; }
    if (!barber) { toast.error("Select a barber first"); return; }
    setShowPaymentScreen(true);
  };

  const handleConfirmPayment = () => {
    if (payMethod === "CASH" && cashGiven && cashChange !== null && cashChange < 0) { toast.error("Insufficient cash"); return; }
    if (payMethod === "SPLIT" && splitRemaining > 0.01) { toast.error(`Still need ${formatCurrency(splitRemaining)}`); return; }
    setShowPaymentScreen(false);
    setShowReceipt(true);
  };

  const handleNewSale = () => {
    clearTicket(); setShowReceipt(false); setPayMethod("CASH");
  };

  const appendCash = (digit: string) => {
    setCashGiven(prev => {
      const val = prev + digit;
      return isNaN(parseFloat(val)) ? prev : val;
    });
  };
  const backspaceCash = () => setCashGiven(prev => prev.slice(0, -1));

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <DashboardShell role="admin">

      {/* ══ ADD-ON SHEET ═══════════════════════════════════════════════════ */}
      {showAddonSheet && pendingService && (
        <div className="modal-overlay" onClick={() => { setShowAddonSheet(false); setPendingService(null); }}>
          <div className="modal-panel" style={{ maxWidth: 440, width: "100%" }} onClick={e => e.stopPropagation()}>
            {/* Service header */}
            <div style={{ padding: "24px 24px 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: "var(--gold-subtle)", border: "2px solid var(--border-gold)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{pendingService.icon}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 18, fontWeight: 900, color: "var(--text-primary)", marginBottom: 2 }}>{pendingService.name}</p>
                  <p style={{ fontSize: 22, fontWeight: 900, color: "var(--gold)", letterSpacing: "-0.02em" }}>{formatCurrency(pendingService.price)}</p>
                </div>
              </div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Add extras?</p>
            </div>
            {/* Addon list */}
            <div style={{ padding: "0 16px", maxHeight: 320, overflowY: "auto" }} className="scrollable">
              {ADDONS_LIB.map(addon => {
                const active = sheetAddons.some(a => a.id === addon.id);
                return (
                  <button key={addon.id} onClick={() => toggleSheetAddon(addon)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 14, cursor: "pointer", textAlign: "left", marginBottom: 8, background: active ? "var(--gold-subtle)" : "var(--bg-elevated)", border: `2px solid ${active ? "var(--gold)" : "var(--border)"}`, transition: "all 0.12s" }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: active ? "var(--gold)" : "var(--bg-card)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0, border: active ? "none" : "1px solid var(--border)" }}>
                      {active ? <Check size={18} style={{ color: "#0A0800" }} /> : addon.emoji}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 1 }}>{addon.name}</p>
                      <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{addon.duration > 0 ? `+${addon.duration} min` : "Instant"}</p>
                    </div>
                    <span style={{ fontSize: 16, fontWeight: 900, color: active ? "var(--gold)" : "var(--text-secondary)" }}>+{formatCurrency(addon.price)}</span>
                  </button>
                );
              })}
            </div>
            {/* Footer */}
            <div style={{ padding: "16px 24px 24px", display: "flex", gap: 10 }}>
              <button className="btn btn-ghost" style={{ flex: 1, justifyContent: "center", padding: "14px" }} onClick={skipAddons}>Skip</button>
              <button className="btn btn-primary" style={{ flex: 2, justifyContent: "center", padding: "14px", fontSize: 15, fontWeight: 800, gap: 8 }} onClick={confirmAddonSheet}>
                <Plus size={15} /> Add to Ticket
                {sheetAddons.length > 0 && <span style={{ background: "rgba(0,0,0,0.2)", borderRadius: 999, padding: "1px 8px", fontSize: 12 }}>+{sheetAddons.length} extras</span>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ PAYMENT SCREEN (full-screen) ════════════════════════════════════ */}
      {showPaymentScreen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 24px", borderBottom: "1px solid var(--border)", background: "var(--bg-card)", flexShrink: 0 }}>
            <button className="btn btn-ghost" style={{ padding: "8px 10px" }} onClick={() => setShowPaymentScreen(false)}>
              <X size={18} />
            </button>
            <p style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)" }}>Take Payment</p>
            <div style={{ flex: 1 }} />
            <div style={{ background: "var(--gold-subtle)", border: "1px solid var(--border-gold)", borderRadius: 10, padding: "8px 18px" }}>
              <p style={{ fontSize: 28, fontWeight: 900, color: "var(--gold)", letterSpacing: "-0.03em", lineHeight: 1 }}>{formatCurrency(total)}</p>
            </div>
          </div>

          <div style={{ flex: 1, overflow: "hidden", display: "flex" }}>
            {/* Left: payment method selection */}
            <div style={{ flex: 1, padding: "24px", display: "flex", flexDirection: "column", gap: 16, overflowY: "auto" }} className="scrollable">
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Payment method</p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {([
                  { id: "CASH" as const, emoji: "💵", label: "Cash", sub: "Calculate change" },
                  { id: "CARD" as const, emoji: "💳", label: "Card", sub: "Chip, tap or swipe" },
                  { id: "TAP" as const, emoji: "📱", label: "Tap to Pay", sub: "Apple/Google Pay" },
                  { id: "CREDIT" as const, emoji: "📋", label: "Credit", sub: "Record as credit" },
                  { id: "SPLIT" as const, emoji: "⚡", label: "Split", sub: "Cash + card" },
                ]).map(pm => {
                  const active = payMethod === pm.id;
                  return (
                    <button key={pm.id} onClick={() => setPayMethod(pm.id)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 20px", borderRadius: 16, cursor: "pointer", textAlign: "left", background: active ? "var(--gold)" : "var(--bg-card)", border: `2px solid ${active ? "var(--gold)" : "var(--border)"}`, transition: "all 0.15s", boxShadow: active ? "0 6px 24px var(--gold-glow)" : "none" }}>
                      <span style={{ fontSize: 28 }}>{pm.emoji}</span>
                      <div>
                        <p style={{ fontSize: 15, fontWeight: 800, color: active ? "#0A0800" : "var(--text-primary)", marginBottom: 1 }}>{pm.label}</p>
                        <p style={{ fontSize: 11, color: active ? "rgba(0,0,0,0.5)" : "var(--text-muted)" }}>{pm.sub}</p>
                      </div>
                      {active && <div style={{ marginLeft: "auto", width: 22, height: 22, borderRadius: "50%", background: "rgba(0,0,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}><Check size={13} style={{ color: "#0A0800" }} /></div>}
                    </button>
                  );
                })}
              </div>

              {/* SPLIT inputs */}
              {payMethod === "SPLIT" && (
                <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>Split Payment</p>
                  {[
                    { label: "💵 Cash amount", val: splitCash, set: setSplitCash },
                    { label: "💳 Card amount", val: splitCard, set: setSplitCard },
                  ].map(f => (
                    <div key={f.label}>
                      <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 5 }}>{f.label}</p>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontWeight: 700 }}>£</span>
                        <input className="input" type="number" style={{ paddingLeft: 27, fontFamily: "monospace", fontSize: 18, fontWeight: 700 }} value={f.val} onChange={e => f.set(e.target.value)} placeholder="0.00" />
                      </div>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid var(--border)" }}>
                    <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Remaining</span>
                    <span style={{ fontSize: 18, fontWeight: 900, color: splitRemaining > 0.01 ? "var(--error)" : "var(--success)" }}>{splitRemaining > 0.01 ? `−${formatCurrency(splitRemaining)}` : "✓ Covered"}</span>
                  </div>
                </div>
              )}

              {/* CARD instructions */}
              {payMethod === "CARD" && (
                <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 14, padding: 20, textAlign: "center" }}>
                  <p style={{ fontSize: 28, marginBottom: 8 }}>💳</p>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>Please tap, insert, or swipe card</p>
                  <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Confirm once the terminal shows payment complete</p>
                </div>
              )}

              {payMethod === "TAP" && (
                <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 14, padding: 20, textAlign: "center" }}>
                  <p style={{ fontSize: 28, marginBottom: 8 }}>📱</p>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>Hold phone or watch near reader</p>
                  <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Apple Pay · Google Pay · Samsung Pay</p>
                </div>
              )}
            </div>

            {/* Right: cash number pad (only for CASH) */}
            {payMethod === "CASH" && (
              <div style={{ width: 320, borderLeft: "1px solid var(--border)", background: "var(--bg-card)", display: "flex", flexDirection: "column", padding: 24, gap: 16, flexShrink: 0 }}>
                {/* Cash display */}
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Cash received</p>
                  <div style={{ background: "var(--bg-elevated)", borderRadius: 14, padding: "16px 18px", border: "2px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 700 }}>£</span>
                    <span style={{ fontSize: 32, fontWeight: 900, color: "var(--text-primary)", letterSpacing: "-0.03em", fontFamily: "monospace" }}>{cashGiven || "0.00"}</span>
                    <button onClick={backspaceCash} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4 }}><Delete size={18} /></button>
                  </div>
                  {cashGiven && cashChange !== null && (
                    <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 10, background: cashChange >= 0 ? "var(--success-bg)" : "var(--error-bg)", display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: cashChange >= 0 ? "var(--success)" : "var(--error)" }}>{cashChange >= 0 ? "💵 Change" : "⚠️ Need more"}</span>
                      <span style={{ fontSize: 20, fontWeight: 900, color: cashChange >= 0 ? "var(--success)" : "var(--error)" }}>{formatCurrency(Math.abs(cashChange))}</span>
                    </div>
                  )}
                </div>

                {/* Quick amounts */}
                <div>
                  <p style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 6, fontWeight: 600 }}>Quick amount</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                    {quickCashAmounts.map(amt => (
                      <button key={amt} onClick={() => setCashGiven(amt.toFixed(2))} style={{ padding: "10px", borderRadius: 10, background: "var(--bg-elevated)", border: "1px solid var(--border)", cursor: "pointer", fontSize: 14, fontWeight: 800, color: "var(--text-primary)", fontFamily: "monospace" }}>
                        £{amt.toFixed(0)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Number pad */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, flex: 1 }}>
                  {["1","2","3","4","5","6","7","8","9","00","0","."].map(d => (
                    <button key={d} onClick={() => appendCash(d)} style={{ padding: "14px", borderRadius: 12, background: "var(--bg-elevated)", border: "1px solid var(--border)", cursor: "pointer", fontSize: 18, fontWeight: 800, color: "var(--text-primary)", fontFamily: "monospace", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.1s" }}
                      onMouseDown={e => (e.currentTarget as HTMLButtonElement).style.background = "var(--border)"}
                      onMouseUp={e => (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-elevated)"}
                    >{d}</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirm payment button */}
          <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border)", background: "var(--bg-card)", flexShrink: 0 }}>
            <button className="btn btn-primary" onClick={handleConfirmPayment} style={{ width: "100%", justifyContent: "center", fontSize: 17, fontWeight: 900, padding: "17px", borderRadius: 16, gap: 10, boxShadow: "0 6px 24px var(--gold-glow)" }}>
              <CheckCircle2 size={18} /> Confirm Payment — {formatCurrency(total)}
            </button>
          </div>
        </div>
      )}

      {/* ══ SUCCESS / RECEIPT (full-screen) ═════════════════════════════════ */}
      {showReceipt && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "var(--bg-base)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
          {/* Success icon */}
          <div style={{ width: 88, height: 88, borderRadius: "50%", background: "var(--success-bg)", border: "3px solid var(--success)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, boxShadow: "0 0 60px rgba(34,197,94,0.3)" }}>
            <CheckCircle2 size={40} style={{ color: "var(--success)" }} />
          </div>

          <p style={{ fontSize: 30, fontWeight: 900, color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: 6 }}>Payment Complete!</p>
          <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 6 }}>{client || "Walk-in Guest"}</p>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 28 }}>Served by <strong style={{ color: "var(--text-secondary)" }}>{barber}</strong></p>

          {/* Total */}
          <div style={{ background: "var(--gold-subtle)", border: "2px solid var(--border-gold)", borderRadius: 20, padding: "20px 40px", marginBottom: 24, textAlign: "center" }}>
            <p style={{ fontSize: 12, color: "var(--gold)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Total Paid</p>
            <p style={{ fontSize: 48, fontWeight: 900, color: "var(--gold)", letterSpacing: "-0.04em", lineHeight: 1 }}>{formatCurrency(total)}</p>
          </div>

          {/* Ticket items */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: "16px 20px", width: "100%", maxWidth: 400, marginBottom: 24 }}>
            {ticket.map(item => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{item.qty > 1 ? `${item.qty}× ` : ""}{item.name}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{formatCurrency(item.price * item.qty)}</span>
              </div>
            ))}
            {discountAmt > 0 && <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid var(--border)" }}><span style={{ fontSize: 12, color: "var(--success)" }}>Discount</span><span style={{ fontSize: 12, fontWeight: 700, color: "var(--success)" }}>−{formatCurrency(discountAmt)}</span></div>}
            {tipAmount > 0 && <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 12, color: "var(--text-muted)" }}>Tip</span><span style={{ fontSize: 12, fontWeight: 700 }}>{formatCurrency(tipAmount)}</span></div>}
            {payMethod === "CASH" && cashChange !== null && cashChange > 0 && (
              <div style={{ marginTop: 10, padding: "10px 14px", background: "var(--success-bg)", borderRadius: 10, border: "1px solid rgba(34,197,94,0.2)", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--success)" }}>💵 Change</span>
                <span style={{ fontSize: 18, fontWeight: 900, color: "var(--success)" }}>{formatCurrency(cashChange)}</span>
              </div>
            )}
          </div>

          {/* Receipt options */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, width: "100%", maxWidth: 400, marginBottom: 14 }}>
            {[{ icon: <Printer size={18} />, label: "Print" }, { icon: <Mail size={18} />, label: "Email" }, { icon: <MessageSquare size={18} />, label: "WhatsApp" }].map(o => (
              <button key={o.label} className="btn btn-secondary" style={{ flexDirection: "column", gap: 6, padding: "14px 6px", fontSize: 12, borderRadius: 14 }} onClick={() => toast.success(`${o.label} sent`)}>
                {o.icon}{o.label}
              </button>
            ))}
          </div>

          {/* New Sale */}
          <button className="btn btn-primary" style={{ width: "100%", maxWidth: 400, justifyContent: "center", fontSize: 17, fontWeight: 900, padding: "17px", borderRadius: 16, gap: 10, boxShadow: "0 6px 24px var(--gold-glow)" }} onClick={handleNewSale}>
            <Plus size={18} /> New Sale
          </button>
        </div>
      )}

      {/* ══ HELD TICKETS ════════════════════════════════════════════════════ */}
      {showHeld && (
        <div className="modal-overlay" onClick={() => setShowHeld(false)}>
          <div className="modal-panel" style={{ maxWidth: 380, width: "100%" }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><p style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>Held Tickets</p><p style={{ fontSize: 12, color: "var(--text-muted)" }}>{heldTickets.length} on hold</p></div>
              <button className="btn btn-ghost" style={{ padding: "5px 7px" }} onClick={() => setShowHeld(false)}><X size={14} /></button>
            </div>
            <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8, maxHeight: 400, overflowY: "auto" }} className="scrollable">
              {heldTickets.length === 0 ? (
                <div style={{ textAlign: "center", padding: "36px 0", color: "var(--text-muted)" }}><Layers size={28} style={{ margin: "0 auto 10px", display: "block", opacity: 0.3 }} /><p style={{ fontSize: 13 }}>No held tickets</p></div>
              ) : heldTickets.map(ht => (
                <button key={ht.id} onClick={() => recallTicket(ht)} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 14, padding: "14px 18px", cursor: "pointer", textAlign: "left", width: "100%" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{ht.label}</span><span style={{ fontSize: 11, color: "var(--text-muted)" }}>{ht.createdAt}</span></div>
                  <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{ht.items.length} item{ht.items.length !== 1 ? "s" : ""} · {ht.barber || "No barber"}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══ APPOINTMENT QUEUE ═══════════════════════════════════════════════ */}
      {showApptQueue && (
        <div className="modal-overlay" onClick={() => setShowApptQueue(false)}>
          <div className="modal-panel" style={{ maxWidth: 520, width: "100%" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid var(--border)" }}>
              <div><p style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>Today's Appointments</p><p style={{ fontSize: 12, color: "var(--text-muted)" }}>Tap to load into the terminal</p></div>
              <button className="btn btn-ghost" style={{ padding: "5px 7px" }} onClick={() => setShowApptQueue(false)}><X size={14} /></button>
            </div>
            <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8, maxHeight: "65vh", overflowY: "auto" }} className="scrollable">
              {TODAY_APPTS.map(appt => (
                <button key={appt.id} onClick={() => loadFromAppt(appt)} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 14, padding: "16px 18px", cursor: "pointer", textAlign: "left", width: "100%", transition: "all 0.15s" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = "var(--gold)"; el.style.background = "var(--gold-subtle)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = "var(--border)"; el.style.background = "var(--bg-elevated)"; }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--gold-subtle)", border: "1px solid var(--border-gold)", display: "flex", alignItems: "center", justifyContent: "center" }}><User size={16} style={{ color: "var(--gold)" }} /></div>
                      <div><p style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>{appt.client}</p><p style={{ fontSize: 11, color: "var(--text-muted)" }}>with {appt.barber}</p></div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: 17, fontWeight: 900, color: "var(--gold)" }}>{formatCurrency(appt.amount)}</p>
                      <p style={{ fontSize: 11, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 3, justifyContent: "flex-end" }}><Clock size={10} />{appt.time}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 600 }}>{appt.service}</span>
                    {appt.addons.map(a => <span key={a} style={{ fontSize: 11, background: "var(--gold-subtle)", color: "var(--gold)", borderRadius: 999, padding: "2px 8px", border: "1px solid var(--border-gold)" }}>+{a}</span>)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══ CUSTOM ITEM ═════════════════════════════════════════════════════ */}
      {showCustom && (
        <div className="modal-overlay" onClick={() => setShowCustom(false)}>
          <div className="modal-panel" style={{ maxWidth: 340, width: "100%" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid var(--border)" }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>Custom Item</p>
              <button className="btn btn-ghost" style={{ padding: "5px 7px" }} onClick={() => setShowCustom(false)}><X size={14} /></button>
            </div>
            <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 14 }}>
              <input className="input" placeholder="Item name e.g. Extra service" value={customItem.name} onChange={e => setCustomItem(c => ({ ...c, name: e.target.value }))} autoFocus />
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: 15, fontWeight: 700, pointerEvents: "none" }}>£</span>
                <input className="input" type="number" style={{ paddingLeft: 30, fontFamily: "monospace", fontSize: 18, fontWeight: 700 }} placeholder="0.00" value={customItem.price} onChange={e => setCustomItem(c => ({ ...c, price: e.target.value }))} />
              </div>
              <button className="btn btn-primary" style={{ gap: 8, justifyContent: "center", padding: "13px" }} onClick={addCustom}><Plus size={15} /> Add to Ticket</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ EOD ═════════════════════════════════════════════════════════════ */}
      {eodModal && (
        <div className="modal-overlay" onClick={() => setEodModal(false)}>
          <div className="modal-panel" style={{ maxWidth: 440, width: "100%" }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: "var(--gold-subtle)", display: "flex", alignItems: "center", justifyContent: "center" }}><Calculator size={24} style={{ color: "var(--gold)" }} /></div>
                <div><h3 style={{ fontSize: 18, fontWeight: 900, color: "var(--text-primary)" }}>End of Day</h3><p style={{ fontSize: 12, color: "var(--text-muted)" }}>Close out today's register</p></div>
              </div>
              <div style={{ background: "var(--bg-elevated)", borderRadius: 16, padding: 20, marginBottom: 20 }}>
                {[{ label: "Cash Sales", value: "£284.00" }, { label: "Card Sales", value: "£1,000.50" }, { label: "Total Revenue", value: "£1,284.50", gold: true }, { label: "Expenses", value: "£3,200.00", red: true }, { label: "Transactions", value: "31" }, { label: "Avg. Ticket", value: "£41.44" }].map(row => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{row.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: (row as any).gold ? "var(--gold)" : (row as any).red ? "var(--error)" : "var(--text-primary)" }}>{row.value}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: 8 }}>Cash in drawer (count now)</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: 15, fontWeight: 700, pointerEvents: "none" }}>£</span>
                  <input className="input" value={eodCash} onChange={e => setEodCash(e.target.value)} placeholder="0.00" style={{ paddingLeft: 28, fontFamily: "monospace", fontSize: 18, fontWeight: 700 }} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-ghost" style={{ flex: 1, justifyContent: "center" }} onClick={() => setEodModal(false)}>Cancel</button>
                <button className="btn btn-primary" style={{ flex: 2, justifyContent: "center", gap: 8 }} onClick={() => { toast.success("Day closed — report saved"); setEodModal(false); }}><Check size={14} /> Close Register</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ EXPENSE / LOAN ══════════════════════════════════════════════════ */}
      {showQuickRecord && (
        <div className="modal-overlay" onClick={() => setShowQuickRecord(false)}>
          <div className="modal-panel" style={{ maxWidth: 420, width: "100%" }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>Quick Record</p>
              <button className="btn btn-ghost" style={{ padding: "5px 7px" }} onClick={() => setShowQuickRecord(false)}><X size={14} /></button>
            </div>
            <div style={{ padding: 22 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
                {([{ id: "expense" as const, label: "Record Expense", icon: <TrendingDown size={18} />, color: "var(--error)", bg: "var(--error-bg)" }, { id: "loan" as const, label: "Give / Receive", icon: <Landmark size={18} />, color: "var(--gold)", bg: "var(--gold-subtle)" }]).map(m => (
                  <button key={m.id} onClick={() => setQuickMode(m.id)} style={{ padding: "16px 10px", borderRadius: 14, cursor: "pointer", textAlign: "center", background: quickMode === m.id ? m.bg : "var(--bg-elevated)", border: `2px solid ${quickMode === m.id ? m.color : "var(--border)"}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, transition: "all 0.15s" }}>
                    <span style={{ color: quickMode === m.id ? m.color : "var(--text-muted)" }}>{m.icon}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: quickMode === m.id ? m.color : "var(--text-secondary)" }}>{m.label}</span>
                  </button>
                ))}
              </div>
              {quickMode === "expense" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <input className="input" placeholder="Description e.g. Electricity bill" value={expForm.desc} onChange={e => setExpForm(f => ({ ...f, desc: e.target.value }))} />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div style={{ position: "relative" }}><span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: 14, fontWeight: 700, pointerEvents: "none" }}>£</span><input className="input" type="number" style={{ paddingLeft: 26 }} placeholder="Amount" value={expForm.amount} onChange={e => setExpForm(f => ({ ...f, amount: e.target.value }))} /></div>
                    <select className="input" value={expForm.cat} onChange={e => setExpForm(f => ({ ...f, cat: e.target.value }))}>{["Rent", "Utilities", "Staff", "Marketing", "Equipment", "Maintenance", "Other"].map(c => <option key={c}>{c}</option>)}</select>
                  </div>
                  <input className="input" placeholder="Paid to (name)" value={expForm.paidTo} onChange={e => setExpForm(f => ({ ...f, paidTo: e.target.value }))} />
                  <button className="btn btn-primary" style={{ gap: 8, justifyContent: "center", padding: "13px" }} onClick={() => { if (!expForm.desc || !expForm.amount) { toast.error("Fill description and amount"); return; } toast.success(`Expense — ${formatCurrency(parseFloat(expForm.amount))}`); setExpForm({ desc: "", amount: "", cat: "Utilities", paidTo: "" }); setShowQuickRecord(false); }}><Check size={14} /> Record Expense</button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {(["given", "taken"] as const).map(t => (
                      <button key={t} onClick={() => setLoanForm(f => ({ ...f, type: t }))} style={{ padding: "11px", borderRadius: 12, cursor: "pointer", textAlign: "center", background: loanForm.type === t ? (t === "given" ? "var(--gold-subtle)" : "var(--error-bg)") : "var(--bg-elevated)", border: `2px solid ${loanForm.type === t ? (t === "given" ? "var(--gold)" : "var(--error)") : "var(--border)"}`, transition: "all 0.15s" }}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: loanForm.type === t ? (t === "given" ? "var(--gold)" : "var(--error)") : "var(--text-secondary)" }}>{t === "given" ? "↗ Given Out" : "↙ Received"}</p>
                      </button>
                    ))}
                  </div>
                  <input className="input" placeholder="Party name" value={loanForm.party} onChange={e => setLoanForm(f => ({ ...f, party: e.target.value }))} />
                  <div style={{ position: "relative" }}><span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: 14, fontWeight: 700, pointerEvents: "none" }}>£</span><input className="input" type="number" style={{ paddingLeft: 26 }} placeholder="Amount" value={loanForm.amount} onChange={e => setLoanForm(f => ({ ...f, amount: e.target.value }))} /></div>
                  <input className="input" placeholder="Reason e.g. Advance on wages" value={loanForm.reason} onChange={e => setLoanForm(f => ({ ...f, reason: e.target.value }))} />
                  <button className="btn btn-primary" style={{ gap: 8, justifyContent: "center", padding: "13px" }} onClick={() => { if (!loanForm.party || !loanForm.amount) { toast.error("Fill required fields"); return; } toast.success(`${loanForm.type === "given" ? "Loan given" : "Received"} — ${formatCurrency(parseFloat(loanForm.amount))}`); setLoanForm({ party: "", amount: "", reason: "", type: "given" }); setShowQuickRecord(false); }}><Check size={14} /> Record</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════ MAIN POS LAYOUT ══════════════════════════════ */}
      <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 64px)", overflow: "hidden", background: "var(--bg-base)" }}>

        {/* ── Top bar ─────────────────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 16px", borderBottom: "1px solid var(--border)", background: "var(--bg-card)", flexShrink: 0 }}>
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Scissors size={15} style={{ color: "#0A0800" }} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 900, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>POS Terminal</span>
          </div>

          {refundMode && (
            <span style={{ fontSize: 11, fontWeight: 800, background: "var(--error-bg)", color: "var(--error)", borderRadius: 6, padding: "4px 10px", border: "1px solid rgba(244,63,94,0.3)" }}>REFUND MODE</span>
          )}

          <div style={{ flex: 1 }} />

          {/* Today summary toggle */}
          <button onClick={() => setShowSummary(s => !s)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: "pointer", background: showSummary ? "var(--gold-subtle)" : "var(--bg-elevated)", color: showSummary ? "var(--gold)" : "var(--text-secondary)", border: showSummary ? "1px solid var(--border-gold)" : "1px solid var(--border)", transition: "all 0.15s" }}>
            <TrendingUp size={13} />
            Today
            {showSummary ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          </button>

          {/* Hold */}
          <button onClick={holdTicket} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: "pointer", background: "var(--bg-elevated)", color: "var(--text-secondary)", border: "1px solid var(--border)", transition: "all 0.15s" }}>
            <Layers size={13} />
            Hold
            {heldTickets.length > 0 && <span style={{ background: "var(--gold)", color: "#0A0800", borderRadius: 999, fontSize: 9, fontWeight: 900, padding: "1px 5px" }}>{heldTickets.length}</span>}
          </button>

          {/* Recall (only if held tickets) */}
          {heldTickets.length > 0 && (
            <button onClick={() => setShowHeld(true)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: "pointer", background: "var(--gold-subtle)", color: "var(--gold)", border: "1px solid var(--border-gold)", transition: "all 0.15s" }}>
              <RefreshCw size={13} /> Recall
            </button>
          )}

          {/* Appointments bell */}
          <button onClick={() => setShowApptQueue(true)} style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 9, cursor: "pointer", background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-secondary)", transition: "all 0.15s" }}>
            <Calendar size={15} />
            {TODAY_APPTS.length > 0 && <span style={{ position: "absolute", top: -4, right: -4, width: 16, height: 16, borderRadius: "50%", background: "var(--gold)", color: "#0A0800", fontSize: 8, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>{TODAY_APPTS.length}</span>}
          </button>

          {/* More menu */}
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowMoreMenu(m => !m)} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 9, cursor: "pointer", background: showMoreMenu ? "var(--bg-elevated)" : "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
              <MoreHorizontal size={16} />
            </button>
            {showMoreMenu && (
              <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, boxShadow: "var(--shadow-lg)", zIndex: 100, minWidth: 180, overflow: "hidden" }} onClick={() => setShowMoreMenu(false)}>
                {[
                  { label: refundMode ? "Exit Refund Mode" : "Refund Mode", icon: <RotateCcw size={13} />, action: () => { setRefundMode(!refundMode); if (!refundMode) toast.info("Refund mode on"); }, red: !refundMode || undefined },
                  { label: "Record Expense", icon: <TrendingDown size={13} />, action: () => { setShowQuickRecord(true); setQuickMode("expense"); } },
                  { label: "Give / Receive Loan", icon: <Landmark size={13} />, action: () => { setShowQuickRecord(true); setQuickMode("loan"); } },
                  { label: "Custom Item", icon: <PenLine size={13} />, action: () => setShowCustom(true) },
                  { label: "End of Day", icon: <Calculator size={13} />, action: () => setEodModal(true) },
                  { label: "Sales Reports", icon: <FileText size={13} />, href: "/admin/pos/sales" },
                ].map((item, i) => item.href ? (
                  <Link key={i} href={item.href} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", textDecoration: "none", color: "var(--text-secondary)", fontSize: 13, fontWeight: 600, borderBottom: i < 5 ? "1px solid var(--border)" : "none" }}>
                    <span style={{ color: "var(--text-muted)" }}>{item.icon}</span>{item.label}
                  </Link>
                ) : (
                  <button key={i} onClick={item.action} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", background: "none", border: "none", width: "100%", cursor: "pointer", color: (item as any).red ? "var(--error)" : "var(--text-secondary)", fontSize: 13, fontWeight: 600, textAlign: "left", borderBottom: i < 5 ? "1px solid var(--border)" : "none" }}>
                    <span style={{ color: (item as any).red ? "var(--error)" : "var(--text-muted)" }}>{item.icon}</span>{item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Today's Summary Drawer ──────────────────────────────────────── */}
        {showSummary && (
          <div style={{ display: "flex", gap: 16, padding: "12px 16px", borderBottom: "1px solid var(--border)", background: "var(--bg-card)", flexShrink: 0 }}>
            {[
              { label: "Revenue", value: formatCurrency(mockStats.todayRevenue), color: "var(--success)", icon: "📈" },
              { label: "Transactions", value: "14", color: "var(--gold)", icon: "🧾" },
              { label: "Avg. Ticket", value: "£41.44", color: "#6366f1", icon: "📊" },
              { label: "Cash Drawer", value: "£185", color: "var(--text-secondary)", icon: "💵" },
            ].map(s => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px", flex: 1 }}>
                <span style={{ fontSize: 18 }}>{s.icon}</span>
                <div>
                  <p style={{ fontSize: 16, fontWeight: 900, color: s.color, lineHeight: 1, marginBottom: 3 }}>{s.value}</p>
                  <p style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600 }}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Mobile tabs (2 tabs) ─────────────────────────────────────────── */}
        <div className="lg:hidden" style={{ display: "flex", borderBottom: "1px solid var(--border)", flexShrink: 0, background: "var(--bg-card)" }}>
          {([{ id: "items" as const, label: "Services & Products" }, { id: "ticket" as const, label: `Ticket${ticketCount > 0 ? ` (${ticketCount})` : ""}` }]).map(t => (
            <button key={t.id} onClick={() => setMobilePanel(t.id)} style={{ flex: 1, padding: "11px 0", fontSize: 12, fontWeight: 700, cursor: "pointer", background: "none", border: "none", color: mobilePanel === t.id ? "var(--gold)" : "var(--text-muted)", borderBottom: mobilePanel === t.id ? "2px solid var(--gold)" : "2px solid transparent" }}>{t.label}</button>
          ))}
        </div>

        {/* ══ Two-panel area ════════════════════════════════════════════════ */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }} onClick={() => showMoreMenu && setShowMoreMenu(false)}>

          {/* ── LEFT: Item Browser (55%) ───────────────────────────────── */}
          <div className="lg:flex" style={{ flex: "0 0 55%", display: mobilePanel === "items" ? "flex" : "none", flexDirection: "column", overflow: "hidden", borderRight: "1px solid var(--border)" }}>
            {/* Search row */}
            <div style={{ padding: "12px 14px 0", flexShrink: 0 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                <div style={{ position: "relative", flex: 1 }}>
                  <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
                  <input className="input" style={{ paddingLeft: 36, paddingRight: search ? 34 : 12, borderRadius: 12, fontSize: 13 }}
                    value={search} onChange={e => setSearch(e.target.value)} placeholder="Search services, products or scan barcode…" />
                  {search && <button onClick={() => setSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><X size={13} /></button>}
                </div>
              </div>
              {/* Category pills */}
              <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 10 }} className="scrollable">
                {SERVICE_CATEGORIES.concat(["Products"]).map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 13px", borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: "pointer", flexShrink: 0, transition: "all 0.15s", background: category === cat ? "var(--gold)" : "var(--bg-elevated)", color: category === cat ? "#0A0800" : "var(--text-secondary)", border: category === cat ? "1.5px solid var(--gold)" : "1.5px solid var(--border)", boxShadow: category === cat ? "0 2px 10px var(--gold-glow)" : "none" }}>
                    <span style={{ fontSize: 13 }}>{cat === "Products" ? "📦" : CAT_ICONS[cat] || "●"}</span>{cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Item grid */}
            <div style={{ flex: 1, overflowY: "auto", padding: "0 14px 14px" }} className="scrollable">
              {/* Quick Services row (only visible in "All" or no search) */}
              {category === "All" && !search && (
                <div style={{ marginBottom: 18 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                    <Zap size={12} style={{ color: "var(--gold)" }} />
                    <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--gold)" }}>Quick Services</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                    {quickServices.map(item => {
                      const inTicket = ticket.find(c => c.name === item.name);
                      return (
                        <button key={item.id} onClick={() => handleServiceTap(item)} style={{ background: inTicket ? "var(--gold)" : "var(--gold-subtle)", border: `2px solid var(--gold)`, borderRadius: 18, padding: "18px 14px", cursor: "pointer", textAlign: "left", display: "flex", flexDirection: "column", minHeight: 160, position: "relative", transition: "all 0.15s", boxShadow: "0 4px 16px var(--gold-glow)" }}>
                          {inTicket && <div style={{ position: "absolute", top: 10, right: 10, width: 24, height: 24, background: "#0A0800", color: "var(--gold)", borderRadius: "50%", fontSize: 11, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>{inTicket.qty}</div>}
                          <span style={{ fontSize: 30, marginBottom: 10, lineHeight: 1 }}>{item.icon}</span>
                          <p style={{ fontSize: 14, fontWeight: 800, color: inTicket ? "#0A0800" : "var(--text-primary)", lineHeight: 1.3, flex: 1, marginBottom: 8 }}>{item.name}</p>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 17, fontWeight: 900, color: inTicket ? "#0A0800" : "var(--gold)" }}>{formatCurrency(item.price)}</span>
                            {item.duration > 0 && <span style={{ fontSize: 10, color: inTicket ? "rgba(0,0,0,0.5)" : "var(--text-muted)", display: "flex", alignItems: "center", gap: 2 }}><Timer size={9} />{item.duration}m</span>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* All services */}
              {category !== "Products" && serviceItems.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  {(category === "All" || search) && (
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 10 }}>
                      <Scissors size={11} style={{ color: "var(--text-muted)" }} />
                      <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)" }}>All Services</span>
                    </div>
                  )}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
                    {serviceItems
                      .filter(i => category === "All" && !search ? !quickServices.some(q => q.id === i.id) : true)
                      .map(item => {
                        const inTicket = ticket.find(c => c.name === item.name);
                        return (
                          <button key={item.id} onClick={() => handleServiceTap(item)} style={{ background: inTicket ? "var(--gold-subtle)" : "var(--bg-card)", border: inTicket ? "2px solid var(--gold)" : "1.5px solid var(--border)", borderRadius: 16, padding: "16px 14px 14px", cursor: "pointer", textAlign: "left", display: "flex", flexDirection: "column", minHeight: 150, position: "relative", transition: "all 0.15s", boxShadow: inTicket ? "0 0 0 3px var(--gold-glow)" : "0 1px 3px rgba(0,0,0,0.05)" }}
                            onMouseEnter={e => { if (!inTicket) { const el = e.currentTarget as HTMLButtonElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 6px 18px rgba(0,0,0,0.10)"; } }}
                            onMouseLeave={e => { if (!inTicket) { const el = e.currentTarget as HTMLButtonElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)"; } }}
                          >
                            {inTicket && <div style={{ position: "absolute", top: 9, right: 9, width: 22, height: 22, background: "var(--gold)", color: "#0A0800", borderRadius: "50%", fontSize: 11, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>{inTicket.qty}</div>}
                            <span style={{ fontSize: 28, marginBottom: 9, lineHeight: 1 }}>{item.icon}</span>
                            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.3, flex: 1, marginBottom: 8 }}>{item.name}</p>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                              <span style={{ fontSize: 15, fontWeight: 900, color: "var(--gold)" }}>{formatCurrency(item.price)}</span>
                              {item.duration > 0 && <span style={{ fontSize: 10, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 2 }}><Timer size={9} />{item.duration}m</span>}
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Products */}
              {(category === "All" || category === "Products") && productItems.length > 0 && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 10 }}>
                    <Package size={11} style={{ color: "var(--text-muted)" }} />
                    <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)" }}>Products</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
                    {productItems.map(item => {
                      const inTicket = ticket.find(c => c.name === item.name && c.type === "product");
                      const isLow = item.stock !== null && item.stock <= 5;
                      return (
                        <button key={item.id} onClick={() => handleServiceTap(item)} style={{ background: inTicket ? "var(--gold-subtle)" : "var(--bg-card)", border: inTicket ? "2px solid var(--gold)" : "1.5px solid var(--border)", borderRadius: 16, padding: "16px 14px 14px", cursor: "pointer", textAlign: "left", display: "flex", flexDirection: "column", minHeight: 150, position: "relative", transition: "all 0.15s" }}>
                          {inTicket && <div style={{ position: "absolute", top: 9, right: 9, width: 22, height: 22, background: "var(--gold)", color: "#0A0800", borderRadius: "50%", fontSize: 11, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>{inTicket.qty}</div>}
                          {isLow && !inTicket && <div style={{ position: "absolute", top: 8, right: 8, background: "var(--error-bg)", color: "var(--error)", borderRadius: 5, fontSize: 8, fontWeight: 800, padding: "2px 5px", border: "1px solid rgba(244,63,94,0.2)" }}>LOW</div>}
                          <span style={{ fontSize: 26, marginBottom: 9, lineHeight: 1 }}>📦</span>
                          <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.3, flex: 1, marginBottom: 8 }}>{item.name}</p>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 15, fontWeight: 900, color: "var(--gold)" }}>{formatCurrency(item.price)}</span>
                            {item.stock !== null && <span style={{ fontSize: 10, color: isLow ? "var(--error)" : "var(--text-muted)" }}>{item.stock} left</span>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {filtered.length === 0 && (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
                  <Search size={32} style={{ margin: "0 auto 12px", display: "block", opacity: 0.2 }} />
                  <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>No items found</p>
                  <button className="btn btn-secondary" style={{ gap: 6, marginTop: 12, fontSize: 12 }} onClick={() => setShowCustom(true)}><PenLine size={12} /> Custom item</button>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Live Ticket (45%) ───────────────────────────────── */}
          <div className="lg:flex" style={{ flex: 1, display: mobilePanel === "ticket" ? "flex" : "none", flexDirection: "column", overflow: "hidden", background: "var(--bg-surface)" }}>

            {/* ── Step 1: Who is serving? ── */}
            <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", flexShrink: 0, background: "var(--bg-card)" }}>
              <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: !barber ? "var(--error)" : "var(--text-muted)", marginBottom: 10 }}>
                {barber ? "✓ Serving barber" : "① Select barber first"}
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {mockBarbers.filter(b => b.status !== "inactive").map(b => {
                  const active = barber === b.name;
                  return (
                    <button key={b.id} onClick={() => setBarber(active ? "" : b.name)} style={{ display: "flex", alignItems: "center", gap: 9, padding: "10px 16px", borderRadius: 12, cursor: "pointer", background: active ? `${b.color}20` : "var(--bg-elevated)", border: `2px solid ${active ? b.color : "var(--border)"}`, transition: "all 0.15s", boxShadow: active ? `0 2px 12px ${b.color}30` : "none" }}>
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: active ? b.color : "var(--bg-card)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: active ? "#fff" : "var(--text-secondary)", border: active ? `2px solid ${b.color}` : "1px solid var(--border)", flexShrink: 0 }}>
                        {b.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: active ? b.color : "var(--text-secondary)", whiteSpace: "nowrap" }}>{b.name.split(" ")[0]}</span>
                      {active && <Check size={13} style={{ color: b.color, flexShrink: 0 }} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Step 2: Client ── */}
            <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", flexShrink: 0, background: "var(--bg-card)" }}>
              {clientMode === null ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <button onClick={() => setClientMode("search")} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "13px", borderRadius: 12, cursor: "pointer", background: "var(--bg-elevated)", border: "1.5px solid var(--border)", fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", transition: "all 0.15s" }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = "var(--gold)"; el.style.color = "var(--text-primary)"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = "var(--border)"; el.style.color = "var(--text-secondary)"; }}
                  >
                    <Search size={14} /> Search Client
                  </button>
                  <button onClick={() => { setClientMode("walkin"); setClient("Walk-in Guest"); }} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "13px", borderRadius: 12, cursor: "pointer", background: "var(--bg-elevated)", border: "1.5px solid var(--border)", fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", transition: "all 0.15s" }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = "var(--border-strong)"; el.style.color = "var(--text-primary)"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = "var(--border)"; el.style.color = "var(--text-secondary)"; }}
                  >
                    <User size={14} /> Walk-in
                  </button>
                </div>
              ) : clientMode === "walkin" ? (
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "var(--bg-elevated)", borderRadius: 12, border: "1.5px solid var(--border)" }}>
                  <User size={14} style={{ color: "var(--text-muted)" }} />
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>Walk-in Guest</span>
                  <button onClick={() => { setClientMode(null); setClient(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><X size={13} /></button>
                </div>
              ) : (
                <div style={{ position: "relative" }}>
                  <Search size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
                  <input className="input" style={{ paddingLeft: 30, paddingRight: client ? 32 : 12, fontSize: 13, borderRadius: 12 }} autoFocus
                    value={client || clientSearch}
                    onChange={e => { setClientSearch(e.target.value); setClient(""); setShowClientDrop(true); }}
                    onFocus={() => setShowClientDrop(true)}
                    placeholder="Search by name or phone…" />
                  {(client || clientSearch) && (
                    <button onClick={() => { setClient(""); setClientSearch(""); setClientMode(null); }} style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><X size={12} /></button>
                  )}
                  {showClientDrop && filteredClients.length > 0 && (
                    <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 50, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-lg)", overflow: "hidden" }}>
                      {filteredClients.map(c => (
                        <button key={c.id} onClick={() => { setClient(c.name); setClientSearch(""); setShowClientDrop(false); }} style={{ display: "flex", alignItems: "center", gap: 9, padding: "10px 12px", background: "none", border: "none", width: "100%", cursor: "pointer", textAlign: "left" }}
                          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-elevated)"}
                          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "transparent"}
                        >
                          <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--gold-subtle)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid var(--border-gold)" }}><User size={12} style={{ color: "var(--gold)" }} /></div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>{c.name}</p>
                            <p style={{ fontSize: 10, color: "var(--text-muted)" }}>{c.visits} visits · {formatCurrency(c.spent)}</p>
                          </div>
                          {c.status === "vip" && <Star size={11} style={{ color: "var(--gold)", fill: "var(--gold)", flexShrink: 0 }} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Ticket header ── */}
            <div style={{ padding: "10px 16px 6px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <FileText size={13} style={{ color: "var(--text-muted)" }} />
                <span style={{ fontSize: 12, fontWeight: 800, color: "var(--text-primary)" }}>Ticket</span>
                {ticketCount > 0 && <span style={{ fontSize: 10, fontWeight: 800, background: "var(--gold)", color: "#0A0800", borderRadius: 999, padding: "1px 7px" }}>{ticketCount}</span>}
                {refundMode && <span style={{ fontSize: 9, fontWeight: 800, background: "var(--error-bg)", color: "var(--error)", borderRadius: 5, padding: "2px 6px" }}>REFUND</span>}
              </div>
              <div style={{ display: "flex", gap: 5 }}>
                <button onClick={() => setShowApptQueue(true)} style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, fontWeight: 700, color: "var(--gold)", background: "var(--gold-subtle)", border: "1px solid var(--border-gold)", borderRadius: 7, padding: "3px 8px", cursor: "pointer" }}><Calendar size={10} /> Load appt</button>
                {hasOrder && <button onClick={clearTicket} style={{ fontSize: 10, fontWeight: 600, color: "var(--text-muted)", background: "none", border: "1px solid var(--border)", borderRadius: 7, padding: "3px 8px", cursor: "pointer" }}>Clear</button>}
              </div>
            </div>

            {/* ── Ticket items (scrollable) ── */}
            <div style={{ flex: 1, overflowY: "auto", padding: "2px 16px 0" }} className="scrollable">
              {!hasOrder ? (
                <div style={{ textAlign: "center", padding: "32px 16px", color: "var(--text-muted)" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--bg-elevated)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", border: "1.5px dashed var(--border)" }}>
                    <Scissors size={22} style={{ opacity: 0.25 }} />
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>Ticket is empty</p>
                  <p style={{ fontSize: 11, opacity: 0.6, marginBottom: 14 }}>Tap a service on the left to start</p>
                  <button className="btn btn-secondary" style={{ gap: 5, fontSize: 11, margin: "0 auto" }} onClick={() => setShowApptQueue(true)}><Calendar size={11} /> Load Appointment</button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingBottom: 6 }}>
                  {ticket.map(item => (
                    <div key={item.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "10px 12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</p>
                          {item.addons && item.addons.length > 0 && (
                            <p style={{ fontSize: 10, color: "var(--gold)", marginTop: 2 }}>+ {item.addons.map(a => a.name).join(", ")}</p>
                          )}
                          {item.type === "product" && <p style={{ fontSize: 10, color: "var(--text-muted)" }}>Product</p>}
                          {item.type === "custom" && <p style={{ fontSize: 10, color: "var(--text-muted)" }}>Custom</p>}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
                          <button onClick={() => updateQty(item.id, -1)} style={{ width: 26, height: 26, borderRadius: 7, background: "var(--bg-elevated)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Minus size={10} /></button>
                          <span style={{ fontSize: 12, fontWeight: 800, color: "var(--text-primary)", minWidth: 16, textAlign: "center" }}>{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} style={{ width: 26, height: 26, borderRadius: 7, background: "var(--bg-elevated)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Plus size={10} /></button>
                          {/* Price — tap to edit */}
                          {editingPriceId === item.id ? (
                            <div style={{ position: "relative" }}>
                              <input autoFocus type="number" className="input" style={{ width: 70, fontSize: 12, fontWeight: 800, textAlign: "right", height: 28, padding: "0 6px", fontFamily: "monospace" }} value={editingPrice} onChange={e => setEditingPrice(e.target.value)} onBlur={() => confirmEditPrice(item.id)} onKeyDown={e => { if (e.key === "Enter") confirmEditPrice(item.id); if (e.key === "Escape") setEditingPriceId(null); }} />
                            </div>
                          ) : (
                            <button onClick={() => startEditPrice(item)} title="Tap to override price" style={{ fontSize: 13, fontWeight: 900, color: item.price !== item.basePrice ? "var(--gold)" : "var(--text-primary)", minWidth: 52, textAlign: "right", background: "none", border: "none", cursor: "pointer", padding: "3px 4px", borderRadius: 6, fontFamily: "monospace" }}
                              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-elevated)"}
                              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "none"}
                            >{formatCurrency(item.price * item.qty)}</button>
                          )}
                          <button onClick={() => removeItem(item.id)} style={{ width: 22, height: 22, borderRadius: 5, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", opacity: 0.5 }}><X size={11} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Bottom checkout area ── */}
            <div style={{ flexShrink: 0, borderTop: "1px solid var(--border)", background: "var(--bg-card)" }}>

              {/* Quick add-ons row */}
              <div style={{ padding: "10px 16px 0", display: "flex", gap: 7, overflowX: "auto" }} className="scrollable">
                {QUICK_ADDONS.map(addon => {
                  const isIn = ticket.some(t => t.id.startsWith(`qa-${addon.id}`));
                  return (
                    <button key={addon.id} onClick={() => toggleQuickAddon(addon)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 11px", borderRadius: 999, cursor: "pointer", flexShrink: 0, background: isIn ? "var(--gold)" : "var(--bg-elevated)", border: `1.5px solid ${isIn ? "var(--gold)" : "var(--border)"}`, color: isIn ? "#0A0800" : "var(--text-secondary)", fontSize: 11, fontWeight: 700, transition: "all 0.12s" }}>
                      <span style={{ fontSize: 13 }}>{addon.emoji}</span>
                      <span>{addon.name}</span>
                      <span style={{ fontSize: 11, fontWeight: 800 }}>+{formatCurrency(addon.price)}</span>
                    </button>
                  );
                })}
                <button onClick={() => setShowAddonSheet(true)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 11px", borderRadius: 999, cursor: "pointer", flexShrink: 0, background: "var(--bg-elevated)", border: "1.5px solid var(--border)", color: "var(--text-muted)", fontSize: 11, fontWeight: 700, transition: "all 0.12s" }}>
                  <Sparkles size={11} /> More extras
                </button>
              </div>

              {/* Discount + Notes row */}
              <div style={{ padding: "10px 16px 0", display: "flex", gap: 8 }}>
                {!showDiscountRow ? (
                  <button onClick={() => setShowDiscountRow(true)} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: discountAmt > 0 ? "var(--success)" : "var(--text-muted)", background: discountAmt > 0 ? "var(--success-bg)" : "var(--bg-elevated)", border: `1px solid ${discountAmt > 0 ? "rgba(34,197,94,0.3)" : "var(--border)"}`, borderRadius: 8, padding: "7px 11px", cursor: "pointer", flex: 1 }}>
                    <Tag size={12} />{discountAmt > 0 ? `Discount −${formatCurrency(discountAmt)}` : "Add discount / promo"}
                  </button>
                ) : (
                  <div style={{ flex: 1, background: "var(--bg-elevated)", borderRadius: 10, padding: "10px 12px", border: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                      {(["pct", "fixed", "promo"] as const).map(t => (
                        <button key={t} onClick={() => setDiscountTab(t)} style={{ flex: 1, padding: "5px", borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: "pointer", background: discountTab === t ? "var(--gold)" : "var(--bg-card)", color: discountTab === t ? "#0A0800" : "var(--text-muted)", border: discountTab === t ? "1px solid var(--gold)" : "1px solid var(--border)" }}>
                          {t === "pct" ? "% Off" : t === "fixed" ? "£ Off" : "Code"}
                        </button>
                      ))}
                      <button onClick={() => { setShowDiscountRow(false); setDiscountPct(""); setDiscountFixed(""); setPromoCode(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><X size={13} /></button>
                    </div>
                    {discountTab === "pct" && <div style={{ position: "relative" }}><input className="input" style={{ paddingRight: 26, fontSize: 14, fontWeight: 700 }} type="number" value={discountPct} onChange={e => { setDiscountPct(e.target.value); setDiscountFixed(""); }} placeholder="e.g. 10" /><span style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontWeight: 700 }}>%</span></div>}
                    {discountTab === "fixed" && <div style={{ position: "relative" }}><span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontWeight: 700 }}>£</span><input className="input" style={{ paddingLeft: 22, fontSize: 14, fontWeight: 700 }} type="number" value={discountFixed} onChange={e => { setDiscountFixed(e.target.value); setDiscountPct(""); }} placeholder="0.00" /></div>}
                    {discountTab === "promo" && <div style={{ display: "flex", gap: 6 }}><input className="input" style={{ flex: 1, fontSize: 13, fontWeight: 700, letterSpacing: "0.05em" }} value={promoCode} onChange={e => setPromoCode(e.target.value)} onKeyDown={e => e.key === "Enter" && applyPromo()} placeholder="PROMO CODE" /><button className="btn btn-secondary" style={{ padding: "0 12px", fontSize: 12, flexShrink: 0 }} onClick={applyPromo}>Apply</button></div>}
                  </div>
                )}

                {!showNotes ? (
                  <button onClick={() => setShowNotes(true)} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: orderNotes ? "var(--text-primary)" : "var(--text-muted)", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 8, padding: "7px 11px", cursor: "pointer", flexShrink: 0 }}>
                    <PenLine size={12} />{orderNotes ? "Note" : "Note"}
                  </button>
                ) : (
                  <input className="input" style={{ fontSize: 12, width: 120, flexShrink: 0 }} value={orderNotes} onChange={e => setOrderNotes(e.target.value)} placeholder="Order note…" autoFocus onBlur={() => !orderNotes && setShowNotes(false)} />
                )}
              </div>

              {/* Totals */}
              <div style={{ padding: "10px 16px 0" }}>
                <div style={{ background: "var(--bg-elevated)", borderRadius: 12, padding: "10px 14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontSize: 12, color: "var(--text-muted)" }}>Subtotal</span><span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>{formatCurrency(subtotal)}</span></div>
                  {discountAmt > 0 && <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontSize: 12, color: "var(--success)" }}>Discount</span><span style={{ fontSize: 12, fontWeight: 700, color: "var(--success)" }}>−{formatCurrency(discountAmt)}</span></div>}
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><span style={{ fontSize: 12, color: "var(--text-muted)" }}>VAT 20%</span><span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>{formatCurrency(tax)}</span></div>
                  {tipAmount > 0 && <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><span style={{ fontSize: 12, color: "var(--text-muted)" }}>Tip</span><span style={{ fontSize: 12, fontWeight: 700 }}>{formatCurrency(tipAmount)}</span></div>}
                  <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid var(--border)" }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)" }}>Total</span>
                    <span style={{ fontSize: 24, fontWeight: 900, color: "var(--gold)", letterSpacing: "-0.03em" }}>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>

              {/* Tip row */}
              <div style={{ padding: "8px 16px 0" }}>
                {!showTip ? (
                  <button onClick={() => setShowTip(true)} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, color: tipAmount > 0 ? "var(--gold)" : "var(--text-muted)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    <Wallet size={11} />{tipAmount > 0 ? `Tip added: ${formatCurrency(tipAmount)}` : "Add tip?"}
                  </button>
                ) : (
                  <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                    {[2, 5, 10].map(t => (
                      <button key={t} onClick={() => { setTipAmount(t); setCustomTip(""); setShowTip(false); }} style={{ padding: "5px 10px", borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: "pointer", background: tipAmount === t ? "var(--gold)" : "var(--bg-elevated)", color: tipAmount === t ? "#0A0800" : "var(--text-secondary)", border: `1.5px solid ${tipAmount === t ? "var(--gold)" : "var(--border)"}` }}>
                        £{t}
                      </button>
                    ))}
                    <div style={{ position: "relative", flex: 1 }}>
                      <span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: 11, fontWeight: 700 }}>£</span>
                      <input className="input" type="number" style={{ paddingLeft: 18, fontSize: 12, height: 32 }} placeholder="Other" value={customTip} onChange={e => { setCustomTip(e.target.value); setTipAmount(parseFloat(e.target.value) || 0); }} />
                    </div>
                    <button onClick={() => { setShowTip(false); if (!tipAmount) setTipAmount(0); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><X size={13} /></button>
                  </div>
                )}
              </div>

              {/* Charge button */}
              <div style={{ padding: "10px 16px 14px" }}>
                <button onClick={handleCharge} disabled={!canCharge} style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 10, fontSize: 17, fontWeight: 900, padding: "15px", borderRadius: 14, cursor: canCharge ? "pointer" : "not-allowed", background: canCharge ? "var(--gold)" : "var(--bg-elevated)", color: canCharge ? "#0A0800" : "var(--text-muted)", border: canCharge ? "none" : "1.5px solid var(--border)", boxShadow: canCharge ? "0 6px 24px var(--gold-glow)" : "none", transition: "all 0.2s" }}>
                  {canCharge ? (
                    <><Zap size={17} /> Charge {formatCurrency(total)}</>
                  ) : !barber ? (
                    <><User size={15} /> Select a barber first</>
                  ) : (
                    <><Scissors size={15} /> Add services to ticket</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
