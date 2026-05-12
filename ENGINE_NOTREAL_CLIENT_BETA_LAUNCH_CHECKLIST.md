# Engine NotREAL — Client Beta Launch Checklist
Generated: 2026-05-12

## Pre-Launch

### Environment
- [x] `SUPABASE_URL` set — `kmuvqataoxprbnowgbqh.supabase.co`
- [x] `SUPABASE_SERVICE_KEY` set — real service_role key (219 chars, JWT format)
- [x] `GROQ_API_KEY` set — 56 chars, `gsk_` prefix
- [x] `JWT_SECRET` set — 36+ chars
- [x] `ADMIN_EMAIL` set (single email)
- [ ] `ADMIN_EMAILS` OR `ADMIN_EMAIL` populated with real admin email ← confirm in prod deploy
- [x] `.env` not committed to git
- [x] Manual payment phone number: `01778307704`

### Database
- [x] Supabase schema applied: 14 tables, RLS enabled
- [x] Seed data: 5 marketplace listings, 3 pricing plans
- [x] `support_tickets` table live
- [x] `orders` table live
- [x] `users` table with `password_hash` column
- [x] `service_requests` table live
- [x] `fixer_diagnoses` table live

### Backend
- [x] `/api/health` → `database.mode: supabase`, `ai.provider: groq`, `missingRequired: []`
- [x] User register + login → persists to Supabase `users` table
- [x] JWT auth middleware reads from Supabase `users`
- [x] Support tickets → `persisted: true`
- [x] Orders → `persisted: true`
- [x] Service requests → UUID in Supabase
- [x] Fixer diagnose → `demo: false`, real Groq response
- [x] Admin overview → reads live Supabase counts
- [x] `groq-sdk` package installed

### Frontend
- [x] TypeScript: 0 errors
- [x] Vite build: ✅ 7.26s, 2400 modules
- [x] Landing page → `/` loads
- [x] Login / Register pages load
- [x] Dashboard quick actions all link to active routes
- [x] Fixer Mode → form + AI response
- [x] Create Business → AI builder + demo fallback
- [x] Run/CRM → pipeline view
- [x] Marketplace → seeded listings
- [x] Pricing → 3-tier plans
- [x] Support → ticket form + confirmation
- [x] Payment → manual bKash/Nagad/Rocket flow (honest)
- [x] No fake Stripe "Pay Now" button

### Security
- [x] `SUPABASE_SERVICE_KEY` not in any frontend file
- [x] Frontend uses only `VITE_API_URL` to hit backend
- [x] CORS restricted to known origins
- [x] No secrets in console logs

---

## Deployment Steps

### Step 1 — Deploy Backend (Render)
```
Root: apps/backend
Build: npm install
Start: node server.js
```
Set env vars in Render dashboard:
```
NODE_ENV=production
PORT=10000
JWT_SECRET=<your 64-char hex>
SUPABASE_URL=https://kmuvqataoxprbnowgbqh.supabase.co
SUPABASE_SERVICE_KEY=<real service_role key>
GROQ_API_KEY=<your Groq key>
ADMIN_EMAIL=<your email>
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### Step 2 — Deploy Frontend (Vercel)
```
Root: apps/web
Build: npm run build
Output: dist
```
Set env var:
```
VITE_API_URL=https://your-render-backend.onrender.com/api
```

### Step 3 — Verify Deployment
```bash
curl https://your-backend.onrender.com/api/health
# Expect: database.mode: "supabase", missingRequired: []
```

### Step 4 — Test Live Flow
1. Open `https://your-vercel-app.vercel.app`
2. Register new account
3. Run Fixer Diagnosis
4. Submit support ticket
5. Check admin overview: `https://your-vercel-app.vercel.app/admin`

---

## Post-Launch Monitoring
- [ ] Check `/api/health` daily for first week
- [ ] Monitor support_tickets in Supabase Dashboard
- [ ] Monitor orders in Supabase Dashboard
- [ ] Add rate limiting before traffic scales (express-rate-limit)
- [ ] Add email notifications for new tickets/orders (Resend/SendGrid)
- [ ] Stripe integration when ready (add `STRIPE_SECRET_KEY`)
