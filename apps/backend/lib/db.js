/**
 * Engine NotREAL — Database Client
 *
 * Exports a single `db` client that is:
 *   - Real Supabase client when SUPABASE_URL + SUPABASE_SERVICE_KEY are set
 *   - In-memory memdb when Supabase env is not configured (dev/demo mode)
 *
 * All backend routes import `db` from here (or via middleware/auth which re-exports it).
 * Zero route changes needed — the API is identical.
 */

const memdb = require('./memdb')

let _db = null
let _usingSupabase = false

function buildSupabaseClient() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) return null

  try {
    const { createClient } = require('@supabase/supabase-js')
    const client = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
    return client
  } catch (err) {
    console.warn('[db] Supabase client creation failed:', err.message)
    return null
  }
}

function getDb() {
  if (_db) return _db

  const supabaseClient = buildSupabaseClient()
  if (supabaseClient) {
    _db = supabaseClient
    _usingSupabase = true
    console.log('[db] ✅ Supabase connected')
  } else {
    _db = memdb
    _usingSupabase = false
    if (process.env.NODE_ENV === 'production') {
      console.warn('[db] ⚠️  WARNING: Running in PRODUCTION without Supabase. Data will not persist.')
    } else {
      console.log('[db] ℹ️  Using in-memory memdb (dev mode). Set SUPABASE_URL + SUPABASE_SERVICE_KEY for persistence.')
    }
  }

  return _db
}

function isUsingSupabase() {
  getDb() // ensure initialized
  return _usingSupabase
}

function resetClient() {
  _db = null
  _usingSupabase = false
}

// Export the db getter as a proxy so callers can use it like: db.from('table')
const db = new Proxy({}, {
  get(_, prop) {
    const client = getDb()
    if (prop === 'isSupabase') return _usingSupabase
    if (prop === '__reset') return resetClient
    const val = client[prop]
    return typeof val === 'function' ? val.bind(client) : val
  }
})

module.exports = { db, getDb, isUsingSupabase, resetClient }
