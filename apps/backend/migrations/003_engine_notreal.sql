-- ============================================================
-- ENGINE NOTREAL — Migration 003
-- New tables: businesses, fixer_diagnoses, marketplace_listings,
--             leads, projects, ai_generations, pricing_plans
-- Run in Supabase SQL Editor after 001 and 002
-- ============================================================

-- ── Businesses ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS businesses (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  tagline           TEXT,
  niche             TEXT,
  country           TEXT DEFAULT 'Global',
  audience          TEXT,
  budget            TEXT,
  stage             TEXT DEFAULT 'idea' CHECK (stage IN ('idea','mvp','launched','growing','scaling')),
  status            TEXT DEFAULT 'active' CHECK (status IN ('active','paused','archived')),
  blueprint         JSONB,
  created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_businesses_user ON businesses(user_id);

-- ── Fixer Diagnoses ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fixer_diagnoses (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID REFERENCES users(id) ON DELETE SET NULL,
  problem_type      TEXT NOT NULL,
  description       TEXT NOT NULL,
  tried             TEXT,
  goal              TEXT,
  budget            TEXT,
  country           TEXT,
  timeline          TEXT,
  biz_link          TEXT,
  result            JSONB,
  provider          TEXT,
  is_demo           BOOLEAN DEFAULT FALSE,
  created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_fixer_user ON fixer_diagnoses(user_id);
CREATE INDEX IF NOT EXISTS idx_fixer_created ON fixer_diagnoses(created_at DESC);

-- ── AI Generations ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ai_generations (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  type        TEXT NOT NULL CHECK (type IN ('blueprint','fixer','listing','roadmap','content','other')),
  input       JSONB,
  output      JSONB,
  model       TEXT,
  provider    TEXT,
  tokens_used INTEGER,
  is_demo     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ai_gen_user ON ai_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_gen_type ON ai_generations(type);

-- ── Marketplace Listings ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS marketplace_listings (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  title         TEXT NOT NULL,
  description   TEXT,
  category      TEXT NOT NULL CHECK (category IN ('business','service','digital','saas','content','tool','agency','other')),
  price         DECIMAL(10,2),
  price_type    TEXT DEFAULT 'one_time' CHECK (price_type IN ('one_time','monthly','annual','free','contact')),
  currency      TEXT DEFAULT 'USD',
  tags          TEXT[],
  badge         TEXT,
  status        TEXT DEFAULT 'active' CHECK (status IN ('active','paused','sold','draft')),
  featured      BOOLEAN DEFAULT FALSE,
  cta_label     TEXT DEFAULT 'Get This',
  cta_url       TEXT,
  image_url     TEXT,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_listings_status ON marketplace_listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_category ON marketplace_listings(category);

-- ── Leads (CRM) ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leads (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id      UUID REFERENCES users(id) ON DELETE SET NULL,
  name          TEXT NOT NULL,
  business_name TEXT,
  email         TEXT,
  phone         TEXT,
  country       TEXT,
  source        TEXT DEFAULT 'direct' CHECK (source IN ('direct','referral','marketplace','social','ads','organic','other')),
  status        TEXT DEFAULT 'new' CHECK (status IN ('new','active','pending','qualified','won','lost','paused')),
  estimated_value DECIMAL(10,2),
  currency      TEXT DEFAULT 'USD',
  notes         TEXT,
  next_action   TEXT,
  next_action_at TIMESTAMP WITH TIME ZONE,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_leads_owner ON leads(owner_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);

-- ── Projects (Run module) ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id      UUID REFERENCES users(id) ON DELETE SET NULL,
  lead_id       UUID REFERENCES leads(id) ON DELETE SET NULL,
  title         TEXT NOT NULL,
  service_type  TEXT,
  status        TEXT DEFAULT 'pending' CHECK (status IN ('pending','active','review','completed','paused','cancelled')),
  priority      TEXT DEFAULT 'medium' CHECK (priority IN ('high','medium','low')),
  progress      INTEGER DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  due_date      DATE,
  budget        DECIMAL(10,2),
  currency      TEXT DEFAULT 'USD',
  notes         TEXT,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_projects_owner ON projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

-- ── Service Requests ──────────────────────────────────────────────────────────
-- (enhancing existing service_requests if present, or creating fresh)
CREATE TABLE IF NOT EXISTS service_requests (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
  service_type    TEXT NOT NULL,
  business_name   TEXT,
  description     TEXT NOT NULL,
  budget          TEXT,
  deadline        TEXT,
  references_text TEXT,
  status          TEXT DEFAULT 'pending' CHECK (status IN ('pending','reviewing','accepted','in_progress','completed','cancelled')),
  admin_note      TEXT,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_svc_requests_user ON service_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_svc_requests_status ON service_requests(status);

-- ── Pricing Plans ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pricing_plans (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  description   TEXT,
  price_monthly DECIMAL(10,2),
  price_annual  DECIMAL(10,2),
  currency      TEXT DEFAULT 'USD',
  features      TEXT[],
  limits        JSONB,
  is_popular    BOOLEAN DEFAULT FALSE,
  is_active     BOOLEAN DEFAULT TRUE,
  sort_order    INTEGER DEFAULT 0,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ── Seed Data ─────────────────────────────────────────────────────────────────

-- Seed marketplace listings
INSERT INTO marketplace_listings (title, description, category, price, price_type, currency, tags, badge, status, featured, cta_label)
VALUES
  (
    'SocialBoost — Social Media Growth System',
    'Complete social media growth system with content calendar, engagement templates, and analytics tracking. Built for agencies and solo operators who want consistent organic growth without burning out.',
    'service', 299.00, 'one_time', 'USD',
    ARRAY['social', 'growth', 'automation', 'content'],
    'HOT', 'active', true, 'Get SocialBoost'
  ),
  (
    'LaunchKit Pro — 30-Day Business Launch Package',
    'Everything you need to launch a business in 30 days. Includes brand identity, landing page, ad copy, email sequence, and a custom 30-day roadmap generated by Engine NotREAL AI.',
    'service', 999.00, 'one_time', 'USD',
    ARRAY['launch', 'branding', 'marketing', 'startup'],
    'NEW', 'active', true, 'Start Launch'
  ),
  (
    'Agency Engine — White-Label AI Business Platform',
    'Run your own AI-powered business consulting practice using Engine NotREAL. White-label access, client portal, and custom branding included. Perfect for consultants and agencies.',
    'saas', 297.00, 'monthly', 'USD',
    ARRAY['agency', 'white-label', 'saas', 'consulting'],
    'PREMIUM', 'active', false, 'Explore Agency Plan'
  )
ON CONFLICT DO NOTHING;

-- Seed pricing plans
INSERT INTO pricing_plans (slug, name, description, price_monthly, price_annual, currency, features, limits, is_popular, sort_order)
VALUES
  (
    'starter',
    'Starter',
    'Perfect for solo founders getting started',
    0, 0, 'USD',
    ARRAY[
      '5 AI business blueprints/month',
      '3 Fixer diagnoses/month',
      'Basic CRM (10 leads)',
      'Marketplace access',
      'AI Chat (50 messages/day)',
      'Community access'
    ],
    '{"blueprints": 5, "fixer": 3, "leads": 10, "chat": 50}'::jsonb,
    false, 1
  ),
  (
    'pro',
    'Pro',
    'For serious operators building momentum',
    49, 470, 'USD',
    ARRAY[
      'Unlimited AI blueprints',
      'Unlimited Fixer diagnoses',
      'Full CRM (unlimited leads)',
      'Priority marketplace listing',
      'AI Chat (500 messages/day)',
      'All AI tools',
      'Export all reports',
      'Email support'
    ],
    '{"blueprints": -1, "fixer": -1, "leads": -1, "chat": 500}'::jsonb,
    true, 2
  ),
  (
    'agency',
    'Agency',
    'For agencies and high-volume operators',
    149, 1430, 'USD',
    ARRAY[
      'Everything in Pro',
      'White-label branding',
      'Client sub-accounts (10)',
      'API access',
      'Custom AI prompts',
      'Dedicated support',
      'Onboarding call'
    ],
    '{"blueprints": -1, "fixer": -1, "leads": -1, "chat": -1, "clients": 10}'::jsonb,
    false, 3
  )
ON CONFLICT (slug) DO NOTHING;
