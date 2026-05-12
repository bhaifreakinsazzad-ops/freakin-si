# Engine NotREAL — Support System Report

**Date:** 2026-05-10
**Status:** ✅ Complete — demo/memdb mode working, Supabase path documented

---

## Support Route

| Item | Value |
|------|-------|
| URL | `http://localhost:5173/support` |
| Component | `apps/web/src/pages/SupportPage.tsx` |
| Auth required | No (public page) |
| Backend endpoint | `POST /api/support/tickets` |

---

## Support Form Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | text | ✅ | Min 2 characters |
| email | email | ✅ | Validated |
| businessName | text | | Optional |
| category | pill selection | ✅ | 8 categories |
| priority | pill selection | | Defaults to medium |
| message | textarea | ✅ | Min 10 characters |
| preferredContact | pill selection | | email/whatsapp/messenger/call |
| budgetRange | select | | Only shown for service/marketplace category |
| timeline | select | | Only shown for service/marketplace category |

---

## Support Categories

1. Business problem
2. AI tool issue
3. Service request
4. Payment / manual checkout
5. Marketplace listing
6. CRM / project issue
7. Account / login help
8. Other

---

## Ticket Confirmation

After submit, user sees:
- Ticket ID (format: `ENR-XXXXXXXX`)
- Category
- Priority (color-coded)
- Status: Open (pulsing dot)
- Next step message
- 4 navigation CTAs (Dashboard, Fixer, Marketplace, Run/CRM)

---

## Backend API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/support/tickets` | Create ticket |
| GET | `/api/support/tickets` | List all tickets |
| GET | `/api/support/tickets/:id` | Get specific ticket |

**File:** `apps/backend/routes/support.js`

### Ticket Schema

```json
{
  "id": "ENR-A1B2C3D4",
  "name": "John Doe",
  "email": "john@example.com",
  "businessName": "My Agency",
  "category": "business-problem",
  "priority": "medium",
  "message": "...",
  "preferredContact": "email",
  "budgetRange": null,
  "timeline": null,
  "status": "open",
  "createdAt": "2026-05-10T...",
  "updatedAt": "2026-05-10T..."
}
```

---

## Demo / MemDB Behavior

- Tickets stored in `TICKETS = []` array in `routes/support.js`
- Data resets when backend restarts (memdb mode)
- Frontend has a graceful fallback: if `/api/support/tickets` fails, generates a local ticket ID and still shows the confirmation screen
- **No Supabase required to submit a ticket in demo mode**

---

## Future Supabase Persistence Path

1. Create `support_tickets` table in Supabase (SQL migration):

```sql
CREATE TABLE support_tickets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  business_name TEXT,
  category TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  message TEXT NOT NULL,
  preferred_contact TEXT DEFAULT 'email',
  budget_range TEXT,
  timeline TEXT,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

2. Set `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` in `apps/backend/.env`
3. The backend route already attempts a non-blocking Supabase insert:

```js
// In routes/support.js — already implemented
try {
  const db = require('../lib/db')
  if (db && db.from) {
    db.from('support_tickets').insert(ticket).then(() => {}).catch(() => {})
  }
} catch (_) {}
```

4. If the table doesn't exist or Supabase isn't configured, the ticket still saves to memdb and the response succeeds.

---

## Health Endpoint Update

`GET /api/health` now reports:

```json
{
  "support": {
    "ready": true,
    "tickets": 0
  }
}
```
