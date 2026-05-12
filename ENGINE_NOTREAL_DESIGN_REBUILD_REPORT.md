# Engine NotREAL — Design Rebuild Report

**Date:** 2026-05-10
**Target:** `/command` page — premium interactive command center

---

## Design Problems Found

1. **Visual clutter** — 18 floating model pills in orbit animation created noise, not clarity
2. **Misleading claims** — "40+ AI Mesh" implied 40 live models; only 9 providers are supported
3. **No system awareness** — page showed no actual engine status (AI mode, DB mode, health)
4. **Missing inputs** — Create screen lacked business stage and budget level selectors
5. **Neon overload** — excessive cyan glow (0_0_80px, 0_0_38px shadows) felt cheap, not premium
6. **Typography** — overuse of `font-black` (weight 900) reduced hierarchy
7. **Design language mismatch** — CommandPage looked different from the rest of the app (different card style, color palette)

## What Was Improved

### Visual System
| Before | After |
|--------|-------|
| Cyan-dominated neon glow | Indigo primary with subtle accents |
| `font-black` everywhere | Measured weights (bold, semibold, medium) |
| `rounded-[2.3rem]` cards | `rounded-2xl` consistent cards |
| 3 animated glow orbs | Single subtle radial gradient |
| Grid background overlay | Clean minimal background |
| Custom Logo component | Compact branded header |

### New Features Added
- **Engine Status Panel** — Live health check from `/api/health`, shows AI mode (Demo/Live), database mode (Memory/Supabase), system readiness
- **AI Provider Grid** — Clean chips showing 9 supported providers with honest description
- **Feature Cards** — 4 cards (Create/Fix/Run/Sell) with hover interactions and descriptions
- **Business Stage Selector** — Idea, Pre-launch, Early Revenue, Growing, Scaling
- **Budget Level Selector** — Bootstrap, Lean, Growth, Funded
- **Service Pack Details** — Added "Best for" and "Expected outcome" to marketplace cards

### Design Components
- `Card` — Reusable glass card with optional hover state
- `StatusDot` — Active/inactive indicator with glow
- `SectionLabel` — Consistent section headers
- `MiniCard` — Compact stat display
- `Pill` — Selection button with active/inactive states

### Color Palette
```
Primary:    #6366f1 (indigo-500)
Accent:     #06b6d4 (cyan-500)
Success:    #10b981 (emerald-500)
Background: #08080f (near-black)
Card BG:    rgba(255,255,255,0.03)
Card Border:rgba(255,255,255,0.08)
Text:       #f1f5f9 (slate-100)
Muted:      #64748b (slate-500)
```

## Route / Page Changed

| File | Change |
|------|--------|
| `apps/web/src/pages/CommandPage.tsx` | Full redesign — new visual system, engine status, provider grid, stage/budget selectors |

## Interaction Features

- [x] Screen switching with AnimatePresence mode="wait"
- [x] Live engine health check (fetches /api/health on mount)
- [x] Business type / market / stage / budget / bottleneck pill selectors
- [x] Scan animation (gradient beam sweep on blueprint generation)
- [x] Marketplace search/filter (real-time across title/category/signal/desc/bestFor)
- [x] Service offer modal with details + "Request This Service" CTA
- [x] Live Blueprint modal
- [x] Reactive request stack
- [x] Mobile bottom nav with labels (5 tabs)
- [x] Feature cards with hover reveal
- [x] Provider chip grid

## Mobile Status

- ✅ Responsive grid layouts (1-col on mobile, multi-col on desktop)
- ✅ Sticky mobile bottom nav with 5 tabs + labels
- ✅ Touch-friendly pill buttons and cards
- ✅ Full-screen modals on mobile
- ✅ Readable typography at all breakpoints

## Build Results — v2 (Premium Design)

| Check | Result |
|-------|--------|
| TypeScript (`tsc --noEmit`) | ✅ Zero errors |
| Vite build | ✅ 7.60s |
| CommandPage chunk | 42.32 kB (gzip: 11.04 kB) |

---

## v3 Interactive Rebuild — Business Machine Simulator

**Date:** 2026-05-10
**Status:** ✅ TypeScript clean, Vite build passes

### Why v3?

The v2 design was visually premium but mostly static. Clicking pills updated state but panels didn't change substantively. The `/command` page needs to feel like a real AI business operating system — users should be able to spend 2–3 minutes clicking through it and feel like the platform is actually doing something.

### New Interactive Systems Added

| System | Implementation |
|--------|---------------|
| Mode switcher | 6 modes (Command, Create, Fix, Run, Sell, AI Mesh) — each renders a completely different panel |
| Business Configurator | Persistent left sidebar — businessType/market/stage/problem/budget pills — drives ALL output panels |
| AI Scan Animation | 5-step progress overlay (360ms intervals) with progress bar — RunScan button triggers it |
| Dynamic Fixer Diagnosis | `getDiagnosis(cfg)` — 8 problem types, each with diagnosis/rootCause/fixStrategy/priorityActions/urgency/confidence/nextMove, text incorporates all 5 config dimensions |
| Live Blueprint Generator | `getBlueprint(cfg)` — offer/audience/pricing/channel/roadmap/nextActions mapped by businessType + market + stage |
| Action Stack Builder | `ActionItem[]` state — add/remove actions, click to cycle todo→doing→done, color-coded status |
| Run/CRM Simulation | Lead table + pipeline metrics that update based on market + stage; service request stack |
| Marketplace Matching | `getMatchedPacks(problem)` — match scores 95/82/71 for matching packs, 40–60 for others, sorted by relevance |
| Service Details Modal | Full deliverables list, timeline, expected outcome, "Request This Service" CTA |
| AI Mesh Panel | 9 provider chips (Groq/OpenAI/Anthropic/etc.) — click to see capabilities, honest connection status |
| Command Palette | `/` or `Ctrl+K` shortcut — 7 searchable commands — keyboard-navigable |
| Mobile Experience | Bottom nav (5 tabs), collapsible configurator accordion |

### Architecture Change

Config-driven pattern: one `BusinessConfig` state object propagates through all dynamic content generators as pure functions — no backend calls needed.

```typescript
interface BusinessConfig {
  businessType: string; market: string; stage: string; problem: string; budget: string
}
// All panels re-render when any config value changes
const diagnosis = getDiagnosis(cfg)
const blueprint = getBlueprint(cfg)
const packs = getMatchedPacks(cfg.problem)
```

### Build Results — v3

| Check | Result |
|-------|--------|
| TypeScript (`tsc --noEmit`) | ✅ Zero errors |
| Vite build | ✅ 10.31s |
| CommandPage chunk | 53.20 kB (gzip: 14.38 kB) |

### Remaining Design Upgrades (non-blocking)

1. Connect "Generate Blueprint" / "Run Scan" to live `/api/fixer/diagnose` for real AI output
2. Persist action stack to backend (currently in-memory React state)
3. Drag-to-reorder on action stack items
4. Keyboard navigation within command palette (↑↓ arrows)
5. Dark/light mode toggle (currently dark only)
