-- 003_sheep_portal_structures.sql
-- THE SHEEP portal operating-system tables
-- RLS-ready note: apply owner policies by user_id and admin policies by role claim.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Compatibility with earlier core migrations and the current Express auth code.
ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_reset_at DATE NOT NULL DEFAULT CURRENT_DATE;
UPDATE users SET password = password_hash WHERE password IS NULL AND password_hash IS NOT NULL;

ALTER TABLE marketplace_listings ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE marketplace_listings ADD COLUMN IF NOT EXISTS price_label TEXT;
ALTER TABLE marketplace_listings ADD COLUMN IF NOT EXISTS seller_id UUID REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE marketplace_listings ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE marketplace_listings ADD COLUMN IF NOT EXISTS listing_price NUMERIC(12,2);
ALTER TABLE marketplace_listings ADD COLUMN IF NOT EXISTS monthly_revenue TEXT DEFAULT '';
ALTER TABLE marketplace_listings ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE marketplace_listings ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;
ALTER TABLE marketplace_listings ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

CREATE TABLE IF NOT EXISTS business_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  idea TEXT DEFAULT '',
  audience TEXT DEFAULT '',
  location TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','in_review','approved','launched','archived')),
  current_step SMALLINT NOT NULL DEFAULT 1 CHECK (current_step BETWEEN 1 AND 7),
  progress SMALLINT NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  readiness_score SMALLINT NOT NULL DEFAULT 0 CHECK (readiness_score BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS onboarding_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES business_projects(id) ON DELETE CASCADE,
  step SMALLINT NOT NULL CHECK (step BETWEEN 1 AND 7),
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (project_id, step)
);

CREATE TABLE IF NOT EXISTS step_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES business_projects(id) ON DELETE CASCADE,
  step_key TEXT NOT NULL CHECK (step_key IN ('idea','brand','case','preview','setup','funding','launch')),
  progress SMALLINT NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started','in_progress','review','approved')),
  review_state TEXT NOT NULL DEFAULT 'none' CHECK (review_state IN ('none','submitted','changes_requested','approved')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (project_id, step_key)
);

