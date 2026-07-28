import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ToastProvider } from "@/contexts/ToastContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "BarberOS — Premium Barbershop Management Platform",
  description: "The all-in-one SaaS platform for modern barbershops. Bookings, POS, AI hairstyle, analytics. Built for UK & European barbershops.",
  keywords: ["barbershop software", "booking system", "barber POS", "SaaS"],
  authors: [{ name: "BarberOS" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#080C14" },
    { media: "(prefers-color-scheme: light)", color: "#F0F2F8" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light" className={inter.variable}>
      <body className="font-[Inter,system-ui,sans-serif]">
        <ThemeProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
