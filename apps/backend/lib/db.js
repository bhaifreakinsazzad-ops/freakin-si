const { createClient } = require('@supabase/supabase-js');
const memdb = require('./memdb');

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
const hasSupabase = Boolean(supabaseUrl && serviceKey);

const supabase = hasSupabase
  ? createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : memdb;

async function getUserByEmail(email) {
  if (!email) return null;
  if (!hasSupabase) return memdb.getUserByEmail(email);
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', String(email).toLowerCase())
    .maybeSingle();
  if (error) throw error;
  return data || null;
}

async function getUserById(id) {
  if (!id) return null;
  if (!hasSupabase) return memdb.getUserById(id);
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data || null;
}

async function addUser(user) {
  if (!hasSupabase) {
    memdb.addUser(user);
    return user;
  }
  const { data, error } = await supabase
    .from('users')
    .insert(user)
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function updateUser(id, patch) {
  if (!hasSupabase) {
    const user = memdb.getUserById(id);
    if (!user) return null;
    Object.assign(user, patch);
    return user;
  }
  const { data, error } = await supabase
    .from('users')
    .update(patch)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

module.exports = {
  supabase,
  usingSupabase: hasSupabase,
  getUserByEmail,
  getUserById,
  addUser,
  updateUser,
};
