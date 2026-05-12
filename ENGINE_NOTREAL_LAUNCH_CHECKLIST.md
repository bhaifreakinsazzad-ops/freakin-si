# Engine NotREAL — Launch Checklist

**Version:** Phase 2 Complete  
**Date:** 2026-05-10

---

## ☐ Local Setup

- [ ] Clone repo and run `npm install` from root
- [ ] Confirm no install errors (`@rollup/rollup-linux-x64-gnu` is now in optionalDependencies — Windows safe)
- [ ] Confirm `apps/web/` and `apps/backend/` directories are present

---

## ☐ Environment Keys

- [ ] `cp .env.example apps/backend/.env`
- [ ] Set `SUPABASE_URL` (required)
- [ ] Set `SUPABASE_SERVICE_KEY` (required — backend only, never expose to frontend)
- [ ] Set `JWT_SECRET` (required — 32+ chars random string)
- [ ] Set `GROQ_API_KEY` (recommended — free at console.groq.com)
- [ ] Confirm `.env` is NOT committed (check `.gitignore`)

---

## ☐ Database Migration

Run in Supabase SQL Editor in order:

1. [ ] `apps/backend/migrations/001_bhaifreakinsbi_schema.sql`
2. [ ] `apps/backend/migrations/002_idempotent_fix.sql`
3. [ ] `apps/backend/migrations/003_engine_notreal.sql`

Verify after migration:
- [ ] Tables created: `businesses`, `fixer_diagnoses`, `ai_generations`, `marketplace_listings`, `leads`, `projects`, `service_requests`, `pricing_plans`
- [ ] Seed data inserted: 3 marketplace listings, 3 pricing plans

---

## ☐ Dev Server

- [ ] Run `npm run dev` from root
- [ ] Frontend loads at `http://localhost:5173`
- [ ] Backend loads at `http://localhost:3001`
- [ ] No console errors on startup

---

## ☐ Landing Page Check

- [ ] Visit `http://localhost:5173/` when not logged in — LandingPage renders (not login redirect)
- [ ] Hero: "Create. Fix. Run. Sell. One AI Business Engine." visible
- [ ] All 10 sections render: Hero, Problem, Features, AI Engine, How It Works, Marketplace, Global, Pricing CTA, Final CTA
- [ ] "Start Building" CTA → `/register`
- [ ] "Open Fixer Mode" CTA → `/fixer`
- [ ] Nav links work (Features → #features, How It Works → #how)
- [ ] Footer links don't 404

---

## ☐ Auth Flow Check

- [ ] `/login` — Engine NotREAL "EN" logo (indigo gradient), no "Black Sheep" or "BS"
- [ ] `/register` — Engine NotREAL "EN" logo, no "Black Sheep" or "BS"
- [ ] Login with valid credentials → redirects to `/dashboard`
- [ ] Invalid credentials → shows error message
- [ ] Register → creates account and redirects to `/dashboard`

---

## ☐ Dashboard Check

- [ ] Engine NotREAL header, Zap icon
- [ ] "Founder Dashboard" title
- [ ] 4 action cards link to: /dashboard, /builder, /fixer, /run
- [ ] Platform modules section: AI Builder, Fixer Mode, Marketplace (indigo/cyan colors, not red/gold)

---

## ☐ Fixer Mode Check

- [ ] `/fixer` route loads `FixerPage`
- [ ] All 9 problem type buttons visible
- [ ] Form validation: description requires 20+ characters
- [ ] Submit with no API key → demo fallback result displays
- [ ] Submit with GROQ_API_KEY → live AI result
- [ ] Result shows: Diagnosis, Root Cause, Fix Strategy, Priority Actions, Timeline
- [ ] "Get This Fixed" CTA links to `/services`

---

## ☐ Business Builder Check (Create)

- [ ] `/builder` route loads `BusinessBuilderPage`
- [ ] "Engine NotREAL AI Builder" badge (not Black Sheep)
- [ ] Wizard steps 1–10 navigate correctly
- [ ] Submit generates blueprint (demo or live)
- [ ] Partner services section says "Engine NotREAL partner services"

---

## ☐ Run / CRM Check

- [ ] `/run` route loads `RunPage`
- [ ] 4 stat cards visible (Active Leads, Pipeline Value, Active Projects, Completed)
- [ ] Leads tab: table with name, contact, status, value
- [ ] Projects tab: cards with progress bars (indigo→cyan gradient)
- [ ] Search filter works on both tabs

---

## ☐ Marketplace Check

- [ ] `/marketplace` route loads `MarketplacePage`
- [ ] 3+ demo listings visible (SocialBoost, LaunchKit Pro, Agency Engine)
- [ ] Category tabs work
- [ ] Search works
- [ ] No "Black Sheep" references in visible UI

---

## ☐ Pricing Check

- [ ] `/pricing` route loads `PricingPage`
- [ ] 3 plans: Starter ($0), Growth ($49/mo), Agency ($149/mo)
- [ ] Growth plan is highlighted as "Most Popular"
- [ ] Annual toggle shows discounted prices
- [ ] 3 credit pack cards visible
- [ ] No "Black Sheep" references, no old Black Sheep partner names

---

## ☐ AI Provider Test

- [ ] Demo mode works with no API keys configured (verify fixer + chat)
- [ ] With GROQ_API_KEY set, live Groq output appears
- [ ] No API keys are hardcoded in any source file
- [ ] SUPABASE_SERVICE_KEY is used only in backend (`apps/backend/`)

---

## ☐ Security Check

- [ ] `.env` file is in `.gitignore` and not committed
- [ ] `.env.example` has placeholder values only (no real keys)
- [ ] `SUPABASE_SERVICE_KEY` only in `apps/backend/` — not imported by frontend
- [ ] CORS in `apps/backend/server.js` allows only known origins
- [ ] JWT_SECRET is required before server starts

---

## ☐ Build Check

- [ ] `cd apps/web && npm run build` → succeeds with zero errors
- [ ] `cd apps/web && ./node_modules/.bin/tsc --noEmit` → zero errors
- [ ] All page chunks build successfully

---

## ☐ Deployment (Vercel + Render)

**Frontend (Vercel):**
- [ ] Set `VITE_API_URL=https://your-backend.render.com/api`
- [ ] Set `VITE_PUBLIC_ACCESS=false` to enforce auth gate in production
- [ ] Deploy from `apps/web/` root (or configure Vercel project root)

**Backend (Render.com):**
- [ ] Connect to `apps/backend/`
- [ ] Set all env vars in Render dashboard
- [ ] Verify health endpoint responds: `GET /api/health`

---

## ☐ Post-Launch

- [ ] Run migration 003 in production Supabase project
- [ ] Test Fixer Mode with live AI key in production
- [ ] Verify landing page at production URL
- [ ] Set `VITE_PUBLIC_ACCESS=false` and re-deploy
- [ ] Test login → dashboard flow in production
