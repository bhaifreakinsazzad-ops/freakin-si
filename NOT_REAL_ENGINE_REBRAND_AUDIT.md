# Not Real Engine Rebrand Audit

## Files inspected
- `apps/web/src/pages/LandingPage.tsx`
- `apps/web/src/components/Layout.tsx`
- `apps/web/src/App.tsx`
- `apps/web/index.html`
- `apps/web/src/config/brand.ts`
- `apps/web/src/contexts/LanguageContext.tsx`
- `apps/web/src/pages/LoginPage.tsx`
- `apps/web/src/pages/RegisterPage.tsx`
- `apps/web/src/pages/PricingPage.tsx`
- `apps/web/src/pages/CommandPage.tsx`
- `apps/web/src/pages/DashboardPage.tsx`
- `apps/web/src/pages/AdminPage.tsx`
- `apps/web/src/pages/SupportPage.tsx`
- `apps/web/src/pages/RequestsPage.tsx`
- `apps/web/src/pages/RunPage.tsx`
- `apps/web/src/pages/FixerPage.tsx`
- `apps/web/src/pages/MarketplacePage.tsx`
- `apps/web/src/pages/ChooseYourGatePage.tsx`
- `apps/web/src/pages/FounderIntakePage.tsx`
- `apps/web/src/pages/PartnersPage.tsx`
- `apps/web/src/pages/os/AICEODashboardPage.tsx`
- `apps/web/src/pages/os/LaunchRoadPage.tsx`
- `apps/web/src/pages/os/BuilderOSPage.tsx`

## Old public brand terms found
- `DhandaBuzz`
- `Black Sheep`
- `Divorcing The Game`
- `Engine NotREAL`
- `THE SHEEP`

## Landing page state
- Rebuilt for the Not Real Engine brand.
- Hero, audience strip, problem/solution blocks, service offers, how-it-works, payment honesty, and final CTA are aligned to the new brand.

## App-wide user-facing brand issues
- Shared shell labels, login/register branding, pricing copy, command page copy, dashboard labels, and public SEO metadata still carried legacy brand terms.
- Several legacy public pages also used old brand labels or partner names.

## Domain limitation
- `dhandabuzz.online` remains the temporary beta domain and should stay live during the transition.

## Final plan
- Keep the current platform and routes.
- Remove user-facing legacy branding where visible.
- Leave internal comments and history alone unless they leak to the UI.
- Build, verify, then deploy the rebrand without changing payment, Supabase, Groq, auth, support, requests, or admin flows.
