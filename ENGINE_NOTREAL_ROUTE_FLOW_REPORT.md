# Engine NotREAL — Route Flow Report

**Date:** 2026-05-10

---

## Public Routes (No Auth Required)

| Route | Component | Status |
|-------|-----------|--------|
| `/` | LandingPage | ✅ Active |
| `/login` | LoginPage | ✅ Active |
| `/register` | RegisterPage | ✅ Active |
| `/pricing` | PricingPage | ✅ Active |
| `/command` | CommandPage | ✅ Active — interactive business simulator |
| `/support` | SupportPage | ✅ Active — **newly created** |
| `/growth-check` | GrowthCheckPage | ✅ Active |
| `/partners` | PartnersPage | ✅ Active |
| `/hub` | HubPage | ✅ Active |

---

## App Routes (Auth-gated in production; open in dev)

| Route | Component | Status |
|-------|-----------|--------|
| `/dashboard` | DashboardPage | ✅ Active |
| `/create` | BusinessBuilderPage | ✅ Active — **newly added** |
| `/builder` | BusinessBuilderPage | ✅ Active (legacy alias kept) |
| `/fixer` | FixerPage | ✅ Active |
| `/run` | RunPage | ✅ Active |
| `/marketplace` | MarketplacePage | ✅ Active — Service Packs tab added |
| `/requests` | RequestsPage | ✅ Active — **newly created** |
| `/services` | ServicesPage | ✅ Active (legacy alias kept) |
| `/payment` | PaymentPage | ✅ Active — honest manual checkout |
| `/chat` | ChatPage | ✅ Active |
| `/tools` | ToolsPage | ✅ Active |
| `/image` | ImagePage | ✅ Active |

---

## Redirected Routes

| Route | Redirects To | Reason |
|-------|-------------|--------|
| `/choose-your-gate` | `/` | Legacy route |
| `/apply` | `/register` | Legacy route |
| `/founder-intake` | `/register` | Legacy route |
| `/the-gate` | `/marketplace` | Legacy alias |
| `/build-request` | `/services` | Legacy alias (kept) |
| `/uncover-my-gold` | `/builder` | Legacy alias |
| `*` (catch-all) | `/` | Safe fallback |

---

## Navigation (Layout Sidebar)

Current nav order:
1. Dashboard → `/dashboard`
2. Command → `/command` *(highlighted)*
3. Create → `/create`
4. Fixer → `/fixer` *(highlighted)*
5. Run / CRM → `/run`
6. Marketplace → `/marketplace`
7. Requests → `/requests`
8. Support → `/support` *(newly added)*
9. AI Chat → `/chat`
10. AI Tools → `/tools`
11. Pricing → `/pricing`

---

## Full User Flow

```
/ (Landing)
  → /register  (Create account)
  → /login     (Sign in)
  → /command   (Try demo — no login required)

/dashboard
  → /create       (Create a business)
  → /fixer        (Fix a business problem)
  → /run          (View CRM / pipeline)
  → /marketplace  (Browse service packs)
  → /requests     (Submit service request)
  → /support      (Get help / open ticket)

/fixer (submit problem)
  → /requests     (Request This Service)
  → /marketplace  (Open Marketplace)
  → /support      (Get Support)

/marketplace → Service Packs tab
  → /requests     (Request This Service)
  → /fixer        (Fixer First)

/requests (submit)
  → /run          (View CRM)
  → /support      (Get Support)

/support (submit ticket)
  → /dashboard, /fixer, /marketplace, /run
```

---

## Intentionally Left for Later

- Admin panel advanced CRM features
- `/settings` profile settings page (user can edit name in dashboard)
- Supabase-backed listing submission on marketplace
- Real Stripe checkout flow (currently manual)
