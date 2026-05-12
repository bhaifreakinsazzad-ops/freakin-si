# THE SHEEP Persistence Audit

## Current Preview API
Same-domain fallback files:
- `apps/web/api/[...path].js`
- `apps/web/api/index.js`
- `apps/web/vercel.json`

Fallback routes currently covered:
- `/api/health`
- `/api/auth/login`, `/api/auth/register`, `/api/auth/me`, `/api/auth/profile`
- `/api/businesses/generate`
- `/api/businesses/marketplace/listings`
- `/api/portal/projects`
- `/api/portal/onboarding/:projectId`
- `/api/portal/steps/:projectId`
- `/api/portal/assets/:projectId`
- `/api/portal/modules/runs/:projectId`
- `/api/portal/reviews/:projectId`
- `/api/portal/support/threads/:projectId`
- `/api/portal/support/messages/:threadId`
- `/api/portal/marketplace/orders/:projectId`
- `/api/portal/documents/:projectId`
- `/api/portal/notifications`
- `/api/portal/activity/:projectId`
- `/api/portal/admin-notes/:projectId`
- `/api/portal/pricing-plans`
- `/api/portal/subscriptions`
- `/api/tools`, `/api/tools/:id/run`, `/api/tools/history`
- `/api/chat`, `/api/chat/conversations`
- `/api/image/*`
- `/api/subscriptions/*`
- `/api/admin/*`
- `/api/services`

These routes are preview-safe and in-memory only on Vercel.

## Backend-Ready Routes
`apps/backend/routes/portal.js` is wired for the durable backend path and supports:
- business projects
- onboarding answers
- step progress
- generated assets
- AI module runs
- review tickets
- support threads/messages
- marketplace orders
- documents
- notifications
- activity logs
- admin notes
- pricing plans
- subscriptions

`apps/backend/routes/auth.js` now uses the active database helper, so register/login/profile can use Supabase when configured or memdb when not configured.

## Database Switch
`apps/backend/lib/db.js` chooses the database provider:
- Supabase/Postgres when `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_SERVICE_KEY` are set.
- `memdb` fallback when Supabase env is missing.

## In-Memory Only Areas
Still intentionally in-memory/demo unless a production backend is connected:
- Vercel same-domain API state
- preview auth token state
- Vercel fallback support/marketplace/module writes

This is acceptable for client preview, not for final production persistence.

## Durable Persistence Requirements
To make production persistent:
1. Create Supabase/Postgres project.
2. Run migrations `001`, `002`, `003`.
3. Deploy `apps/backend` to Render or another Node host.
4. Set Supabase service-role env vars on backend only.
5. Set Vercel frontend to `VITE_SERVICE_MODE=live` and `VITE_API_BASE_URL=<backend>/api`.
6. Turn off public preview flags for real production.

## Frontend Service Contract
Frontend services now resolve the active project id from `/portal/projects` for live/hybrid calls instead of assuming the preview id `proj-1`. This allows production UUID project ids to work while preserving preview fallback behavior.
