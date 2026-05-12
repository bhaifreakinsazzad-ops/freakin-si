const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const memdb = require('../lib/memdb');
const { db, isUsingSupabase } = require('../lib/db');
const { authenticateToken } = require('../middleware/auth');
const { getJwtSecret } = require('../lib/jwtSecret');

function makeToken(userId, email) {
  return jwt.sign({ userId, email }, getJwtSecret(), { expiresIn: '30d' });
}

function sanitizeUser(user) {
  const { password, password_hash, ...safe } = user;
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

    // Check uniqueness — Supabase or memdb
    if (isUsingSupabase()) {
      const { data: existing } = await db.from('users').select('id').eq('email', lowerEmail).maybeSingle();
      if (existing) {
        return res.status(400).json({ error: 'An account with this email already exists' });
      }
    } else {
      if (memdb.getUserByEmail(lowerEmail)) {
        return res.status(400).json({ error: 'An account with this email already exists' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = {
      id: uuidv4(),
      email: lowerEmail,
      password_hash: hashedPassword,
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

    if (isUsingSupabase()) {
      const { error: insertErr } = await db.from('users').insert(newUser);
      if (insertErr) {
        console.error('[auth] Supabase register error:', insertErr.message);
        return res.status(500).json({ error: 'Registration failed. Please try again.' });
      }
    } else {
      memdb.addUser(newUser);
    }

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

    const lowerEmail = email.toLowerCase();
    let user = null;

    if (isUsingSupabase()) {
      const { data, error } = await db.from('users').select('*').eq('email', lowerEmail).maybeSingle();
      if (error) {
        console.error('[auth] Supabase login lookup error:', error.message);
        return res.status(500).json({ error: 'Login failed. Please try again.' });
      }
      user = data;
    } else {
      user = memdb.getUserByEmail(lowerEmail);
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, user.password_hash || user.password || '');
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Reset daily usage if it's a new day
    const lastReset = new Date(user.last_reset_at || 0);
    const today = new Date();
    if (lastReset.toDateString() !== today.toDateString()) {
      const updates = { daily_usage: 0, image_daily_usage: 0, last_reset_at: today.toISOString() };
      if (isUsingSupabase()) {
        await db.from('users').update(updates).eq('id', user.id);
        Object.assign(user, updates);
      } else {
        Object.assign(user, updates);
      }
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
    const updates = { updated_at: new Date().toISOString() };
    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (avatar_url !== undefined) updates.avatar_url = avatar_url;

    if (isUsingSupabase()) {
      const { data, error } = await db.from('users').update(updates).eq('id', req.user.id).select().single();
      if (error) return res.status(500).json({ error: 'Profile update failed' });
      return res.json({ user: sanitizeUser(data) });
    } else {
      const user = memdb.getUserById(req.user.id);
      Object.assign(user, updates);
      return res.json({ user: sanitizeUser(user) });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── Change password ───────────────────────────────────────────────────────────
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (newPassword.length < 6) return res.status(400).json({ error: 'New password must be at least 6 characters' });

    let user;
    if (isUsingSupabase()) {
      const { data } = await db.from('users').select('*').eq('id', req.user.id).single();
      user = data;
    } else {
      user = memdb.getUserById(req.user.id);
    }

    const valid = await bcrypt.compare(currentPassword, user.password_hash || user.password || '');
    if (!valid) return res.status(401).json({ error: 'Current password is incorrect' });

    const newHash = await bcrypt.hash(newPassword, 12);
    if (isUsingSupabase()) {
      await db.from('users').update({ password_hash: newHash, updated_at: new Date().toISOString() }).eq('id', req.user.id);
    } else {
      user.password = newHash;
      user.updated_at = new Date().toISOString();
    }
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
