/**
 * In-memory database that mirrors the Supabase client API exactly.
 * Drop-in replacement — zero route changes needed.
 * Data persists in-process; resets on server restart.
 */

const { v4: uuidv4 } = require('uuid');

// Pre-seed tables
const tables = {
  users: {},        // keyed by id
  conversations: {},
  messages: {},
  subscriptions: {},
  businesses: {},
  services: {},
  payments: {},
  business_projects: {},
  onboarding_answers: {},
  step_progress: {},
  generated_assets: {},
  ai_modules: {},
  ai_module_runs: {},
  review_tickets: {},
  support_threads: {},
  support_messages: {},
  marketplace_listings: {},
  marketplace_orders: {},
  documents: {},
  notifications: {},
  activity_logs: {},
  admin_notes: {},
  pricing_plans: {},
};

// Seed demo user (always available)
const DEMO_ID = 'demo-user-001';
tables.users[DEMO_ID] = {
  id: DEMO_ID,
  email: 'demo@blacksheep.ai',
  // bcrypt hash of "Demo@2025"
  password: '$2a$12$Bv8tUtqcX0nTPOhBFDsvcuaH3THRGOsGxp.bPyX3NFA4rfINnhXYa',
  name: 'Demo User',
  phone: '+1',
  subscription: 'premium',
  daily_usage: 0,
  daily_limit: 999,
  image_daily_usage: 0,
  image_daily_limit: 999,
  is_admin: true,
  trial_ends_at: '2027-01-01T00:00:00.000Z',
  last_reset_at: new Date().toISOString(),
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: new Date().toISOString(),
};

const nowIso = () => new Date().toISOString();

function seedTable(tableName, rows) {
  for (const row of rows) {
    tables[tableName][row.id] = { ...row };
  }
}

seedTable('business_projects', [
  {
    id: 'proj-1',
    user_id: DEMO_ID,
    name: 'Black Sheep Founder Project',
    idea: 'Guided AI-powered business launch operating system',
    audience: 'First-time and growth-stage founders',
    location: 'United States',
    status: 'in_review',
    current_step: 3,
    progress: 42,
    readiness_score: 61,
    created_at: nowIso(),
    updated_at: nowIso(),
  },
]);

seedTable('step_progress', [
  { id: 'step-1', project_id: 'proj-1', step_key: 'idea', progress: 100, status: 'approved', review_state: 'approved', updated_at: nowIso() },
  { id: 'step-2', project_id: 'proj-1', step_key: 'brand', progress: 78, status: 'review', review_state: 'submitted', updated_at: nowIso() },
  { id: 'step-3', project_id: 'proj-1', step_key: 'case', progress: 46, status: 'in_progress', review_state: 'none', updated_at: nowIso() },
  { id: 'step-4', project_id: 'proj-1', step_key: 'preview', progress: 12, status: 'in_progress', review_state: 'none', updated_at: nowIso() },
  { id: 'step-5', project_id: 'proj-1', step_key: 'setup', progress: 0, status: 'not_started', review_state: 'none', updated_at: nowIso() },
  { id: 'step-6', project_id: 'proj-1', step_key: 'funding', progress: 0, status: 'not_started', review_state: 'none', updated_at: nowIso() },
  { id: 'step-7', project_id: 'proj-1', step_key: 'launch', progress: 0, status: 'not_started', review_state: 'none', updated_at: nowIso() },
]);

seedTable('generated_assets', [
  { id: 'a1', project_id: 'proj-1', title: 'Brand Kit v2', asset_type: 'brand', content: { text: 'Brand voice, palette, logo direction' }, status: 'approved', created_at: nowIso(), updated_at: nowIso() },
  { id: 'a2', project_id: 'proj-1', title: 'Business Case Draft', asset_type: 'business_case', content: { text: 'Roadmap + pricing strategy' }, status: 'in_review', created_at: nowIso(), updated_at: nowIso() },
  { id: 'a3', project_id: 'proj-1', title: 'Funding Snapshot', asset_type: 'funding', content: { text: 'Readiness score and assumptions' }, status: 'draft', created_at: nowIso(), updated_at: nowIso() },
]);

