const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const { supabase, authenticateToken, requireAdmin } = require('../middleware/auth');

const nowIso = () => new Date().toISOString();

function asArray(x) { return Array.isArray(x) ? x : []; }

router.use(authenticateToken);

// Projects
router.get('/projects', async (req, res) => {
  const { data, error } = await supabase.from('business_projects').select('*').eq('user_id', req.user.id).order('updated_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ projects: asArray(data) });
});

router.post('/projects', async (req, res) => {
  const payload = req.body || {};
  const { data, error } = await supabase.from('business_projects').insert({
    id: payload.id || uuidv4(),
    user_id: req.user.id,
    name: payload.name || 'Untitled Project',
    idea: payload.idea || '',
    audience: payload.audience || '',
    location: payload.location || '',
    status: payload.status || 'draft',
    current_step: payload.current_step || 1,
    progress: payload.progress || 0,
    readiness_score: payload.readiness_score || 0,
    created_at: nowIso(),
    updated_at: nowIso(),
  }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ project: data });
});

router.patch('/projects/:id', async (req, res) => {
  const { data, error } = await supabase.from('business_projects').update({ ...req.body, updated_at: nowIso() }).eq('id', req.params.id).eq('user_id', req.user.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ project: data });
});

// Onboarding
router.get('/onboarding/:projectId', async (req, res) => {
  const { data, error } = await supabase.from('onboarding_answers').select('*').eq('project_id', req.params.projectId).order('step', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ answers: asArray(data) });
});

router.post('/onboarding', async (req, res) => {
  const { project_id, step, payload } = req.body;
  if (!project_id || !step) return res.status(400).json({ error: 'project_id and step required' });
  const { data: existing } = await supabase.from('onboarding_answers').select('*').eq('project_id', project_id).eq('step', step).maybeSingle();
  if (existing) {
    const { data, error } = await supabase.from('onboarding_answers').update({ payload: payload || {}, updated_at: nowIso() }).eq('id', existing.id).select().single();
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ answer: data });
  }
  const { data, error } = await supabase.from('onboarding_answers').insert({ id: uuidv4(), project_id, step, payload: payload || {}, created_at: nowIso(), updated_at: nowIso() }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ answer: data });
});

// Steps
router.get('/steps/:projectId', async (req, res) => {
  const { data, error } = await supabase.from('step_progress').select('*').eq('project_id', req.params.projectId).order('updated_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ steps: asArray(data) });
});

router.post('/steps', async (req, res) => {
  const { project_id, step_key, progress = 0, status = 'not_started', review_state = 'none' } = req.body;
  const { data: existing } = await supabase.from('step_progress').select('*').eq('project_id', project_id).eq('step_key', step_key).maybeSingle();
  if (existing) {
    const { data, error } = await supabase.from('step_progress').update({ progress, status, review_state, updated_at: nowIso() }).eq('id', existing.id).select().single();
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ step: data });
  }
  const { data, error } = await supabase.from('step_progress').insert({ id: uuidv4(), project_id, step_key, progress, status, review_state, updated_at: nowIso() }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ step: data });
});

// Assets
router.get('/assets/:projectId', async (req, res) => {
  const { data, error } = await supabase.from('generated_assets').select('*').eq('project_id', req.params.projectId).order('updated_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ assets: asArray(data) });
});

router.post('/assets', async (req, res) => {
  const payload = req.body || {};
  const { data, error } = await supabase.from('generated_assets').insert({
    id: payload.id || uuidv4(),
    project_id: payload.project_id,
    title: payload.title,
    asset_type: payload.asset_type,
    content: payload.content || {},
    status: payload.status || 'draft',
    created_at: nowIso(),
    updated_at: nowIso(),
  }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ asset: data });
});

router.patch('/assets/:id', async (req, res) => {
  const { data, error } = await supabase.from('generated_assets').update({ ...req.body, updated_at: nowIso() }).eq('id', req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ asset: data });
});

// Module runs
router.get('/modules/runs/:projectId', async (req, res) => {
  const { data, error } = await supabase.from('ai_module_runs').select('*').eq('project_id', req.params.projectId).order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ runs: asArray(data) });
});

router.post('/modules/runs', async (req, res) => {
  const payload = req.body || {};
  const { data, error } = await supabase.from('ai_module_runs').insert({
    id: uuidv4(),
    module_id: payload.module_id,
    project_id: payload.project_id,
    input: payload.input || {},
    output: payload.output || {},
    created_at: nowIso(),
  }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ run: data });
});

// Reviews
router.get('/reviews/:projectId', async (req, res) => {
  const { data, error } = await supabase.from('review_tickets').select('*').eq('project_id', req.params.projectId).order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ tickets: asArray(data) });
});

router.post('/reviews', async (req, res) => {
  const payload = req.body || {};
  const { data, error } = await supabase.from('review_tickets').insert({
    id: uuidv4(),
    project_id: payload.project_id,
    asset_id: payload.asset_id || null,
    step_key: payload.step_key || null,
    status: 'pending',
    admin_note: payload.admin_note || null,
    created_at: nowIso(),
    updated_at: nowIso(),
  }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ticket: data });
});

router.patch('/reviews/:id', async (req, res) => {
  const { data, error } = await supabase.from('review_tickets').update({ ...req.body, updated_at: nowIso() }).eq('id', req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ticket: data });
});

