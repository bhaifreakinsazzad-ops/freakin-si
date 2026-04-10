-- ============================================================
-- Freakin BI — Idempotent Database Setup v2.0
-- Safe to run multiple times — drops & recreates all policies
-- Run in Supabase SQL Editor
-- ============================================================

-- ── STEP 1: Core tables ─────────────────────────────────────────────────────

-- users (may already exist — just add missing columns safely)
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name          TEXT NOT NULL DEFAULT '',
  phone         TEXT DEFAULT '',
  subscription  TEXT NOT NULL DEFAULT 'free'
                  CHECK (subscription IN ('free','pro','premium')),
  subscription_ends_at  TIMESTAMPTZ,
  trial_ends_at         TIMESTAMPTZ DEFAULT (now() + INTERVAL '7 days'),
  daily_usage           INTEGER NOT NULL DEFAULT 0,
  daily_limit           INTEGER NOT NULL DEFAULT 20,
  image_daily_usage     INTEGER NOT NULL DEFAULT 0,
  image_daily_limit     INTEGER NOT NULL DEFAULT 5,
  last_reset_at         DATE NOT NULL DEFAULT CURRENT_DATE,
  is_admin              BOOLEAN NOT NULL DEFAULT false,
  credits               INTEGER NOT NULL DEFAULT 100,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS phone         TEXT DEFAULT '';
ALTER TABLE users ADD COLUMN IF NOT EXISTS credits       INTEGER NOT NULL DEFAULT 100;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin      BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '7 days');
ALTER TABLE users ADD COLUMN IF NOT EXISTS image_daily_usage  INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS image_daily_limit  INTEGER NOT NULL DEFAULT 5;
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_ends_at TIMESTAMPTZ;

