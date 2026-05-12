# Engine NotREAL — Payment Plan

## Current Status

Payment is handled via **manual bKash/Nagad confirmation** for Bangladesh users.

- Phone: `01778307704` (bKash/Nagad merchant)
- User submits plan selection → PaymentPage shows QR / number
- User sends payment manually → admin confirms
- No automated payment processing is wired yet

## What's in the Code

| File | Status |
|------|--------|
| `apps/web/src/pages/PricingPage.tsx` | ✅ 3 plans with honest CTAs. Starter → `/register`, Growth/Agency → `/payment` |
| `apps/web/src/pages/PaymentPage.tsx` | ✅ Honest bKash/Nagad manual flow. No fake Stripe button. |
| `apps/backend/routes/subscriptions.js` | Backend subscription routes exist but no Stripe integration |

## Pricing Plans

| Plan | Monthly | Annual (×10) |
|------|---------|--------------|
| Starter | Free | Free |
| Growth | $49 | $490 |
| Agency | $149 | $1,490 |

Annual pricing = 2 months free (10-month equivalent).

## Stripe: Not Yet Wired

Environment variables are prepared in `.env.example`:

```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

But no Stripe SDK calls exist in the codebase. Wiring Stripe is a future step.

## Recommended Next Steps for Payment

1. Create Stripe account and get API keys
2. Install `stripe` npm package in `apps/backend/`
3. Add `/api/subscriptions/create-checkout` endpoint
4. Add `/api/subscriptions/webhook` endpoint for Stripe webhooks
5. Update `PaymentPage.tsx` to call checkout endpoint for Growth/Agency
6. Keep bKash/Nagad flow for Bangladesh users (manual or Stripe-less path)

## For MVP Launch

The current manual bKash/Nagad flow is production-ready for Bangladesh-first launch. The pricing page is honest — it does not promise automated card processing.
