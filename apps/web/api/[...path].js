import { randomUUID } from 'crypto';

const now = () => new Date().toISOString();
const demoUserId = 'demo-user-001';
const projectId = 'proj-1';
const durableDemoUserId = '11111111-1111-4111-8111-111111111111';
const durableProjectId = '22222222-2222-4222-8222-222222222222';
const defaultSupabaseProjectId = 'pcaturcbsepbtaqksqqm';
const configuredSupabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const configuredSupabaseProjectId = process.env.SUPABASE_PROJECT_ID || process.env.VITE_SUPABASE_PROJECT_ID || defaultSupabaseProjectId;
const supabaseUrl = (configuredSupabaseUrl || (configuredSupabaseProjectId ? `https://${configuredSupabaseProjectId}.supabase.co` : '')).replace(/\/+$/, '');
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabaseEnabled = Boolean(supabaseUrl && supabaseKey);

const moduleCatalog = [
  'Idea Refiner', 'Niche Finder', 'Audience Builder', 'Problem/Solution Mapper',
  'Offer Generator', 'Business Model Builder', 'Startup Roadmap Builder', 'Name Generator',
  'Tagline Generator', 'Brand Voice Builder', 'Logo Concept Generator', 'Color Palette Builder',
  'Social Bio Generator', 'Brand Story Builder', 'Business Case Generator', 'SWOT Analyzer',
  'Competitor Mapper', 'Pricing Strategy Builder', 'Revenue Stream Builder', 'Risk Analyzer',
  'Growth Roadmap Builder', 'Landing Page Copy Builder', 'Website Section Generator',
  'Service Page Builder', 'FAQ Generator', 'Contact Form Builder', 'Blog Idea Generator',
  '7-Day Content Planner', 'Ad Copy Generator', 'Email Sequence Builder', 'LLC Checklist Builder',
  'EIN Checklist Builder', 'License/Permit Checklist Builder', 'Business Bank Setup Guide',
  'Bookkeeping Setup Checklist', 'Operations SOP Builder', 'Task Planner',
  'Document Checklist Builder', 'Funding Readiness Scorer', 'Startup Cost Calculator',
  'Use-of-Funds Builder', 'Pitch Summary Generator', 'Lender Summary Builder',
  'Projection Table Builder', 'Funding Document Builder', 'Launch Checklist Builder',
  'Lead Tracker', 'CRM Note Assistant', 'Service Request Builder',
  'Monthly Improvement Planner', 'KPI Dashboard Assistant', 'Client Update Generator',
].map((name, index) => ({
  id: String(index + 1),
  name,
  category: index < 7 ? 'Business Creation' : index < 14 ? 'Brand' : index < 21 ? 'Strategy' : index < 30 ? 'Website & Content' : index < 38 ? 'Setup & Operations' : index < 45 ? 'Funding' : 'Launch & Management',
  description: `${name} for THE SHEEP operating system workflows.`,
  status: index % 8 === 0 ? 'beta' : 'ready',
  usageCount: (index % 7) + 1,
}));

