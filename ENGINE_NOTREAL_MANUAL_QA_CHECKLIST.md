# Engine NotREAL — Manual QA Checklist

**Demo credentials:** `demo@enginenotreal.com` / `Demo@2025`

---

## Landing Page `/`

- [ ] Page loads without error
- [ ] Hero title: "Create. Fix. Run. Sell. One AI Business Engine."
- [ ] "Start Building" CTA → navigates to `/register`
- [ ] "Open Fixer Mode" CTA → navigates to `/fixer`
- [ ] Nav links (Features, How It Works, Pricing) scroll to correct sections
- [ ] All 10 sections visible: Nav, Hero, Problem, Features, AIEngine, HowItWorks, Marketplace, Global, PricingCTA, FinalCTA + Footer
- [ ] No "Black Sheep", "DhandaBuzz", or "Divorcing The Game" text visible
- [ ] No console errors

---

## Auth Pages

- [ ] `/login` — "EN" logo (indigo/cyan gradient), no "BS" or red
- [ ] `/register` — "EN" logo, same branding
- [ ] Login with demo credentials → redirects to `/dashboard`
- [ ] Invalid credentials → error message shown (no crash)
- [ ] Register with new email → creates account, redirects to `/dashboard`

---

## Dashboard `/dashboard`

- [ ] "Founder Dashboard" heading
- [ ] 4 action cards visible and clickable
- [ ] Platform modules section: indigo/cyan colors (not red/gold)
- [ ] No "Black Sheep" text visible

---

## Fixer Mode `/fixer`

- [ ] Page loads, all 9 problem type buttons visible
- [ ] Selecting a problem type highlights the button
- [ ] Description field: typing fewer than 20 chars → submit is disabled
- [ ] Description 20+ chars → submit enabled
- [ ] Submit (no AI key) → demo result appears within 2 seconds
- [ ] Demo result shows: Diagnosis, Root Cause, Fix Strategy, Priority Actions, Timeline
- [ ] "Get This Fixed" CTA links to `/services`
- [ ] No crash, no console error

---

## Business Builder `/builder`

- [ ] Page loads with "Engine NotREAL AI Builder" badge (not "Black Sheep")
- [ ] Wizard step 1 renders (business name input)
- [ ] Can navigate through steps
- [ ] Submit generates blueprint (demo or live)
- [ ] Output includes actionable sections

---

## Run / CRM `/run`

- [ ] Page loads with 4 stat cards (Active Leads, Pipeline Value, Active Projects, Completed)
- [ ] Leads tab shows lead table
- [ ] Projects tab shows project cards with progress bars
- [ ] Search input filters results

---

## Marketplace `/marketplace`

- [ ] Page loads with at least 3 listings
- [ ] Category tabs work
- [ ] Search works
- [ ] No "Black Sheep" text visible

---

## Chat `/chat`

- [ ] Chat interface loads
- [ ] Can type and submit a message
- [ ] Response returns (demo or live AI)
- [ ] Mode selector works

---

## Pricing `/pricing`

- [ ] 3 plans: Starter ($0), Growth ($49), Agency ($149)
- [ ] Growth plan has "Most Popular" badge
- [ ] Annual toggle changes prices
- [ ] Starter "Get Started Free" → `/register`
- [ ] Growth/Agency CTA → `/payment`
- [ ] Credit packs section visible
- [ ] No "Black Sheep" text, no old partners list

---

## Payment `/payment`

- [ ] Page loads (may need to navigate directly or via pricing)
- [ ] bKash/Nagad instructions visible
- [ ] Correct phone number shown
- [ ] No fake Stripe button that does nothing

---

## Legacy Routes

- [ ] `/choose-your-gate` → redirects to `/`
- [ ] `/apply` → redirects to `/register`
- [ ] `/founder-intake` → redirects to `/register`

---

## Admin `/admin`

- [ ] Loads for demo user (is_admin: true)
- [ ] "Engine NotREAL Admin" title visible (not "Black Sheep Command Center")

---

## Demo Mode (No AI Keys)

- [ ] Backend health at `http://localhost:3001/api/health` returns `{"ai":{"demoMode":true}}`
- [ ] Fixer Mode returns contextual demo result
- [ ] Chat returns a response (may be demo)
- [ ] No error toasts about missing API keys

---

## Security Spot Check

- [ ] `.env` not in git: run `git status` — no `.env` file listed
- [ ] `SUPABASE_SERVICE_KEY` not in any frontend file: search `apps/web/src` for the string
- [ ] No hardcoded API keys in source: search for `sk-`, `gsk_`, `AIza` in `src/`
