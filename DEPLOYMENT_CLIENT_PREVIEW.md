# THE SHEEP Client Preview Deployment

## Goal
Deploy a stable client preview where `/dashboard` opens the Launch Road without visible API crashes.

## Frontend
- App root: `apps/web`
- Required env:
  - `VITE_API_URL=https://your-backend-host/api`
  - `VITE_SERVICE_MODE=hybrid`
  - `VITE_PUBLIC_ACCESS=true`
  - `VITE_CLIENT_PREVIEW_MODE=true`
- Notes:
  - `VITE_PUBLIC_ACCESS=true` keeps protected routes browsable for the client.
  - `VITE_CLIENT_PREVIEW_MODE=true` injects the preview user/token so portal actions still work against the backend.
  - `VITE_SERVICE_MODE=hybrid` lets the Launch Road fall back to local mock data if a live request fails.

## Backend
- App root: `apps/backend`
- Required env:
  - `NODE_ENV=production`
  - `PORT=3001`
  - `JWT_SECRET=<set-a-real-secret>`
  - `FRONTEND_URL=https://your-frontend-host`
  - `CLIENT_PREVIEW_MODE=true`
- Notes:
  - `CLIENT_PREVIEW_MODE=true` allows the preview token and local preview auth path.
  - The backend already uses `memdb`, so no Supabase setup is required for the client preview.
  - Demo portal data is pre-seeded for project `proj-1`.

## Vercel Frontend
```bash
cd apps/web
vercel
```

Set the frontend env vars above in the Vercel project before the production deploy.

## Render Backend
```bash
cd apps/backend
render blueprint launch
```

Or create a Render web service manually with:
- Root directory: `apps/backend`
- Build command: `npm install`
- Start command: `node server.js`

## Smoke Test
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

## Interaction Checks
- Open a zone drawer from `/dashboard`
- Run a tool station
- Open a reward asset
- Submit a support request
- Trigger a marketplace/power-up request
- Confirm `/admin` loads in preview mode
