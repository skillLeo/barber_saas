"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Calendar, Users, Scissors, ShoppingBag,
  BarChart3, Settings, CreditCard, Package, Tag, Building2,
  Sparkles, Menu, X, DollarSign, UserCheck, Wand2, Globe,
  Key, ChevronDown, LogOut, Star, ShoppingCart, Receipt,
  PackageCheck, TrendingDown, Landmark, PieChart, Wallet, Archive,
  CalendarDays
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeVariant?: "gold" | "red";
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const superAdminGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/super-admin", icon: LayoutDashboard },
      { label: "Analytics", href: "/super-admin/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Management",
    items: [
      { label: "Tenants", href: "/super-admin/tenants", icon: Building2 },
      { label: "Subscriptions", href: "/super-admin/subscriptions", icon: CreditCard },
    ],
  },
  {
    label: "Platform",
    items: [
      { label: "API Keys", href: "/super-admin/api-keys", icon: Key },
      { label: "Branding", href: "/super-admin/branding", icon: Sparkles },
      { label: "Languages", href: "/super-admin/languages", icon: Globe },
      { label: "Settings", href: "/super-admin/settings", icon: Settings },
    ],
  },
];

const adminGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Bookings", href: "/admin/bookings", icon: Calendar, badge: 8, badgeVariant: "gold" },
      { label: "My Schedule", href: "/admin/schedule", icon: CalendarDays },
    ],
  },
  {
    label: "Point of Sale",
    items: [
      { label: "POS Terminal", href: "/admin/pos", icon: ShoppingCart },
      { label: "Sales History", href: "/admin/pos/sales", icon: Receipt },
      { label: "Purchases", href: "/admin/pos/purchases", icon: PackageCheck },
      { label: "Expenses", href: "/admin/pos/expenses", icon: TrendingDown },
      { label: "Loans & Credits", href: "/admin/pos/loans", icon: Landmark },
      { label: "Staff Salaries", href: "/admin/pos/salaries", icon: Wallet },
      { label: "Stock & Inventory", href: "/admin/pos/stock", icon: Archive },
    ],
  },
  {
    label: "People",
    items: [
      { label: "Clients", href: "/admin/clients", icon: Users },
      { label: "Staff", href: "/admin/staff", icon: UserCheck },
    ],
  },
  {
    label: "Catalogue",
    items: [
      { label: "Services", href: "/admin/services", icon: Scissors },
      { label: "Products", href: "/admin/products", icon: Package },
      { label: "Discounts", href: "/admin/discounts", icon: Tag },
    ],
  },
  {
    label: "Tools",
    items: [
      { label: "AI Stylist", href: "/admin/ai-stylist", icon: Wand2, badge: "NEW", badgeVariant: "gold" },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

const barberGroups: NavGroup[] = [
  {
    label: "My Work",
    items: [
      { label: "My Schedule", href: "/barber", icon: Calendar },
      { label: "My Bookings", href: "/barber/bookings", icon: Scissors, badge: 3, badgeVariant: "gold" },
    ],
  },
  {
    label: "People",
    items: [
      { label: "My Clients", href: "/barber/clients", icon: Users },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "My Earnings", href: "/barber/earnings", icon: DollarSign },
      { label: "My Profile", href: "/barber/profile", icon: Settings },
    ],
  },
];

const roleConfig = {
  "super-admin": { groups: superAdminGroups, label: "Super Admin", color: "var(--gold)" },
  "admin":       { groups: adminGroups, label: "Shop Owner", color: "#6366F1" },
  "manager":     { groups: adminGroups, label: "Manager", color: "var(--success)" },
  "barber":      { groups: barberGroups, label: "Barber", color: "var(--warning)" },
  "receptionist":{ groups: adminGroups, label: "Receptionist", color: "#EC4899" },
};

interface SidebarProps {
  role?: keyof typeof roleConfig;
}

export function Sidebar({ role = "admin" }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  useTheme();
  const { groups, label, color } = roleConfig[role];

  const isActive = (href: string) =>
    href === "/admin" || href === "/super-admin" || href === "/barber"
      ? pathname === href
      : pathname === href || pathname.startsWith(href + "/");

  const NavItemLink = ({ item }: { item: NavItem }) => {
    const active = isActive(item.href);
    return (
      <Link
        href={item.href}
        onClick={() => setMobileOpen(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "9px 12px",
          borderRadius: 10,
          fontSize: 13.5,
          fontWeight: active ? 600 : 500,
          color: active ? "var(--gold)" : "var(--text-secondary)",
          background: active ? "var(--gold-subtle)" : "transparent",
          textDecoration: "none",
          position: "relative",
          whiteSpace: "nowrap",
          transition: "background 0.15s, color 0.15s",
          borderLeft: active ? "3px solid var(--gold)" : "3px solid transparent",
        }}
        onMouseEnter={e => {
          if (!active) {
            (e.currentTarget as HTMLElement).style.background = "var(--bg-elevated)";
            (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
          }
        }}
        onMouseLeave={e => {
          if (!active) {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
          }
        }}
      >
        <item.icon
          size={15}
          style={{ flexShrink: 0, color: active ? "var(--gold)" : "var(--text-muted)" }}
          strokeWidth={active ? 2.2 : 1.8}
        />
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>{item.label}</span>
        {item.badge && (
          <span style={{
            fontSize: 10,
            fontWeight: 700,
            borderRadius: 999,
            padding: "2px 6px",
            lineHeight: 1.4,
            flexShrink: 0,
            background: item.badgeVariant === "gold" ? "var(--gold-subtle)" : "var(--error-bg)",
            color: item.badgeVariant === "gold" ? "var(--gold)" : "var(--error)",
          }}>
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  const Content = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--bg-surface)" }}>
      {/* Logo */}
      <div style={{ padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)",
            boxShadow: "0 2px 8px var(--gold-glow)",
          }}>
            <Scissors size={15} color="#0A0800" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1, color: "var(--text-primary)" }}>BarberOS</div>
            <div style={{ fontSize: 11, fontWeight: 500, marginTop: 3, color }}>{label}</div>
          </div>
        </div>
        <button
          className="lg:hidden"
          style={{ width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-elevated)", border: "none", cursor: "pointer" }}
          onClick={() => setMobileOpen(false)}
        >
          <X size={14} color="var(--text-secondary)" />
        </button>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: 20 }}>
        {groups.map((group) => (
          <div key={group.label}>
            <div style={{
              fontSize: 10.5, fontWeight: 600, textTransform: "uppercase",
              letterSpacing: "0.07em", padding: "0 12px", marginBottom: 6,
              color: "var(--text-muted)",
            }}>
              {group.label}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {group.items.map((item) => (
                <NavItemLink key={item.href} item={item} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Plan badge */}
      {role === "admin" && (
        <div style={{ margin: "0 12px 12px" }}>
          <div style={{
            borderRadius: 12, padding: "14px",
            background: "var(--gold-subtle)",
            border: "1px solid var(--border-gold)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <Star size={12} color="var(--gold)" fill="var(--gold)" />
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--gold)" }}>Professional Plan</span>
            </div>
            <p style={{ fontSize: 11, lineHeight: 1.5, marginBottom: 10, color: "var(--text-secondary)" }}>
              12 days left in billing cycle
            </p>
            <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "6px 12px", fontSize: 11 }}>
              Manage Plan
            </button>
          </div>
        </div>
      )}

      {/* User footer */}
      <div style={{ padding: "12px", borderTop: "1px solid var(--border)" }}>
        <div
          style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px", borderRadius: 10, cursor: "pointer", transition: "background 0.15s" }}
          onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-elevated)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <div style={{
            width: 28, height: 28, borderRadius: 8, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700,
            background: "var(--gold-subtle)", color: "var(--gold)",
            border: "1px solid var(--border-gold)",
          }}>
            JO
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text-primary)" }}>James Okafor</div>
            <div style={{ fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text-muted)" }}>james@theshop.com</div>
          </div>
          <LogOut size={13} style={{ flexShrink: 0, color: "var(--text-muted)", opacity: 0.5 }} />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="lg:hidden flex items-center justify-center"
        style={{
          position: "fixed", top: 12, left: 12, zIndex: 50,
          width: 36, height: 36, borderRadius: 10,
          background: "var(--bg-card)", border: "1px solid var(--border)",
          cursor: "pointer", boxShadow: "var(--shadow-md)",
        }}
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <Menu size={17} style={{ color: "var(--text-primary)" }} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden"
          style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className="lg:hidden"
        style={{
          position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 40,
          width: 260,
          borderRight: "1px solid var(--border)",
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <Content />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex"
        style={{
          flexDirection: "column",
          width: 240,
          flexShrink: 0,
          height: "100vh",
          position: "sticky",
          top: 0,
          borderRight: "1px solid var(--border)",
        }}
      >
        <Content />
      </aside>
    </>
  );
}