CREATE TABLE IF NOT EXISTS generated_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES business_projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('brand','business_case','website','setup','funding','launch','document','general')),
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','in_review','approved','archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_modules (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'ready' CHECK (status IN ('ready','beta','deprecated')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_module_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id TEXT NOT NULL REFERENCES ai_modules(id) ON DELETE RESTRICT,
  project_id UUID NOT NULL REFERENCES business_projects(id) ON DELETE CASCADE,
  input JSONB NOT NULL DEFAULT '{}'::jsonb,
  output JSONB NOT NULL DEFAULT '{}'::jsonb,
  source TEXT NOT NULL DEFAULT 'live' CHECK (source IN ('mock','live')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS review_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES business_projects(id) ON DELETE CASCADE,
  asset_id UUID REFERENCES generated_assets(id) ON DELETE SET NULL,
  step_key TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  admin_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS support_threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES business_projects(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved')),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS support_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID NOT NULL REFERENCES support_threads(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
  sender_role TEXT NOT NULL DEFAULT 'client' CHECK (sender_role IN ('client','admin','super_admin','system')),
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS marketplace_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  price_label TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','paused','archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS marketplace_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES marketplace_listings(id) ON DELETE SET NULL,
  project_id UUID NOT NULL REFERENCES business_projects(id) ON DELETE CASCADE,
  requester_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN ('requested','approved','in_progress','completed','cancelled')),
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES business_projects(id) ON DELETE CASCADE,
  asset_id UUID REFERENCES generated_assets(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  document_type TEXT NOT NULL DEFAULT 'general',
  uri TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','ready','approved','archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES business_projects(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  actor_role TEXT NOT NULL DEFAULT 'client' CHECK (actor_role IN ('client','admin','super_admin','system')),
  action_type TEXT NOT NULL,
  title TEXT NOT NULL,
  detail TEXT DEFAULT '',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES business_projects(id) ON DELETE CASCADE,
  review_ticket_id UUID REFERENCES review_tickets(id) ON DELETE SET NULL,
  admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
  note TEXT NOT NULL,
  visibility TEXT NOT NULL DEFAULT 'internal' CHECK (visibility IN ('internal','client_visible')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pricing_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  monthly_price_cents INTEGER,
  annual_price_cents INTEGER,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','archived')),
  position SMALLINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES business_projects(id) ON DELETE SET NULL,
  pricing_plan_id UUID REFERENCES pricing_plans(id) ON DELETE SET NULL,
  provider TEXT NOT NULL DEFAULT 'placeholder' CHECK (provider IN ('placeholder','stripe')),
  provider_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','past_due','cancelled')),
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_business_projects_user_id ON business_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_business_projects_status ON business_projects(status);
CREATE INDEX IF NOT EXISTS idx_step_progress_project_id ON step_progress(project_id);
CREATE INDEX IF NOT EXISTS idx_generated_assets_project_id ON generated_assets(project_id);
CREATE INDEX IF NOT EXISTS idx_ai_module_runs_project_id_created_at ON ai_module_runs(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_review_tickets_project_id_status ON review_tickets(project_id, status);
CREATE INDEX IF NOT EXISTS idx_support_threads_project_id_status ON support_threads(project_id, status);
CREATE INDEX IF NOT EXISTS idx_support_messages_thread_id_created_at ON support_messages(thread_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_project_id_status ON marketplace_orders(project_id, status);
CREATE INDEX IF NOT EXISTS idx_documents_project_id_status ON documents(project_id, status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_read ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_activity_logs_project_id_created_at ON activity_logs(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_notes_project_id_created_at ON admin_notes(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id_status ON subscriptions(user_id, status);

-- Production seed data for client preview and first durable launch.
-- These IDs are valid UUIDs so Supabase/Postgres can use the same demo scenario
-- while the Vercel preview API keeps its lightweight proj-1 fallback.
INSERT INTO users (
  id, email, password, password_hash, name, phone, subscription, daily_usage, daily_limit,
  image_daily_usage, image_daily_limit, is_admin, trial_ends_at, last_reset_at,
  created_at, updated_at
) VALUES (
  '11111111-1111-4111-8111-111111111111',
  'demo@blacksheep.ai',
  '$2a$12$Bv8tUtqcX0nTPOhBFDsvcuaH3THRGOsGxp.bPyX3NFA4rfINnhXYa',
  '$2a$12$Bv8tUtqcX0nTPOhBFDsvcuaH3THRGOsGxp.bPyX3NFA4rfINnhXYa',
  'Demo User',
  '+1',
  'premium',
  0,
  999,
  0,
  999,
  TRUE,
  '2027-01-01T00:00:00.000Z',
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  password = COALESCE(users.password, EXCLUDED.password),
  password_hash = COALESCE(users.password_hash, EXCLUDED.password_hash),
  subscription = EXCLUDED.subscription,
  is_admin = TRUE,
  updated_at = NOW();

INSERT INTO business_projects (
  id, user_id, name, idea, audience, location, status, current_step, progress, readiness_score
) VALUES (
  '22222222-2222-4222-8222-222222222222',
  '11111111-1111-4111-8111-111111111111',
  'Black Sheep Founder Project',
  'Guided AI-powered business launch operating system',
  'First-time and growth-stage founders',
  'United States',
  'in_review',
  3,
  42,
  61
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  idea = EXCLUDED.idea,
  audience = EXCLUDED.audience,
  location = EXCLUDED.location,
  status = EXCLUDED.status,
  current_step = EXCLUDED.current_step,
  progress = EXCLUDED.progress,
  readiness_score = EXCLUDED.readiness_score,
  updated_at = NOW();

INSERT INTO step_progress (project_id, step_key, progress, status, review_state)
VALUES
  ('22222222-2222-4222-8222-222222222222', 'idea', 100, 'approved', 'approved'),
  ('22222222-2222-4222-8222-222222222222', 'brand', 78, 'review', 'submitted'),
  ('22222222-2222-4222-8222-222222222222', 'case', 46, 'in_progress', 'none'),
  ('22222222-2222-4222-8222-222222222222', 'preview', 12, 'in_progress', 'none'),
  ('22222222-2222-4222-8222-222222222222', 'setup', 0, 'not_started', 'none'),
  ('22222222-2222-4222-8222-222222222222', 'funding', 0, 'not_started', 'none'),
  ('22222222-2222-4222-8222-222222222222', 'launch', 0, 'not_started', 'none')
ON CONFLICT (project_id, step_key) DO UPDATE SET
  progress = EXCLUDED.progress,
  status = EXCLUDED.status,
  review_state = EXCLUDED.review_state,
  updated_at = NOW();

INSERT INTO ai_modules (id, name, category, description, status)
VALUES
  ('1','Idea Refiner','Business Creation','Idea Refiner for THE SHEEP operating system workflows.','beta'),
  ('2','Niche Finder','Business Creation','Niche Finder for THE SHEEP operating system workflows.','ready'),
  ('3','Audience Builder','Business Creation','Audience Builder for THE SHEEP operating system workflows.','ready'),
  ('4','Problem/Solution Mapper','Business Creation','Problem/Solution Mapper for THE SHEEP operating system workflows.','ready'),
  ('5','Offer Generator','Business Creation','Offer Generator for THE SHEEP operating system workflows.','ready'),
  ('6','Business Model Builder','Business Creation','Business Model Builder for THE SHEEP operating system workflows.','ready'),
  ('7','Startup Roadmap Builder','Business Creation','Startup Roadmap Builder for THE SHEEP operating system workflows.','ready'),
  ('8','Name Generator','Brand','Name Generator for THE SHEEP operating system workflows.','ready'),
  ('9','Tagline Generator','Brand','Tagline Generator for THE SHEEP operating system workflows.','beta'),
  ('10','Brand Voice Builder','Brand','Brand Voice Builder for THE SHEEP operating system workflows.','ready'),
  ('11','Logo Concept Generator','Brand','Logo Concept Generator for THE SHEEP operating system workflows.','ready'),
  ('12','Color Palette Builder','Brand','Color Palette Builder for THE SHEEP operating system workflows.','ready'),
  ('13','Social Bio Generator','Brand','Social Bio Generator for THE SHEEP operating system workflows.','ready'),
  ('14','Brand Story Builder','Brand','Brand Story Builder for THE SHEEP operating system workflows.','ready'),
  ('15','Business Case Generator','Strategy','Business Case Generator for THE SHEEP operating system workflows.','ready'),
  ('16','SWOT Analyzer','Strategy','SWOT Analyzer for THE SHEEP operating system workflows.','ready'),
  ('17','Competitor Mapper','Strategy','Competitor Mapper for THE SHEEP operating system workflows.','beta'),
  ('18','Pricing Strategy Builder','Strategy','Pricing Strategy Builder for THE SHEEP operating system workflows.','ready'),
  ('19','Revenue Stream Builder','Strategy','Revenue Stream Builder for THE SHEEP operating system workflows.','ready'),
  ('20','Risk Analyzer','Strategy','Risk Analyzer for THE SHEEP operating system workflows.','ready'),
  ('21','Growth Roadmap Builder','Strategy','Growth Roadmap Builder for THE SHEEP operating system workflows.','ready'),
  ('22','Landing Page Copy Builder','Website & Content','Landing Page Copy Builder for THE SHEEP operating system workflows.','ready'),
  ('23','Website Section Generator','Website & Content','Website Section Generator for THE SHEEP operating system workflows.','ready'),
  ('24','Service Page Builder','Website & Content','Service Page Builder for THE SHEEP operating system workflows.','ready'),
  ('25','FAQ Generator','Website & Content','FAQ Generator for THE SHEEP operating system workflows.','beta'),
  ('26','Contact Form Builder','Website & Content','Contact Form Builder for THE SHEEP operating system workflows.','ready'),
  ('27','Blog Idea Generator','Website & Content','Blog Idea Generator for THE SHEEP operating system workflows.','ready'),
  ('28','7-Day Content Planner','Website & Content','7-Day Content Planner for THE SHEEP operating system workflows.','ready'),
  ('29','Ad Copy Generator','Website & Content','Ad Copy Generator for THE SHEEP operating system workflows.','ready'),
  ('30','Email Sequence Builder','Website & Content','Email Sequence Builder for THE SHEEP operating system workflows.','ready'),
  ('31','LLC Checklist Builder','Setup & Operations','LLC Checklist Builder for THE SHEEP operating system workflows.','ready'),
  ('32','EIN Checklist Builder','Setup & Operations','EIN Checklist Builder for THE SHEEP operating system workflows.','ready'),
  ('33','License/Permit Checklist Builder','Setup & Operations','License/Permit Checklist Builder for THE SHEEP operating system workflows.','beta'),
  ('34','Business Bank Setup Guide','Setup & Operations','Business Bank Setup Guide for THE SHEEP operating system workflows.','ready'),
  ('35','Bookkeeping Setup Checklist','Setup & Operations','Bookkeeping Setup Checklist for THE SHEEP operating system workflows.','ready'),
  ('36','Operations SOP Builder','Setup & Operations','Operations SOP Builder for THE SHEEP operating system workflows.','ready'),
  ('37','Task Planner','Setup & Operations','Task Planner for THE SHEEP operating system workflows.','ready'),
  ('38','Document Checklist Builder','Setup & Operations','Document Checklist Builder for THE SHEEP operating system workflows.','ready'),
  ('39','Funding Readiness Scorer','Funding','Funding Readiness Scorer for THE SHEEP operating system workflows.','ready'),
  ('40','Startup Cost Calculator','Funding','Startup Cost Calculator for THE SHEEP operating system workflows.','ready'),
  ('41','Use-of-Funds Builder','Funding','Use-of-Funds Builder for THE SHEEP operating system workflows.','beta'),
  ('42','Pitch Summary Generator','Funding','Pitch Summary Generator for THE SHEEP operating system workflows.','ready'),
  ('43','Lender Summary Builder','Funding','Lender Summary Builder for THE SHEEP operating system workflows.','ready'),
  ('44','Projection Table Builder','Funding','Projection Table Builder for THE SHEEP operating system workflows.','ready'),
  ('45','Funding Document Builder','Funding','Funding Document Builder for THE SHEEP operating system workflows.','ready'),
  ('46','Launch Checklist Builder','Launch & Management','Launch Checklist Builder for THE SHEEP operating system workflows.','ready'),
  ('47','Lead Tracker','Launch & Management','Lead Tracker for THE SHEEP operating system workflows.','ready'),
  ('48','CRM Note Assistant','Launch & Management','CRM Note Assistant for THE SHEEP operating system workflows.','ready'),
  ('49','Service Request Builder','Launch & Management','Service Request Builder for THE SHEEP operating system workflows.','beta'),
  ('50','Monthly Improvement Planner','Launch & Management','Monthly Improvement Planner for THE SHEEP operating system workflows.','ready'),
  ('51','KPI Dashboard Assistant','Launch & Management','KPI Dashboard Assistant for THE SHEEP operating system workflows.','ready'),
  ('52','Client Update Generator','Launch & Management','Client Update Generator for THE SHEEP operating system workflows.','ready')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  status = EXCLUDED.status,
  updated_at = NOW();

INSERT INTO generated_assets (id, project_id, title, asset_type, content, status)
VALUES
  ('33333333-3333-4333-8333-333333333331','22222222-2222-4222-8222-222222222222','Brand Kit v2','brand','{"text":"Brand voice, palette, logo direction"}'::jsonb,'approved'),
  ('33333333-3333-4333-8333-333333333332','22222222-2222-4222-8222-222222222222','Business Case Draft','business_case','{"text":"Roadmap + pricing strategy"}'::jsonb,'in_review'),
  ('33333333-3333-4333-8333-333333333333','22222222-2222-4222-8222-222222222222','Funding Snapshot','funding','{"text":"Readiness score and assumptions"}'::jsonb,'draft')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  status = EXCLUDED.status,
  updated_at = NOW();

INSERT INTO ai_module_runs (id, module_id, project_id, input, output, source)
VALUES
  ('44444444-4444-4444-8444-444444444441','1','22222222-2222-4222-8222-222222222222','{"text":"Generate idea strategy"}'::jsonb,'{"summary":"Idea strategy drafted."}'::jsonb,'live'),
  ('44444444-4444-4444-8444-444444444442','10','22222222-2222-4222-8222-222222222222','{"text":"Generate brand kit"}'::jsonb,'{"summary":"Brand kit drafted."}'::jsonb,'live'),
  ('44444444-4444-4444-8444-444444444443','15','22222222-2222-4222-8222-222222222222','{"text":"Generate business case"}'::jsonb,'{"summary":"Business case drafted."}'::jsonb,'live')
ON CONFLICT (id) DO NOTHING;

INSERT INTO review_tickets (id, project_id, asset_id, step_key, status)
VALUES (
  '55555555-5555-4555-8555-555555555555',
  '22222222-2222-4222-8222-222222222222',
  '33333333-3333-4333-8333-333333333332',
  'brand',
  'pending'
) ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  updated_at = NOW();

INSERT INTO support_threads (id, project_id, subject, priority, status, created_by)
VALUES (
  '66666666-6666-4666-8666-666666666666',
  '22222222-2222-4222-8222-222222222222',
  'Need help choosing setup state',
  'high',
  'in_progress',
  '11111111-1111-4111-8111-111111111111'
) ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  updated_at = NOW();

INSERT INTO support_messages (id, thread_id, sender_id, sender_role, body)
VALUES
  ('77777777-7777-4777-8777-777777777771','66666666-6666-4666-8666-666666666666','11111111-1111-4111-8111-111111111111','client','Which state is better for launch?'),
  ('77777777-7777-4777-8777-777777777772','66666666-6666-4666-8666-666666666666','11111111-1111-4111-8111-111111111111','admin','We added state comparison inside your setup step.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO marketplace_listings (id, seller_id, title, name, category, description, price_label, listing_price, monthly_revenue, tags, verified, status)
VALUES
  ('88888888-8888-4888-8888-888888888881','11111111-1111-4111-8111-111111111111','Done-For-You Launch Blueprint','Done-For-You Launch Blueprint','Services','CGWS team builds and launches complete funnel.','$1,999',1999,'','{done-for-you,launch}'::text[],TRUE,'active'),
  ('88888888-8888-4888-8888-888888888882','11111111-1111-4111-8111-111111111111','Funding Prep Intensive','Funding Prep Intensive','Services','Readiness audit plus lender pack support.','$599',599,'','{funding,readiness}'::text[],TRUE,'active'),
  ('88888888-8888-4888-8888-888888888883','11111111-1111-4111-8111-111111111111','Brand Sprint','Brand Sprint','Services','Name, positioning, and visual direction in 72h.','$399',399,'','{brand,sprint}'::text[],TRUE,'active'),
  ('88888888-8888-4888-8888-888888888884','11111111-1111-4111-8111-111111111111','Website Launch Pack','Website Launch Pack','Digital','Landing page, CTA, and analytics setup.','$799',799,'','{website,launch}'::text[],TRUE,'active')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  price_label = EXCLUDED.price_label,
  listing_price = EXCLUDED.listing_price,
  status = EXCLUDED.status,
  updated_at = NOW();

INSERT INTO notifications (id, user_id, title, body, read)
VALUES
  ('99999999-9999-4999-8999-999999999991','11111111-1111-4111-8111-111111111111','Review Submitted','Brand Builder assets submitted for admin review.',FALSE),
  ('99999999-9999-4999-8999-999999999992','11111111-1111-4111-8111-111111111111','Support Reply','Admin replied to your setup request.',FALSE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO activity_logs (id, project_id, actor_id, actor_role, action_type, title, detail, metadata)
VALUES
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1','22222222-2222-4222-8222-222222222222','11111111-1111-4111-8111-111111111111','client','review','Review submitted','Brand Builder sent for admin review.','{}'::jsonb),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2','22222222-2222-4222-8222-222222222222','11111111-1111-4111-8111-111111111111','client','module_run','Module run complete','Business Case Generator produced output.','{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO pricing_plans (id, plan_key, name, monthly_price_cents, annual_price_cents, features, status, position)
VALUES
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1','free','Free',0,0,'["Preview access"]'::jsonb,'active',1),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2','premium','Premium',19900,199000,'["Launch Road","AI modules","Support"]'::jsonb,'active',2)
ON CONFLICT (plan_key) DO UPDATE SET
  name = EXCLUDED.name,
  monthly_price_cents = EXCLUDED.monthly_price_cents,
  annual_price_cents = EXCLUDED.annual_price_cents,
  features = EXCLUDED.features,
  status = EXCLUDED.status,
  position = EXCLUDED.position,
  updated_at = NOW();

INSERT INTO subscriptions (id, user_id, project_id, pricing_plan_id, provider, status, started_at)
VALUES (
  'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
  '11111111-1111-4111-8111-111111111111',
  '22222222-2222-4222-8222-222222222222',
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2',
  'placeholder',
  'active',
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  updated_at = NOW();

-- Supabase RLS-ready policy notes:
-- 1. Enable RLS on portal tables before storing real client data.
-- 2. Client policies should restrict business_projects.user_id = auth.uid()
--    and child records through their parent project ownership.
-- 3. Admin/super_admin policies should use role claims or an admin_users table.
-- 4. Keep service-role backend access for trusted server routes only.
