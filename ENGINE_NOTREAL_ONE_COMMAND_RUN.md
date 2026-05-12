# Engine NotREAL — One Command Run Guide

## Quick Start

```bash
# 1. Install everything (first time only)
npm install

# 2. Start both frontend + backend
npm run dev
```

No API keys needed for demo mode.

## URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:3001 |
| Command Center | http://localhost:5173/command |
| Support | http://localhost:5173/support |
| Service Requests | http://localhost:5173/requests |
| Marketplace | http://localhost:5173/marketplace |
| Health Check | http://localhost:3001/api/health |

## Demo Login

In dev mode (`npm run dev`), you are automatically logged in as a premium admin user — no login needed.

If login is required:

| Field | Value |
|-------|-------|
| Email | `demo@enginenotreal.com` |
| Password | `Demo@2025` |

## Full Platform Flow (Demo Mode)

1. `http://localhost:5173` — Landing page
2. `http://localhost:5173/dashboard` — Control center
3. `http://localhost:5173/create` — Build a business (demo output if no AI key)
4. `http://localhost:5173/fixer` — Fix a business problem (demo fallback)
5. `http://localhost:5173/run` — CRM / pipeline
6. `http://localhost:5173/marketplace` — Service packs + listings
7. `http://localhost:5173/requests` — Submit a service request
8. `http://localhost:5173/support` — Open a support ticket
9. `http://localhost:5173/pricing` — View plans
10. `http://localhost:5173/command` — Interactive AI business simulator

## What Demo AI Means

When no AI provider key is set, the app shows realistic static demo output instead of calling a real AI API. All buttons work. Forms submit. Results display. No API key needed to test the full flow.

## What MemDB Means

The backend uses an in-memory store when no Supabase credentials are set. Data resets when the backend restarts. Everything works — leads, requests, support tickets — they just don't persist across restarts.

## Individual Commands

```bash
npm run dev          # Start everything (Turborepo — recommended)
npm run dev:web      # Frontend only (port 5173)
npm run dev:backend  # Backend only (port 3001)
npm run build        # Production build (frontend)
```

## For Real Production

Create `apps/backend/.env` with these keys:

```env
# Required
JWT_SECRET=your-32-char-secret-here

# AI (at least one — Groq is free tier)
GROQ_API_KEY=gsk_...

# Database (optional — memdb works without it)
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...

# Optional
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
ADMIN_EMAILS=your@email.com
```

Run SQL migrations once Supabase is connected (in order):
- `migrations/001_bhaifreakinsbi_schema.sql`
- `migrations/002_idempotent_fix.sql`
- `migrations/003_engine_notreal.sql`
- `migrations/004_production_core.sql`  ← support_tickets + orders tables
