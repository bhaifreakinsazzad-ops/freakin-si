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

async function resolvePreviewUser() {
  return (
    (await db.getUserByEmail('demo@enginenotreal.com')) ||
    (await db.getUserByEmail('demo@blacksheep.ai')) ||
    (await db.getUserById('demo-user-001')) ||
    null
  )
}

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  try {
    if (PREVIEW_TOKENS.has(token) || token.startsWith(LOCAL_TOKEN_PREFIX)) {
      const previewUser = await resolvePreviewUser()
      if (!previewUser) {
        return res.status(500).json({ error: 'Preview user unavailable' })
      }
      req.user = previewUser
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
