const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const db = require('../lib/db');
const { authenticateToken } = require('../middleware/auth');
const { getJwtSecret } = require('../lib/jwtSecret');

function makeToken(userId, email) {
  return jwt.sign({ userId, email }, getJwtSecret(), { expiresIn: '30d' });
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
    if (await db.getUserByEmail(lowerEmail)) {
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

    const savedUser = await db.addUser(newUser);

    res.status(201).json({ token: makeToken(savedUser.id, savedUser.email), user: sanitizeUser(savedUser) });
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

    const user = await db.getUserByEmail(email.toLowerCase());
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
      await db.updateUser(user.id, {
        daily_usage: user.daily_usage,
        image_daily_usage: user.image_daily_usage,
        last_reset_at: user.last_reset_at,
        updated_at: new Date().toISOString(),
      });
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
    const patch = { updated_at: new Date().toISOString() };
    if (name !== undefined) patch.name = name;
    if (phone !== undefined) patch.phone = phone;
    if (avatar_url !== undefined) patch.avatar_url = avatar_url;
    const user = await db.updateUser(req.user.id, patch);
    res.json({ user: sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── Change password ───────────────────────────────────────────────────────────
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await db.getUserById(req.user.id);

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return res.status(401).json({ error: 'Current password is incorrect' });
    if (newPassword.length < 6) return res.status(400).json({ error: 'New password must be at least 6 characters' });

    await db.updateUser(req.user.id, {
      password: await bcrypt.hash(newPassword, 12),
      updated_at: new Date().toISOString(),
    });
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
