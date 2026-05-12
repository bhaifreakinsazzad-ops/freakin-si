# Engine NotREAL — Frontend Route QA Report
Generated: 2026-05-12

## Public Routes (No Auth Required)

| Route | Component | Status | Notes |
|-------|-----------|--------|-------|
| `/` | LandingPage | ✅ Active | Redirects to /dashboard if logged in |
| `/landing` | LandingPage | ✅ Active | Force landing regardless of auth |
| `/login` | LoginPage | ✅ Active | Redirects to /dashboard if logged in |
| `/register` | RegisterPage | ✅ Active | Redirects to /dashboard if logged in |
| `/pricing` | PricingPage | ✅ Active | 3-tier: Starter / Growth / Agency |
| `/command` | CommandPage | ✅ Active | Interactive AI command terminal |
| `/support` | SupportPage | ✅ Active | Ticket form, categories, confirmation |
| `/growth-check` | GrowthCheckPage | ✅ Active | Growth diagnostic tool |
| `/partners` | PartnersPage | ✅ Active | Partner programme page |
| `/hub` | HubPage | ✅ Active | Resource hub |

## Legacy Routes (Redirected)

| Route | Redirects To | Status |
|-------|-------------|--------|
| `/choose-your-gate` | `/` | ✅ 301 |
| `/apply` | `/register` | ✅ 301 |
| `/founder-intake` | `/register` | ✅ 301 |

## Protected App Routes (Auth Required)

| Route | Component | Status | Notes |
|-------|-----------|--------|-------|
| `/dashboard` | DashboardPage | ✅ Active | Status cards, quick actions, pipeline preview |
| `/create` | BusinessBuilderPage | ✅ Active | AI business builder, demo fallback |
| `/builder` | BusinessBuilderPage | ✅ Active | Alias for /create |
| `/fixer` | FixerPage | ✅ Active | AI diagnosis tool, demo fallback |
| `/run` | RunPage | ✅ Active | CRM / pipeline management |
| `/marketplace` | MarketplacePage | ✅ Active | Seeded listings, category filter |
| `/requests` | RequestsPage | ✅ Active | Service request form, order creation |
| `/services` | ServicesPage | ✅ Active | Service catalogue |
| `/build-request` | ServicesPage | ✅ Active | Alias for /services |
| `/chat` | ChatPage | ✅ Active | AI chat, demo fallback |
| `/chat/:id` | ChatPage | ✅ Active | Conversation continuation |
| `/image` | ImagePage | ✅ Active | Image generation tool |
| `/tools` | ToolsPage | ✅ Active | All tools index |
| `/payment` | PaymentPage | ✅ Active | Manual bKash/Nagad/Rocket flow |
| `/uncover-my-gold` | BusinessBuilderPage | ✅ Active | Legacy path |
| `/the-gate` | MarketplacePage | ✅ Active | Legacy path |

## Admin Route

| Route | Component | Status | Notes |
|-------|-----------|--------|-------|
| `/admin` | AdminPage | ✅ Active | Requires admin email in ADMIN_EMAILS env |

## Catch-All

| Route | Redirects To | Status |
|-------|-------------|--------|
| `/*` | `/` | ✅ 301 |

---

## Navigation Links Verified

**Layout sidebar:**
- Dashboard → `/dashboard` ✅
- Create → `/create` ✅
- Fixer → `/fixer` ✅
- Run → `/run` ✅
- Marketplace → `/marketplace` ✅
- Requests → `/requests` ✅
- Chat → `/chat` ✅
- Tools → `/tools` ✅
- Payment → `/payment` ✅
- Admin → `/admin` (admin users only) ✅

**Landing page CTAs:**
- "Start Building" → `/create` ✅ (authenticated) / `/register` (guest)
- "Open Fixer Mode" → `/fixer` ✅
- "View Pricing" → `/pricing` ✅
- "Explore Marketplace" → `/marketplace` ✅

**Dashboard quick actions:**
- All 6 quick action cards link to active routes ✅

---

## Issues Found & Fixed

None critical. All routes are either active, properly redirected, or clearly marked Coming Soon within the component.

---

## Payment Copy Audit

| Check | Status |
|-------|--------|
| No fake "Pay Now" with card promise | ✅ |
| No mention of instant Stripe checkout | ✅ |
| Manual flow clearly explained (bKash/Nagad/Rocket/bank) | ✅ |
| "2-24 hours review" timeline shown | ✅ |
| Payment reference (TxnID) field prominent | ✅ |
| No credit card form rendered | ✅ |
| Stripe referenced only in LandingPage US market note | ✅ (honest) |
