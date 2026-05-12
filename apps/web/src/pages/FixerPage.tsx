/**
 * Engine NotREAL — Fixer Mode
 * Submit a business problem → get AI diagnosis + fix strategy
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wrench, Loader2, ChevronRight, Copy, Check, RefreshCw,
  AlertTriangle, Target, Zap, ArrowRight, CheckCircle, Lightbulb,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const PROBLEM_TYPES = [
  { id: 'no_sales',      label: 'No Sales / Low Revenue',    color: '#ef4444' },
  { id: 'no_traffic',    label: 'No Traffic / Visibility',   color: '#f59e0b' },
  { id: 'operations',    label: 'Operations / Workflow',     color: '#6366f1' },
  { id: 'product',       label: 'Product / Service Issues',  color: '#8b5cf6' },
  { id: 'team',          label: 'Team / Hiring Problems',    color: '#06b6d4' },
  { id: 'funding',       label: 'Funding / Capital',         color: '#10b981' },
  { id: 'branding',      label: 'Brand / Positioning',       color: '#f97316' },
  { id: 'tech',          label: 'Tech / Systems',            color: '#3b82f6' },
  { id: 'other',         label: 'Something Else',            color: '#64748b' },
]

const BUDGETS = ['Under $500', '$500–$2K', '$2K–$10K', '$10K+', 'No budget yet']

interface FixerResult {
  diagnosis: string
  rootCause: string
  fixStrategy: string[]
  priorityActions: string[]
  recommendedTools: string[]
  executionPlan: string
  estimatedTimeline: string
}

/* Demo result used when no AI key is configured */
const DEMO_RESULT: FixerResult = {
  diagnosis: 'Your business has a conversion funnel gap — traffic may exist but the offer-to-close process is leaking customers at the consideration phase.',
  rootCause: 'Misaligned offer messaging: what you say you do does not match what the customer experiences when they try to buy. The gap between promise and proof is creating hesitation.',
  fixStrategy: [
    'Audit every touchpoint from first contact to payment — map where people drop off',
    'Rewrite your core offer in 1 sentence: Who it helps, what it does, and the result they get',
    'Add 3 pieces of social proof within the first scroll of your landing page or profile',
    'Introduce a low-risk entry point (free trial, discovery call, $9 intro product)',
    'Follow up with leads within 24 hours using a structured sequence',
  ],
  priorityActions: [
    'Install a heatmap (Hotjar free tier) on your site this week',
    'Write a new offer headline and test it for 7 days',
    'DM or email 10 past leads with a personalized message today',
  ],
  recommendedTools: [
    'Hotjar (user behavior)',
    'Notion (offer documentation)',
    'Calendly (frictionless booking)',
    'Lemlist or Apollo (outreach)',
  ],
  executionPlan: 'Week 1: Audit + rewrite offer. Week 2: Add social proof + test new headline. Week 3: Launch outreach sequence to 50 warm leads. Week 4: Review conversion data and iterate.',
  estimatedTimeline: '4–6 weeks to measurable improvement',
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="p-1.5 rounded transition-opacity opacity-50 hover:opacity-100"
      style={{ color: '#818cf8' }}
      title="Copy"
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
    </button>
  )
}

