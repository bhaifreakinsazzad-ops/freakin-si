/**
 * Engine NotREAL — AI Business Engine
 * Backend API v4.0
 *
 * Stack: Express.js + Supabase + JWT
 * AI Providers: Groq, OpenAI, Anthropic, Google, Mistral, Together, DeepSeek, xAI, Perplexity
 * Image Gen: Pollinations.ai (free, no key)
 * Payment: Manual bKash/Nagad/Stripe confirmation
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
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  'https://enginenotreal.com',
  'https://www.enginenotreal.com',
  // DhandaBuzz / client beta domains
  'https://dhandabuzz.online',
  'https://www.dhandabuzz.online',
  // Legacy domains (kept for backward compat)
  'https://bhaifreakin.online',
  'https://www.bhaifreakin.online',
  'https://black-sheep.company',
  'https://www.black-sheep.company',
];

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (curl, mobile apps, Render health checks)
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
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

app.use('/api/auth',          require('./routes/auth'));
app.use('/api/chat',          require('./routes/chat'));
app.use('/api/image',         require('./routes/image'));
app.use('/api/tools',         require('./routes/tools'));
app.use('/api/models',        require('./routes/models'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/admin',         require('./routes/admin'));
app.use('/api/businesses',    require('./routes/businesses'));
app.use('/api/services',      require('./routes/services'));
app.use('/api/fixer',         require('./routes/fixer'));
app.use('/api/support',       require('./routes/support'));
app.use('/api/orders',        require('./routes/orders'));

// Admin overview — counts across all core resources
app.get('/api/admin/overview', require('./middleware/auth').authenticateToken, async (req, res) => {
  const { db, isUsingSupabase } = require('./lib/db')
  const adminEmails = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || '').split(',').map(e => e.trim())
  const isAdmin = req.user?.is_admin || adminEmails.includes(req.user?.email || '')
  if (!isAdmin) return res.status(403).json({ error: 'Admin access required' })

  const supportRoute = require('./routes/support')
  const ordersRoute  = require('./routes/orders')

  if (isUsingSupabase()) {
    try {
      const [tickets, orders, services, businesses] = await Promise.all([
        db.from('support_tickets').select('id, status, created_at', { count: 'exact' }),
        db.from('orders').select('id, status, amount, currency, created_at', { count: 'exact' }),
        db.from('service_requests').select('id, status, created_at', { count: 'exact' }),
        db.from('businesses').select('id, created_at', { count: 'exact' }),
      ])
      return res.json({
        mode: 'supabase',
        support_tickets: { total: tickets.count || 0, recent: (tickets.data || []).slice(0, 5) },
        orders:          { total: orders.count  || 0, recent: (orders.data  || []).slice(0, 5) },
        service_requests:{ total: services.count || 0, recent: (services.data || []).slice(0, 5) },
        businesses:      { total: businesses.count || 0 },
      })
    } catch (err) {
      console.error('[admin/overview] Supabase error:', err.message)
    }
  }

  res.json({
    mode: 'memdb',
    support_tickets:  { total: supportRoute.TICKETS?.length || 0, recent: (supportRoute.TICKETS || []).slice(0, 5) },
    orders:           { total: ordersRoute.ORDERS?.length   || 0, recent: (ordersRoute.ORDERS   || []).slice(0, 5) },
    service_requests: { total: 0, recent: [] },
    businesses:       { total: 0 },
  })
});

// Health check — production readiness report
app.get('/api/health', (req, res) => {
  const { getEnvStatus } = require('./lib/envStatus')
  const supportRoute = require('./routes/support')
  const status = getEnvStatus()

  res.json({
    status: 'ok',
    app: 'Engine NotREAL',
    version: '4.0.0',
    timestamp: new Date().toISOString(),
    ...status,
    support: {
      ready: true,
      ticketsInMemory: supportRoute.TICKETS ? supportRoute.TICKETS.length : 0,
    },
  });
});

// API info
app.get('/', (req, res) => {
  res.json({
    name: 'Engine NotREAL API',
    version: '4.0.0',
    description: 'Engine NotREAL — AI Business Fixer Engine',
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

// Only bind to a port when run directly (node server.js).
// When imported by a serverless runtime (Vercel, etc.) the export below is used instead.
if (require.main === module) {
  app.listen(PORT, () => {
    const aiProvider = process.env.GROQ_API_KEY ? 'Groq' :
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ? 'Google' :
      process.env.OPENAI_API_KEY ? 'OpenAI' :
      process.env.ANTHROPIC_API_KEY ? 'Anthropic' : 'Demo Mode';
    console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   ⚡  ENGINE NOTREAL BACKEND v4.0                        ║
║   AI Business Fixer Engine                               ║
║                                                          ║
║   🌐  http://localhost:${PORT}                              ║
║   📍  Environment: ${(process.env.NODE_ENV || 'development').padEnd(35)}║
║                                                          ║
║   🤖  AI Provider: ${aiProvider.padEnd(37)}║
║   🎨  Image Gen: Pollinations.ai (free)                  ║
║   💳  Payments: bKash/Nagad (manual) + Stripe (future)  ║
║   👤  Admin: ${(process.env.ADMIN_EMAILS || 'not set').padEnd(43)}║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
    `);
  });
}

module.exports = app;