seedTable('ai_module_runs', [
  { id: 'run-1', module_id: '1', project_id: 'proj-1', input: { text: 'Generate idea strategy' }, output: { summary: 'Idea strategy drafted.' }, created_at: nowIso() },
  { id: 'run-10', module_id: '10', project_id: 'proj-1', input: { text: 'Generate brand kit' }, output: { summary: 'Brand kit drafted.' }, created_at: nowIso() },
  { id: 'run-15', module_id: '15', project_id: 'proj-1', input: { text: 'Generate business case' }, output: { summary: 'Business case drafted.' }, created_at: nowIso() },
]);

seedTable('review_tickets', [
  { id: 'r1', project_id: 'proj-1', asset_id: 'a2', step_key: 'brand', status: 'pending', admin_note: null, created_at: nowIso(), updated_at: nowIso() },
]);

seedTable('support_threads', [
  { id: 's1', project_id: 'proj-1', subject: 'Need help choosing setup state', priority: 'high', status: 'in_progress', created_by: DEMO_ID, created_at: nowIso(), updated_at: nowIso() },
]);

seedTable('support_messages', [
  { id: 'm1', thread_id: 's1', sender_id: DEMO_ID, sender_role: 'client', body: 'Which state is better for launch?', created_at: nowIso() },
  { id: 'm2', thread_id: 's1', sender_id: DEMO_ID, sender_role: 'admin', body: 'We added state comparison inside your setup step.', created_at: nowIso() },
]);

seedTable('notifications', [
  { id: 'n1', user_id: DEMO_ID, title: 'Review Submitted', body: 'Brand Builder assets submitted for admin review.', read: false, created_at: nowIso() },
  { id: 'n2', user_id: DEMO_ID, title: 'Support Reply', body: 'Admin replied to your setup request.', read: false, created_at: nowIso() },
]);

seedTable('activity_logs', [
  { id: 'ac1', project_id: 'proj-1', actor_id: DEMO_ID, actor_role: 'client', action_type: 'review', title: 'Review submitted', detail: 'Brand Builder sent for admin review.', metadata: {}, created_at: nowIso() },
  { id: 'ac2', project_id: 'proj-1', actor_id: DEMO_ID, actor_role: 'client', action_type: 'module_run', title: 'Module run complete', detail: 'Business Case Generator produced output.', metadata: {}, created_at: nowIso() },
  { id: 'ac3', project_id: 'proj-1', actor_id: DEMO_ID, actor_role: 'admin', action_type: 'support', title: 'Support response received', detail: 'Admin updated setup guidance.', metadata: {}, created_at: nowIso() },
]);

seedTable('pricing_plans', [
  { id: 'plan-free', plan_key: 'free', name: 'Free', monthly_price_cents: 0, annual_price_cents: 0, features: ['Preview access'], status: 'active', position: 1, created_at: nowIso(), updated_at: nowIso() },
  { id: 'plan-premium', plan_key: 'premium', name: 'Premium', monthly_price_cents: 19900, annual_price_cents: 199000, features: ['Launch Road', 'AI modules', 'Support'], status: 'active', position: 2, created_at: nowIso(), updated_at: nowIso() },
]);

seedTable('subscriptions', [
  { id: 'sub-1', user_id: DEMO_ID, project_id: 'proj-1', pricing_plan_id: 'plan-premium', provider: 'placeholder', provider_subscription_id: null, status: 'active', started_at: nowIso(), ended_at: null, created_at: nowIso(), updated_at: nowIso() },
]);

// ── Query Builder ─────────────────────────────────────────────────────────────

class QueryBuilder {
  constructor(tableName) {
    this._table = tableName;
    this._filters = [];
    this._orderCol = null;
    this._orderAsc = true;
    this._limitN = null;
    this._selectCols = null;
    this._op = null;     // 'select' | 'insert' | 'update' | 'delete'
    this._insertRows = null;
    this._updateData = null;
    this._single = false;
    this._maybeSingle = false;
    this._upsert = false;
  }

  // ── Operations ──────────────────────────────────────────────────────────────
  select(cols) {
    this._selectCols = cols;
    if (!this._op) this._op = 'select';
    return this;
  }

  insert(rows, opts) {
    this._op = 'insert';
    this._insertRows = Array.isArray(rows) ? rows : [rows];
    if (opts && opts.onConflict) this._upsert = true;
    return this;
  }

  upsert(rows) {
    this._op = 'insert';
    this._upsert = true;
    this._insertRows = Array.isArray(rows) ? rows : [rows];
    return this;
  }

