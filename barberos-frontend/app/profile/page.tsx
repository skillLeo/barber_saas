"use client";
import { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Camera, Save, Shield, Bell, CreditCard, Key, Star, Scissors } from "lucide-react";

const tabs = ["Profile", "Security", "Notifications", "Billing"];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <DashboardShell role="admin" title="My Profile" subtitle="Manage your personal account settings">
      <div className="max-w-3xl space-y-5">

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-[12px] overflow-x-auto" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
          {tabs.map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              className="flex-shrink-0 px-4 py-2 rounded-[9px] text-[13px] font-medium transition-all"
              style={{
                background: activeTab === t ? "var(--bg-card)" : "transparent",
                color: activeTab === t ? "var(--text-primary)" : "var(--text-muted)",
                border: activeTab === t ? "1px solid var(--border)" : "1px solid transparent",
              }}>
              {t}
            </button>
          ))}
        </div>

        {activeTab === "Profile" && (
          <div className="space-y-4">
            {/* Avatar + info */}
            <div className="card p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-6">
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 rounded-[16px] flex items-center justify-center text-[24px] font-bold"
                    style={{ background: "var(--gold-subtle)", color: "var(--gold)", border: "2px solid var(--border-gold)" }}>
                    JO
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg flex items-center justify-center shadow-lg"
                    style={{ background: "var(--gold)" }}>
                    <Camera size={12} color="var(--text-inverse)" />
                  </button>
                </div>
                <div>
                  <div className="text-[18px] font-bold" style={{ color: "var(--text-primary)" }}>James Okafor</div>
                  <div className="text-[13px] mt-0.5 mb-2" style={{ color: "var(--text-muted)" }}>Shop Owner · The Barbershop</div>
                  <span className="badge badge-gold text-[10px]">Professional Plan</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "First Name", val: "James" },
                  { label: "Last Name", val: "Okafor" },
                  { label: "Email", val: "james@theshop.com" },
                  { label: "Phone", val: "+44 7700 900001" },
                  { label: "Job Title", val: "Shop Owner" },
                  { label: "Location", val: "London, UK" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>{f.label}</label>
                    <input className="input w-full text-[13px]" defaultValue={f.val} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "Security" && (
          <div className="space-y-4">
            <div className="card p-5">
              <div className="flex items-center gap-2.5 mb-5">
                <Shield size={16} style={{ color: "var(--gold)" }} />
                <h3 className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>Change Password</h3>
              </div>
              <div className="space-y-3 max-w-sm">
                {["Current Password", "New Password", "Confirm New Password"].map((f) => (
                  <div key={f}>
                    <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>{f}</label>
                    <input type="password" className="input w-full text-[13px]" placeholder="••••••••" />
                  </div>
                ))}
                <button className="btn btn-primary text-[13px] mt-2">Update Password</button>
              </div>
            </div>
            <div className="card p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <Key size={16} style={{ color: "var(--gold)" }} />
                <h3 className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>Two-Factor Authentication</h3>
              </div>
              <p className="text-[13px] mb-4" style={{ color: "var(--text-secondary)" }}>
                Protect your account with 2FA. Use an authenticator app like Google Authenticator or Authy.
              </p>
              <button className="btn btn-secondary text-[13px]">Enable 2FA</button>
            </div>
          </div>
        )}

        {activeTab === "Notifications" && (
          <div className="card p-5">
            <div className="flex items-center gap-2.5 mb-5">
              <Bell size={16} style={{ color: "var(--gold)" }} />
              <h3 className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>Notification Preferences</h3>
            </div>
            <div className="space-y-1">
              {[
                { label: "New bookings", desc: "When a client books an appointment" },
                { label: "Booking cancellations", desc: "When a client cancels" },
                { label: "Payment received", desc: "When a payment is completed" },
                { label: "Staff requests", desc: "Leave or schedule change requests" },
                { label: "Weekly report", desc: "Summary of the week's performance" },
                { label: "Marketing emails", desc: "Tips, product updates, and offers" },
              ].map((n, i) => (
                <div key={n.label} className="flex items-center justify-between py-3"
                  style={{ borderBottom: i < 5 ? "1px solid var(--border)" : "none" }}>
                  <div>
                    <div className="text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>{n.label}</div>
                    <div className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>{n.desc}</div>
                  </div>
                  <button className="relative rounded-full transition-colors flex-shrink-0 bg-[var(--gold)]"
                    style={{ width: 40, height: 22 }}>
                    <span className="absolute top-0.5 left-[19px] w-[18px] h-[18px] rounded-full bg-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Billing" && (
          <div className="space-y-4">
            <div className="card p-5" style={{ background: "var(--gold-subtle)", border: "1px solid var(--border-gold)" }}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Star size={14} fill="var(--gold)" style={{ color: "var(--gold)" }} />
                    <span className="text-[14px] font-bold" style={{ color: "var(--gold)" }}>Professional Plan</span>
                  </div>
                  <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>£79/month · Renews Feb 1, 2026</p>
                  <p className="text-[12px] mt-1" style={{ color: "var(--text-muted)" }}>12 days remaining in billing cycle</p>
                </div>
                <button className="btn btn-primary text-[13px]">Upgrade</button>
              </div>
            </div>
            <div className="card p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <CreditCard size={16} style={{ color: "var(--gold)" }} />
                <h3 className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>Payment Method</h3>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-[10px]" style={{ background: "var(--bg-elevated)" }}>
                <div className="w-10 h-7 rounded-[6px] flex items-center justify-center text-[10px] font-bold"
                  style={{ background: "var(--bg-base)", color: "var(--text-primary)", border: "1px solid var(--border)" }}>
                  VISA
                </div>
                <div>
                  <div className="text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>•••• •••• •••• 4242</div>
                  <div className="text-[11.5px]" style={{ color: "var(--text-muted)" }}>Expires 12/27</div>
                </div>
                <button className="ml-auto btn btn-ghost text-[12px] h-7 px-3">Change</button>
              </div>
            </div>
          </div>
        )}

        {(activeTab === "Profile") && (
          <div className="flex justify-end">
            <button onClick={handleSave} className="btn btn-primary gap-2 text-[13px]">
              <Save size={14} />
              {saved ? "Saved!" : "Save Changes"}
            </button>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
