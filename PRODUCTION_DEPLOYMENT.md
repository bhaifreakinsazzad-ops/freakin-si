# THE SHEEP Production Deployment

## Goal
Move from client-preview-safe mode to durable production mode without breaking the existing Vercel preview.

## Architecture Modes

### 1. Preview
- Frontend: Vercel `apps/web`
- API: same-domain Vercel serverless fallback under `/api`
- Data: in-memory seeded demo data
- Env:
  - `VITE_API_BASE_URL=/api`
  - `VITE_SERVICE_MODE=hybrid`
  - `VITE_PUBLIC_ACCESS=true`
  - `VITE_CLIENT_PREVIEW_MODE=true`
- Use when: client needs a stable visual/product demo immediately.

### 2. Hybrid / Staging
- Frontend: Vercel
- API: Render backend if available, fallback behavior still enabled in frontend services
- Data: Supabase/Postgres if backend env is configured, otherwise backend memdb
- Env:
  - `VITE_API_BASE_URL=https://your-render-app.onrender.com/api`
  - `VITE_SERVICE_MODE=hybrid`
  - `VITE_PUBLIC_ACCESS=true` or `false` depending on staging audience
  - `VITE_CLIENT_PREVIEW_MODE=true` for demo users
- Use when: testing real backend while keeping client-safe fallback.

### 3. Production
- Frontend: Vercel custom domain
- API: Render backend or another Node host running `apps/backend`
- Data: Supabase/Postgres using service-role backend access
- Env:
  - `VITE_API_BASE_URL=https://api.your-domain.com/api`
  - `VITE_SERVICE_MODE=live`
  - `VITE_PUBLIC_ACCESS=false`
  - `VITE_CLIENT_PREVIEW_MODE=false`
  - `CLIENT_PREVIEW_MODE=false`
- Use when: real users need persistent accounts/projects/assets/support/orders.

## Durable Database Path
Use Supabase/Postgres with these migrations in order:
1. `apps/backend/migrations/001_bhaifreakinsbi_schema.sql`
2. `apps/backend/migrations/002_idempotent_fix.sql`
3. `apps/backend/migrations/003_sheep_portal_structures.sql`

The third migration creates/finalizes:
- `business_projects`
- `onboarding_answers`
- `step_progress`
- `generated_assets`
- `ai_modules`
- `ai_module_runs`
- `review_tickets`
- `support_threads`
- `support_messages`
- `marketplace_listings`
- `marketplace_orders`
- `documents`
- `notifications`
- `activity_logs`
- `admin_notes`
- `pricing_plans`
- `subscriptions`

It also seeds:
- demo admin user: `demo@blacksheep.ai`
- demo project
- 7 Launch Road steps
- 52 AI modules
- reward assets
- review ticket
- support thread/messages
- marketplace listings
- notifications/activity
- pricing/subscription placeholders

## Backend Persistence Behavior
Backend database selection lives in `apps/backend/lib/db.js`.

If `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_SERVICE_KEY` exist:
- backend routes use Supabase/Postgres
- auth register/login/profile reads and writes the `users` table
- portal routes persist projects, assets, reviews, support, marketplace orders, notifications, and activity

If Supabase env is missing:
- backend uses `apps/backend/lib/memdb.js`
- preview data remains stable for local/client demos
- API should return JSON instead of crashing

## Auth And Access Control Prep
Current auth model:
- JWTs are issued by `apps/backend/routes/auth.js`
- JWT validation happens in `apps/backend/middleware/auth.js`
- preview tokens are accepted only when `CLIENT_PREVIEW_MODE=true` or non-production local mode
- admin access uses `ADMIN_EMAILS` or `users.is_admin`

Roles to use in production:
- `client`: normal user, owns projects through `business_projects.user_id`
- `admin`: can review assets, reply to support, view project operations
- `super_admin`: reserved for platform-level data and future billing/admin management

Supabase RLS production notes:
- Enable RLS before storing real client data.
- Client policies should restrict parent rows with `business_projects.user_id = auth.uid()`.
- Child records should be restricted through project ownership joins.
- Admin/super_admin policies should use role claims or a dedicated admin table.
- Keep service-role keys only on trusted backend hosts, never in frontend env.

## Frontend Vercel Setup
- Root: `apps/web`
- Build command: `npm run build`
- Output: `dist`
- Node: 18+

Production env:
- `VITE_API_BASE_URL=https://your-backend-host/api`
- `VITE_API_URL=https://your-backend-host/api`
- `VITE_SERVICE_MODE=live`
- `VITE_PUBLIC_ACCESS=false`
- `VITE_CLIENT_PREVIEW_MODE=false`

Custom domain steps:
1. Add domain in Vercel project settings.
2. Point DNS to Vercel as instructed.
3. Set `FRONTEND_URL` on backend to the final frontend domain.
4. Add the final frontend domain to backend CORS if needed.
5. Redeploy backend and frontend.

## Backend Render Setup
- Root: `apps/backend`
- Build command: `npm install`
- Start command: `node server.js`
- Health: `/api/health`
- Blueprint: `apps/backend/render.yaml`

Required env:
- `NODE_ENV=production`
- `PORT=3001`
- `JWT_SECRET=<secure-random-value>`
- `FRONTEND_URL=<frontend-domain>`
- `CLIENT_PREVIEW_MODE=false` for production
- `ADMIN_EMAILS=<comma-separated-admin-emails>`
- `SUPABASE_URL=<supabase-url>`
- `SUPABASE_SERVICE_ROLE_KEY=<service-role-key>`
- `SUPABASE_ANON_KEY=<anon-key>`

Optional provider env:
- `GROQ_API_KEY`
- `GEMINI_API_KEY`
- `OPENROUTER_API_KEY`
- `COHERE_API_KEY`

## Production QA Checklist
Routes:
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

API checks:
- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/portal/projects`
- `POST /api/portal/projects`
- `POST /api/portal/modules/runs`
- `POST /api/portal/support/threads`
- `POST /api/portal/marketplace/orders`

Interaction checks:
- Launch Road loads
- zone drawer opens
- Continue Mission opens current zone
- tool station writes a module run
- reward asset opens
- support request persists
- marketplace request persists
- admin review actions work
- 52 modules remain available

## Rollback
Fast rollback to safe preview:
1. Set frontend env back to same-domain API:
   - `VITE_API_BASE_URL=/api`
   - `VITE_API_URL=/api`
   - `VITE_SERVICE_MODE=hybrid`
   - `VITE_PUBLIC_ACCESS=true`
   - `VITE_CLIENT_PREVIEW_MODE=true`
2. Redeploy Vercel.
3. Verify `/api/health` and `/dashboard`.

## Exact Next Action For Full Production Launch
Create the Supabase project, run migrations `001` to `003`, deploy `apps/backend` to Render with Supabase env vars, then switch Vercel from same-domain preview API to the Render API in `live` mode.
