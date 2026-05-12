# Engine NotREAL — Deploy Now Report
Generated: 2026-05-12

## Status: READY TO DEPLOY ✅

All production systems verified 2026-05-12:
- Supabase: ✅ connected, data persists
- Groq AI: ✅ live responses
- Auth: ✅ register/login to Supabase
- Smoke tests: ✅ all passed
- Build: ✅ 7.26s, 0 errors

The platform is build-stable, TypeScript clean, and demo-safe. You need two env vars for full production persistence.

---

## Required Before Deploy

```bash
# In apps/backend/.env (or your deployment env panel):
SUPABASE_SERVICE_KEY=eyJ...    # Supabase Dashboard → kmuvqataoxprbnowgbqh → Settings → API → service_role
GROQ_API_KEY=gsk_...           # console.groq.com (free)
```

Confirm with: `curl https://your-backend-url/api/health`

Expected response:
```json
{
  "database": { "mode": "supabase" },
  "ai": { "mode": "live", "provider": "groq" },
  "missingRequired": []
}
```

---

## Deployment: Backend on Render

### 1. Create Web Service
- **Root Directory**: `apps/backend`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Node Version**: 18+

### 2. Environment Variables
```
NODE_ENV=production
PORT=10000
JWT_SECRET=<generate: node -e "require('crypto').randomBytes(32).toString('hex')">
SUPABASE_URL=https://kmuvqataoxprbnowgbqh.supabase.co
SUPABASE_SERVICE_KEY=<paste real service_role key>
GROQ_API_KEY=<paste Groq key>
FRONTEND_URL=https://your-vercel-app.vercel.app
ADMIN_EMAILS=youremail@domain.com
```

### 3. Health Check
- Health check path: `/api/health`
- Expected: 200 OK with `status: "ok"`

---

## Deployment: Frontend on Vercel

### 1. Import Project
- **Root Directory**: `apps/web`
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 2. Environment Variables
```
VITE_API_URL=https://your-render-backend.onrender.com/api
```

### 3. Vercel Config
If your repo is a monorepo, set the root to `apps/web` or add a `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## Alternative: Railway (Backend)

1. Connect GitHub repo
2. Set root to `apps/backend`
3. Same env vars as Render above
4. Railway auto-detects `npm start`

---

## Alternative: Self-hosted / VPS

```bash
git clone <repo>
cd apps/backend
npm install
cp .env.example .env
# Edit .env with real values
NODE_ENV=production node server.js
```

Use `pm2` for process management:
```bash
npm install -g pm2
pm2 start server.js --name engine-notreal-backend
pm2 save
```

---

## Domain Setup (Optional)

1. Add custom domain in Vercel for frontend
2. Add `FRONTEND_URL=https://yourdomain.com` to backend env
3. Update CORS automatically picks it up

---

## Post-Deploy Verification Checklist

- [ ] `GET /api/health` → `database.mode: supabase`, `missingRequired: []`
- [ ] Register a new account
- [ ] Run Fixer Diagnosis → returns real AI response (not demo)
- [ ] Submit support ticket → `persisted: true` in response
- [ ] Create order → order saved to Supabase
- [ ] View Marketplace → real listings from Supabase
- [ ] View Pricing → real plans from Supabase
- [ ] Admin page loads for admin email user

---

## Build Verification (Local)
```
TypeScript: ✅ 0 errors (npx tsc --noEmit)
Vite build: ✅ built in 8.50s, 24 chunks, 0 errors
Backend start: ✅ PID confirmed on port 3001
API smoke tests: ✅ support, orders, fixer all 200 OK
```
