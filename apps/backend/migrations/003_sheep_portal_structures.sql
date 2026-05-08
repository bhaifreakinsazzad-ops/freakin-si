-- 003_sheep_portal_structures.sql
-- THE SHEEP portal operating-system tables
-- RLS-ready note: apply owner policies by user_id and admin policies by role claim.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
