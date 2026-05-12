/**
 * Engine NotREAL - AI Business Engine
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

app.use(helmet({ crossOriginEmbedderPolicy: false }));

const allowedOrigins = new Set([
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
  'https://enginenotreal.com',
  'https://www.enginenotreal.com',
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
    if (!origin) return cb(null, true);
    if (allowedOrigins.has(origin)) return cb(null, true);
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

app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
}));

app.use('/api/auth/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many auth attempts. Please try again later.' },
}));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/image', require('./routes/image'));
app.use('/api/tools', require('./routes/tools'));
app.use('/api/models', require('./routes/models'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/businesses', require('./routes/businesses'));
app.use('/api/services', require('./routes/services'));
app.use('/api/portal', require('./routes/portal'));
app.use('/api/fixer', require('./routes/fixer'));
app.use('/api/support', require('./routes/support'));
app.use('/api/orders', require('./routes/orders'));

app.get('/api/admin/overview', require('./middleware/auth').authenticateToken, async (req, res) => {
  const { db, isUsingSupabase } = require('./lib/db');
  const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map((email) => email.trim()).filter(Boolean);
  const isAdmin = req.user?.is_admin || adminEmails.includes(req.user?.email || '');
  if (!isAdmin) return res.status(403).json({ error: 'Admin access required' });

  if (isUsingSupabase()) {
    try {
      const [supportTickets, orders, serviceRequests, businesses] = await Promise.all([
        db.from('support_tickets').select('id, status, created_at').order('created_at', { ascending: false }),
        db.from('orders').select('id, status, amount, currency, created_at').order('created_at', { ascending: false }),
        db.from('service_requests').select('id, status, created_at').order('created_at', { ascending: false }),
        db.from('businesses').select('id, created_at').order('created_at', { ascending: false }),
      ]);

      return res.json({
        mode: 'supabase',
        support_tickets: { total: supportTickets.data?.length || 0, recent: (supportTickets.data || []).slice(0, 5) },
        orders: { total: orders.data?.length || 0, recent: (orders.data || []).slice(0, 5) },
        service_requests: { total: serviceRequests.data?.length || 0, recent: (serviceRequests.data || []).slice(0, 5) },
        businesses: { total: businesses.data?.length || 0, recent: (businesses.data || []).slice(0, 5) },
      });
    } catch (error) {
      console.error('[admin/overview] Supabase error:', error.message);
    }
  }

  const supportRoute = require('./routes/support');
  const ordersRoute = require('./routes/orders');
  const [supportTickets, orders, serviceRequests, businesses] = await Promise.all([
    db.from('support_tickets').select('id, status, created_at').order('created_at', { ascending: false }),
    db.from('orders').select('id, status, amount, currency, created_at').order('created_at', { ascending: false }),
    db.from('service_requests').select('id, status, created_at').order('created_at', { ascending: false }),
    db.from('businesses').select('id, created_at').order('created_at', { ascending: false }),
  ]);

  return res.json({
    mode: 'memdb',
    support_tickets: { total: supportTickets.data?.length || supportRoute.TICKETS?.length || 0, recent: (supportTickets.data || supportRoute.TICKETS || []).slice(0, 5) },
    orders: { total: orders.data?.length || ordersRoute.ORDERS?.length || 0, recent: (orders.data || ordersRoute.ORDERS || []).slice(0, 5) },
    service_requests: { total: serviceRequests.data?.length || 0, recent: (serviceRequests.data || []).slice(0, 5) },
    businesses: { total: businesses.data?.length || 0, recent: (businesses.data || []).slice(0, 5) },
  });
});

app.get('/api/health', (req, res) => {
  const { getEnvStatus } = require('./lib/envStatus');
  const status = getEnvStatus();

  res.json({
    status: 'ok',
    app: 'Engine NotREAL',
    version: '4.0.0',
    timestamp: new Date().toISOString(),
    ...status,
  });
});

app.get('/', (req, res) => {
  res.json({
    name: 'Engine NotREAL API',
    version: '4.0.0',
    description: 'Engine NotREAL - AI Business Fixer Engine',
    docs: '/api/health',
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  const aiProvider = process.env.GROQ_API_KEY ? 'Groq'
    : process.env.GOOGLE_GENERATIVE_AI_API_KEY ? 'Google'
    : process.env.OPENAI_API_KEY ? 'OpenAI'
    : process.env.ANTHROPIC_API_KEY ? 'Anthropic'
    : 'Demo Mode';

  console.log(`
+--------------------------------------------------------------+
|                                                              |
|   ENGINE NOTREAL BACKEND v4.0                                |
|   AI Business Fixer Engine                                   |
|                                                              |
|   http://localhost:${PORT}                                   |
|   Environment: ${(process.env.NODE_ENV || 'development').padEnd(35)}|
|                                                              |
|   AI Provider: ${aiProvider.padEnd(37)}|
|   Image Gen: Pollinations.ai (free)                          |
|   Payments: bKash/Nagad (manual) + Stripe (future)          |
|   Admin: ${(process.env.ADMIN_EMAILS || 'not set').padEnd(43)}|
|                                                              |
+--------------------------------------------------------------+
  `);
});

module.exports = app;
