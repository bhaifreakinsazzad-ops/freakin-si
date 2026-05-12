/**
 * Engine NotREAL — Fixer Route
 * POST /api/fixer/diagnose — AI business problem diagnosis
 * Persists results to fixer_diagnoses when Supabase is configured.
 */
const express  = require('express')
const router   = express.Router()
const { randomBytes } = require('crypto')
const { generateAI, parseAIJson } = require('../lib/aiRouter')
const { db, isUsingSupabase } = require('../lib/db')

const SYSTEM_PROMPT = `You are Engine NotREAL's Business Fixer AI. You diagnose real business problems and provide structured fix strategies.

Analyze the submitted business problem and return a JSON object with exactly these fields:
{
  "diagnosis": "string — clear statement of the core problem",
  "rootCause": "string — underlying reason",
  "fixStrategy": ["string", ...],    // 5-7 specific, actionable steps
  "priorityActions": ["string", ...], // top 3 things to do immediately
  "recommendedTools": ["string", ...], // specific tools/services
  "executionPlan": "string — week-by-week plan",
  "estimatedTimeline": "string — how long to see results"
}

Be direct, practical, and specific. No generic advice. Return valid JSON only.`

/* Demo result when no AI key is configured */
const DEMO_RESULTS = {
  no_sales: {
    diagnosis: 'Your business has a conversion funnel gap — the offer-to-close process is leaking customers at the consideration phase.',
    rootCause: 'Misaligned offer messaging: what you say you do does not match what the customer experiences when they try to buy. The gap between promise and proof creates hesitation.',
    fixStrategy: [
      'Audit every touchpoint from first contact to payment and map where people drop off',
      'Rewrite your core offer in 1 sentence: who it helps, what it does, and the result they get',
      'Add 3 pieces of social proof within the first scroll of your landing page',
      'Introduce a low-risk entry point (free trial, discovery call, $9 intro product)',
      'Follow up with leads within 24 hours using a structured 5-message sequence',
      'Run a 7-day urgency campaign to re-engage cold leads',
    ],
    priorityActions: [
      'Install Hotjar (free) on your site this week to see where people drop off',
      'Write a new offer headline and test it for 7 days against your current one',
      'DM or email 10 past leads with a personalized, non-salesy message today',
    ],
    recommendedTools: ['Hotjar (user behavior)', 'Notion (offer docs)', 'Calendly (booking)', 'Lemlist (outreach)'],
    executionPlan: 'Week 1: Audit funnel + rewrite offer. Week 2: Add social proof + launch new headline. Week 3: Outreach sequence to 50 warm leads. Week 4: Review data + iterate.',
    estimatedTimeline: '4–6 weeks to measurable improvement',
  },
  no_traffic: {
    diagnosis: 'Your business has a visibility problem — the right people cannot find you through your current channels.',
    rootCause: 'Insufficient distribution strategy: you are creating content or running ads on channels where your buyers are not active, or your SEO/social signals are too weak to surface organically.',
    fixStrategy: [
      'Identify where your top 3 competitors get most of their traffic (use SimilarWeb free)',
      'Publish 3x per week on the 1 platform where your audience is most active',
      'Create a lead magnet (free checklist, template, or guide) to capture email addresses',
      'Run a $5/day Facebook or Google ad for 2 weeks targeting your ideal customer profile',
      'Set up Google Business Profile if local, or optimize your LinkedIn/Instagram bio',
      'Partner with 2 non-competing businesses in your niche for cross-promotion',
    ],
    priorityActions: [
      'Set up a free Google Analytics account and connect it to your website today',
      'Post one high-value piece of content on your primary platform in the next 48 hours',
      'Research 10 relevant hashtags or keywords your audience searches for',
    ],
    recommendedTools: ['SimilarWeb (competitor traffic)', 'Google Analytics', 'Canva (content)', 'Mailchimp (email)'],
    executionPlan: 'Week 1: Audit + identify best channel. Week 2: Publish 3 content pieces + launch lead magnet. Week 3: Start paid traffic test. Week 4: Scale what works.',
    estimatedTimeline: '6–8 weeks to consistent inbound traffic',
  },
  default: {
    diagnosis: 'Your business has a structural execution gap — there is misalignment between strategy, operations, and output that is slowing growth.',
    rootCause: 'Too many priorities without a clear system: without structured processes and defined KPIs, effort gets scattered and results are inconsistent.',
    fixStrategy: [
      'Define your single most important metric for the next 90 days',
      'Map your core business process from lead to delivery in 5 steps or less',
      'Eliminate or delegate the 3 tasks that waste the most time each week',
      'Set up a simple weekly review: what worked, what didn\'t, what\'s next',
      'Create a one-page operating plan with goals, actions, and owners',
      'Establish a daily 30-minute "deep work" block for your most important task',
    ],
    priorityActions: [
      'Write down your top 3 business goals for the next 30 days — keep them visible',
      'Identify the one task that, if done consistently, would most move the needle',
      'Block time in your calendar for strategy work (not just execution)',
    ],
    recommendedTools: ['Notion (planning)', 'Loom (async communication)', 'Calendly (scheduling)', 'Stripe (payments)'],
    executionPlan: 'Week 1: Clarity — define goals and metrics. Week 2: Systems — build core processes. Week 3: Execution — daily focused action. Week 4: Review and optimize.',
    estimatedTimeline: '30 days to operational clarity, 90 days to measurable results',
  },
}

