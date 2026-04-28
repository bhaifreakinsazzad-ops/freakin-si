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
  select(cols) { this._op = 'select'; this._selectCols = cols; return this; }

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