// Support threads
router.get('/support/threads/:projectId', async (req, res) => {
  const { data, error } = await supabase.from('support_threads').select('*').eq('project_id', req.params.projectId).order('updated_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ threads: asArray(data) });
});

router.post('/support/threads', async (req, res) => {
  const payload = req.body || {};
  const { data, error } = await supabase.from('support_threads').insert({
    id: uuidv4(),
    project_id: payload.project_id,
    subject: payload.subject,
    priority: payload.priority || 'medium',
    status: payload.status || 'open',
    created_at: nowIso(),
    updated_at: nowIso(),
  }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ thread: data });
});

router.patch('/support/threads/:id', async (req, res) => {
  const { data, error } = await supabase.from('support_threads').update({ ...req.body, updated_at: nowIso() }).eq('id', req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ thread: data });
});

// Support messages
router.get('/support/messages/:threadId', async (req, res) => {
  const { data, error } = await supabase.from('support_messages').select('*').eq('thread_id', req.params.threadId).order('created_at', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ messages: asArray(data) });
});

router.post('/support/messages', async (req, res) => {
  const payload = req.body || {};
  const { data, error } = await supabase.from('support_messages').insert({
    id: uuidv4(),
    thread_id: payload.thread_id,
    sender_id: req.user.id,
    sender_role: payload.sender_role || 'client',
    body: payload.body,
    created_at: nowIso(),
  }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  await supabase.from('support_threads').update({ updated_at: nowIso() }).eq('id', payload.thread_id);
  res.json({ message: data });
});

// Marketplace orders
router.get('/marketplace/orders/:projectId', async (req, res) => {
  const { data, error } = await supabase.from('marketplace_orders').select('*').eq('project_id', req.params.projectId).order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ orders: asArray(data) });
});

router.post('/marketplace/orders', async (req, res) => {
  const payload = req.body || {};
  const { data, error } = await supabase.from('marketplace_orders').insert({
    id: uuidv4(),
    listing_id: payload.listing_id || null,
    project_id: payload.project_id,
    requester_id: req.user.id,
    status: payload.status || 'requested',
    note: payload.note || null,
    created_at: nowIso(),
    updated_at: nowIso(),
  }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ order: data });
});

// Documents
router.get('/documents/:projectId', async (req, res) => {
  const { data, error } = await supabase.from('documents').select('*').eq('project_id', req.params.projectId).order('updated_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ documents: asArray(data) });
});

router.post('/documents', async (req, res) => {
  const payload = req.body || {};
  const { data, error } = await supabase.from('documents').insert({
    id: uuidv4(),
    project_id: payload.project_id,
    asset_id: payload.asset_id || null,
    name: payload.name,
    document_type: payload.document_type || 'general',
    uri: payload.uri || null,
    status: payload.status || 'draft',
    created_at: nowIso(),
    updated_at: nowIso(),
  }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ document: data });
});

// Notifications
router.get('/notifications', async (req, res) => {
  const { data, error } = await supabase.from('notifications').select('*').eq('user_id', req.user.id).order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ notifications: asArray(data) });
});

router.post('/notifications', async (req, res) => {
  const payload = req.body || {};
  const { data, error } = await supabase.from('notifications').insert({ id: uuidv4(), user_id: payload.user_id || req.user.id, title: payload.title, body: payload.body, read: false, created_at: nowIso() }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ notification: data });
});

router.patch('/notifications/:id/read', async (req, res) => {
  const { data, error } = await supabase.from('notifications').update({ read: true }).eq('id', req.params.id).eq('user_id', req.user.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ notification: data });
});

// Activity
router.get('/activity/:projectId', async (req, res) => {
  const { data, error } = await supabase.from('activity_logs').select('*').eq('project_id', req.params.projectId).order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ activity: asArray(data) });
});

router.post('/activity', async (req, res) => {
  const payload = req.body || {};
  const { data, error } = await supabase.from('activity_logs').insert({
    id: uuidv4(),
    project_id: payload.project_id,
    actor_id: req.user.id,
    actor_role: payload.actor_role || 'client',
    action_type: payload.action_type || 'event',
    title: payload.title,
    detail: payload.detail || '',
    metadata: payload.metadata || {},
    created_at: nowIso(),
  }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ activity: data });
});

// Admin notes
router.get('/admin-notes/:projectId', requireAdmin, async (req, res) => {
  const { data, error } = await supabase.from('admin_notes').select('*').eq('project_id', req.params.projectId).order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ notes: asArray(data) });
});

router.post('/admin-notes', requireAdmin, async (req, res) => {
  const payload = req.body || {};
  const { data, error } = await supabase.from('admin_notes').insert({
    id: uuidv4(),
    project_id: payload.project_id,
    review_ticket_id: payload.review_ticket_id || null,
    admin_id: req.user.id,
    note: payload.note,
    visibility: payload.visibility || 'internal',
    created_at: nowIso(),
  }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ note: data });
});

// Pricing placeholders
router.get('/pricing-plans', async (req, res) => {
  const { data } = await supabase.from('pricing_plans').select('*').order('position', { ascending: true });
  res.json({ plans: asArray(data) });
});

router.get('/subscriptions', async (req, res) => {
  const { data } = await supabase.from('subscriptions').select('*').eq('user_id', req.user.id).order('created_at', { ascending: false });
  res.json({ subscriptions: asArray(data) });
});

module.exports = router;