-- conversations
CREATE TABLE IF NOT EXISTS conversations (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      TEXT NOT NULL DEFAULT 'New Chat',
  model      TEXT NOT NULL DEFAULT 'llama-3.1-8b-instant',
  chat_mode  TEXT NOT NULL DEFAULT 'chat',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS chat_mode TEXT NOT NULL DEFAULT 'chat';

-- messages
CREATE TABLE IF NOT EXISTS messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role            TEXT NOT NULL CHECK (role IN ('user','assistant','system')),
  content         TEXT NOT NULL,
  model           TEXT,
  tokens_used     INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- payment_requests
CREATE TABLE IF NOT EXISTS payment_requests (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_name      TEXT NOT NULL,
  amount         NUMERIC(10,2) NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'bkash',
  transaction_id TEXT NOT NULL,
  phone          TEXT NOT NULL DEFAULT '',
  status         TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending','approved','rejected')),
  admin_notes    TEXT DEFAULT '',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- businesses
CREATE TABLE IF NOT EXISTS businesses (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name              TEXT NOT NULL DEFAULT '',
  tagline           TEXT DEFAULT '',
  niche             TEXT DEFAULT '',
  target_audience   TEXT DEFAULT '',
  budget            TEXT DEFAULT '',
  goal              TEXT DEFAULT '',
  business_model    JSONB DEFAULT '{}',
  brand_identity    JSONB DEFAULT '{}',
  offer_structure   JSONB DEFAULT '{}',
  landing_page      JSONB DEFAULT '{}',
  ad_creatives      JSONB DEFAULT '{}',
  monetization_plan JSONB DEFAULT '{}',
  market_analysis   JSONB DEFAULT '{}',
  next_steps        JSONB DEFAULT '[]',
  status            TEXT DEFAULT 'draft',
  listing_price     NUMERIC(12,2),
  monthly_revenue   TEXT DEFAULT '',
  is_listed         BOOLEAN DEFAULT false,
  listed_at         TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE businesses ADD COLUMN IF NOT EXISTS goal            TEXT DEFAULT '';
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS listing_price   NUMERIC(12,2);
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS monthly_revenue TEXT DEFAULT '';
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS is_listed       BOOLEAN DEFAULT false;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS listed_at       TIMESTAMPTZ;

-- service_requests
CREATE TABLE IF NOT EXISTS service_requests (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service_type   TEXT NOT NULL CHECK (service_type IN ('ads','dev','design','copy','seo','social')),
  name           TEXT DEFAULT '',
  email          TEXT DEFAULT '',
  business_name  TEXT DEFAULT '',
  description    TEXT NOT NULL DEFAULT '',
  budget         TEXT DEFAULT '',
  deadline       TEXT DEFAULT '',
  references_url TEXT DEFAULT '',
  status         TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending','in_progress','completed','cancelled')),
  admin_notes    TEXT DEFAULT '',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- marketplace_listings
CREATE TABLE IF NOT EXISTS marketplace_listings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id     UUID REFERENCES businesses(id) ON DELETE SET NULL,
  seller_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name            TEXT NOT NULL DEFAULT '',
  tagline         TEXT DEFAULT '',
  category        TEXT NOT NULL DEFAULT 'Digital'
                    CHECK (category IN ('Digital','E-commerce','Services','SaaS','Content','Other')),
  description     TEXT DEFAULT '',
  listing_price   NUMERIC(12,2) NOT NULL DEFAULT 0,
  monthly_revenue TEXT DEFAULT '',
  tags            TEXT[] DEFAULT '{}',
  status          TEXT NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active','sold','paused','removed')),
  verified        BOOLEAN DEFAULT false,
  views           INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── STEP 2: Enable RLS on all tables ────────────────────────────────────────

ALTER TABLE users               ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations       ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages            ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_requests    ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses          ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests    ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;

-- ── STEP 3: DROP all policies (idempotent — safe to re-run) ─────────────────

-- users policies
DROP POLICY IF EXISTS "Users read own"            ON users;
DROP POLICY IF EXISTS "Users update own"          ON users;
DROP POLICY IF EXISTS "Allow registration"        ON users;
DROP POLICY IF EXISTS "Admins read all users"     ON users;

-- conversations policies
DROP POLICY IF EXISTS "Users own conversations"   ON conversations;

-- messages policies
DROP POLICY IF EXISTS "Users own messages"        ON messages;

-- payment_requests policies
DROP POLICY IF EXISTS "Users own payments"        ON payment_requests;
DROP POLICY IF EXISTS "Admins manage payments"    ON payment_requests;

-- businesses policies
DROP POLICY IF EXISTS "Users own businesses"      ON businesses;

-- service_requests policies
DROP POLICY IF EXISTS "Users see own service requests"    ON service_requests;
DROP POLICY IF EXISTS "Users insert own service requests" ON service_requests;
DROP POLICY IF EXISTS "Admins see all service requests"   ON service_requests;

-- marketplace_listings policies
DROP POLICY IF EXISTS "Public can view active listings"   ON marketplace_listings;
DROP POLICY IF EXISTS "Sellers manage own listings"       ON marketplace_listings;
DROP POLICY IF EXISTS "Admins manage all listings"        ON marketplace_listings;

-- ── STEP 4: RECREATE all policies ───────────────────────────────────────────

-- NOTE: Our backend uses custom JWT auth (not Supabase auth.users).
-- auth.uid() will be NULL for API calls. We use permissive policies
-- so the Express backend (service role key) can manage data freely.
-- RLS is kept enabled for future Supabase auth integration.

-- users: backend service role can do everything; users can read own
CREATE POLICY "Users read own"
  ON users FOR SELECT
  USING (true);  -- Backend filters by user ID in queries

CREATE POLICY "Users update own"
  ON users FOR UPDATE
  USING (true);

CREATE POLICY "Allow registration"
  ON users FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins read all users"
  ON users FOR ALL
  USING (true);

-- conversations
CREATE POLICY "Users own conversations"
  ON conversations FOR ALL
  USING (true);

-- messages
CREATE POLICY "Users own messages"
  ON messages FOR ALL
  USING (true);

-- payment_requests
CREATE POLICY "Users own payments"
  ON payment_requests FOR ALL
  USING (true);

CREATE POLICY "Admins manage payments"
  ON payment_requests FOR ALL
  USING (true);

-- businesses
CREATE POLICY "Users own businesses"
  ON businesses FOR ALL
  USING (true);

-- service_requests
CREATE POLICY "Users see own service requests"
  ON service_requests FOR SELECT
  USING (true);

CREATE POLICY "Users insert own service requests"
  ON service_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins see all service requests"
  ON service_requests FOR ALL
  USING (true);

-- marketplace_listings
CREATE POLICY "Public can view active listings"
  ON marketplace_listings FOR SELECT
  USING (status = 'active');

CREATE POLICY "Sellers manage own listings"
  ON marketplace_listings FOR ALL
  USING (true);

CREATE POLICY "Admins manage all listings"
  ON marketplace_listings FOR ALL
  USING (true);

-- ── STEP 5: Indexes ──────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_users_email
  ON users(email);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id
  ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id
  ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_payment_requests_user_id
  ON payment_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_requests_status
  ON payment_requests(status);
CREATE INDEX IF NOT EXISTS idx_businesses_user_id
  ON businesses(user_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_user_id
  ON service_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_status
  ON service_requests(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_status
  ON marketplace_listings(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_category
  ON marketplace_listings(category);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_seller_id
  ON marketplace_listings(seller_id);

-- ── STEP 6: Auto-update updated_at trigger ───────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_updated_at               ON users;
DROP TRIGGER IF EXISTS conversations_updated_at       ON conversations;
DROP TRIGGER IF EXISTS payment_requests_updated_at    ON payment_requests;
DROP TRIGGER IF EXISTS businesses_updated_at          ON businesses;
DROP TRIGGER IF EXISTS service_requests_updated_at    ON service_requests;
DROP TRIGGER IF EXISTS marketplace_listings_updated_at ON marketplace_listings;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER payment_requests_updated_at
  BEFORE UPDATE ON payment_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER businesses_updated_at
  BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER service_requests_updated_at
  BEFORE UPDATE ON service_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER marketplace_listings_updated_at
  BEFORE UPDATE ON marketplace_listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Done ─────────────────────────────────────────────────────────────────────
-- Verify with:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
-- SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename, policyname;
