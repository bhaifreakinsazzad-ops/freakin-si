/**
 * Freakin BI — Freakin Business Intelligence
 * Backend API v3.0
 *
 * Stack: Express.js + Supabase + JWT
 * Free LLMs: Groq, Gemini, OpenRouter, Together, Cohere
 * Image Gen: Pollinations.ai (free, no key)
 * Payment: Manual bKash/Nagad confirmation
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3001;

// ============ MIDDLEWARE ============

app.use(helmet({ crossOriginEmbedderPolicy: false }));
const configuredFrontendOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
const allowedOrigins = new Set([
  configuredFrontendOrigin,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
  'https://bhaifreakin.online',
  'https://www.bhaifreakin.online',
  'https://black-sheep.company',
  'https://www.black-sheep.company',
  'https://powered-by-bhaisazzad.online',
]);

for (const extraOrigin of String(process.env.ADDITIONAL_ALLOWED_ORIGINS || '').split(',')) {
  const trimmed = extraOrigin.trim();
  if (trimmed) allowedOrigins.add(trimmed);
}

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (curl, mobile apps, Render health checks)
    if (!origin) return cb(null, true);
    if (allowedOrigins.has(origin)) return cb(null, true);
    // Allow any *.vercel.app preview deployments
    if (origin.endsWith('.vercel.app')) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Global rate limit
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests. অনুগ্রহ করে কিছুক্ষণ পরে চেষ্টা করুন।' },
  standardHeaders: true,
  legacyHeaders: false,
}));

// Stricter limit for auth routes
app.use('/api/auth/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many auth attempts. Please try again later.' },
}));

// ============ ROUTES ============

app.use('/api/auth', require('./routes/auth'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/image', require('./routes/image'));
app.use('/api/tools', require('./routes/tools'));
app.use('/api/models', require('./routes/models'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/businesses', require('./routes/businesses'));
app.use('/api/services',   require('./routes/services'));
app.use('/api/portal',     require('./routes/portal'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Freakin BI',
    version: '3.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API info
app.get('/', (req, res) => {
  res.json({
    name: 'Freakin BI API',
    version: '3.0.0',
    description: 'Freakin Business Intelligence — Unlock the Code to Billions',
    docs: '/api/health',
  });
});

// ============ ERROR HANDLING ============

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ============ START ============

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   🔥  FREAKIN BI BACKEND v3.0                           ║
║   Freakin Business Intelligence                          ║
║                                                          ║
║   🌐  http://localhost:${PORT}                              ║
║   📍  Environment: ${(process.env.NODE_ENV || 'development').padEnd(35)}║
║                                                          ║
║   ✅  Free LLMs: Groq, Gemini, OpenRouter               ║
║   🎨  Image Gen: Pollinations.ai (free)                  ║
║   💳  Payments: bKash/Nagad (manual confirm)             ║
║   👤  Admin: ${(process.env.ADMIN_EMAILS || 'not set').padEnd(43)}║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
