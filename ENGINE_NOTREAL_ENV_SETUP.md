# Engine NotREAL — Environment Setup

## What's Actually Required

| Variable | Required | Notes |
|----------|----------|-------|
| `JWT_SECRET` | **Yes (production)** | 32+ char random string. Has dev fallback — never use fallback in production. |
| `GROQ_API_KEY` | Recommended | Free at console.groq.com. Enables live AI. |
| `SUPABASE_URL` | Optional | Only needed to persist data across restarts. App runs without it (memdb mode). |
| `SUPABASE_SERVICE_KEY` | Optional | Backend only. Never expose to frontend. |
| All other AI keys | Optional | See provider table below. |

## Database Mode

By default the backend runs in **memdb mode** — an in-memory store that mirrors the Supabase API. No Supabase project needed to start the app.

- Data resets on each server restart
- Demo user `demo@enginenotreal.com` / `Demo@2025` is always available
- To persist data: run SQL migrations in Supabase and set `SUPABASE_URL` + `SUPABASE_SERVICE_KEY`

## AI Provider Priority

The backend auto-selects the first available key in this order:

1. `GROQ_API_KEY` — recommended, free tier available
2. `GOOGLE_GENERATIVE_AI_API_KEY`
3. `OPENAI_API_KEY`
4. `ANTHROPIC_API_KEY`
5. `MISTRAL_API_KEY`
6. `TOGETHER_API_KEY`
7. `DEEPSEEK_API_KEY`
8. `XAI_API_KEY`
9. `PERPLEXITY_API_KEY`
10. Demo mode — if no keys set, contextual demo responses are returned

## Frontend Variables

The frontend only reads two env vars (set in Vercel or `.env` in `apps/web/`):

| Variable | Default | Notes |
|----------|---------|-------|
| `VITE_API_URL` | (none) | Backend URL. Leave empty for local dev with proxy. |
| `VITE_PUBLIC_ACCESS` | `true` in dev | Set `false` in production to enforce auth gate. |

**The frontend never reads Supabase keys or AI provider keys.** All AI calls go through the backend.

## Quickstart (No Keys)

```bash
cp .env.example apps/backend/.env
# .env can stay empty — app runs in demo + memdb mode
npm install
npm run dev
```

## Minimum Production .env

```env
JWT_SECRET=your-random-32-plus-char-secret-here
GROQ_API_KEY=gsk_...
```

## Full .env Reference

See `.env.example` for all supported variables with placeholder values.
