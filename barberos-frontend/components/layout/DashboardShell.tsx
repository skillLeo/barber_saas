"use client";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface DashboardShellProps {
  children: React.ReactNode;
  role?: "super-admin" | "admin" | "manager" | "barber" | "receptionist";
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function DashboardShell({ children, role = "admin", title, subtitle, action }: DashboardShellProps) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-base)" }}>
      <Sidebar role={role} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar title={title} subtitle={subtitle} action={action} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
