# Engine NotREAL — Customer Launch Checklist

## Phase 1: Local Verification (No Customers Yet)

- [ ] `npm install` — clean install from root
- [ ] `npm run dev` — both frontend + backend start without errors
- [ ] `http://localhost:5173` — landing page loads
- [ ] `http://localhost:3001/api/health` — status: ok
- [ ] `http://localhost:5173/create` — business builder works (demo output OK)
- [ ] `http://localhost:5173/fixer` — fixer form submits, returns diagnosis
- [ ] `http://localhost:5173/requests` — service request form submits, shows reference ID
- [ ] `http://localhost:5173/support` — support ticket form submits, shows ticket ID
- [ ] `http://localhost:5173/marketplace` — service packs display correctly
- [ ] `http://localhost:5173/command` — interactive simulator loads

---

## Phase 2: Production Database

- [ ] Supabase project created at supabase.com
- [ ] `apps/backend/.env` created with `SUPABASE_URL` + `SUPABASE_SERVICE_KEY`
- [ ] Migration 001 run in Supabase SQL editor
- [ ] Migration 002 run
- [ ] Migration 003 run
- [ ] Migration 004 run (support_tickets + orders)
- [ ] `/api/health` shows `database.mode: "supabase"`
- [ ] Submit a test support ticket → check Supabase → row appears in `support_tickets`
- [ ] Submit a test service request → check Supabase → row appears in `orders`

---

## Phase 3: Real AI

- [ ] At least one AI provider key added to `.env` (Groq recommended — free)
- [ ] `/api/health` shows `ai.configured: true` and `ai.mode: "live"`
- [ ] Fixer mode diagnosis returns real AI output (not demo text)
- [ ] Create business tool returns real blueprint

---

## Phase 4: Auth & Security

- [ ] `JWT_SECRET` set in `.env` (32+ random characters)
- [ ] `/api/health` shows `auth.configured: true`
- [ ] Login works with a real created account
- [ ] Demo auto-login disabled in production (`NODE_ENV=production`)

---

## Phase 5: Admin Setup

- [ ] `ADMIN_EMAILS` set in `.env` with your email
- [ ] Login with that email → admin badge appears
- [ ] `GET /api/admin/overview` returns real counts
- [ ] Admin can view support tickets via `GET /api/support/tickets`
- [ ] Admin can view orders via `GET /api/orders`

---

## Phase 6: Production Deploy

- [ ] Backend deployed (Render / Railway / VPS)
- [ ] Backend env vars configured on deploy platform
- [ ] `FRONTEND_URL` set to your actual domain
- [ ] Frontend deployed (Vercel / Netlify)
- [ ] `VITE_API_URL` set to deployed backend URL
- [ ] `https://yourdomain.com/api/health` returns `productionReady: true`
- [ ] Test full flow from deployed URL (submit request, check Supabase)

---

## Phase 7: Customer-Ready

- [ ] Landing page copy is final
- [ ] Payment number is correct (`01778307704`)
- [ ] Support email / contact method is visible
- [ ] Pricing page is accurate
- [ ] bKash/Nagad payment flow tested end-to-end
- [ ] First test order submitted and confirmed manually

---

## What You DO NOT Need on Day 1

- ❌ Stripe (manual payment works)
- ❌ Custom domain (Render/Vercel subdomains work)
- ❌ CDN
- ❌ Multiple AI providers (one Groq key is enough)
- ❌ Admin UI panel (use Supabase dashboard + API directly)

---

## Support

Check `/api/health` first. If `productionReady: false`, look at `missingRequired` — it tells you exactly what key is missing.
