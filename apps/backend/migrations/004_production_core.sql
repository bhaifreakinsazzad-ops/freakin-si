-- Engine NotREAL — Migration 004: Production Core
-- Adds: support_tickets, orders
-- Safe to run on top of 001 + 002 + 003.
-- Run this once against your Supabase project.

-- ============================================================
-- SUPPORT TICKETS
-- ============================================================

CREATE TABLE IF NOT EXISTS support_tickets (
  id              TEXT PRIMARY KEY,               -- ENR-XXXXXXXX
  name            TEXT NOT NULL,
  email           TEXT NOT NULL,
  business_name   TEXT,
  category        TEXT NOT NULL,
  priority        TEXT NOT NULL DEFAULT 'medium', -- low | medium | high | urgent
  message         TEXT NOT NULL,
  preferred_contact TEXT DEFAULT 'email',
  budget_range    TEXT,
  timeline        TEXT,
  status          TEXT NOT NULL DEFAULT 'open',   -- open | in-progress | resolved | closed
  assigned_to     TEXT,
  admin_notes     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS support_tickets_email_idx    ON support_tickets (email);
CREATE INDEX IF NOT EXISTS support_tickets_status_idx   ON support_tickets (status);
CREATE INDEX IF NOT EXISTS support_tickets_category_idx ON support_tickets (category);

-- Enable Row Level Security
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS (backend only)
-- Authenticated users can see their own tickets
CREATE POLICY IF NOT EXISTS "Users can view own support tickets"
  ON support_tickets FOR SELECT
  USING (email = auth.jwt() ->> 'email');

-- Anyone can create a ticket (including unauthenticated — for contact forms)
CREATE POLICY IF NOT EXISTS "Anyone can create support ticket"
  ON support_tickets FOR INSERT
  WITH CHECK (true);

-- ============================================================
-- ORDERS
-- ============================================================

CREATE TABLE IF NOT EXISTS orders (
  id                TEXT PRIMARY KEY,             -- ORD-XXXXXXXXXX
  plan_id           TEXT,
  service_id        TEXT,
  description       TEXT,
  customer_name     TEXT NOT NULL,
  customer_email    TEXT NOT NULL,
  customer_phone    TEXT,
  business_name     TEXT,
  amount            NUMERIC(12, 2) NOT NULL,
  currency          TEXT NOT NULL DEFAULT 'BDT',
  payment_method    TEXT DEFAULT 'manual',         -- bkash | nagad | rocket | bank_transfer | stripe | manual
  payment_reference TEXT,                          -- bKash TxnID, Nagad ref, etc.
  stripe_session_id TEXT,
  notes             TEXT,
  status            TEXT NOT NULL DEFAULT 'pending', -- pending | payment_submitted | confirmed | processing | completed | cancelled | refunded
  processed_by      TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS orders_customer_email_idx ON orders (customer_email);
CREATE INDEX IF NOT EXISTS orders_status_idx         ON orders (status);
CREATE INDEX IF NOT EXISTS orders_created_at_idx     ON orders (created_at DESC);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view own orders"
  ON orders FOR SELECT
  USING (customer_email = auth.jwt() ->> 'email');

CREATE POLICY IF NOT EXISTS "Anyone can create order"
  ON orders FOR INSERT
  WITH CHECK (true);

-- ============================================================
-- UPDATED_AT TRIGGERS (if trigger function exists from 003)
-- ============================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
    DROP TRIGGER IF EXISTS update_support_tickets_updated_at ON support_tickets;
    CREATE TRIGGER update_support_tickets_updated_at
      BEFORE UPDATE ON support_tickets
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
    CREATE TRIGGER update_orders_updated_at
      BEFORE UPDATE ON orders
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END
$$;
