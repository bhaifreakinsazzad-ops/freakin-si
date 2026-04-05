/**
 * AI Shala — Database Setup Script
 * Runs the schema SQL on Supabase via Management API
 */
require('dotenv').config();
const fs   = require('fs');
const path = require('path');
const https = require('https');

const SUPABASE_URL = process.env.SUPABASE_URL;               // https://xxx.supabase.co
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_KEY;       // sb_secret_...
const PROJECT_REF  = SUPABASE_URL.replace('https://', '').split('.')[0]; // agkuxuchzifmbgmhsnkb

const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
const sql = fs.readFileSync(schemaPath, 'utf8')
  // Remove comments and blank lines for cleaner execution
  .split('\n')
  .filter(l => !l.trim().startsWith('--') && l.trim() !== '')
  .join('\n');

// Split into individual statements
const statements = sql
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 10);

async function runQuery(query) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query: query + ';' });
    const options = {
      hostname: `${PROJECT_REF}.supabase.co`,
      path: '/rest/v1/rpc/query',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'apikey': SERVICE_KEY,
        'Content-Length': Buffer.byteLength(body),
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function runViaSQL(query) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query });
    const options = {
      hostname: `${PROJECT_REF}.supabase.co`,
      path: '/sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'apikey': SERVICE_KEY,
        'Content-Length': Buffer.byteLength(body),
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  console.log('🤖 AI Shala — Database Setup');
  console.log(`📍 Project: ${PROJECT_REF}`);
  console.log('');

  // Try the /sql endpoint (newer Supabase)
  console.log('📦 Running schema on Supabase...');
  const fullSchema = fs.readFileSync(schemaPath, 'utf8');

  const result = await runViaSQL(fullSchema);

  if (result.status === 200 || result.status === 201) {
    console.log('✅ Schema created successfully!');
    return;
  }

  console.log(`⚠️  /sql endpoint returned ${result.status}: ${result.body.slice(0, 200)}`);
  console.log('');
  console.log('📋 Running statements individually...');

  // Run individual DDL statements
  const ddl = [
    `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`,
    `CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, name TEXT NOT NULL, phone TEXT,
      avatar_url TEXT, subscription TEXT DEFAULT 'free',
      subscription_ends_at TIMESTAMP WITH TIME ZONE, trial_ends_at TIMESTAMP WITH TIME ZONE,
      daily_usage INTEGER DEFAULT 0, daily_limit INTEGER DEFAULT 50,
      image_daily_usage INTEGER DEFAULT 0, image_daily_limit INTEGER DEFAULT 5,
      last_reset_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      is_admin BOOLEAN DEFAULT FALSE, is_banned BOOLEAN DEFAULT FALSE, ban_reason TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS conversations (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT DEFAULT 'নতুন চ্যাট', model TEXT DEFAULT 'groq/llama-3.3-70b-versatile',
      system_prompt TEXT, pinned BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS messages (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
      role TEXT NOT NULL, content TEXT NOT NULL, model TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS image_history (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      prompt TEXT NOT NULL, style TEXT DEFAULT 'realistic', image_url TEXT NOT NULL,
      width INTEGER DEFAULT 1024, height INTEGER DEFAULT 1024, seed INTEGER,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS tool_history (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      tool_id TEXT NOT NULL, input TEXT, output TEXT, model TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS payment_requests (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      user_email TEXT NOT NULL, user_name TEXT, plan_id TEXT NOT NULL, plan_name TEXT,
      amount DECIMAL(10,2) NOT NULL, payment_method TEXT NOT NULL,
      transaction_id TEXT NOT NULL UNIQUE, sender_number TEXT,
      status TEXT DEFAULT 'pending', admin_note TEXT, approved_by UUID, approved_at TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS usage_logs (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL, model TEXT, tool_id TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )`,
  ];

  let success = 0;
  for (const stmt of ddl) {
    const r = await runViaSQL(stmt);
    if (r.status < 300) {
      success++;
      process.stdout.write('.');
    } else {
      process.stdout.write('x');
    }
  }
  console.log(`\n✅ ${success}/${ddl.length} statements completed`);

  console.log('\n🎉 Database setup complete!');
  console.log('👉 If any tables failed, run database/schema.sql manually in Supabase SQL Editor');
  console.log('   https://supabase.com/dashboard/project/' + PROJECT_REF + '/sql');
}

main().catch(err => {
  console.error('❌ Setup error:', err.message);
  console.log('\n📋 Manual setup required:');
  console.log('1. Go to https://supabase.com/dashboard/project/' +
    (SUPABASE_URL || '').replace('https://', '').split('.')[0] + '/sql');
  console.log('2. Copy contents of database/schema.sql');
  console.log('3. Paste and click Run');
  process.exit(1);
});
