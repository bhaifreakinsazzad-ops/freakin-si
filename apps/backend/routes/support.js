/**
 * Engine NotREAL — Support Tickets API
 * Uses unified db client: persists to Supabase when configured, memdb otherwise.
 */

const express = require('express')
const router = express.Router()
const { randomBytes } = require('crypto')
const { db, isUsingSupabase } = require('../lib/db')

const genId = () => `ENR-${randomBytes(4).toString('hex').toUpperCase()}`

// In-memory fallback store for health check / memdb mode
const TICKETS = []

const VALID_CATEGORIES = [
  'business-problem',
  'ai-tool-issue',
  'service-request',
  'payment-checkout',
  'marketplace-listing',
  'crm-project-issue',
  'account-login',
  'other',
]

const VALID_PRIORITIES = ['low', 'medium', 'high', 'urgent']

function validate(body) {
  const errors = []
  if (!body.name || body.name.trim().length < 2) errors.push('name is required (min 2 chars)')
  if (!body.email || !body.email.includes('@')) errors.push('valid email is required')
  if (!body.category || !VALID_CATEGORIES.includes(body.category)) errors.push(`category must be one of: ${VALID_CATEGORIES.join(', ')}`)
  if (!body.message || body.message.trim().length < 10) errors.push('message is required (min 10 chars)')
  return errors
}

/**
 * POST /api/support/tickets
 */
router.post('/tickets', async (req, res) => {
  const errors = validate(req.body)
  if (errors.length) {
    return res.status(400).json({ error: 'Validation failed', details: errors })
  }

  const ticket = {
    id: genId(),
    name: req.body.name.trim(),
    email: req.body.email.trim().toLowerCase(),
    business_name: (req.body.businessName || '').trim() || null,
    category: req.body.category,
    priority: VALID_PRIORITIES.includes(req.body.priority) ? req.body.priority : 'medium',
    message: req.body.message.trim(),
    preferred_contact: req.body.preferredContact || 'email',
    budget_range: req.body.budgetRange || null,
    timeline: req.body.timeline || null,
    status: 'open',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  if (isUsingSupabase()) {
    const { data, error } = await db.from('support_tickets').insert(ticket).select().single()
    if (error) {
      console.error('[support] Supabase insert error:', error.message)
      // Fall through to memdb so the user still gets a response
    } else {
      // Normalise response shape for frontend
      const out = { ...data, businessName: data.business_name, preferredContact: data.preferred_contact }
      return res.status(201).json({ success: true, ticket: out, message: 'Ticket created. We will respond within 24 hours.', persisted: true })
    }
  }

  // memdb path (or Supabase failed)
  const memTicket = { ...ticket, businessName: ticket.business_name, preferredContact: ticket.preferred_contact }
  TICKETS.unshift(memTicket)
  res.status(201).json({ success: true, ticket: memTicket, message: 'Ticket created. We will respond within 24 hours.', persisted: false })
})

/**
 * GET /api/support/tickets
 */
router.get('/tickets', async (req, res) => {
  if (isUsingSupabase()) {
    const { data, error } = await db.from('support_tickets').select('*').order('created_at', { ascending: false })
    if (!error) {
      return res.json({ tickets: data || [], total: (data || []).length, mode: 'supabase' })
    }
    console.error('[support] Supabase fetch error:', error.message)
  }
  res.json({ tickets: TICKETS, total: TICKETS.length, mode: 'memdb' })
})

/**
 * GET /api/support/tickets/:id
 */
router.get('/tickets/:id', async (req, res) => {
  if (isUsingSupabase()) {
    const { data, error } = await db.from('support_tickets').select('*').eq('id', req.params.id).single()
    if (!error && data) return res.json({ ticket: data })
  }
  const ticket = TICKETS.find(t => t.id === req.params.id)
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' })
  res.json({ ticket })
})

/**
 * PATCH /api/support/tickets/:id
 * Update ticket status (admin use)
 */
router.patch('/tickets/:id', async (req, res) => {
  const { status } = req.body
  const allowed = ['open', 'in-progress', 'resolved', 'closed']
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${allowed.join(', ')}` })
  }

  if (isUsingSupabase()) {
    const { data, error } = await db.from('support_tickets')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select().single()
    if (!error && data) return res.json({ success: true, ticket: data })
    if (error) console.error('[support] Supabase update error:', error.message)
  }

  const ticket = TICKETS.find(t => t.id === req.params.id)
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' })
  ticket.status = status
  ticket.updated_at = new Date().toISOString()
  res.json({ success: true, ticket })
})

module.exports = router
module.exports.TICKETS = TICKETS // exported for health check
