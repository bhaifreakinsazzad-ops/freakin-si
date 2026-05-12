/**
 * Engine NotREAL - Environment & Production Readiness Status
 * Reports what is configured and what is missing.
 * Never exposes actual key values - only presence/absence.
 */

const { isUsingSupabase } = require('./db')
const { getActiveProvider } = require('./aiRouter')

function getEnvStatus() {
  const hasSupabaseUrl = !!process.env.SUPABASE_URL
  const hasSupabaseKey = !!(process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)
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
  const hasStripe = !!process.env.STRIPE_SECRET_KEY

  const activeProvider = getActiveProvider()
  const usingSupabase = isUsingSupabase()

  const missingRequired = []
  if (!hasSupabaseUrl) missingRequired.push('SUPABASE_URL')
  if (!hasSupabaseKey) missingRequired.push('SUPABASE_SERVICE_KEY')
  if (!hasJwtSecret) missingRequired.push('JWT_SECRET (min 16 chars)')

  const missingRecommended = []
  if (!hasAiKey) missingRecommended.push('At least one AI provider key (GROQ_API_KEY recommended)')

  const productionReady = missingRequired.length === 0 && usingSupabase

  return {
    environment: process.env.NODE_ENV || 'development',
    productionReady,
    database: {
      configured: hasSupabaseUrl && hasSupabaseKey,
      mode: usingSupabase ? 'supabase' : 'memdb',
      note: usingSupabase
        ? 'Connected to Supabase - data persists.'
        : 'In-memory memdb - data resets on restart. Set SUPABASE_URL + SUPABASE_SERVICE_KEY.',
    },
    auth: {
      configured: hasJwtSecret,
      note: hasJwtSecret ? 'JWT_SECRET set.' : 'Using dev fallback JWT secret - NOT safe for production.',
    },
    ai: {
      configured: hasAiKey,
      provider: activeProvider || 'demo',
      mode: hasAiKey ? 'live' : 'demo',
      note: hasAiKey
        ? `Using ${activeProvider} - real AI responses.`
        : 'No AI key found - returning demo fallback responses. Set GROQ_API_KEY for free live AI.',
    },
    payment: {
      mode: hasStripe ? 'stripe' : 'not_configured',
      stripeConfigured: hasStripe,
      note: hasStripe
        ? 'Stripe configured.'
        : 'Manual payment flow is active. Set STRIPE_SECRET_KEY for card payments.',
    },
    missingRequired,
    missingRecommended,
  }
}

module.exports = { getEnvStatus }
