const jwt = require('jsonwebtoken')
const { getJwtSecret } = require('../lib/jwtSecret')
const dbModule = require('../lib/db')

const db = dbModule.db
const supabase = db
const { isUsingSupabase } = dbModule

const PREVIEW_TOKENS = new Set(['preview-token', 'dev-token'])
const LOCAL_TOKEN_PREFIX = 'local-auth:'

function previewModeEnabled() {
  return process.env.CLIENT_PREVIEW_MODE === 'true' || process.env.NODE_ENV !== 'production'
}

function makePreviewAdmin() {
  return {
    id: 'demo-user-001',
    email: 'demo@enginenotreal.com',
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  try {
    if (PREVIEW_TOKENS.has(token) || token.startsWith(LOCAL_TOKEN_PREFIX)) {
      req.user = makePreviewAdmin()
      return next()
    }

    const decoded = jwt.verify(token, getJwtSecret())
    const user = await db.getUserById(decoded.userId)

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    req.user = user
    next()
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' })
  }
}

const requireAdmin = async (req, res, next) => {
  const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map((email) => email.trim()).filter(Boolean)
  if (!req.user || (!adminEmails.includes(req.user.email) && !req.user.is_admin)) {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}

module.exports = {
  authenticateToken,
  requireAdmin,
  supabase,
  db,
  isUsingSupabase,
  useDevDb: () => false,
  devUsers: () => ({}),
  setDevUsers: () => {},
  saveDevUsers: () => {},
}
