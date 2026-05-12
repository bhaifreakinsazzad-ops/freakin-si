# ENGINE NOTREAL — Merge Plan

**Date:** 2026-05-10  
**Status:** In Progress

---

## What Was Found

### Existing Monorepo (`freakin-si`)
- **Stack:** React 18 + Vite + TypeScript + Tailwind CSS (web), Express.js (backend), Supabase PostgreSQL
- **Brand:** "Black Sheep by Divorcing The Game™" — red/gold palette, premium serif fonts
- **18 pages** already built: auth, chat, dashboard, builder, marketplace, services, pricing, tools, image gen, admin
- **Backend routes:** auth, chat, image, tools, models, subscriptions, admin, businesses, services
- **Database:** Full Supabase schema — users, conversations, messages, image_history, tool_history, payment_requests, usage_logs
- **AI providers:** Groq (default), Gemini, OpenRouter, Together, Cohere

### Archive 1 — DhandaBuzz Supabase Export (`amuqMEBHJ4md4RxsFYflK.tar.gz`)
- Supabase project export with `ai-generate` edge function
- Three AI modes: `ads` (Facebook ad copy), `content` (social posts), `chat`
- Uses `google/gemini-2.5-flash` via fastrouter.io gateway
- **Reuse:** AI prompt patterns for ad copy and content generation

### Archive 2 — Agency CRM Dashboard (`automation-business-digital.zip`)
- Full React CRM: Clients, Tasks, Campaigns, Invoices, Team, Reports
- Dark glassmorphism UI, Recharts, TanStack Query, Supabase
- **Reuse:** Client management structure → Engine NotREAL "Run" module, campaign tracking → CRM module

### Archive 3 — freakin-si-main.zip
- GitHub snapshot of main branch (same as worktree)
- Includes Expo mobile app (`SI BhaiFreakin`) — not merged now, future-ready
- **Reuse:** Shared constants patterns

---

## Merge Decisions

| Component | Decision | Reason |
|-----------|----------|--------|
| React+Vite+TS+Tailwind | Keep | Already working, good stack |
| Express.js backend | Keep + extend | Add fixer route |
| Supabase PostgreSQL | Keep + extend | Add new tables |
| Black Sheep brand | Replace → Engine NotREAL | Core mission |
| "Divorcing The Game™" | Archive as legacy ref | Keep in legal/about only |
| Chat AI | Keep | Core feature, well-built |
| Business Builder (10-step) | Keep + rebrand | Already excellent |
| Marketplace | Keep + enhance | Add seed data |
| Services page | Keep + rebrand as "Requests" | Good foundation |
| DhandaBuzz AI prompts | Absorb into AI layer | Upgrade ad/content prompts |
| Agency CRM features | Absorb into Run module | Client/task management |
| Expo mobile app | Leave untouched | Out of MVP scope |
| LandingPage | Full rebrand | Must become Engine NotREAL |
| Dashboard | Rebrand + upgrade | Remove Black Sheep copy |
| Layout/Navigation | Rebrand + restructure | New nav items |

---

## New Architecture

```
apps/
  web/
    src/
      config/
        brand.ts          ← Rebranded to Engine NotREAL
        gates.ts          ← Archive (keep for reference)
      lib/
        ai/
          modelRegistry.ts   ← NEW: 40+ model definitions
          providers.ts       ← NEW: Provider abstraction
          prompts.ts         ← NEW: All system prompts
          generateBlueprint.ts   ← NEW
          generateFixer.ts       ← NEW
          generateListing.ts     ← NEW
          generateRoadmap.ts     ← NEW
      pages/
        LandingPage.tsx      ← Full rebrand
        DashboardPage.tsx    ← Rebrand + upgrade
        FixerPage.tsx        ← NEW
        RunPage.tsx          ← NEW (CRM/operations)
        MarketplacePage.tsx  ← Keep + enhance
        BusinessBuilderPage  ← Keep + rebrand
        ServicesPage         ← Keep as Requests
  backend/
    routes/
      fixer.js             ← NEW
      ai.js                ← NEW (AI abstraction)
    lib/
      aiRouter.js          ← NEW: provider abstraction
    migrations/
      003_engine_notreal.sql ← NEW tables + seed
```

---

## What Will Be Archived

- `Freakin Si/` folder — legacy reference, not deleted
- Old Black Sheep copy in comments — replaced in place
- DhandaBuzz edge function — patterns absorbed, original archived

---

## Assumptions

1. Supabase remains the database (no migration needed)
2. Existing auth system is preserved as-is
3. No real API keys in files — all via .env
4. Demo mode works without any AI keys
5. Mobile app (Expo) is out of MVP scope
6. bKash/Nagad payment kept as-is (markets match)
7. Bengali language support kept but English is primary for Engine NotREAL
