/**
 * Engine NotREAL — Orders API
 * Handles manual payment orders (bKash / Nagad / bank transfer / Stripe future).
 * Persists to Supabase when configured, memdb otherwise.
 */

const express = require('express')
const router = express.Router()
const { randomBytes } = require('crypto')
const { db, isUsingSupabase } = require('../lib/db')
const { authenticateToken } = require('../middleware/auth')

const genOrderId = () => `ORD-${randomBytes(5).toString('hex').toUpperCase()}`

// In-memory fallback
const ORDERS = []

const VALID_PAYMENT_METHODS = ['bkash', 'nagad', 'rocket', 'bank_transfer', 'stripe', 'manual']
const VALID_STATUSES = ['pending', 'payment_submitted', 'confirmed', 'processing', 'completed', 'cancelled', 'refunded']

function validateOrder(body) {
  const errors = []
  if (!body.planId && !body.serviceId && !body.description) errors.push('planId, serviceId, or description is required')
  if (!body.customerName || body.customerName.trim().length < 2) errors.push('customerName is required')
  if (!body.customerEmail || !body.customerEmail.includes('@')) errors.push('valid customerEmail is required')
  if (!body.amount || isNaN(Number(body.amount)) || Number(body.amount) <= 0) errors.push('amount must be a positive number')
  if (!body.currency) errors.push('currency is required (e.g. BDT, USD)')
  if (body.paymentMethod && !VALID_PAYMENT_METHODS.includes(body.paymentMethod)) {
    errors.push(`paymentMethod must be one of: ${VALID_PAYMENT_METHODS.join(', ')}`)
  }
  return errors
}

/**
 * POST /api/orders
 * Create a new order (checkout → manual payment)
 */
router.post('/', async (req, res) => {
  const errors = validateOrder(req.body)
  if (errors.length) {
    return res.status(400).json({ error: 'Validation failed', details: errors })
  }

  const order = {
    id: genOrderId(),
    plan_id: req.body.planId || null,
    service_id: req.body.serviceId || null,
    description: (req.body.description || '').trim() || null,
    customer_name: req.body.customerName.trim(),
    customer_email: req.body.customerEmail.trim().toLowerCase(),
    customer_phone: (req.body.customerPhone || '').trim() || null,
    business_name: (req.body.businessName || '').trim() || null,
    amount: Number(req.body.amount),
    currency: (req.body.currency || 'BDT').toUpperCase(),
    payment_method: req.body.paymentMethod || 'manual',
    payment_reference: (req.body.paymentReference || '').trim() || null,
    notes: (req.body.notes || '').trim() || null,
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  if (isUsingSupabase()) {
    const { data, error } = await db.from('orders').insert(order).select().single()
    if (error) {
      console.error('[orders] Supabase insert error:', error.message)
      // Fall through to memdb so user still gets a confirmation
    } else {
      return res.status(201).json({
        success: true,
        order: normalise(data),
        message: 'Order created. Please complete your payment and submit the reference number.',
        persisted: true,
      })
    }
  }

  ORDERS.unshift(order)
  res.status(201).json({
    success: true,
    order: normalise(order),
    message: 'Order created. Please complete your payment and submit the reference number.',
    persisted: false,
  })
})

/**
 * POST /api/orders/:id/submit-payment
 * Customer submits their bKash/Nagad transaction ID
 */
router.post('/:id/submit-payment', async (req, res) => {
  const { paymentReference, paymentMethod } = req.body
  if (!paymentReference || paymentReference.trim().length < 4) {
    return res.status(400).json({ error: 'paymentReference is required (your bKash/Nagad TxnID)' })
  }

  const updates = {
    payment_reference: paymentReference.trim(),
    payment_method: paymentMethod || 'manual',
    status: 'payment_submitted',
    updated_at: new Date().toISOString(),
  }

  if (isUsingSupabase()) {
    const { data, error } = await db.from('orders')
      .update(updates)
      .eq('id', req.params.id)
      .select().single()
    if (!error && data) return res.json({ success: true, order: normalise(data), message: 'Payment reference received. We will confirm within 2-4 hours.' })
    if (error) console.error('[orders] Supabase update error:', error.message)
  }

  const order = ORDERS.find(o => o.id === req.params.id)
  if (!order) return res.status(404).json({ error: 'Order not found' })
  Object.assign(order, updates)
  res.json({ success: true, order: normalise(order), message: 'Payment reference received. We will confirm within 2-4 hours.' })
})

/**
 * GET /api/orders
 * List orders — authenticated users see their own; admins see all
 */
router.get('/', authenticateToken, async (req, res) => {
  const isAdmin = req.user?.is_admin || (process.env.ADMIN_EMAILS || '').split(',').includes(req.user?.email || '')

  if (isUsingSupabase()) {
    let query = db.from('orders').select('*').order('created_at', { ascending: false })
    if (!isAdmin) query = query.eq('customer_email', req.user.email)
    const { data, error } = await query
    if (!error) return res.json({ orders: (data || []).map(normalise), total: (data || []).length, mode: 'supabase' })
    console.error('[orders] Supabase fetch error:', error.message)
  }

  const orders = isAdmin ? ORDERS : ORDERS.filter(o => o.customer_email === req.user?.email)
  res.json({ orders: orders.map(normalise), total: orders.length, mode: 'memdb' })
})

/**
 * GET /api/orders/:id
 */
router.get('/:id', authenticateToken, async (req, res) => {
  if (isUsingSupabase()) {
    const { data, error } = await db.from('orders').select('*').eq('id', req.params.id).single()
    if (!error && data) return res.json({ order: normalise(data) })
    if (error) console.error('[orders] Supabase fetch error:', error.message)
  }
  const order = ORDERS.find(o => o.id === req.params.id)
  if (!order) return res.status(404).json({ error: 'Order not found' })
  res.json({ order: normalise(order) })
})

/**
 * PATCH /api/orders/:id/status
 * Admin updates order status
 */
router.patch('/:id/status', authenticateToken, async (req, res) => {
  const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim())
  const isAdmin = req.user?.is_admin || adminEmails.includes(req.user?.email || '')
  if (!isAdmin) return res.status(403).json({ error: 'Admin access required' })

  const { status, notes } = req.body
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` })
  }

  const updates = { status, updated_at: new Date().toISOString() }
  if (notes) updates.notes = notes

  if (isUsingSupabase()) {
    const { data, error } = await db.from('orders').update(updates).eq('id', req.params.id).select().single()
    if (!error && data) return res.json({ success: true, order: normalise(data) })
    if (error) console.error('[orders] Supabase update error:', error.message)
  }

  const order = ORDERS.find(o => o.id === req.params.id)
  if (!order) return res.status(404).json({ error: 'Order not found' })
  Object.assign(order, updates)
  res.json({ success: true, order: normalise(order) })
})

// Normalise snake_case DB fields to camelCase for frontend
function normalise(o) {
  if (!o) return o
  return {
    ...o,
    planId: o.plan_id,
    serviceId: o.service_id,
    customerName: o.customer_name,
    customerEmail: o.customer_email,
    customerPhone: o.customer_phone,
    businessName: o.business_name,
    paymentMethod: o.payment_method,
    paymentReference: o.payment_reference,
    createdAt: o.created_at,
    updatedAt: o.updated_at,
  }
}

module.exports = router
module.exports.ORDERS = ORDERS
