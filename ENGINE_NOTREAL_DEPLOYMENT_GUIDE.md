# Engine NotREAL — Deployment Guide

## Architecture

```
Frontend (Vercel)         Backend (Render.com)
apps/web/                 apps/backend/
Vite + React SPA          Express.js API
                          │
                          └── memdb (default) or Supabase
```

---

## Frontend — Vercel

### Project Setup

1. Connect your GitHub repo to Vercel
2. Set **Root Directory**: `apps/web`
3. **Framework**: Vite (auto-detected)
4. **Build command**: `npm run build`
5. **Output directory**: `dist`

### Environment Variables (Vercel)

```env
VITE_API_URL=https://your-backend.render.com/api
VITE_PUBLIC_ACCESS=false
```

`VITE_PUBLIC_ACCESS=false` enables the auth gate in production. Without it, all routes are public.

### Domain

Add `enginenotreal.com` and `www.enginenotreal.com` in Vercel → Domains.

---

## Backend — Render.com

### Service Setup

1. Create a **Web Service** in Render
2. Connect your GitHub repo
3. Set **Root Directory**: `apps/backend`
4. **Build command**: `npm install`
5. **Start command**: `node server.js`
6. **Environment**: Node

### Environment Variables (Render)

```env
NODE_ENV=production
PORT=3001
JWT_SECRET=<your-32-plus-char-random-string>

# At least one AI provider:
GROQ_API_KEY=gsk_...

# Optional — for persistent storage:
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=service_role_...

# Optional AI providers:
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_GENERATIVE_AI_API_KEY=AIza...

# Optional payments:
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Optional:
FRONTEND_URL=https://enginenotreal.com
ADMIN_EMAILS=your@email.com
```

### Health Check

Render will hit `GET /api/health` for uptime checks. Ensure this route returns 200.

---

## Database — Supabase (optional)

If using persistent storage:

1. Create a Supabase project at supabase.com
2. Open SQL Editor and run migrations in order:
   - `apps/backend/migrations/001_bhaifreakinsbi_schema.sql`
   - `apps/backend/migrations/002_idempotent_fix.sql`
   - `apps/backend/migrations/003_engine_notreal.sql`
3. Copy your project URL and service role key to Render env vars

Without Supabase: app runs in memdb mode (data resets on restart, fine for demos).

---

## CORS Configuration

Backend CORS (`apps/backend/server.js`) allows:
- `http://localhost:5173` (local dev)
- `http://localhost:3000`
- `http://localhost:4173` (Vite preview)
- `https://enginenotreal.com`
- `https://www.enginenotreal.com`
- Any `*.vercel.app` (preview deployments)

Add other domains to `allowedOrigins` in `server.js` if needed.

---

## Vercel Frontend API Proxy

`apps/web/vite.config.ts` includes a proxy that forwards `/api/*` to `http://localhost:3001` in local dev. In production, `VITE_API_URL` tells the frontend the backend URL directly.

---

## Post-Deployment Checklist

- [ ] Verify `GET https://your-backend.render.com/api/health` returns `{"status":"ok"}`
- [ ] Verify AI provider shows correct name in health response (not "demo")
- [ ] Login with demo user or register a new account
- [ ] Test Fixer Mode end-to-end
- [ ] Confirm pricing page loads without errors
- [ ] Set `VITE_PUBLIC_ACCESS=false` and redeploy frontend
- [ ] Test auth gate: visiting `/dashboard` without login → redirects to `/login`