router.post('/diagnose', async (req, res) => {
  try {
    const { problemType, description, tried, goal, budget, country, timeline, bizLink } = req.body

    if (!problemType || !description || description.length < 20) {
      return res.status(400).json({ message: 'Please describe your business problem in more detail.' })
    }

    const userPrompt = `Business Problem Submission:
Problem Type: ${problemType}
Description: ${description}
What's been tried: ${tried || 'Not specified'}
Goal: ${goal || 'Not specified'}
Budget: ${budget || 'Not specified'}
Country/Market: ${country || 'Not specified'}
Timeline: ${timeline || 'Not specified'}
Business link/description: ${bizLink || 'Not specified'}

Please diagnose this business problem and provide a structured fix strategy.`

    const { text, demo, error } = await generateAI(SYSTEM_PROMPT, userPrompt)
    const persistDiagnosis = async (result, isDemo) => {
      if (!isUsingSupabase()) return
      const record = {
        id: randomBytes(8).toString('hex'),
        problem_type: problemType,
        description,
        goal: goal || null,
        budget: budget || null,
        country: country || null,
        timeline: timeline || null,
        result,
        is_demo: isDemo,
        created_at: new Date().toISOString(),
      }
      await db.from('fixer_diagnoses').insert(record)
    }

    if (demo || !text) {
      // Return contextual demo result
      const demoResult = DEMO_RESULTS[problemType] || DEMO_RESULTS.default
      persistDiagnosis(demoResult, true).catch((persistError) =>
        console.warn('[fixer] Demo save failed (non-blocking):', persistError.message)
      )
      return res.json({ result: demoResult, demo: true, provider: 'demo' })
    }

    const parsed = parseAIJson(text)
    if (!parsed) {
      const demoResult = DEMO_RESULTS[problemType] || DEMO_RESULTS.default
      persistDiagnosis(demoResult, true).catch((persistError) =>
        console.warn('[fixer] Parse fallback save failed (non-blocking):', persistError.message)
      )
      return res.json({ result: demoResult, demo: true, provider: 'parse_error' })
    }

    // Persist diagnosis to database (non-blocking)
    persistDiagnosis(parsed, false).catch((persistError) =>
      console.warn('[fixer] DB save failed (non-blocking):', persistError.message)
    )

    return res.json({ result: parsed, demo: false })
  } catch (err) {
    console.error('[fixer] error:', err)
    res.status(500).json({ message: 'Fixer service temporarily unavailable.', demo: true })
  }
})

module.exports = router
