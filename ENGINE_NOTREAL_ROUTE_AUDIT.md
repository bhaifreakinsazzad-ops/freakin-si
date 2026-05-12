# Engine NotREAL — Route Audit

## Public Routes (no auth required)

| Route | Component | Status |
|-------|-----------|--------|
| `/` | LandingPage (non-auth) / redirect to /dashboard (auth) | ✅ Production ready |
| `/landing` | LandingPage | ✅ Alias for `/` |
| `/login` | LoginPage | ✅ EN branded |
| `/register` | RegisterPage | ✅ EN branded |
| `/pricing` | PricingPage | ✅ 3 EN plans |
| `/growth-check` | GrowthCheckPage | ✅ Keep — useful public tool |
| `/partners` | PartnersPage | ✅ EN branded |
| `/hub` | HubPage | ✅ EN branded |

## Protected App Routes (require auth in production)

| Route | Component | Status |
|-------|-----------|--------|
| `/dashboard` | DashboardPage | ✅ EN branded |
| `/chat` | ChatPage | ✅ |
| `/chat/:id` | ChatPage | ✅ |
| `/image` | ImagePage | ✅ |
| `/tools` | ToolsPage | ✅ |
| `/builder` | BusinessBuilderPage | ✅ EN branded |
| `/fixer` | FixerPage | ✅ Fully implemented |
| `/run` | RunPage | ✅ CRM page |
| `/marketplace` | MarketplacePage | ✅ |
| `/services` | ServicesPage | ✅ |
| `/payment` | PaymentPage | ✅ bKash/Nagad honest flow |

## Legacy Route Redirects (Phase 3 cleanup)

| Route | Redirects To | Reason |
|-------|-------------|--------|
| `/choose-your-gate` | `/` | Old gating concept — replaced by public LandingPage |
| `/apply` | `/register` | Old application form — replaced by standard registration |
| `/founder-intake` | `/register` | Alias for `/apply` — same redirect |

## Legacy Route Aliases (kept)

| Route | Maps To | Reason |
|-------|---------|--------|
| `/uncover-my-gold` | BusinessBuilderPage | Old name for builder — harmless alias |
| `/the-gate` | MarketplacePage | Old name for marketplace — harmless alias |
| `/build-request` | ServicesPage | Old name for services — harmless alias |

## Admin

| Route | Component | Notes |
|-------|-----------|-------|
| `/admin` | AdminPage | Requires `is_admin: true` on user object |

## 404 Handler

All unmatched routes → redirect to `/`.

## Notes

- Auth gate is controlled by `VITE_PUBLIC_ACCESS` env var
- In dev (`VITE_PUBLIC_ACCESS=true`), all protected routes are accessible without login
- In production (`VITE_PUBLIC_ACCESS=false`), protected routes redirect to `/login`