const state = globalThis.__theSheepPreviewState || {
  users: [{
    id: demoUserId,
    email: 'demo@blacksheep.ai',
    name: 'Demo User',
    phone: '+1',
    subscription: 'premium',
    is_admin: true,
    created_at: now(),
    updated_at: now(),
  }],
  projects: [{
    id: projectId,
    user_id: demoUserId,
    name: 'Black Sheep Founder Project',
    idea: 'Guided AI-powered business launch operating system',
    audience: 'First-time and growth-stage founders',
    location: 'United States',
    status: 'in_review',
    current_step: 3,
    progress: 42,
    readiness_score: 61,
    created_at: now(),
    updated_at: now(),
  }],
  onboarding: [],
  steps: [
    ['idea', 100, 'approved', 'approved'],
    ['brand', 78, 'review', 'submitted'],
    ['case', 46, 'in_progress', 'none'],
    ['preview', 12, 'in_progress', 'none'],
    ['setup', 0, 'not_started', 'none'],
    ['funding', 0, 'not_started', 'none'],
    ['launch', 0, 'not_started', 'none'],
  ].map(([step_key, progress, status, review_state], index) => ({ id: `step-${index + 1}`, project_id: projectId, step_key, progress, status, review_state, updated_at: now() })),
  assets: [
    { id: 'a1', project_id: projectId, title: 'Brand Kit v2', asset_type: 'brand', content: { text: 'Brand voice, palette, logo direction' }, status: 'approved', created_at: now(), updated_at: now() },
    { id: 'a2', project_id: projectId, title: 'Business Case Draft', asset_type: 'business_case', content: { text: 'Roadmap + pricing strategy' }, status: 'in_review', created_at: now(), updated_at: now() },
    { id: 'a3', project_id: projectId, title: 'Funding Snapshot', asset_type: 'funding', content: { text: 'Readiness score and assumptions' }, status: 'draft', created_at: now(), updated_at: now() },
  ],
  runs: [
    { id: 'run-1', module_id: '1', project_id: projectId, input: { text: 'Generate idea strategy' }, output: { summary: 'Idea strategy drafted.' }, created_at: now() },
    { id: 'run-10', module_id: '10', project_id: projectId, input: { text: 'Generate brand kit' }, output: { summary: 'Brand kit drafted.' }, created_at: now() },
  ],
  reviews: [{ id: 'r1', project_id: projectId, asset_id: 'a2', step_key: 'brand', status: 'pending', admin_note: null, created_at: now(), updated_at: now() }],
  supportThreads: [{ id: 's1', project_id: projectId, subject: 'Need help choosing setup state', priority: 'high', status: 'in_progress', created_at: now(), updated_at: now() }],
  supportMessages: [
    { id: 'm1', thread_id: 's1', sender_id: demoUserId, sender_role: 'client', body: 'Which state is better for launch?', created_at: now() },
    { id: 'm2', thread_id: 's1', sender_id: demoUserId, sender_role: 'admin', body: 'We added state comparison inside your setup step.', created_at: now() },
  ],
  marketplaceOrders: [],
  documents: [],
  notifications: [
    { id: 'n1', user_id: demoUserId, title: 'Review Submitted', body: 'Brand Builder assets submitted for admin review.', read: false, created_at: now() },
    { id: 'n2', user_id: demoUserId, title: 'Support Reply', body: 'Admin replied to your setup request.', read: false, created_at: now() },
  ],
  activity: [
    { id: 'ac1', project_id: projectId, actor_id: demoUserId, actor_role: 'client', action_type: 'review', title: 'Review submitted', detail: 'Brand Builder sent for admin review.', metadata: {}, created_at: now() },
    { id: 'ac2', project_id: projectId, actor_id: demoUserId, actor_role: 'client', action_type: 'module_run', title: 'Module run complete', detail: 'Business Case Generator produced output.', metadata: {}, created_at: now() },
  ],
  adminNotes: [],
  conversations: [],
  messages: {},
  payments: [],
};

globalThis.__theSheepPreviewState = state;

function send(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(data));
}

function getBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return req.body;
}

function listByProject(rows, pid) {
  return rows.filter((row) => String(row.project_id) === String(pid));
}

function blueprint(payload) {
  const idea = payload.businessIdea || payload.idea || 'AI-powered service business';
  const audience = payload.targetAudience || payload.audience || 'startup founders';
  return {
    businessName: 'Black Sheep Launch Co.',
    tagline: 'Build the business before the noise.',
    positioning: `${idea} for ${audience}.`,
    offer: 'A guided launch package with brand, website, operations, and support readiness.',
    nextSteps: ['Validate the offer', 'Generate brand kit', 'Build launch page', 'Prepare setup checklist'],
  };
}

function normalizeProjectId(value) {
  if (!value || String(value) === projectId) return durableProjectId;
  return String(value);
}

function normalizeUserId(value) {
  if (!value || String(value) === demoUserId) return durableDemoUserId;
  return String(value);
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ''));
}

function cleanPayload(payload) {
  return Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined));
}

function restEq(field, value) {
  return `${field}=eq.${encodeURIComponent(String(value))}`;
}

