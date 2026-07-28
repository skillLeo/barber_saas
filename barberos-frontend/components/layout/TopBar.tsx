"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bell, Search, Globe, ChevronDown, Check, Settings, LogOut, User, CreditCard, ExternalLink, Sun, Moon } from "lucide-react";
import { useTheme, languages } from "@/contexts/ThemeContext";
import { mockNotifications } from "@/lib/mock-data";

interface TopBarProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function TopBar({ title, subtitle, action }: TopBarProps) {
  const { theme, toggleTheme, language, setLanguage } = useTheme();
  const [notifOpen, setNotifOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const unread = mockNotifications.filter(n => !n.read).length;

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const closeAll = () => { setNotifOpen(false); setLangOpen(false); setProfileOpen(false); };

  return (
    <header className="sticky top-0 z-30 h-[60px] flex items-center px-4 lg:px-6 gap-3"
      style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)" }}>

      {/* Mobile spacer */}
      <div className="w-5 lg:hidden flex-shrink-0" />

      {/* Title */}
      <div className="flex-1 min-w-0">
        {searchOpen ? (
          <div className="flex items-center gap-2" style={{ maxWidth: 320 }}>
            <Search size={14} style={{ color: "var(--text-muted)" }} />
            <input
              ref={searchRef}
              className="flex-1 bg-transparent text-[14px] outline-none"
              style={{ color: "var(--text-primary)" }}
              placeholder="Search anything..."
              onBlur={() => setSearchOpen(false)}
            />
            <button onClick={() => setSearchOpen(false)} className="text-[11px] px-1.5 py-0.5 rounded"
              style={{ background: "var(--bg-elevated)", color: "var(--text-muted)" }}>
              Esc
            </button>
          </div>
        ) : title ? (
          <div>
            <h1 className="text-[15px] font-semibold leading-none truncate" style={{ color: "var(--text-primary)" }}>{title}</h1>
            {subtitle && <p className="text-[12px] mt-0.5 truncate" style={{ color: "var(--text-muted)" }}>{subtitle}</p>}
          </div>
        ) : null}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        {/* Search button */}
        <button onClick={() => setSearchOpen(true)} className="topbar-btn" title="Search (⌘K)">
          <Search size={15} style={{ color: "var(--text-secondary)" }} />
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="topbar-btn"
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          style={{ position: "relative", overflow: "hidden" }}
        >
          <span style={{
            position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
            transition: "opacity 0.2s, transform 0.2s",
            opacity: theme === "dark" ? 1 : 0,
            transform: theme === "dark" ? "scale(1) rotate(0deg)" : "scale(0.5) rotate(90deg)",
          }}>
            <Sun size={15} style={{ color: "var(--gold)" }} />
          </span>
          <span style={{
            position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
            transition: "opacity 0.2s, transform 0.2s",
            opacity: theme === "light" ? 1 : 0,
            transform: theme === "light" ? "scale(1) rotate(0deg)" : "scale(0.5) rotate(-90deg)",
          }}>
            <Moon size={15} style={{ color: "var(--text-secondary)" }} />
          </span>
        </button>

        {/* Language switcher */}
        <div className="relative">
          <button onClick={() => { closeAll(); setLangOpen(v => !v); }} className="topbar-btn-wide" title="Language">
            <span className="text-[15px] leading-none">{language.flag}</span>
            <span className="text-[12px] font-medium hidden sm:block" style={{ color: "var(--text-secondary)" }}>
              {language.code.toUpperCase()}
            </span>
            <ChevronDown size={11} style={{ color: "var(--text-muted)" }} />
          </button>
          {langOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
              <div className="dropdown-panel right-0 top-11 z-50 w-52">
                <div className="px-3 py-2.5" style={{ borderBottom: "1px solid var(--border)" }}>
                  <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Display Language</p>
                </div>
                <div className="py-1.5 max-h-72 overflow-y-auto">
                  {languages.map(lang => (
                    <button key={lang.code} onClick={() => { setLanguage(lang); setLangOpen(false); }}
                      className="dropdown-item w-full">
                      <span className="text-[15px]">{lang.flag}</span>
                      <span className="flex-1 text-left text-[13px]" style={{ color: "var(--text-primary)" }}>{lang.name}</span>
                      {lang.dir === "rtl" && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "var(--bg-elevated)", color: "var(--text-muted)" }}>RTL</span>
                      )}
                      {language.code === lang.code && <Check size={12} style={{ color: "var(--gold)" }} />}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button onClick={() => { closeAll(); setNotifOpen(v => !v); }} className="topbar-btn relative" title="Notifications">
            <Bell size={15} style={{ color: "var(--text-secondary)" }} />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-[7px] h-[7px] rounded-full"
                style={{ background: "var(--gold)", boxShadow: "0 0 4px var(--gold-glow)" }} />
            )}
          </button>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <div className="dropdown-panel right-0 top-11 z-50 w-80">
                <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
                  <span className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>Notifications</span>
                  {unread > 0 && <span className="badge badge-gold text-[10px]">{unread} new</span>}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {mockNotifications.map((n) => {
                    const icons: Record<string, string> = { booking: "📅", payment: "💳", alert: "⚠️", cancellation: "❌", review: "⭐" };
                    return (
                      <div key={n.id} className="px-4 py-3 cursor-pointer transition-colors"
                        style={{ borderBottom: "1px solid var(--border)", background: !n.read ? "var(--gold-subtle)" : "transparent" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-elevated)")}
                        onMouseLeave={e => (e.currentTarget.style.background = !n.read ? "var(--gold-subtle)" : "transparent")}>
                        <div className="flex gap-3">
                          <span className="text-[15px] flex-shrink-0">{icons[n.type] || "🔔"}</span>
                          <div className="flex-1">
                            <p className="text-[12.5px] leading-relaxed" style={{ color: "var(--text-primary)" }}>{n.message}</p>
                            <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>{n.time}</p>
                          </div>
                          {!n.read && <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ background: "var(--gold)" }} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="px-4 py-2.5 text-center" style={{ borderTop: "1px solid var(--border)" }}>
                  <button className="text-[12px] font-medium" style={{ color: "var(--gold)" }}>View all notifications</button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button onClick={() => { closeAll(); setProfileOpen(v => !v); }}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-[10px] transition-colors"
            style={{ border: "1px solid var(--border)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-elevated)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
            <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0"
              style={{ background: "var(--gold-subtle)", color: "var(--gold)" }}>
              JO
            </div>
            <span className="text-[12.5px] font-medium hidden sm:block" style={{ color: "var(--text-primary)" }}>James</span>
            <ChevronDown size={11} style={{ color: "var(--text-muted)" }} />
          </button>
          {profileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
              <div className="dropdown-panel right-0 top-11 z-50 w-56">
                <div className="px-4 py-3.5" style={{ borderBottom: "1px solid var(--border)" }}>
                  <div className="text-[13.5px] font-semibold" style={{ color: "var(--text-primary)" }}>James Okafor</div>
                  <div className="text-[11.5px] mt-0.5" style={{ color: "var(--text-muted)" }}>james@theshop.com</div>
                  <div className="mt-1.5"><span className="badge badge-gold text-[10px]">Professional Plan</span></div>
                </div>
                <div className="py-1.5">
                  {[
                    { icon: User, label: "View Profile", href: "/profile" },
                    { icon: Settings, label: "Account Settings", href: "/admin/settings" },
                    { icon: CreditCard, label: "Billing", href: "/admin/settings" },
                    { icon: ExternalLink, label: "View My Shop", href: "/book" },
                  ].map(item => (
                    <Link key={item.label} href={item.href} onClick={() => setProfileOpen(false)}
                      className="dropdown-item">
                      <item.icon size={14} style={{ color: "var(--text-muted)" }} />
                      <span style={{ color: "var(--text-primary)" }}>{item.label}</span>
                    </Link>
                  ))}
                </div>
                <div className="py-1.5" style={{ borderTop: "1px solid var(--border)" }}>
                  <button className="dropdown-item w-full text-left">
                    <LogOut size={14} style={{ color: "var(--error)" }} />
                    <span style={{ color: "var(--error)" }}>Sign out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {action && <div className="ml-1">{action}</div>}
      </div>

      <style>{`
        .topbar-btn {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s;
          position: relative;
          cursor: pointer;
          border: 1px solid transparent;
          background: transparent;
        }
        .topbar-btn:hover {
          background: var(--bg-elevated);
          border-color: var(--border);
        }
        .topbar-btn-wide {
          height: 34px;
          padding: 0 10px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
          transition: background 0.15s;
          border: 1px solid transparent;
          background: transparent;
        }
        .topbar-btn-wide:hover {
          background: var(--bg-elevated);
          border-color: var(--border);
        }
        .dropdown-panel {
          position: absolute;
          background: var(--bg-card);
          border: 1px solid var(--border-strong);
          border-radius: 14px;
          box-shadow: var(--shadow-lg);
          overflow: hidden;
          animation: fadeUp 0.15s ease;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 8px 14px;
          font-size: 13px;
          cursor: pointer;
          transition: background 0.12s;
          background: transparent;
          width: 100%;
          border: none;
        }
        .dropdown-item:hover {
          background: var(--bg-elevated);
        }
      `}</style>
    </header>
  );
}
