const jwt = require('jsonwebtoken');
const db = require('../lib/db');
const { getJwtSecret } = require('../lib/jwtSecret');

// Export the active database client so existing routes keep working unchanged.
const { supabase } = db;
const PREVIEW_TOKENS = new Set(['preview-token', 'dev-token']);
const LOCAL_TOKEN_PREFIX = 'local-auth:';

function previewModeEnabled() {
  return process.env.CLIENT_PREVIEW_MODE === 'true' || process.env.NODE_ENV !== 'production';
}

function resolvePreviewUser() {
  return db.getUserByEmail('demo@blacksheep.ai');
}

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    if (previewModeEnabled() && (PREVIEW_TOKENS.has(token) || token.startsWith(LOCAL_TOKEN_PREFIX))) {
      const previewUser = await resolvePreviewUser();
      if (!previewUser) {
        return res.status(500).json({ error: 'Preview user unavailable' });
      }
      req.user = previewUser;
      return next();
    }

    const decoded = jwt.verify(token, getJwtSecret());
    const user = await db.getUserById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

const requireAdmin = async (req, res, next) => {
  const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim());
  if (!req.user || (!adminEmails.includes(req.user.email) && !req.user.is_admin)) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  supabase,
  // Legacy exports (no-ops kept for compatibility)
  useDevDb: () => false,
  devUsers: () => ({}),
  setDevUsers: () => {},
  saveDevUsers: () => {},
};
