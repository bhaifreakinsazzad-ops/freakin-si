const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const memdb = require('../lib/memdb');
const { authenticateToken } = require('../middleware/auth');

function makeToken(userId, email) {
  return jwt.sign({ userId, email }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

function sanitizeUser(user) {
  const { password, ...safe } = user;
  return safe;
}

// ── Register ──────────────────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const lowerEmail = email.toLowerCase();
    if (memdb.getUserByEmail(lowerEmail)) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = {
      id: uuidv4(),
      email: lowerEmail,
      password: hashedPassword,
      name,
      phone: phone || null,
      subscription: 'free',
      daily_usage: 0,
      daily_limit: parseInt(process.env.FREE_DAILY_LIMIT || 50),
      image_daily_usage: 0,
      image_daily_limit: parseInt(process.env.FREE_IMAGE_DAILY_LIMIT || 5),
      is_admin: false,
      trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      last_reset_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    memdb.addUser(newUser);

    res.status(201).json({ token: makeToken(newUser.id, newUser.email), user: sanitizeUser(newUser) });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── Login ─────────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = memdb.getUserByEmail(email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Reset daily usage if it's a new day
    const lastReset = new Date(user.last_reset_at || 0);
    const today = new Date();
    if (lastReset.toDateString() !== today.toDateString()) {
      user.daily_usage = 0;
      user.image_daily_usage = 0;
      user.last_reset_at = today.toISOString();
    }

    res.json({ token: makeToken(user.id, user.email), user: sanitizeUser(user) });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── Get current user ──────────────────────────────────────────────────────────
router.get('/me', authenticateToken, (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});

// ── Update profile ────────────────────────────────────────────────────────────
router.patch('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone, avatar_url } = req.body;
    const user = memdb.getUserById(req.user.id);
    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (avatar_url !== undefined) user.avatar_url = avatar_url;
    user.updated_at = new Date().toISOString();
    res.json({ user: sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── Change password ───────────────────────────────────────────────────────────
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = memdb.getUserById(req.user.id);

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return res.status(401).json({ error: 'Current password is incorrect' });
    if (newPassword.length < 6) return res.status(400).json({ error: 'New password must be at least 6 characters' });

    user.password = await bcrypt.hash(newPassword, 12);
    user.updated_at = new Date().toISOString();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
