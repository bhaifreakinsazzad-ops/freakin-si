/**
 * BhaiFreakin'sBI — Service Requests
 * POST /api/services        — Submit a service request (costs 5 credits)
 * GET  /api/services        — List user's service requests
 */

const express = require('express');
const router  = express.Router();
const { supabase, authenticateToken } = require('../middleware/auth');

const SERVICE_TYPES = ['ads', 'dev', 'design', 'copy', 'seo', 'social'];
const CREDIT_COST   = 5;

// ── Submit Service Request ─────────────────────────────────────────────────
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      service_type, name, email, business_name,
      description, budget, deadline, references_url,
    } = req.body;

    if (!service_type || !SERVICE_TYPES.includes(service_type)) {
      return res.status(400).json({ error: 'Valid service_type required: ads, dev, design, copy, seo, social' });
    }
    if (!description || description.trim().length < 10) {
      return res.status(400).json({ error: 'Description must be at least 10 characters.' });
    }

    // Insert service request
    const { data: saved, error: dbErr } = await supabase
      .from('service_requests')
      .insert({
        user_id:       req.user.id,
        service_type,
        name:          name || req.user.name || '',
        email:         email || req.user.email || '',
        business_name: business_name || '',
        description:   description.trim(),
        budget:        budget || '',
        deadline:      deadline || '',
        references_url:references_url || '',
        status:        'pending',
      })
      .select()
      .single();

    if (dbErr) {
      console.error('Service request DB error:', dbErr);
      return res.status(500).json({ error: 'Failed to save service request. Please try again.' });
    }

    res.json({ success: true, request: saved, creditsUsed: CREDIT_COST });
  } catch (err) {
    console.error('Services error:', err.message);
    res.status(500).json({ error: err.message || 'Request failed.' });
  }
});

// ── List User Service Requests ─────────────────────────────────────────────
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('service_requests')
      .select('id, service_type, business_name, description, budget, deadline, status, created_at')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;
    res.json({ requests: data || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
