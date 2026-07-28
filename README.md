# 💇 BarberOS

**A premium, multi-tenant SaaS platform for barbershop & salon management** — booking, staff scheduling, POS/payments, inventory, and AI-powered client tools in one system.

Built for the UK & European market with a focus on world-class UX for non-technical staff and a mobile-first client booking experience.

---

## What It Does

BarberOS lets a barbershop (or a chain of them) run its entire business digitally:

- Clients book appointments online in a few taps, pay via Stripe, and get an AI-powered hairstyle suggestion from a selfie.
- Barbers see their daily schedule and next client at a glance.
- Receptionists and cashiers manage walk-ins, checkout, and payments from a fast POS.
- Managers and owners get real-time revenue dashboards, staff performance, and inventory alerts.
- Each shop runs on its own isolated database (multi-tenant), with its own subdomain, branding, and language.

## Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Laravel 12 (PHP), MySQL (per-tenant database), Redis |
| **Frontend** | Next.js 14+ (App Router), TypeScript, Tailwind CSS |
| **Multi-tenancy** | `stancl/tenancy` — subdomain-based, isolated DB per tenant |
| **Auth** | Laravel Sanctum (SPA tokens), OAuth (Google/Facebook/Apple), 2FA/OTP |
| **Queues** | Redis + Laravel Horizon |
| **Payments** | Stripe + Laravel Cashier (recurring SaaS billing), PayPal, Razorpay, Tap, Paymob |
| **Storage** | AWS S3 |
| **Roles/Permissions** | Spatie Laravel Permission (team-scoped) |
| **AI** | OpenAI GPT-4o Vision (hairstyle suggestions) |

## Project Structure

```
barberos/
├── barberos-backend/     # Laravel 12 API
└── barberos-frontend/    # Next.js (TypeScript, App Router)
```

## Core Modules

**Phase 1 — MVP**
1. Authentication (email/password, OAuth, 2FA, OTP)
2. Tenant onboarding — shop creation, subdomain, isolated DB, setup wizard
3. Role & permission management (Super Admin → Shop Owner → Manager → Barber → Receptionist → Cashier → Client)
4. Service & addon catalog
5. Barber schedule engine (weekly hours, breaks, holidays)
6. Booking engine — dynamic slot generation, conflict detection, Redis-based slot locking
7. Point-of-sale (cart, cash/card checkout, receipts)
8. Stripe payments for online bookings
9. Email notifications (booking confirmation, reminders)
10. Owner/manager dashboard (today's revenue, appointments)
11. SaaS billing (Starter / Professional / Business / Enterprise plans)

**Phase 2 — Growth**
- Advanced analytics with CSV/PDF export
- AI hairstyle suggestions (OpenAI Vision)
- Product inventory & low-stock alerts
- Multi-branch comparison reporting
- Loyalty points & auto-applied discounts
- Additional payment gateways (PayPal, Razorpay, Tap, Paymob)

**Phase 3 — Platform**
- White-label / franchise branding
- Public API with Swagger docs
- Google Calendar / Outlook two-way sync
- Cross-shop marketplace for clients

## Booking Logic

Appointment slots are computed dynamically rather than stored — this keeps the schedule always accurate against staff availability, breaks, and holidays.

- **Conflict check:** `NOT (end_time <= slot_start OR start_time >= slot_end)`
- **Slot locking:** a Redis key with a 10-minute TTL reserves a slot during checkout, released automatically on payment failure/timeout
- **Duration:** `base_service_duration + sum(addon_durations) + buffer_time` (buffer configurable per shop)
- **Cancellations:** configurable fee window per shop, with automatic gateway refund

## Multi-Tenancy & Data Isolation

- **Central (landlord) DB:** `tenants`, `plans`, `subscriptions`, `domains`
- **Per-tenant DB:** `users`, `branches`, `staff`, `services`, `appointments`, `products`, `orders`, `transactions`, `ai_suggestions`, `settings`, etc.
- Tenant context is injected via middleware — no code path can query across tenant boundaries.

## SaaS Plans

| Plan | Price | Branches | Staff | AI | Analytics |
|---|---|---|---|---|---|
| Starter | $29/mo | 1 | ≤3 | — | Basic |
| Professional | $79/mo | ≤3 | ≤10 | ✓ | Advanced |
| Business | $149/mo | ≤10 | Unlimited | ✓ | Full + Export |
| Enterprise | Custom | Unlimited | Unlimited | ✓ + Custom | White-label + API |

14-day free trial, no card required. 3-day grace period on failed payment before suspension (data retained).

## Advanced Features

- **White-label branding** — per-tenant logo, colours, fonts, and homepage templates, all driven by CSS variables (no hardcoded colours)
- **Dual-level API keys** — Super Admin manages platform keys (OpenAI, Stripe, Twilio, etc.); higher-tier tenants can supply their own, encrypted at rest (AES-256), with automatic fallback to the platform key
- **Multilingual, RTL-ready** — English, Arabic, French, Spanish, Urdu, Turkish at launch, with full RTL support for Arabic/Urdu/Hebrew
- **AI hairstyle suggestions** — selfie upload → S3 → async job → GPT-4o Vision → face-shape + style recommendations → direct "Book Now" CTA, with NSFW filtering and GDPR-compliant auto-deletion

## Architecture Principles

- Thin controllers — all business logic lives in Service classes
- Single-purpose Action classes for atomic operations (e.g. `BookAppointmentAction`)
- Events + Listeners for decoupled side effects (`BookingConfirmed`, `PaymentProcessed`)
- All external API calls (email, SMS, AI) are queued, never synchronous
- Money is always stored as integers (cents/pence) — never floats
- Versioned API (`/api/v1/`), cursor pagination, rate-limited at 60 req/min

## Getting Started

### Backend
```bash
cd barberos-backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
php artisan horizon   # queue worker
```

### Frontend
```bash
cd barberos-frontend
npm install
npm run dev
```

### Required Environment Variables

```
# Backend
APP_URL, DB_*, REDIS_*, QUEUE_CONNECTION=redis
STRIPE_KEY, STRIPE_SECRET, STRIPE_WEBHOOK_SECRET
OPENAI_API_KEY
AWS_*, FILESYSTEM_DISK=s3
MAIL_*, SMS_DRIVER
TENANCY_*

# Frontend
NEXT_PUBLIC_API_URL
NEXT_PUBLIC_STRIPE_KEY
NEXT_PUBLIC_GOOGLE_MAPS_KEY
```

## Design Philosophy

Premium SaaS feel (Notion / Linear / Stripe Dashboard-level polish), mobile-first, dark-mode from day one. Every role gets a purpose-built layout — a 5-tap booking flow for clients, a glanceable schedule for barbers, large touch targets for cashiers under pressure, and dense data views for owners and admins.

---

**Status:** Active development — Phase 1 (MVP) in progress.
