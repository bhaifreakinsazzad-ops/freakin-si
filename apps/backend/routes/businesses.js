/**
 * Money Machine — AI Business Generator
 * POST /api/businesses/generate  — Generate full business blueprint via LLM
 * GET  /api/businesses            — List user's saved businesses
 * GET  /api/businesses/:id        — Get one business
 * DELETE /api/businesses/:id      — Delete a business
 * GET  /api/businesses/marketplace — Public marketplace listings
 * POST /api/businesses/:id/list   — List business on marketplace
 */

const express = require('express');
const router  = express.Router();
const { supabase, authenticateToken } = require('../middleware/auth');
const { callLLM } = require('./llm');

function buildPreviewBlueprint(businessIdea, targetAudience, budget, goal) {
  const idea = String(businessIdea || '').trim();
  const shortIdea = idea.split(' ').slice(0, 5).join(' ') || 'launch-ready business';
  const businessName = idea
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('') || 'BlackSheepCo';

  return {
    businessName: `${businessName} Co.`,
    tagline: `The premium way to launch ${shortIdea.toLowerCase()}.`,
    businessModel: {
      type: targetAudience || 'Digital business',
      description: `A lean launch system built around ${idea}.`,
      revenueStreams: ['Core offer', 'Upsell service', 'Retainer support'],
      estimatedMonthlyRevenue: '$2,000 - $8,000',
      timeToFirstRevenue: '30-60 days',
    },
    brandIdentity: {
      positioning: 'Premium, direct, execution-focused',
      tone: 'Confident and business-serious',
      colorPalette: ['#0c0f14', '#b5121b', '#c9a449'],
      uniqueSellingProposition: `Launch ${shortIdea.toLowerCase()} with a guided AI operating system.`,
    },
    offerStructure: {
      mainOffer: idea,
      pricePoint: budget || '$49 - $299',
      upsells: ['Done-for-you setup', 'Launch support'],
      guaranteeOrHook: goal || 'Move from idea to launch with clear next actions.',
    },
    landingPageContent: {
      headline: `Launch ${shortIdea} with clarity.`,
      subheadline: 'Structured execution, assets, support, and next actions in one workflow.',
      heroDescription: `This preview blueprint turns ${idea.toLowerCase()} into a concrete launch path.`,
      features: [
        { title: 'Launch roadmap', description: 'See the full journey from idea to launch.' },
        { title: 'Execution assets', description: 'Generate brand, case, and website outputs.' },
        { title: 'Support escalation', description: 'Request expert help without leaving the workflow.' },
      ],
      callToAction: 'Start the mission',
      socialProof: 'Built for founders who need structure, not more noise.',
    },
    adCreatives: {
      hooks: [
        `Still guessing how to launch ${shortIdea.toLowerCase()}?`,
        `Turn ${shortIdea.toLowerCase()} into a revenue-ready plan.`,
        'Stop collecting ideas and start executing.',
      ],
      adCopy: `Build and launch ${shortIdea.toLowerCase()} with a guided AI operating system that keeps execution moving.`,
      targetingStrategy: targetAudience || 'Founders, operators, and first-time builders',
      estimatedCPC: '$0.80 - $2.40',
    },
    monetizationPlan: {
      phase1: { timeline: 'Month 1', action: 'Package and launch the initial offer', expectedRevenue: '$500 - $2,000' },
      phase2: { timeline: 'Month 2-3', action: 'Refine positioning and add conversion assets', expectedRevenue: '$3,000 - $8,000' },
      phase3: { timeline: 'Month 4-6', action: 'Add support products and recurring revenue', expectedRevenue: '$8,000 - $20,000' },
    },
    marketAnalysis: {
      marketSize: 'Large enough for a niche-first launch',
      competition: 'Medium',
      trend: 'Growing with AI-assisted execution demand',
      keyCompetitors: ['Manual consultants', 'Generic templates', 'Do-it-yourself tools'],
    },
    nextSteps: [
      'Clarify the offer and buyer outcome',
      'Finalize brand and positioning',
      'Prepare the first landing page and CTA',
      'Run initial outreach or paid traffic test',
      'Collect feedback and improve the next checkpoint',
    ],
  };
}

