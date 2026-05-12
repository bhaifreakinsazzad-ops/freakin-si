/**
 * Engine NotREAL — Environment & Production Readiness Status
 * Reports what is configured and what is missing.
 * Never exposes actual key values — only presence/absence.
 */

const { isUsingSupabase } = require('./db')
const { getActiveProvider } = require('./aiRouter')

// Known placeholder values that should not be treated as real keys
const PLACEHOLDERS = [
  'PASTE_YOUR_SERVICE_ROLE_KEY_HERE',
  'your-supabase-service-role-key',
  'your-service-role-key-from-settings-api',
  'eyJ_PLACEHOLDER',
]

function isPlaceholder(val) {
  if (!val) return true
  return PLACEHOLDERS.some(p => val.includes(p))
}

function getEnvStatus() {
  const hasSupabaseUrl = !!process.env.SUPABASE_URL
  const rawKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
  const hasSupabaseKey = !!rawKey && !isPlaceholder(rawKey) && rawKey.length > 50
  const hasJwtSecret = !!(process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 16)
  const hasAiKey = !!(
    process.env.GROQ_API_KEY ||
    process.env.OPENAI_API_KEY ||
    process.env.ANTHROPIC_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.MISTRAL_API_KEY ||
    process.env.TOGETHER_API_KEY ||
    process.env.DEEPSEEK_API_KEY ||
    process.env.XAI_API_KEY ||
    process.env.PERPLEXITY_API_KEY
  )
  const hasStripe = !!(process.env.STRIPE_SECRET_KEY)

  const activeProvider = getActiveProvider()
  const usingSupabase = isUsingSupabase()

  // Required for production
  const missingRequired = []
  if (!hasSupabaseUrl)  missingRequired.push('SUPABASE_URL')
  if (!hasSupabaseKey) {
    if (rawKey && isPlaceholder(rawKey)) {
      missingRequired.push('SUPABASE_SERVICE_KEY (placeholder detected — paste real service_role key from Supabase Dashboard → Settings → API)')
    } else {
      missingRequired.push('SUPABASE_SERVICE_KEY')
    }
  }
  if (!hasJwtSecret)    missingRequired.push('JWT_SECRET (min 16 chars)')

  // Recommended
  const missingRecommended = []
  if (!hasAiKey) missingRecommended.push('At least one AI provider key (GROQ_API_KEY recommended — free tier)')

  const isProduction = process.env.NODE_ENV === 'production'
  const productionReady = isProduction
    ? (missingRequired.length === 0)
    : true  // dev always reports "ready" — we just warn

  return {
    environment: process.env.NODE_ENV || 'development',
    productionReady,
    database: {
      configured: hasSupabaseUrl && hasSupabaseKey,
      mode: usingSupabase ? 'supabase' : 'memdb',
      note: usingSupabase
        ? 'Connected to Supabase — data persists.'
        : 'In-memory memdb — data resets on restart. Set SUPABASE_URL + SUPABASE_SERVICE_KEY.',
    },
    auth: {
      configured: hasJwtSecret,
      note: hasJwtSecret ? 'JWT_SECRET set.' : 'Using dev fallback JWT secret — NOT safe for production.',
    },
    ai: {
      configured: hasAiKey,
      provider: activeProvider || 'demo',
      mode: hasAiKey ? 'live' : 'demo',
      note: hasAiKey
        ? `Using ${activeProvider} — real AI responses.`
        : 'No AI key found — returning demo fallback responses. Set GROQ_API_KEY for free live AI.',
    },
    payment: {
      mode: hasStripe ? 'stripe' : 'manual',
      stripeConfigured: hasStripe,
      note: hasStripe
        ? 'Stripe configured.'
        : 'Manual payment flow (bKash/Nagad/bank transfer). Set STRIPE_SECRET_KEY for card payments.',
    },
    missingRequired,
    missingRecommended,
  }
}

module.exports = { getEnvStatus }
