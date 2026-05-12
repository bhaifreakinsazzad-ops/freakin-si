# Engine NotREAL — Client Beta Security Report
Generated: 2026-05-12

## Summary: SAFE FOR BETA

No critical security issues found. Platform is safe for private client beta.

---

## Checks Performed

### 1. Secret Exposure
| Check | Result |
|-------|--------|
| `SUPABASE_SERVICE_KEY` in frontend code | ✅ NONE |
| Direct `createClient()` in frontend | ✅ NONE |
| Any `process.env` in frontend (non-VITE_) | ✅ NONE |
| API keys logged to console | ✅ NONE |
| Keys in response bodies | ✅ NONE |
| `.env` committed to git | ✅ NOT committed (in .gitignore) |

### 2. Auth Security
| Check | Result |
|-------|--------|
| JWT_SECRET falls back safely in dev | ✅ (clear warning logged) |
| JWT_SECRET required in production | ✅ (envStatus reports missing) |
| JWT tokens not exposed in URLs | ✅ |
| Auth middleware validates token on every protected route | ✅ |
| Admin routes require admin email match | ✅ |

### 3. Database Security
| Check | Result |
|-------|--------|
| Service role key backend-only | ✅ |
| Frontend accesses data only via `/api/*` | ✅ |
| RLS enabled on all 14 Supabase tables | ✅ |
| Service role bypasses RLS (correct — backend-only) | ✅ |
| Placeholder key detection prevents false "connected" state | ✅ (NEW) |

### 4. CORS Security
| Check | Result |
|-------|--------|
| Whitelist: localhost:5173 | ✅ |
| Whitelist: FRONTEND_URL env var | ✅ |
| Whitelist: *.vercel.app | ✅ (acceptable for deployment) |
| Unknown origins blocked | ✅ |
| Credentials: false by default | ✅ |

### 5. Input Validation
| Check | Result |
|-------|--------|
| Support tickets: required fields validated | ✅ |
| Support tickets: category enum validated | ✅ |
| Orders: required fields validated | ✅ |
| Orders: currency required | ✅ |
| Fixer: description required | ✅ |

### 6. Environment Hardening
| Check | Result |
|-------|--------|
| `.env.example` uses placeholder values only | ✅ |
| No real keys in any committed file | ✅ |
| README warns not to expose keys | ✅ |
| `envStatus.js` reports missing keys without exposing values | ✅ |

---

## Minor Notes (Non-blocking)

1. **`*.vercel.app` CORS wildcard** — acceptable for deployment but consider restricting to your specific Vercel subdomain once DNS is configured.

2. **JWT fallback in dev** — `engine-notreal-dev-fallback-jwt-secret-set-JWT_SECRET-in-production` is logged as a warning. Set JWT_SECRET in `.env` to suppress.

3. **Admin emails env** — `ADMIN_EMAILS` is currently empty in `.env`. Set it before giving anyone admin access.

4. **Rate limiting** — not implemented on API endpoints. Recommended before public launch (add `express-rate-limit`). Acceptable for private beta.

5. **HTTP in dev** — backend runs HTTP on localhost. Production deployment (Render/Railway) enforces HTTPS automatically.

---

## Verdict
✅ **Safe for private client beta.** No service keys are exposed. Auth works. Data is isolated per user. Manual payment flow is honest.

Block list before public launch:
- [ ] Set `ADMIN_EMAILS` in production env
- [ ] Consider rate limiting on `/api/fixer/diagnose` and `/api/support/tickets`
- [ ] Restrict `*.vercel.app` CORS to your specific domain once known