async function supabaseRequest(table, { method = 'GET', query = '', body, upsert = false } = {}) {
  const separator = query ? (query.startsWith('?') ? '' : '?') : '';
  const response = await fetch(`${supabaseUrl}/rest/v1/${table}${separator}${query}`, {
    method,
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      Prefer: upsert ? 'resolution=merge-duplicates,return=representation' : 'return=representation',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Supabase ${table} ${method} failed: ${response.status} ${detail}`);
  }

  if (response.status === 204) return [];
  return response.json();
}

async function handleSupabase(req, parts, path, body) {
  if (!supabaseEnabled) return null;

  try {
    if (path === '/health') return { status: 200, data: { status: 'ok', mode: 'vercel-supabase', at: now() } };

    if (path === '/auth/login' && req.method === 'POST') {
      const users = await supabaseRequest('users', { query: `select=*&email=eq.${encodeURIComponent(body.email || 'demo@blacksheep.ai')}&limit=1` });
      return { status: 200, data: { token: 'preview-token', user: users[0] || state.users[0] } };
    }
    if (path === '/auth/register' && req.method === 'POST') {
      const users = await supabaseRequest('users', {
        method: 'POST',
        body: cleanPayload({
          email: body.email || `user-${Date.now()}@preview.local`,
          name: body.name || 'Preview User',
          password: 'preview-only',
          password_hash: 'preview-only',
          phone: body.phone || '',
          subscription: 'free',
        }),
      });
      return { status: 200, data: { token: 'preview-token', user: users[0] || state.users[0] } };
    }
    if (path === '/auth/me' && req.method === 'GET') {
      const users = await supabaseRequest('users', { query: `select=*&id=eq.${durableDemoUserId}&limit=1` });
      return { status: 200, data: { user: users[0] || state.users[0] } };
    }
    if (path === '/auth/profile' && req.method === 'PATCH') {
      const users = await supabaseRequest('users', { method: 'PATCH', query: restEq('id', durableDemoUserId), body: cleanPayload({ ...body, updated_at: now() }) });
      return { status: 200, data: { user: users[0] || state.users[0] } };
    }

    if (path === '/portal/projects' && req.method === 'GET') {
      const projects = await supabaseRequest('business_projects', { query: 'select=*&order=updated_at.desc' });
      return { status: 200, data: { projects } };
    }
    if (path === '/portal/projects' && req.method === 'POST') {
      const projects = await supabaseRequest('business_projects', {
        method: 'POST',
        body: cleanPayload({
          user_id: normalizeUserId(body.user_id),
          name: body.name || 'Black Sheep Founder Project',
          idea: body.idea || '',
          audience: body.audience || '',
          location: body.location || 'United States',
          status: body.status || 'draft',
          current_step: body.current_step || 1,
          progress: body.progress || 0,
          readiness_score: body.readiness_score || 0,
        }),
      });
      return { status: 200, data: { project: projects[0] } };
    }
    if (parts[0] === 'portal' && parts[1] === 'projects' && req.method === 'PATCH') {
      const projects = await supabaseRequest('business_projects', { method: 'PATCH', query: restEq('id', normalizeProjectId(parts[2])), body: cleanPayload({ ...body, updated_at: now() }) });
      return { status: 200, data: { project: projects[0] } };
    }

    if (parts[0] === 'portal' && parts[1] === 'onboarding' && req.method === 'GET') {
      const answers = await supabaseRequest('onboarding_answers', { query: `select=*&${restEq('project_id', normalizeProjectId(parts[2]))}&order=step.asc` });
      return { status: 200, data: { answers } };
    }
    if (path === '/portal/onboarding' && req.method === 'POST') {
      const answers = await supabaseRequest('onboarding_answers', {
        method: 'POST',
        query: 'on_conflict=project_id,step',
        upsert: true,
        body: cleanPayload({ project_id: normalizeProjectId(body.project_id), step: body.step || 1, payload: body.payload || {}, updated_at: now() }),
      });
      return { status: 200, data: { answer: answers[0] } };
    }

    if (parts[0] === 'portal' && parts[1] === 'steps' && req.method === 'GET') {
      const steps = await supabaseRequest('step_progress', { query: `select=*&${restEq('project_id', normalizeProjectId(parts[2]))}&order=updated_at.asc` });
      return { status: 200, data: { steps } };
    }
    if (path === '/portal/steps' && req.method === 'POST') {
      const steps = await supabaseRequest('step_progress', {
        method: 'POST',
        query: 'on_conflict=project_id,step_key',
        upsert: true,
        body: cleanPayload({
          project_id: normalizeProjectId(body.project_id),
          step_key: body.step_key || 'idea',
          progress: body.progress ?? 0,
          status: body.status || 'not_started',
          review_state: body.review_state || 'none',
          updated_at: now(),
        }),
      });
      return { status: 200, data: { step: steps[0] } };
    }

    if (parts[0] === 'portal' && parts[1] === 'assets' && req.method === 'GET') {
      const assets = await supabaseRequest('generated_assets', { query: `select=*&${restEq('project_id', normalizeProjectId(parts[2]))}&order=created_at.desc` });
      return { status: 200, data: { assets } };
    }
    if (path === '/portal/assets' && req.method === 'POST') {
      const assets = await supabaseRequest('generated_assets', {
        method: 'POST',
        body: cleanPayload({
          project_id: normalizeProjectId(body.project_id),
          title: body.title || 'Generated Asset',
          asset_type: body.asset_type || 'general',
          content: body.content || {},
          status: body.status || 'draft',
          updated_at: now(),
        }),
      });
      return { status: 200, data: { asset: assets[0] } };
    }
    if (parts[0] === 'portal' && parts[1] === 'assets' && req.method === 'PATCH') {
      const assets = await supabaseRequest('generated_assets', { method: 'PATCH', query: restEq('id', parts[2]), body: cleanPayload({ ...body, updated_at: now() }) });
      return { status: 200, data: { asset: assets[0] } };
    }

    if (parts[0] === 'portal' && parts[1] === 'modules' && parts[2] === 'runs' && req.method === 'GET') {
      const runs = await supabaseRequest('ai_module_runs', { query: `select=*&${restEq('project_id', normalizeProjectId(parts[3]))}&order=created_at.desc` });
      return { status: 200, data: { runs } };
    }
    if (path === '/portal/modules/runs' && req.method === 'POST') {
      const module = moduleCatalog.find((item) => item.id === String(body.module_id));
      const runs = await supabaseRequest('ai_module_runs', {
        method: 'POST',
        body: cleanPayload({
          module_id: String(body.module_id || '1'),
          project_id: normalizeProjectId(body.project_id),
          input: body.input || {},
          output: body.output || { summary: `${module?.name || 'Module'} output generated.` },
          source: 'live',
        }),
      });
      return { status: 200, data: { run: runs[0] } };
    }

    if (parts[0] === 'portal' && parts[1] === 'reviews' && req.method === 'GET') {
      const tickets = await supabaseRequest('review_tickets', { query: `select=*&${restEq('project_id', normalizeProjectId(parts[2]))}&order=created_at.desc` });
      return { status: 200, data: { tickets } };
    }
    if (path === '/portal/reviews' && req.method === 'POST') {
      const tickets = await supabaseRequest('review_tickets', {
        method: 'POST',
        body: cleanPayload({
          project_id: normalizeProjectId(body.project_id),
          asset_id: isUuid(body.asset_id) ? body.asset_id : null,
          step_key: body.step_key || null,
          status: 'pending',
          admin_note: null,
        }),
      });
      return { status: 200, data: { ticket: tickets[0] } };
    }
    if (parts[0] === 'portal' && parts[1] === 'reviews' && req.method === 'PATCH') {
      const tickets = await supabaseRequest('review_tickets', { method: 'PATCH', query: restEq('id', parts[2]), body: cleanPayload({ ...body, updated_at: now() }) });
      return { status: 200, data: { ticket: tickets[0] } };
    }

    if (parts[0] === 'portal' && parts[1] === 'support' && parts[2] === 'threads' && req.method === 'GET') {
      const threads = await supabaseRequest('support_threads', { query: `select=*&${restEq('project_id', normalizeProjectId(parts[3]))}&order=created_at.desc` });
      return { status: 200, data: { threads } };
    }
    if (path === '/portal/support/threads' && req.method === 'POST') {
      const threads = await supabaseRequest('support_threads', {
        method: 'POST',
        body: cleanPayload({
          project_id: normalizeProjectId(body.project_id),
          subject: body.subject || 'Support request',
          priority: body.priority || 'medium',
          status: body.status || 'open',
          created_by: normalizeUserId(body.created_by),
        }),
      });
      return { status: 200, data: { thread: threads[0] } };
    }
    if (parts[0] === 'portal' && parts[1] === 'support' && parts[2] === 'threads' && req.method === 'PATCH') {
      const threads = await supabaseRequest('support_threads', { method: 'PATCH', query: restEq('id', parts[3]), body: cleanPayload({ ...body, updated_at: now() }) });
      return { status: 200, data: { thread: threads[0] } };
    }
    if (parts[0] === 'portal' && parts[1] === 'support' && parts[2] === 'messages' && req.method === 'GET') {
      const messages = await supabaseRequest('support_messages', { query: `select=*&${restEq('thread_id', parts[3])}&order=created_at.asc` });
      return { status: 200, data: { messages } };
    }
    if (path === '/portal/support/messages' && req.method === 'POST' && isUuid(body.thread_id)) {
      const messages = await supabaseRequest('support_messages', {
        method: 'POST',
        body: cleanPayload({
          thread_id: body.thread_id,
          sender_id: normalizeUserId(body.sender_id),
          sender_role: body.sender_role || 'client',
          body: body.body || '',
        }),
      });
      return { status: 200, data: { message: messages[0] } };
    }

    if (parts[0] === 'portal' && parts[1] === 'marketplace' && parts[2] === 'orders' && req.method === 'GET') {
      const orders = await supabaseRequest('marketplace_orders', { query: `select=*&${restEq('project_id', normalizeProjectId(parts[3]))}&order=created_at.desc` });
      return { status: 200, data: { orders } };
    }
    if (path === '/portal/marketplace/orders' && req.method === 'POST') {
      const orders = await supabaseRequest('marketplace_orders', {
        method: 'POST',
        body: cleanPayload({
          listing_id: isUuid(body.listing_id) ? body.listing_id : null,
          project_id: normalizeProjectId(body.project_id),
          requester_id: normalizeUserId(body.requester_id),
          status: body.status || 'requested',
          note: body.note || null,
        }),
      });
      return { status: 200, data: { order: orders[0] } };
    }

    if (parts[0] === 'portal' && parts[1] === 'documents' && req.method === 'GET') {
      const documents = await supabaseRequest('documents', { query: `select=*&${restEq('project_id', normalizeProjectId(parts[2]))}&order=created_at.desc` });
      return { status: 200, data: { documents } };
    }
    if (path === '/portal/documents' && req.method === 'POST') {
      const documents = await supabaseRequest('documents', {
        method: 'POST',
        body: cleanPayload({
          project_id: normalizeProjectId(body.project_id),
          asset_id: isUuid(body.asset_id) ? body.asset_id : null,
          name: body.name || 'Generated Document',
          document_type: body.document_type || 'general',
          uri: body.uri || null,
          status: body.status || 'ready',
        }),
      });
      return { status: 200, data: { document: documents[0] } };
    }

    if (path === '/portal/notifications' && req.method === 'GET') {
      const notifications = await supabaseRequest('notifications', { query: 'select=*&order=created_at.desc' });
      return { status: 200, data: { notifications } };
    }
    if (path === '/portal/notifications' && req.method === 'POST') {
      const notifications = await supabaseRequest('notifications', { method: 'POST', body: cleanPayload({ user_id: normalizeUserId(body.user_id), title: body.title || 'Notification', body: body.body || '', read: false }) });
      return { status: 200, data: { notification: notifications[0] } };
    }
    if (parts[0] === 'portal' && parts[1] === 'notifications' && parts[3] === 'read' && req.method === 'PATCH') {
      const notifications = await supabaseRequest('notifications', { method: 'PATCH', query: restEq('id', parts[2]), body: { read: true, read_at: now() } });
      return { status: 200, data: { notification: notifications[0] } };
    }

    if (parts[0] === 'portal' && parts[1] === 'activity' && req.method === 'GET') {
      const activity = await supabaseRequest('activity_logs', { query: `select=*&${restEq('project_id', normalizeProjectId(parts[2]))}&order=created_at.desc` });
      return { status: 200, data: { activity } };
    }
    if (path === '/portal/activity' && req.method === 'POST') {
      const activity = await supabaseRequest('activity_logs', {
        method: 'POST',
        body: cleanPayload({
          project_id: normalizeProjectId(body.project_id),
          actor_id: normalizeUserId(body.actor_id),
          actor_role: body.actor_role || 'client',
          action_type: body.action_type || 'event',
          title: body.title || 'Activity',
          detail: body.detail || '',
          metadata: body.metadata || {},
        }),
      });
      return { status: 200, data: { activity: activity[0] } };
    }

    if (parts[0] === 'portal' && parts[1] === 'admin-notes' && req.method === 'GET') {
      const notes = await supabaseRequest('admin_notes', { query: `select=*&${restEq('project_id', normalizeProjectId(parts[2]))}&order=created_at.desc` });
      return { status: 200, data: { notes } };
    }
    if (path === '/portal/admin-notes' && req.method === 'POST') {
      const notes = await supabaseRequest('admin_notes', {
        method: 'POST',
        body: cleanPayload({
          project_id: normalizeProjectId(body.project_id),
          review_ticket_id: isUuid(body.review_ticket_id) ? body.review_ticket_id : null,
          admin_id: normalizeUserId(body.admin_id),
          note: body.note || '',
          visibility: body.visibility || 'internal',
        }),
      });
      return { status: 200, data: { note: notes[0] } };
    }

    if (path === '/portal/pricing-plans') {
      const plans = await supabaseRequest('pricing_plans', { query: 'select=*&order=position.asc' });
      return { status: 200, data: { plans } };
    }
    if (path === '/portal/subscriptions') {
      const subscriptions = await supabaseRequest('subscriptions', { query: 'select=*&order=created_at.desc' });
      return { status: 200, data: { subscriptions } };
    }
    if (path === '/tools' && req.method === 'GET') {
      const tools = await supabaseRequest('ai_modules', { query: 'select=*&order=id.asc' });
      return { status: 200, data: { tools } };
    }
  } catch (error) {
    console.error('[preview-api] Supabase fallback:', error.message || error);
    return null;
  }

  return null;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return send(res, 200, { ok: true });

  const raw = req.query.path || [];
  const parts = (Array.isArray(raw) ? raw : [raw])
    .flatMap((part) => String(part).split('/'))
    .filter(Boolean);
  const path = `/${parts.join('/')}`;
  const body = getBody(req);

  try {
    const live = await handleSupabase(req, parts, path, body);
    if (live) return send(res, live.status, live.data);

    if (path === '/health') return send(res, 200, { status: 'ok', mode: 'vercel-preview', at: now() });

    if (path === '/auth/login' && req.method === 'POST') {
      return send(res, 200, { token: 'preview-token', user: state.users[0] });
    }
    if (path === '/auth/register' && req.method === 'POST') {
      const user = { ...state.users[0], id: randomUUID(), email: body.email || `user-${Date.now()}@preview.local`, name: body.name || 'Preview User', created_at: now(), updated_at: now() };
      state.users.unshift(user);
      return send(res, 200, { token: 'preview-token', user });
    }
    if (path === '/auth/me' && req.method === 'GET') return send(res, 200, { user: state.users[0] });
    if (path === '/auth/profile' && req.method === 'PATCH') {
      Object.assign(state.users[0], body, { updated_at: now() });
      return send(res, 200, { user: state.users[0] });
    }

    if (path === '/businesses/generate' && req.method === 'POST') {
      return send(res, 200, { blueprint: blueprint(body), saved: true, source: 'preview' });
    }
    if (path === '/businesses/marketplace/listings' && req.method === 'GET') {
      return send(res, 200, { listings: [
        { id: 'l1', title: 'Done-For-You Launch Blueprint', category: 'Done-for-You Packages', description: 'CGWS team builds and launches complete funnel.', price: '$1,999', status: 'active' },
        { id: 'l2', title: 'Funding Prep Intensive', category: 'Funding Prep', description: 'Readiness audit plus lender pack support.', price: '$599', status: 'active' },
        { id: 'l3', title: 'Brand Sprint', category: 'Branding', description: 'Name, positioning, and visual direction in 72h.', price: '$399', status: 'active' },
      ] });
    }

    if (path === '/portal/projects' && req.method === 'GET') return send(res, 200, { projects: state.projects });
    if (path === '/portal/projects' && req.method === 'POST') {
      const project = { id: body.id || randomUUID(), user_id: demoUserId, name: body.name || 'Untitled Project', idea: body.idea || '', audience: body.audience || '', location: body.location || '', status: body.status || 'draft', current_step: body.current_step || 1, progress: body.progress || 0, readiness_score: body.readiness_score || 0, created_at: now(), updated_at: now() };
      state.projects.unshift(project);
      return send(res, 200, { project });
    }
    if (parts[0] === 'portal' && parts[1] === 'projects' && req.method === 'PATCH') {
      const project = state.projects.find((item) => item.id === parts[2]) || state.projects[0];
      Object.assign(project, body, { updated_at: now() });
      return send(res, 200, { project });
    }

    if (parts[0] === 'portal' && parts[1] === 'onboarding' && req.method === 'GET') return send(res, 200, { answers: listByProject(state.onboarding, parts[2]) });
    if (path === '/portal/onboarding' && req.method === 'POST') {
      const existing = state.onboarding.find((item) => item.project_id === body.project_id && item.step === body.step);
      const answer = existing || { id: randomUUID(), project_id: body.project_id, step: body.step, created_at: now() };
      Object.assign(answer, { payload: body.payload || {}, updated_at: now() });
      if (!existing) state.onboarding.unshift(answer);
      return send(res, 200, { answer });
    }

    if (parts[0] === 'portal' && parts[1] === 'steps' && req.method === 'GET') return send(res, 200, { steps: listByProject(state.steps, parts[2]) });
    if (path === '/portal/steps' && req.method === 'POST') {
      const step = state.steps.find((item) => item.project_id === body.project_id && item.step_key === body.step_key) || { id: randomUUID(), project_id: body.project_id, step_key: body.step_key };
      Object.assign(step, { progress: body.progress ?? 0, status: body.status || 'not_started', review_state: body.review_state || 'none', updated_at: now() });
      if (!state.steps.includes(step)) state.steps.unshift(step);
      return send(res, 200, { step });
    }

    if (parts[0] === 'portal' && parts[1] === 'assets' && req.method === 'GET') return send(res, 200, { assets: listByProject(state.assets, parts[2]) });
    if (path === '/portal/assets' && req.method === 'POST') {
      const asset = { id: body.id || randomUUID(), project_id: body.project_id || projectId, title: body.title || 'Generated Asset', asset_type: body.asset_type || 'general', content: body.content || {}, status: body.status || 'draft', created_at: now(), updated_at: now() };
      state.assets.unshift(asset);
      return send(res, 200, { asset });
    }
    if (parts[0] === 'portal' && parts[1] === 'assets' && req.method === 'PATCH') {
      const asset = state.assets.find((item) => item.id === parts[2]) || state.assets[0];
      Object.assign(asset, body, { updated_at: now() });
      return send(res, 200, { asset });
    }

    if (parts[0] === 'portal' && parts[1] === 'modules' && parts[2] === 'runs' && req.method === 'GET') return send(res, 200, { runs: listByProject(state.runs, parts[3]) });
    if (path === '/portal/modules/runs' && req.method === 'POST') {
      const module = moduleCatalog.find((item) => item.id === String(body.module_id));
      const run = { id: randomUUID(), module_id: String(body.module_id || '1'), project_id: body.project_id || projectId, input: body.input || {}, output: body.output || { summary: `${module?.name || 'Module'} output generated.` }, created_at: now() };
      state.runs.unshift(run);
      return send(res, 200, { run });
    }

    if (parts[0] === 'portal' && parts[1] === 'reviews' && req.method === 'GET') return send(res, 200, { tickets: listByProject(state.reviews, parts[2]) });
    if (path === '/portal/reviews' && req.method === 'POST') {
      const ticket = { id: randomUUID(), project_id: body.project_id || projectId, asset_id: body.asset_id || null, step_key: body.step_key || null, status: 'pending', admin_note: null, created_at: now(), updated_at: now() };
      state.reviews.unshift(ticket);
      return send(res, 200, { ticket });
    }
    if (parts[0] === 'portal' && parts[1] === 'reviews' && req.method === 'PATCH') {
      const ticket = state.reviews.find((item) => item.id === parts[2]) || state.reviews[0];
      Object.assign(ticket, body, { updated_at: now() });
      return send(res, 200, { ticket });
    }

    if (parts[0] === 'portal' && parts[1] === 'support' && parts[2] === 'threads' && req.method === 'GET') return send(res, 200, { threads: listByProject(state.supportThreads, parts[3]) });
    if (path === '/portal/support/threads' && req.method === 'POST') {
      const thread = { id: randomUUID(), project_id: body.project_id || projectId, subject: body.subject || 'Support request', priority: body.priority || 'medium', status: body.status || 'open', created_at: now(), updated_at: now() };
      state.supportThreads.unshift(thread);
      return send(res, 200, { thread });
    }
    if (parts[0] === 'portal' && parts[1] === 'support' && parts[2] === 'threads' && req.method === 'PATCH') {
      const thread = state.supportThreads.find((item) => item.id === parts[3]) || state.supportThreads[0];
      Object.assign(thread, body, { updated_at: now() });
      return send(res, 200, { thread });
    }
    if (parts[0] === 'portal' && parts[1] === 'support' && parts[2] === 'messages' && req.method === 'GET') {
      return send(res, 200, { messages: state.supportMessages.filter((item) => item.thread_id === parts[3]) });
    }
    if (path === '/portal/support/messages' && req.method === 'POST') {
      const message = { id: randomUUID(), thread_id: body.thread_id, sender_id: demoUserId, sender_role: body.sender_role || 'client', body: body.body || '', created_at: now() };
      state.supportMessages.push(message);
      return send(res, 200, { message });
    }

    if (parts[0] === 'portal' && parts[1] === 'marketplace' && parts[2] === 'orders' && req.method === 'GET') return send(res, 200, { orders: listByProject(state.marketplaceOrders, parts[3]) });
    if (path === '/portal/marketplace/orders' && req.method === 'POST') {
      const order = { id: randomUUID(), listing_id: body.listing_id || null, project_id: body.project_id || projectId, requester_id: demoUserId, status: body.status || 'requested', note: body.note || null, created_at: now(), updated_at: now() };
      state.marketplaceOrders.unshift(order);
      return send(res, 200, { order });
    }

    if (parts[0] === 'portal' && parts[1] === 'documents' && req.method === 'GET') return send(res, 200, { documents: listByProject(state.documents, parts[2]) });
    if (path === '/portal/documents' && req.method === 'POST') {
      const document = { id: randomUUID(), project_id: body.project_id || projectId, asset_id: body.asset_id || null, name: body.name || 'Generated Document', document_type: body.document_type || 'general', uri: body.uri || null, status: body.status || 'ready', created_at: now(), updated_at: now() };
      state.documents.unshift(document);
      return send(res, 200, { document });
    }

    if (path === '/portal/notifications' && req.method === 'GET') return send(res, 200, { notifications: state.notifications });
    if (path === '/portal/notifications' && req.method === 'POST') {
      const notification = { id: randomUUID(), user_id: demoUserId, title: body.title || 'Notification', body: body.body || '', read: false, created_at: now() };
      state.notifications.unshift(notification);
      return send(res, 200, { notification });
    }
    if (parts[0] === 'portal' && parts[1] === 'notifications' && parts[3] === 'read' && req.method === 'PATCH') {
      const notification = state.notifications.find((item) => item.id === parts[2]) || state.notifications[0];
      notification.read = true;
      return send(res, 200, { notification });
    }

    if (parts[0] === 'portal' && parts[1] === 'activity' && req.method === 'GET') return send(res, 200, { activity: listByProject(state.activity, parts[2]) });
    if (path === '/portal/activity' && req.method === 'POST') {
      const activity = { id: randomUUID(), project_id: body.project_id || projectId, actor_id: demoUserId, actor_role: body.actor_role || 'client', action_type: body.action_type || 'event', title: body.title || 'Activity', detail: body.detail || '', metadata: body.metadata || {}, created_at: now() };
      state.activity.unshift(activity);
      return send(res, 200, { activity });
    }

    if (parts[0] === 'portal' && parts[1] === 'admin-notes' && req.method === 'GET') return send(res, 200, { notes: listByProject(state.adminNotes, parts[2]) });
    if (path === '/portal/admin-notes' && req.method === 'POST') {
      const note = { id: randomUUID(), project_id: body.project_id || projectId, review_ticket_id: body.review_ticket_id || null, admin_id: demoUserId, note: body.note || '', visibility: body.visibility || 'internal', created_at: now() };
      state.adminNotes.unshift(note);
      return send(res, 200, { note });
    }
    if (path === '/portal/pricing-plans') return send(res, 200, { plans: [
      { id: 'free', name: 'Free', price: 0, features: ['Preview access'] },
      { id: 'premium', name: 'Premium', price: 199, features: ['Launch Road', 'AI modules', 'Support'] },
    ] });
    if (path === '/portal/subscriptions') return send(res, 200, { subscriptions: [{ id: 'sub-1', user_id: demoUserId, status: 'active', plan: 'premium' }] });

    if (path === '/models' && req.method === 'GET') return send(res, 200, { models: [{ id: 'preview-ai', name: 'Preview AI', free: true }] });
    if (path === '/tools' && req.method === 'GET') return send(res, 200, { tools: moduleCatalog });
    if (parts[0] === 'tools' && parts[2] === 'run' && req.method === 'POST') return send(res, 200, { result: `Preview output for ${body.input || 'tool run'}.`, output: { summary: 'Tool run completed.' } });
    if (path === '/tools/history') return send(res, 200, { history: state.runs });

    if (path === '/chat/conversations' && req.method === 'GET') return send(res, 200, { conversations: state.conversations });
    if (path === '/chat/conversations' && req.method === 'POST') {
      const conversation = { id: randomUUID(), title: body.title || 'Preview Conversation', model: body.model || 'preview-ai', created_at: now(), updated_at: now() };
      state.conversations.unshift(conversation);
      state.messages[conversation.id] = [];
      return send(res, 200, { conversation });
    }
    if (parts[0] === 'chat' && parts[1] === 'conversations' && parts[3] === 'messages' && req.method === 'GET') return send(res, 200, { messages: state.messages[parts[2]] || [] });
    if (parts[0] === 'chat' && parts[1] === 'conversations' && parts[3] === 'messages' && req.method === 'POST') {
      const messages = state.messages[parts[2]] || (state.messages[parts[2]] = []);
      const userMessage = { id: randomUUID(), role: 'user', content: body.content || '', created_at: now() };
      const assistantMessage = { id: randomUUID(), role: 'assistant', content: 'Preview AI response generated for the client demo.', created_at: now() };
      messages.push(userMessage, assistantMessage);
      return send(res, 200, { message: assistantMessage, messages });
    }
    if (parts[0] === 'chat' && parts[1] === 'conversations' && req.method === 'PATCH') {
      const conversation = state.conversations.find((item) => item.id === parts[2]);
      if (conversation) Object.assign(conversation, body, { updated_at: now() });
      return send(res, 200, { conversation });
    }
    if (parts[0] === 'chat' && parts[1] === 'conversations' && req.method === 'DELETE') {
      state.conversations = state.conversations.filter((item) => item.id !== parts[2]);
      delete state.messages[parts[2]];
      return send(res, 200, { success: true });
    }
    if (path === '/chat' && req.method === 'POST') return send(res, 200, { response: 'Preview AI response generated for the client demo.' });

    if (path === '/image/styles') return send(res, 200, { styles: ['cinematic', 'premium', 'studio'] });
    if (path === '/image/history') return send(res, 200, { images: [] });
    if (path === '/image/generate' && req.method === 'POST') return send(res, 200, { image: { id: randomUUID(), prompt: body.prompt || '', url: 'https://placehold.co/1024x768/111111/c8102e?text=THE+SHEEP+Preview' } });

    if (path === '/subscriptions/plans') return send(res, 200, { plans: [{ id: 'free', name: 'Free', price: 0 }, { id: 'premium', name: 'Premium', price: 199 }] });
    if (path === '/subscriptions/payment-methods') return send(res, 200, { methods: ['card', 'manual'] });
    if (path === '/subscriptions/my-payments') return send(res, 200, { payments: state.payments });
    if (path === '/subscriptions/payment-request' && req.method === 'POST') {
      const payment = { id: randomUUID(), ...body, status: 'pending', created_at: now() };
      state.payments.unshift(payment);
      return send(res, 200, { payment });
    }

    if (path === '/services' && req.method === 'POST') return send(res, 200, { request: { id: randomUUID(), ...body, status: 'received', created_at: now() } });

    if (path === '/admin/stats') return send(res, 200, { stats: { users: state.users.length, payments: state.payments.length, revenue: 0, activeProjects: state.projects.length } });
    if (path === '/admin/payments') return send(res, 200, { payments: state.payments });
    if (path === '/admin/users') return send(res, 200, { users: state.users });
    if (path === '/admin/analytics') return send(res, 200, { labels: ['Mon', 'Tue', 'Wed'], runs: [12, 19, 24], users: [3, 5, 8] });
    if (parts[0] === 'admin' && parts[1] === 'payments' && req.method === 'POST') return send(res, 200, { success: true });
    if (parts[0] === 'admin' && parts[1] === 'users' && req.method === 'PATCH') return send(res, 200, { success: true });

    return send(res, 404, { error: 'Preview endpoint not found', path });
  } catch (error) {
    return send(res, 500, { error: error.message || 'Preview API error' });
  }
}