export default function FixerPage() {
  const { token } = useAuth()
  const [problemType, setProblemType]   = useState('')
  const [description, setDescription]  = useState('')
  const [tried,       setTried]         = useState('')
  const [goal,        setGoal]          = useState('')
  const [budget,      setBudget]        = useState('')
  const [country,     setCountry]       = useState('')
  const [timeline,    setTimeline]      = useState('')
  const [bizLink,     setBizLink]       = useState('')

  const [loading,  setLoading]  = useState(false)
  const [result,   setResult]   = useState<FixerResult | null>(null)
  const [error,    setError]    = useState('')
  const [isDemo,   setIsDemo]   = useState(false)

  const canSubmit = problemType && description.trim().length > 20

  const handleSubmit = async () => {
    if (!canSubmit) return
    setLoading(true); setError(''); setResult(null); setIsDemo(false)

    try {
      const res = await fetch(`${API}/fixer/diagnose`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ problemType, description, tried, goal, budget, country, timeline, bizLink }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Diagnosis failed')
      if (data.demo) setIsDemo(true)
      setResult(data.result)
    } catch (err: any) {
      // Graceful fallback to demo mode
      setIsDemo(true)
      setResult(DEMO_RESULT)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setResult(null); setError(''); setIsDemo(false)
    setProblemType(''); setDescription(''); setTried('')
    setGoal(''); setBudget(''); setCountry(''); setTimeline(''); setBizLink('')
  }

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}
          >
            <Wrench size={18} style={{ color: '#818cf8' }} />
          </div>
          <div>
            <h1 className="font-bold text-xl" style={{ color: 'var(--fsi-text)', fontFamily: "'Space Grotesk',sans-serif" }}>
              Business Fixer
            </h1>
            <p className="text-sm" style={{ color: 'var(--fsi-text-muted)' }}>
              Bring the problem. Leave with the plan.
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">

              {/* Problem Type */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--fsi-text-muted)' }}>
                  What type of problem? <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PROBLEM_TYPES.map(pt => (
                    <button
                      key={pt.id}
                      onClick={() => setProblemType(pt.id)}
                      className="px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all"
                      style={{
                        background: problemType === pt.id ? `${pt.color}22` : 'var(--fsi-surface-2)',
                        border: `1px solid ${problemType === pt.id ? pt.color : 'rgba(255,255,255,0.07)'}`,
                        color: problemType === pt.id ? pt.color : 'rgba(255,255,255,0.6)',
                      }}
                    >
                      {pt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--fsi-text-muted)' }}>
                  Describe your business problem <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Explain what's going wrong. The more detail, the better the diagnosis. Include what your business does, who your customers are, and what specifically isn't working..."
                  className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none transition-all"
                  style={{
                    background: 'var(--fsi-surface-2)',
                    border: '1px solid var(--fsi-border)',
                    color: 'var(--fsi-text)',
                  }}
                />
                <p className="text-xs mt-1" style={{ color: 'var(--fsi-text-dim)' }}>
                  {description.length} chars — aim for 100+
                </p>
              </div>

              {/* What you tried */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fsi-text-muted)' }}>
                  What have you already tried?
                </label>
                <textarea
                  value={tried}
                  onChange={e => setTried(e.target.value)}
                  rows={2}
                  placeholder="e.g. Facebook ads, cold outreach, lowered prices, hired a VA..."
                  className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none transition-all"
                  style={{ background: 'var(--fsi-surface-2)', border: '1px solid var(--fsi-border)', color: 'var(--fsi-text)' }}
                />
              </div>

              {/* Goal + Budget row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fsi-text-muted)' }}>What's your goal?</label>
                  <input
                    value={goal}
                    onChange={e => setGoal(e.target.value)}
                    placeholder="e.g. 10 paying clients, $5K/mo revenue..."
                    className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                    style={{ background: 'var(--fsi-surface-2)', border: '1px solid var(--fsi-border)', color: 'var(--fsi-text)' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fsi-text-muted)' }}>Budget to fix this</label>
                  <select
                    value={budget}
                    onChange={e => setBudget(e.target.value)}
                    className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                    style={{ background: 'var(--fsi-surface-2)', border: '1px solid var(--fsi-border)', color: 'var(--fsi-text)' }}
                  >
                    <option value="">Select budget</option>
                    {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>

              {/* Country + Timeline row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fsi-text-muted)' }}>Country / Market</label>
                  <input
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    placeholder="e.g. Bangladesh, USA, UK..."
                    className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                    style={{ background: 'var(--fsi-surface-2)', border: '1px solid var(--fsi-border)', color: 'var(--fsi-text)' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fsi-text-muted)' }}>Timeline to fix</label>
                  <input
                    value={timeline}
                    onChange={e => setTimeline(e.target.value)}
                    placeholder="e.g. 30 days, ASAP, 3 months..."
                    className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                    style={{ background: 'var(--fsi-surface-2)', border: '1px solid var(--fsi-border)', color: 'var(--fsi-text)' }}
                  />
                </div>
              </div>

              {/* Business link */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fsi-text-muted)' }}>Business link or description (optional)</label>
                <input
                  value={bizLink}
                  onChange={e => setBizLink(e.target.value)}
                  placeholder="Website, social media, or describe what your business is..."
                  className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                  style={{ background: 'var(--fsi-surface-2)', border: '1px solid var(--fsi-border)', color: 'var(--fsi-text)' }}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
                  <AlertTriangle size={15} style={{ color: '#ef4444' }} />
                  <p className="text-sm" style={{ color: '#ef4444' }}>{error}</p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={!canSubmit || loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all"
                style={{
                  background: canSubmit && !loading ? 'linear-gradient(135deg, #6366f1, #818cf8)' : 'rgba(99,102,241,0.2)',
                  color: canSubmit && !loading ? '#fff' : 'rgba(255,255,255,0.4)',
                  cursor: canSubmit && !loading ? 'pointer' : 'not-allowed',
                }}
              >
                {loading ? (
                  <><Loader2 size={16} className="animate-spin" /> Diagnosing your business…</>
                ) : (
                  <><Wrench size={16} /> Run Business Fixer <ChevronRight size={15} /></>
                )}
              </button>

              <p className="text-center text-xs" style={{ color: 'var(--fsi-text-dim)' }}>
                AI-powered diagnosis. Works in demo mode without API keys.
              </p>
            </motion.div>

          ) : (
            <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

              {isDemo && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
                  <Lightbulb size={15} style={{ color: '#f59e0b' }} />
                  <p className="text-sm" style={{ color: '#f59e0b' }}>Demo mode — connect an AI provider for real-time diagnosis</p>
                </div>
              )}

              {/* Diagnosis */}
              <ResultCard icon={<AlertTriangle size={16} style={{ color: '#f59e0b' }} />} title="Diagnosis" color="#f59e0b">
                <p className="text-sm leading-relaxed" style={{ color: 'var(--fsi-text-muted)' }}>{result.diagnosis}</p>
              </ResultCard>

              {/* Root Cause */}
              <ResultCard icon={<Target size={16} style={{ color: '#ef4444' }} />} title="Root Cause" color="#ef4444">
                <p className="text-sm leading-relaxed" style={{ color: 'var(--fsi-text-muted)' }}>{result.rootCause}</p>
              </ResultCard>

              {/* Fix Strategy */}
              <ResultCard icon={<Wrench size={16} style={{ color: '#818cf8' }} />} title="Fix Strategy" color="#818cf8"
                extra={<CopyBtn text={result.fixStrategy.join('\n')} />}>
                <ul className="space-y-2">
                  {result.fixStrategy.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--fsi-text-muted)' }}>
                      <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: 'rgba(129,140,248,0.15)', color: '#818cf8' }}>
                        {i + 1}
                      </span>
                      {s}
                    </li>
                  ))}
                </ul>
              </ResultCard>

              {/* Priority Actions */}
              <ResultCard icon={<Zap size={16} style={{ color: '#10b981' }} />} title="Priority Actions (Do First)" color="#10b981">
                <ul className="space-y-2">
                  {result.priorityActions.map((a, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--fsi-text-muted)' }}>
                      <CheckCircle size={14} className="mt-0.5 shrink-0" style={{ color: '#10b981' }} />
                      {a}
                    </li>
                  ))}
                </ul>
              </ResultCard>

              {/* Tools + Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ResultCard icon={<ArrowRight size={16} style={{ color: '#22d3ee' }} />} title="Recommended Tools" color="#22d3ee">
                  <ul className="space-y-1">
                    {result.recommendedTools.map((t, i) => (
                      <li key={i} className="text-sm" style={{ color: 'var(--fsi-text-muted)' }}>• {t}</li>
                    ))}
                  </ul>
                </ResultCard>
                <ResultCard icon={<ChevronRight size={16} style={{ color: '#f59e0b' }} />} title="Timeline" color="#f59e0b">
                  <p className="text-sm font-semibold mb-2" style={{ color: '#f59e0b' }}>{result.estimatedTimeline}</p>
                  <p className="text-sm" style={{ color: 'var(--fsi-text-muted)' }}>{result.executionPlan}</p>
                </ResultCard>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="/requests"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: '#fff' }}
                >
                  <ArrowRight size={15} /> Request This Service
                </a>
                <a
                  href="/marketplace"
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all"
                  style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', color: '#22d3ee' }}
                >
                  Open Marketplace
                </a>
                <a
                  href="/support"
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all"
                  style={{ background: 'var(--fsi-surface-2)', border: '1px solid var(--fsi-border)', color: 'var(--fsi-text-muted)' }}
                >
                  Get Support
                </a>
                <button
                  onClick={reset}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all"
                  style={{ background: 'var(--fsi-surface-2)', border: '1px solid var(--fsi-border)', color: 'var(--fsi-text-muted)' }}
                >
                  <RefreshCw size={15} /> Fix Another
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function ResultCard({ icon, title, color, children, extra }: {
  icon: React.ReactNode; title: string; color: string
  children: React.ReactNode; extra?: React.ReactNode
}) {
  return (
    <div className="rounded-xl p-4 space-y-3" style={{ background: 'var(--fsi-surface-2)', border: `1px solid ${color}33` }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-semibold" style={{ color }}>{title}</span>
        </div>
        {extra}
      </div>
      {children}
    </div>
  )
}
