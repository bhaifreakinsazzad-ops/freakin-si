# THE SHEEP Client Preview Deployment

## Current Live Preview
- Frontend: https://freakin-si-git-codex-beta-2-db-x-codex.vercel.app
- Same-domain API: https://freakin-si-git-codex-beta-2-db-x-codex.vercel.app/api
- Health: https://freakin-si-git-codex-beta-2-db-x-codex.vercel.app/api/health
- Best first route for client demo: `/dashboard`

## What This Preview Is
This is a client-safe preview using the accepted Launch Road UI and a same-domain Vercel API fallback. It is designed to avoid client-facing crashes even if the durable backend is not connected yet.

## Frontend: Vercel
- Project root: `apps/web`
- Build command: `npm run build`
- Output directory: `dist`
- Preview env:
  - `VITE_API_BASE_URL=/api`
  - `VITE_API_URL=/api`
  - `VITE_SERVICE_MODE=hybrid`
  - `VITE_PUBLIC_ACCESS=true`
  - `VITE_CLIENT_PREVIEW_MODE=true`

## Same-Domain Vercel API Fallback
Files:
- `apps/web/api/[...path].js`
- `apps/web/api/index.js`
- `apps/web/vercel.json`

Fallback covers:
- auth preview token
- portal projects, onboarding, steps, assets, module runs, reviews
- support threads/messages
- marketplace orders
- documents, notifications, activity logs
- admin stats/users/payments placeholders
- tools/modules/chat/image/subscription placeholders

Data is in-memory per serverless instance. It is safe for demos, but not durable production storage.

## Backend Option: Render
- Root directory: `apps/backend`
- Build command: `npm install`
- Start command: `node server.js`
- Health check: `/api/health`
- Blueprint: `apps/backend/render.yaml`

Required backend env:
- `NODE_ENV=production`
- `PORT=3001`
- `JWT_SECRET=<secure-random-value>`
- `FRONTEND_URL=<deployed-frontend-url>`
- `CLIENT_PREVIEW_MODE=true` for preview or `false` for production login-only access
- `ADMIN_EMAILS=demo@blacksheep.ai,<real-admin-email>`

Durable Supabase env:
- `SUPABASE_PROJECT_ID=pcaturcbsepbtaqksqqm`
- `SUPABASE_URL=https://pcaturcbsepbtaqksqqm.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY=<service-role-key>`
- `SUPABASE_ANON_KEY=<anon-key>`
- `SUPABASE_SERVICE_KEY=<optional-alias-for-service-role-key>`
- `DATABASE_URL=<postgres-connection-string>` if using direct SQL tooling

## Deployment Order
1. Keep Vercel preview live with same-domain API.
2. Use Supabase project `pcaturcbsepbtaqksqqm`.
3. Run backend migrations in order: `002_idempotent_fix.sql`, then `003_sheep_portal_structures.sql`. Do not run the older `001` migration on a blank Supabase project unless it has been manually reviewed for that schema.
4. Deploy `apps/backend` to Render with Supabase env vars.
5. Test Render `/api/health`.
6. Set Vercel frontend env to the Render API for staging or production:
   - hybrid: `VITE_SERVICE_MODE=hybrid`, `VITE_API_BASE_URL=https://your-render-app.onrender.com/api`
   - production: `VITE_SERVICE_MODE=live`, `VITE_PUBLIC_ACCESS=false`, `VITE_CLIENT_PREVIEW_MODE=false`
7. Redeploy Vercel.
8. Test `/dashboard` and API interactions.

## Smoke Test Routes
- `/`
- `/dashboard`
- `/journey`
- `/modules`
- `/assets`
- `/support`
- `/marketplace`
- `/pricing`
- `/builder`
- `/services`
- `/admin`
- `/login`
- `/register`
- `/api/health`

## Interaction Checks
- Launch Road loads
- zone click opens drawer
- Continue Mission opens current zone
- tool station run does not crash
- reward preview opens
- marketplace request creates fallback/live response
- support request creates fallback/live response
- module run creates fallback/live response
- admin page loads
- 52 modules exist
- no API failures in console
- mobile dashboard has no horizontal overflow

## Client Handoff Demo Script
1. Open `/dashboard`.
2. Show THE SHEEP Launch Road and current mission.
3. Click the current zone and show the mission workspace drawer.
4. Run an AI tool station.
5. Open a reward asset.
6. Request a marketplace/service power-up.
7. Open `/modules` and show the 52-module library.
8. Open `/admin` and show command center preview.
9. Explain that the current preview is safe fallback mode and production persistence is prepared through Supabase/Render.

## Rollback
- If Render production API has issues, set Vercel back to:
  - `VITE_API_BASE_URL=/api`
  - `VITE_SERVICE_MODE=hybrid`
  - `VITE_PUBLIC_ACCESS=true`
  - `VITE_CLIENT_PREVIEW_MODE=true`
- Redeploy Vercel. This restores the same-domain fallback preview.
