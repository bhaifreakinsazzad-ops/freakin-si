const jwt = require('jsonwebtoken');
const memdb = require('../lib/memdb');
const { getJwtSecret } = require('../lib/jwtSecret');
const { db, isUsingSupabase } = require('../lib/db');

// db is the unified client — real Supabase when env keys are set, memdb otherwise.
// All routes import `supabase` from here; this one change cascades persistence everywhere.
const supabase = db;

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret());

    let user = null;

    if (isUsingSupabase()) {
      // Real Supabase: look up user in the users table
      const { data, error } = await db.from('users').select('*').eq('id', decoded.userId).maybeSingle();
      if (!error && data) {
        user = data;
      } else {
        // Fallback: token may have been issued before Supabase activation
        user = memdb.getUserById(decoded.userId) || null;
      }
    } else {
      // memdb: use the in-memory store
      user = memdb.getUserById(decoded.userId);
    }

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
  const adminEmails = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || '').split(',').map(e => e.trim()).filter(Boolean);
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
