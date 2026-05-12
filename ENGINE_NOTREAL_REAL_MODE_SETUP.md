# Engine NotREAL — Real Mode Setup

**For production with real customers. Demo/memdb mode needs none of this — it works out of the box.**

---

## What Changes in Real Mode

| System | Demo/Dev Mode | Real Mode (env set) |
|--------|---------------|---------------------|
| Database | In-memory (resets on restart) | Supabase (persists forever) |
| AI | Static demo responses | Live AI (Groq, OpenAI, etc.) |
| Auth | Dev auto-login | JWT verified against real users |
| Orders | In-memory only | Persisted to Supabase `orders` table |
| Support tickets | In-memory only | Persisted to `support_tickets` table |
| Fixer diagnoses | Not saved | Saved to `fixer_diagnoses` table |
| `/api/health` | `productionReady: false` | `productionReady: true` |

---

## Step 1 — Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Settings → API** and copy:
   - `Project URL` → `SUPABASE_URL`
   - `service_role` key (not anon) → `SUPABASE_SERVICE_KEY`

3. Go to **SQL Editor** and run migrations IN ORDER:
   ```
   apps/backend/migrations/001_bhaifreakinsbi_schema.sql
   apps/backend/migrations/002_idempotent_fix.sql
   apps/backend/migrations/003_engine_notreal.sql
   apps/backend/migrations/004_production_core.sql   ← NEW (support_tickets + orders)
   ```

---

## Step 2 — Create `.env` File

```bash
# apps/backend/.env

# ── REQUIRED ──────────────────────────────────────────────
JWT_SECRET=replace-with-32-plus-random-chars-here

# ── DATABASE (required for persistence) ───────────────────
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...service_role_key...

# ── AI (at least one) ─────────────────────────────────────
# Groq — recommended (free tier, fast)
GROQ_API_KEY=gsk_...

# Other providers (optional)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_GENERATIVE_AI_API_KEY=AIza...

# ── ADMIN ─────────────────────────────────────────────────
ADMIN_EMAILS=youremail@example.com,secondadmin@example.com

# ── OPTIONAL ──────────────────────────────────────────────
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://yourdomain.com

# Stripe (future — not required)
STRIPE_SECRET_KEY=sk_live_...
```

---

## Step 3 — Start

```bash
npm install
npm run dev          # dev: frontend + backend together
# OR
npm run dev:backend  # backend only (port 3001)
npm run dev:web      # frontend only (port 5173)
```

---

## Step 4 — Verify

```bash
curl http://localhost:3001/api/health
```

Expected response in real mode:

```json
{
  "status": "ok",
  "productionReady": true,
  "environment": "production",
  "database": { "configured": true, "mode": "supabase", "note": "Connected to Supabase — data persists." },
  "auth": { "configured": true, "note": "JWT_SECRET set." },
  "ai": { "configured": true, "provider": "groq", "mode": "live" },
  "missingRequired": [],
  "missingRecommended": []
}
```

If `productionReady` is `false`, check `missingRequired` for exactly what keys are missing.

---

## Admin Overview

Once running with credentials:

```
GET /api/admin/overview   (requires auth + admin email)
```

Returns counts of support tickets, orders, service requests, businesses.

---

## Data Flow in Real Mode

```
Customer submits service request
    → POST /api/orders
    → Creates record in Supabase orders table
    → You see it in admin overview

Customer submits support ticket
    → POST /api/support/tickets
    → Creates record in Supabase support_tickets table
    → GET /api/support/tickets (admin auth) to view all

Fixer AI diagnosis
    → POST /api/fixer/diagnose
    → Calls Groq/OpenAI/etc.
    → Saves to fixer_diagnoses table
    → Returns real structured diagnosis
```

---

## Frontend Environment

```bash
# apps/web/.env (or .env.local)
VITE_API_URL=http://localhost:3001/api   # dev
# VITE_API_URL=https://api.yourdomain.com/api   # production
```

---

## Deploy

The backend is standard Node/Express — deploy to:
- **Render** (recommended — free tier works, env vars in dashboard)
- **Railway**
- **Fly.io**
- **Any VPS** (PM2 + nginx)

The frontend is a Vite SPA — deploy to:
- **Vercel** (one command: `vercel`)
- **Netlify**
- **Cloudflare Pages**

Set `VITE_API_URL` to your deployed backend URL before building.