  update(data) { this._op = 'update'; this._updateData = data; return this; }

  delete() { this._op = 'delete'; return this; }

  // ── Filters ─────────────────────────────────────────────────────────────────
  eq(col, val)  { this._filters.push(r => r[col] == val); return this; }
  neq(col, val) { this._filters.push(r => r[col] != val); return this; }
  gt(col, val)  { this._filters.push(r => r[col] > val); return this; }
  gte(col, val) { this._filters.push(r => r[col] >= val); return this; }
  lt(col, val)  { this._filters.push(r => r[col] < val); return this; }
  lte(col, val) { this._filters.push(r => r[col] <= val); return this; }
  in(col, vals) { this._filters.push(r => vals.includes(r[col])); return this; }
  is(col, val)  { this._filters.push(r => r[col] === val); return this; }
  ilike(col, pattern) {
    const re = new RegExp(pattern.replace(/%/g, '.*'), 'i');
    this._filters.push(r => re.test(String(r[col] || '')));
    return this;
  }
  contains(col, val) { this._filters.push(r => JSON.stringify(r[col] || '').includes(JSON.stringify(val))); return this; }

  // ── Modifiers ───────────────────────────────────────────────────────────────
  order(col, opts = {}) {
    this._orderCol = col;
    this._orderAsc = opts.ascending !== false;
    return this;
  }
  limit(n) { this._limitN = n; return this; }
  range(from, to) { this._limitN = to - from + 1; return this; }
  single() { this._single = true; return this; }
  maybeSingle() { this._maybeSingle = true; return this; }

  // ── Execute (thenable) ──────────────────────────────────────────────────────
  then(resolve, reject) {
    try {
      resolve(this._execute());
    } catch (e) {
      reject(e);
    }
  }

  _execute() {
    const store = tables[this._table];
    if (!store) {
      // Auto-create table
      tables[this._table] = {};
      return this._execute();
    }

    let rows = Object.values(store);

    if (this._op === 'insert') {
      const inserted = [];
      for (const row of this._insertRows) {
        const id = row.id || uuidv4();
        if (this._upsert || !store[id]) {
          const newRow = { id, ...row };
          store[id] = newRow;
          inserted.push(newRow);
        }
      }
      if (this._single || this._maybeSingle) {
        return { data: inserted[0] || null, error: null };
      }
      return { data: inserted, error: null };
    }

    if (this._op === 'update') {
      // Apply filters to find rows to update
      const toUpdate = rows.filter(r => this._filters.every(f => f(r)));
      const updated = toUpdate.map(r => {
        const newRow = { ...r, ...this._updateData };
        store[r.id] = newRow;
        return newRow;
      });
      if (this._single || this._maybeSingle) {
        return { data: updated[0] || null, error: null };
      }
      return { data: updated, error: null };
    }

    if (this._op === 'delete') {
      const toDelete = rows.filter(r => this._filters.every(f => f(r)));
      for (const r of toDelete) delete store[r.id];
      return { data: toDelete, error: null };
    }

    // SELECT (default)
    let result = rows.filter(r => this._filters.every(f => f(r)));

    if (this._orderCol) {
      result.sort((a, b) => {
        const av = a[this._orderCol];
        const bv = b[this._orderCol];
        if (av < bv) return this._orderAsc ? -1 : 1;
        if (av > bv) return this._orderAsc ? 1 : -1;
        return 0;
      });
    }

    if (this._limitN !== null) result = result.slice(0, this._limitN);

    if (this._single) {
      if (result.length === 0) return { data: null, error: { message: 'Not found', code: 'PGRST116' } };
      return { data: result[0], error: null };
    }
    if (this._maybeSingle) {
      return { data: result[0] || null, error: null };
    }

    return { data: result, error: null };
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

const memdb = {
  from: (table) => new QueryBuilder(table),

  // Expose raw tables for seeding / inspection
  _tables: tables,

  // Helper: add a user from outside (e.g. auth.js register)
  addUser: (user) => {
    tables.users[user.id] = user;
  },

  getUserByEmail: (email) => {
    return Object.values(tables.users).find(u => u.email === email.toLowerCase()) || null;
  },

  getUserById: (id) => {
    return tables.users[id] || null;
  },
};

module.exports = memdb;
