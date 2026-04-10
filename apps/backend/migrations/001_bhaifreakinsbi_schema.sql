-- ============================================================
-- BhaiFreakin'sBI — Synthetic Business Intelligence
-- Production Database Migration v1.0
-- Run this ONCE in your Supabase SQL Editor
-- ============================================================

-- ── 1. businesses table (already exists — add new columns) ──────────────────
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS goal         TEXT,
  ADD COLUMN IF NOT EXISTS listing_price NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS monthly_revenue TEXT,
  ADD COLUMN IF NOT EXISTS is_listed    BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS listed_at    TIMESTAMPTZ;

-- ── 2. service_requests table ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS service_requests (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_type   TEXT NOT NULL CHECK (service_type IN ('ads','dev','design','copy','seo','social')),
  name           TEXT DEFAULT '',
  email          TEXT DEFAULT '',
  business_name  TEXT DEFAULT '',
  description    TEXT NOT NULL,
  budget         TEXT DEFAULT '',
  deadline       TEXT DEFAULT '',
  references_url TEXT DEFAULT '',
  status         TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending','in_progress','completed','cancelled')),
  admin_notes    TEXT DEFAULT '',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Row-level security
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users see own service requests"
  ON service_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users insert own service requests"
  ON service_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Admins see all service requests"
  ON service_requests FOR ALL
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
  );

-- Index for fast user lookups
CREATE INDEX IF NOT EXISTS idx_service_requests_user_id
  ON service_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_status
  ON service_requests(status);

-- ── 3. marketplace_listings table ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS marketplace_listings (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id      UUID REFERENCES businesses(id) ON DELETE SET NULL,
  seller_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name             TEXT NOT NULL,
  tagline          TEXT DEFAULT '',
  category         TEXT NOT NULL DEFAULT 'Digital'
                     CHECK (category IN ('Digital','E-commerce','Services','SaaS','Content','Other')),
  description      TEXT DEFAULT '',
  listing_price    NUMERIC(12,2) NOT NULL DEFAULT 0,
  monthly_revenue  TEXT DEFAULT '',
  tags             TEXT[] DEFAULT '{}',
  status           TEXT NOT NULL DEFAULT 'active'
                     CHECK (status IN ('active','sold','paused','removed')),
  verified         BOOLEAN DEFAULT false,
  views            INTEGER DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Row-level security
ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Public can view active listings"
  ON marketplace_listings FOR SELECT
  USING (status = 'active');

CREATE POLICY IF NOT EXISTS "Sellers manage own listings"
  ON marketplace_listings FOR ALL
  USING (auth.uid() = seller_id);

CREATE POLICY IF NOT EXISTS "Admins manage all listings"
  ON marketplace_listings FOR ALL
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_status
  ON marketplace_listings(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_category
  ON marketplace_listings(category);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_seller_id
  ON marketplace_listings(seller_id);

-- ── 4. Auto-update updated_at timestamps ────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS service_requests_updated_at ON service_requests;
CREATE TRIGGER service_requests_updated_at
  BEFORE UPDATE ON service_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS marketplace_listings_updated_at ON marketplace_listings;
CREATE TRIGGER marketplace_listings_updated_at
  BEFORE UPDATE ON marketplace_listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── 5. Seed: sample marketplace listings (optional demo data) ───────────────
-- Uncomment if you want demo listings visible from day one:
/*
INSERT INTO marketplace_listings (seller_id, name, tagline, category, listing_price, monthly_revenue, tags, verified)
VALUES
  (auth.uid(), 'SpiceBox BD', 'Curated Bangladeshi spice kits delivered monthly', 'E-commerce', 2500, '$800/mo', ARRAY['subscription','food','diaspora'], true),
  (auth.uid(), 'PixelCraft Studio', 'AI-powered design agency for South Asian brands', 'Services', 4999, '$2,100/mo', ARRAY['agency','design','AI'], true),
  (auth.uid(), 'LearnBD Pro', 'Bengali-language SaaS for K-12 tutoring', 'SaaS', 8500, '$3,400/mo', ARRAY['edtech','saas','bengali'], false)
ON CONFLICT DO NOTHING;
*/

-- ── Done ────────────────────────────────────────────────────────────────────
-- Run this migration, then verify with:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