const SYSTEM_PROMPT = `You are an elite business strategist and brand architect. You create REAL, actionable business plans that feel built by a $500/hr consultant. Your outputs are specific, data-driven, and ready to execute immediately.

IMPORTANT: Return ONLY valid JSON. No markdown, no code blocks, no extra text — just the raw JSON object.

Generate a complete business blueprint:

{
  "businessName": "Catchy, brandable name",
  "tagline": "Powerful one-line positioning statement",
  "businessModel": {
    "type": "SaaS / E-commerce / Agency / Coaching / etc.",
    "description": "2-3 sentences on how this business works and makes money",
    "revenueStreams": ["stream1", "stream2", "stream3"],
    "estimatedMonthlyRevenue": "$X,XXX - $XX,XXX",
    "timeToFirstRevenue": "X weeks/months"
  },
  "brandIdentity": {
    "positioning": "How this brand positions itself in the market",
    "tone": "Brand voice: bold/warm/technical/playful etc.",
    "colorPalette": ["#hex1", "#hex2", "#hex3"],
    "uniqueSellingProposition": "What makes this different from every competitor"
  },
  "offerStructure": {
    "mainOffer": "Core product/service name and what it delivers",
    "pricePoint": "$XX - $XXX",
    "upsells": ["upsell1", "upsell2"],
    "guaranteeOrHook": "Risk reversal or compelling hook to remove objections"
  },
  "landingPageContent": {
    "headline": "Powerful hero headline",
    "subheadline": "Supporting statement that amplifies the headline",
    "heroDescription": "2-3 sentences for above the fold",
    "features": [
      {"title": "Feature 1", "description": "Specific benefit, not a feature"},
      {"title": "Feature 2", "description": "Specific benefit"},
      {"title": "Feature 3", "description": "Specific benefit"}
    ],
    "callToAction": "CTA button text",
    "socialProof": "Suggested testimonial or social proof strategy"
  },
  "adCreatives": {
    "hooks": ["Hook 1 — pattern interrupt for social", "Hook 2", "Hook 3"],
    "adCopy": "Complete Facebook/Instagram ad copy (3-4 sentences that sell)",
    "targetingStrategy": "Who to target, platforms, and why",
    "estimatedCPC": "$X.XX - $X.XX"
  },
  "monetizationPlan": {
    "phase1": {"timeline": "Month 1-2", "action": "Specific action", "expectedRevenue": "$X,XXX"},
    "phase2": {"timeline": "Month 3-4", "action": "Specific action", "expectedRevenue": "$XX,XXX"},
    "phase3": {"timeline": "Month 5-6", "action": "Specific action", "expectedRevenue": "$XX,XXX"}
  },
  "marketAnalysis": {
    "marketSize": "Estimated addressable market size",
    "competition": "Low / Medium / High",
    "trend": "Growing / Stable / Declining + reason",
    "keyCompetitors": ["Competitor 1", "Competitor 2", "Competitor 3"]
  },
  "nextSteps": ["Step 1 — specific action", "Step 2", "Step 3", "Step 4", "Step 5"]
}

Make everything hyper-specific to the user's idea. No generic filler. Every section must feel like expert-level consulting tailored to this exact niche.`;

