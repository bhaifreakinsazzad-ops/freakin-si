# Engine NotREAL — Database Setup

## Two Modes

### Mode 1: memdb (default, zero config)

The backend starts with an in-memory database that mirrors the Supabase client API. No Supabase account needed.

- Enabled automatically when `SUPABASE_URL` is not set
- Demo user always seeded: `demo@enginenotreal.com` / `Demo@2025`
- Data resets on server restart
- Good for: local dev, demos, testing, Render.com cold starts

### Mode 2: Supabase (persistent)

Set `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` in the backend `.env` to switch to persistent storage.

## Running Migrations

Migrations are SQL files in `apps/backend/migrations/`. Run them in Supabase SQL Editor in order:

```
001_bhaifreakinsbi_schema.sql   — base schema (profiles, conversations, messages, subscriptions)
002_idempotent_fix.sql          — makes migration 001 safe to re-run
003_engine_notreal.sql          — new tables: businesses, fixer_diagnoses, ai_generations,
                                  marketplace_listings, leads, projects, service_requests, pricing_plans
                                  + seed: 3 marketplace listings, 3 pricing plans
```

## Tables After Migration

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles linked to Supabase auth |
| `conversations` | AI chat conversations |
| `messages` | Individual chat messages |
| `subscriptions` | User subscription plans |
| `businesses` | Business records from builder |
| `fixer_diagnoses` | Saved Fixer Mode results |
| `ai_generations` | Log of AI generation calls |
| `marketplace_listings` | Marketplace service cards |
| `leads` | CRM leads (Run page) |
| `projects` | CRM projects (Run page) |
| `service_requests` | Service request submissions |
| `pricing_plans` | Platform pricing plans (seed data) |

## memdb Tables (Currently Active)

The memdb layer covers the core tables used by routes today:

`users`, `conversations`, `messages`, `subscriptions`, `businesses`, `services`, `payments`

Additional tables (businesses, fixer_diagnoses, leads, etc.) are available only after running migration 003.

## Important Notes

- `SUPABASE_SERVICE_KEY` is a **service role key** — it bypasses RLS. Keep it backend-only.
- Never expose `SUPABASE_SERVICE_KEY` to the frontend or commit it to git.
- If switching from memdb to Supabase mid-session, all in-memory data is lost.
