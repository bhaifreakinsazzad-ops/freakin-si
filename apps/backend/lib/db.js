/**
 * Engine NotREAL - Unified database adapter.
 *
 * Uses Supabase when the required credentials are present, otherwise falls
 * back to the in-memory memdb implementation.
 */

const { createClient } = require('@supabase/supabase-js')
const memdb = require('./memdb')

const defaultSupabaseProjectId = 'pcaturcbsepbtaqksqqm'
const configuredSupabaseProjectId = process.env.SUPABASE_PROJECT_ID || defaultSupabaseProjectId
const supabaseUrl = process.env.SUPABASE_URL || (configuredSupabaseProjectId ? `https://${configuredSupabaseProjectId}.supabase.co` : '')
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
const hasSupabase = Boolean(supabaseUrl && serviceKey)

const client = hasSupabase
  ? createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : memdb

function getDb() {
  return client
}

function isUsingSupabase() {
  return hasSupabase
}

function resetClient() {
  // Kept for compatibility with older test helpers.
}

function querySingle(table, column, value) {
  return client
    .from(table)
    .select('*')
    .eq(column, value)
    .maybeSingle()
    .then(({ data, error }) => {
      if (error) return null
      return data || null
    })
}

async function getUserByEmail(email) {
  const normalized = String(email || '').trim().toLowerCase()
  if (!normalized) return null
  if (!hasSupabase) return memdb.getUserByEmail(normalized)

  const user = await querySingle('users', 'email', normalized)
  if (user) return user
  return querySingle('profiles', 'email', normalized)
}

async function getUserById(id) {
  const normalized = String(id || '').trim()
  if (!normalized) return null
  if (!hasSupabase) return memdb.getUserById(normalized)

  const user = await querySingle('users', 'id', normalized)
  if (user) return user
  return querySingle('profiles', 'id', normalized)
}

async function addUser(user) {
  if (!hasSupabase) {
    memdb.addUser(user)
    return user
  }

  const { data, error } = await client.from('users').insert(user).select().single()
  if (error) throw error
  return data
}

async function updateUser(id, patch) {
  if (!hasSupabase) {
    const user = memdb.getUserById(id)
    if (!user) return null
    Object.assign(user, patch)
    return user
  }

  const { data, error } = await client.from('users').update(patch).eq('id', id).select().single()
  if (error) throw error
  return data
}

const db = {
  from: (...args) => getDb().from(...args),
  getUserByEmail,
  getUserById,
  addUser,
  updateUser,
  getDb,
  isUsingSupabase,
  resetClient,
  usingSupabase: hasSupabase,
}

module.exports = {
  db,
  supabase: db,
  getDb,
  isUsingSupabase,
  resetClient,
  getUserByEmail,
  getUserById,
  addUser,
  updateUser,
  usingSupabase: hasSupabase,
}