// ── Generate Business Blueprint ────────────────────────────────────────────
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const { businessIdea, targetAudience, budget, goal } = req.body;

    if (!businessIdea || businessIdea.trim().length < 10) {
      return res.status(400).json({ error: 'Business idea must be at least 10 characters.' });
    }

    const userPrompt = `Generate a complete business blueprint for:

Business Idea: ${businessIdea}
Target Audience: ${targetAudience || 'General consumers'}
Budget: ${budget || 'Bootstrap / low budget'}
Primary Goal: ${goal || 'Generate revenue as fast as possible'}

Make it specific, actionable, and tailored to this exact niche.`;

    let blueprint;
    try {
      const modelId = 'groq/llama-3.3-70b-versatile';
      const raw = await callLLM(modelId, [{ role: 'user', content: userPrompt }], SYSTEM_PROMPT);
      const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      blueprint = JSON.parse(cleaned);
    } catch (llmError) {
      console.warn('Business generate fallback:', llmError.message);
      blueprint = buildPreviewBlueprint(businessIdea, targetAudience, budget, goal);
    }

    // Save to Supabase
    const { data: saved, error: dbErr } = await supabase
      .from('businesses')
      .insert({
        user_id:          req.user.id,
        name:             blueprint.businessName || businessIdea,
        tagline:          blueprint.tagline || '',
        niche:            targetAudience || '',
        target_audience:  targetAudience || '',
        budget:           budget || '',
        goal:             goal || '',
        business_model:   blueprint.businessModel || {},
        brand_identity:   blueprint.brandIdentity || {},
        offer_structure:  blueprint.offerStructure || {},
        landing_page:     blueprint.landingPageContent || {},
        ad_creatives:     blueprint.adCreatives || {},
        monetization_plan:blueprint.monetizationPlan || {},
        market_analysis:  blueprint.marketAnalysis || {},
        next_steps:       blueprint.nextSteps || [],
        status:           'draft',
      })
      .select()
      .single();

    if (dbErr) {
      console.error('DB save error:', dbErr);
      // Still return blueprint even if save fails
      return res.json({ blueprint, saved: null, warning: 'Could not save to database.' });
    }

    res.json({ blueprint, saved });
  } catch (err) {
    console.error('Business generate error:', err.message);
    res.status(500).json({ error: err.message || 'Generation failed. Please try again.' });
  }
});

// ── List User Businesses ───────────────────────────────────────────────────
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .select('id, name, tagline, niche, status, created_at')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;
    res.json({ businesses: data || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Get Single Business ────────────────────────────────────────────────────
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error || !data) return res.status(404).json({ error: 'Business not found.' });
    res.json({ business: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Delete Business ────────────────────────────────────────────────────────
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { error } = await supabase
      .from('businesses')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Public Marketplace ─────────────────────────────────────────────────────
router.get('/marketplace/listings', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = supabase
      .from('marketplace_listings')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(24);

    if (category && category !== 'all') query = query.eq('category', category);
    if (search) query = query.ilike('title', `%${search}%`);

    const { data, error } = await query;
    if (error) throw error;
    res.json({ listings: data || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── List Business on Marketplace ───────────────────────────────────────────
router.post('/:id/list-marketplace', authenticateToken, async (req, res) => {
  try {
    // Verify user owns the business
    const { data: biz, error: bizErr } = await supabase
      .from('businesses')
      .select('id, name, tagline, niche')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (bizErr || !biz) return res.status(404).json({ error: 'Business not found.' });

    const { price, monthly_revenue, business_age, category, description, tags } = req.body;

    const { data: listing, error: listErr } = await supabase
      .from('marketplace_listings')
      .insert({
        business_id:     biz.id,
        seller_id:       req.user.id,
        title:           biz.name,
        description:     description || biz.tagline || '',
        niche:           biz.niche || '',
        category:        category || 'digital',
        price:           parseFloat(price) || 0,
        monthly_revenue: parseFloat(monthly_revenue) || 0,
        business_age:    business_age || '',
        tags:            tags || [],
        status:          'active',
      })
      .select()
      .single();

    if (listErr) throw listErr;

    // Mark business as listed
    await supabase.from('businesses').update({ status: 'listed' }).eq('id', biz.id);

    res.json({ success: true, listing });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
