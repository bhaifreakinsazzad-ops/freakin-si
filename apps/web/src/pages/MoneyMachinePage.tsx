/**
 * Money Machine — AI Business Blueprint Generator
 * Integrated into Freakin SI platform
 */

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, TrendingUp, Store, Target, Users, DollarSign,
  Zap, ChevronRight, ChevronLeft, Loader2, Check, Copy,
  BarChart3, Megaphone, Globe, ArrowRight, Trash2, RefreshCw,
  Lightbulb, Palette, FileText, Rocket,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

/* ── Types ─────────────────────────────────────────────────────────────── */
interface Blueprint {
  businessName: string
  tagline: string
  businessModel: {
    type: string
    description: string
    revenueStreams: string[]
    estimatedMonthlyRevenue: string
    timeToFirstRevenue: string
  }
  brandIdentity: {
    positioning: string
    tone: string
    colorPalette: string[]
    uniqueSellingProposition: string
  }
  offerStructure: {
    mainOffer: string
    pricePoint: string
    upsells: string[]
    guaranteeOrHook: string
  }
  landingPageContent: {
    headline: string
    subheadline: string
    heroDescription: string
    features: { title: string; description: string }[]
    callToAction: string
    socialProof: string
  }
  adCreatives: {
    hooks: string[]
    adCopy: string
    targetingStrategy: string
    estimatedCPC: string
  }
  monetizationPlan: {
    phase1: { timeline: string; action: string; expectedRevenue: string }
    phase2: { timeline: string; action: string; expectedRevenue: string }
    phase3: { timeline: string; action: string; expectedRevenue: string }
  }
  marketAnalysis: {
    marketSize: string
    competition: string
    trend: string
    keyCompetitors: string[]
  }
  nextSteps: string[]
}

interface SavedBusiness {
  id: string
  name: string
  tagline: string
  niche: string
  status: string
  created_at: string
}

/* ── Generation Steps ──────────────────────────────────────────────────── */
const GEN_STEPS = [
  'Analyzing market opportunity...',
  'Building business model...',
  'Crafting brand identity...',
  'Designing offer structure...',
  'Writing landing page copy...',
  'Creating ad hooks & creatives...',
  'Building monetization roadmap...',
  'Finalizing your blueprint...',
]

const NICHES = ['SaaS', 'E-commerce', 'Digital Product', 'Coaching/Consulting', 'Agency', 'Content', 'App', 'Local Service']
const BUDGETS = ['< $500', '$500 - $2K', '$2K - $10K', '$10K+']
const GOALS = ['Revenue ASAP', 'Build audience first', 'Long-term brand', 'Sell the business']

/* ── Copy button ───────────────────────────────────────────────────────── */
function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="p-1.5 rounded-lg transition-all opacity-50 hover:opacity-100"
      style={{ color: 'var(--fsi-gold)' }}
      title="Copy"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
    </button>
  )
}

/* ── Section card ──────────────────────────────────────────────────────── */
function Card({ icon: Icon, title, color, children }: {
  icon: React.ElementType; title: string; color: string; children: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5 space-y-3"
      style={{ background: 'var(--fsi-surface)', border: '1px solid var(--fsi-border)' }}
    >
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: `${color}18` }}>
          <Icon size={15} style={{ color }} />
        </div>
        <h3 className="font-semibold text-sm" style={{ color: 'var(--fsi-text)' }}>{title}</h3>
      </div>
      {children}
    </motion.div>
  )
}

/* ── Main Component ────────────────────────────────────────────────────── */
export default function MoneyMachinePage() {
  const { token } = useAuth()
  const [step, setStep] = useState<'form' | 'generating' | 'result' | 'saved'>('form')

  // Form state
  const [idea, setIdea] = useState('')
  const [audience, setAudience] = useState('')
  const [niche, setNiche] = useState('')
  const [budget, setBudget] = useState('')
  const [goal, setGoal] = useState('')
  const [error, setError] = useState('')

  // Generation
  const [genStep, setGenStep] = useState(0)
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null)
  const [savedId, setSavedId] = useState<string | null>(null)

  // Saved businesses
  const [savedList, setSavedList] = useState<SavedBusiness[]>([])
  const [loadingSaved, setLoadingSaved] = useState(false)

  const genInterval = useRef<ReturnType<typeof setInterval> | null>(null)

  // Load saved businesses
  const loadSaved = async () => {
    if (!token) return
    setLoadingSaved(true)
    try {
      const r = await fetch(`${API}/businesses`, { headers: { Authorization: `Bearer ${token}` } })
      const d = await r.json()
      setSavedList(d.businesses || [])
    } catch { /* ignore */ }
    setLoadingSaved(false)
  }

  useEffect(() => { loadSaved() }, [token])

  const startGeneration = async () => {
    if (idea.trim().length < 10) { setError('Please describe your idea in at least 10 characters.'); return }
    setError('')
    setStep('generating')
    setGenStep(0)

    // Animate steps
    genInterval.current = setInterval(() => {
      setGenStep(prev => Math.min(prev + 1, GEN_STEPS.length - 1))
    }, 1400)

    try {
      const r = await fetch(`${API}/businesses/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ businessIdea: idea, targetAudience: audience || niche, budget, goal }),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Generation failed')

      clearInterval(genInterval.current!)
      setBlueprint(d.blueprint)
      setSavedId(d.saved?.id || null)
      setStep('result')
      loadSaved()
    } catch (err: unknown) {
      clearInterval(genInterval.current!)
      const message = err instanceof Error ? err.message : 'Generation failed'
      setError(message)
      setStep('form')
    }
  }

  const reset = () => {
    setStep('form')
    setBlueprint(null)
    setSavedId(null)
    setIdea('')
    setAudience('')
    setNiche('')
    setBudget('')
    setGoal('')
    setError('')
  }

  const deleteB = async (id: string) => {
    if (!token) return
    await fetch(`${API}/businesses/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    loadSaved()
  }

  /* ── Render ───────────────────────────────────────────────────────────── */
  return (
    <div className="h-full overflow-y-auto" style={{ background: 'var(--fsi-void)' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 px-4 py-3 flex items-center justify-between"
        style={{ background: 'rgba(8,11,18,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--fsi-border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--fsi-gold), var(--fsi-violet))', boxShadow: '0 0 16px rgba(0,212,255,0.3)' }}>
            <DollarSign size={16} color="#000" />
          </div>
          <div>
            <h1 className="font-display font-bold text-sm leading-none" style={{ color: 'var(--fsi-gold)' }}>Money Machine</h1>
            <p className="text-xs mt-0.5" style={{ color: 'var(--fsi-text-muted)' }}>AI Business Blueprint Generator</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {savedList.length > 0 && step !== 'saved' && (
            <button onClick={() => setStep('saved')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{ background: 'var(--fsi-surface-2)', color: 'var(--fsi-text-muted)', border: '1px solid var(--fsi-border)' }}>
              <Store size={13} />
              {savedList.length} Saved
            </button>
          )}
          {(step === 'result' || step === 'saved') && (
            <button onClick={reset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{ background: 'rgba(0,212,255,0.1)', color: 'var(--fsi-gold)', border: '1px solid rgba(0,212,255,0.2)' }}>
              <Sparkles size={13} />
              New Blueprint
            </button>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 pb-12">
        <AnimatePresence mode="wait">

          {/* ── FORM ───────────────────────────────────────────────────────── */}
          {step === 'form' && (
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="space-y-6 mt-2">

              {/* Hero headline */}
              <div className="text-center pt-4">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-medium"
                  style={{ background: 'rgba(0,212,255,0.08)', color: 'var(--fsi-gold)', border: '1px solid rgba(0,212,255,0.2)' }}>
                  <Zap size={12} />
                  Powered by 40+ AI Models
                </motion.div>
                <h2 className="font-display font-bold text-3xl sm:text-4xl leading-tight mb-3"
                  style={{ background: 'linear-gradient(135deg, #00D4FF, #80EAFF, #9333EA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Turn Ideas Into<br />Real Businesses
                </h2>
                <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--fsi-text-muted)' }}>
                  Describe your idea. Get a full business blueprint — brand, offers, landing page, ads, and monetization roadmap. In seconds.
                </p>
              </div>

              {/* Main idea input */}
              <div className="rounded-2xl p-5 space-y-4" style={{ background: 'var(--fsi-surface)', border: '1px solid var(--fsi-border)' }}>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--fsi-text-muted)' }}>
                    Your Business Idea *
                  </label>
                  <textarea
                    value={idea}
                    onChange={e => setIdea(e.target.value)}
                    placeholder="e.g. A subscription box for Bangladeshi spice lovers living abroad — monthly curated spice kits with recipe cards..."
                    rows={3}
                    className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none transition-all"
                    style={{
                      background: 'var(--fsi-surface-2)',
                      border: `1px solid ${idea.length > 10 ? 'rgba(0,212,255,0.4)' : 'var(--fsi-border)'}`,
                      color: 'var(--fsi-text)',
                    }}
                  />
                  <p className="text-xs" style={{ color: idea.length > 10 ? 'var(--fsi-gold)' : 'var(--fsi-text-muted)' }}>
                    {idea.length}/500 — more detail = better blueprint
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--fsi-text-muted)' }}>Target Audience</label>
                    <input
                      value={audience}
                      onChange={e => setAudience(e.target.value)}
                      placeholder="e.g. Bangladeshi diaspora in UK/USA"
                      className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                      style={{ background: 'var(--fsi-surface-2)', border: '1px solid var(--fsi-border)', color: 'var(--fsi-text)' }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--fsi-text-muted)' }}>Business Type</label>
                    <div className="flex flex-wrap gap-1.5">
                      {NICHES.map(n => (
                        <button key={n} onClick={() => setNiche(n === niche ? '' : n)}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
                          style={{
                            background: niche === n ? 'rgba(0,212,255,0.15)' : 'var(--fsi-surface-2)',
                            color: niche === n ? 'var(--fsi-gold)' : 'var(--fsi-text-muted)',
                            border: `1px solid ${niche === n ? 'rgba(0,212,255,0.4)' : 'var(--fsi-border)'}`,
                          }}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--fsi-text-muted)' }}>Starting Budget</label>
                    <div className="flex flex-wrap gap-1.5">
                      {BUDGETS.map(b => (
                        <button key={b} onClick={() => setBudget(b === budget ? '' : b)}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
                          style={{
                            background: budget === b ? 'rgba(147,51,234,0.15)' : 'var(--fsi-surface-2)',
                            color: budget === b ? 'var(--fsi-violet-glow)' : 'var(--fsi-text-muted)',
                            border: `1px solid ${budget === b ? 'rgba(147,51,234,0.4)' : 'var(--fsi-border)'}`,
                          }}>
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--fsi-text-muted)' }}>Primary Goal</label>
                    <div className="flex flex-wrap gap-1.5">
                      {GOALS.map(g => (
                        <button key={g} onClick={() => setGoal(g === goal ? '' : g)}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
                          style={{
                            background: goal === g ? 'rgba(0,230,118,0.12)' : 'var(--fsi-surface-2)',
                            color: goal === g ? '#00E676' : 'var(--fsi-text-muted)',
                            border: `1px solid ${goal === g ? 'rgba(0,230,118,0.35)' : 'var(--fsi-border)'}`,
                          }}>
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-400 text-center">{error}</p>
              )}

              {/* Generate CTA */}
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={startGeneration}
                disabled={idea.trim().length < 10}
                className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, var(--fsi-gold), var(--fsi-violet))',
                  color: '#fff',
                  boxShadow: idea.trim().length >= 10 ? '0 0 30px rgba(0,212,255,0.3), 0 0 60px rgba(147,51,234,0.2)' : 'none',
                }}>
                <Sparkles size={18} />
                Generate My Business Blueprint
                <ArrowRight size={18} />
              </motion.button>

              {/* Stats bar */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Zap, label: 'Generation Time', value: '~15 sec', color: 'var(--fsi-gold)' },
                  { icon: FileText, label: 'Blueprint Sections', value: '8 sections', color: 'var(--fsi-violet-glow)' },
                  { icon: TrendingUp, label: 'Revenue Roadmap', value: '3 phases', color: '#00E676' },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="rounded-xl p-3 text-center" style={{ background: 'var(--fsi-surface)', border: '1px solid var(--fsi-border)' }}>
                    <Icon size={16} className="mx-auto mb-1" style={{ color }} />
                    <p className="text-xs font-bold" style={{ color: 'var(--fsi-text)' }}>{value}</p>
                    <p className="text-xs" style={{ color: 'var(--fsi-text-muted)' }}>{label}</p>
                  </div>
                ))}
              </div>

              {/* Saved businesses preview */}
              {savedList.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--fsi-text-muted)' }}>Recent Blueprints</p>
                    <button onClick={() => setStep('saved')} className="text-xs" style={{ color: 'var(--fsi-gold)' }}>View all →</button>
                  </div>
                  <div className="space-y-2">
                    {savedList.slice(0, 3).map(b => (
                      <div key={b.id} className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                        style={{ background: 'var(--fsi-surface)', border: '1px solid var(--fsi-border)' }}>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: 'rgba(0,212,255,0.1)' }}>
                          <Rocket size={13} style={{ color: 'var(--fsi-gold)' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: 'var(--fsi-text)' }}>{b.name}</p>
                          <p className="text-xs truncate" style={{ color: 'var(--fsi-text-muted)' }}>{b.tagline}</p>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(0,230,118,0.1)', color: '#00E676' }}>draft</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ── GENERATING ─────────────────────────────────────────────────── */}
          {step === 'generating' && (
            <motion.div key="gen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
              {/* Animated sphere */}
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 rounded-full animate-spin-slow"
                  style={{ background: 'conic-gradient(from 0deg, #00D4FF, #9333EA, #00D4FF)', filter: 'blur(2px)', opacity: 0.6 }} />
                <div className="absolute inset-2 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--fsi-void)' }}>
                  <DollarSign size={32} style={{ color: 'var(--fsi-gold)' }} />
                </div>
                <div className="absolute -inset-2 rounded-full border animate-pulse"
                  style={{ borderColor: 'rgba(0,212,255,0.3)' }} />
              </div>

              <div className="text-center space-y-2">
                <h2 className="font-display font-bold text-xl" style={{ color: 'var(--fsi-text)' }}>
                  Building Your Blueprint
                </h2>
                <p className="text-sm animate-pulse" style={{ color: 'var(--fsi-gold)' }}>
                  {GEN_STEPS[genStep]}
                </p>
              </div>

              {/* Step checklist */}
              <div className="w-full max-w-xs space-y-2">
                {GEN_STEPS.map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-3 text-sm">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      i < genStep ? 'bg-green-500/20 text-green-400'
                      : i === genStep ? 'bg-cyan-500/20 text-cyan-400 animate-pulse'
                      : 'bg-white/5 text-white/20'}`}>
                      {i < genStep ? <Check size={11} /> : i === genStep ? <Loader2 size={11} className="animate-spin" /> : <span className="text-xs">{i + 1}</span>}
                    </div>
                    <span style={{ color: i <= genStep ? 'var(--fsi-text)' : 'var(--fsi-text-muted)', opacity: i <= genStep ? 1 : 0.4 }}>
                      {s.replace('...', '')}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── RESULT ─────────────────────────────────────────────────────── */}
          {step === 'result' && blueprint && (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="space-y-4 mt-2">

              {/* Business name hero */}
              <div className="rounded-2xl p-6 text-center relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.08), rgba(147,51,234,0.08))', border: '1px solid rgba(0,212,255,0.2)' }}>
                <div className="absolute inset-0 opacity-5"
                  style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, #00D4FF, transparent 50%), radial-gradient(circle at 70% 70%, #9333EA, transparent 50%)' }} />
                <div className="relative z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-3"
                    style={{ background: 'rgba(0,230,118,0.12)', color: '#00E676', border: '1px solid rgba(0,230,118,0.3)' }}>
                    <Check size={11} />
                    Blueprint Generated {savedId ? '& Saved' : ''}
                  </span>
                  <h2 className="font-display font-bold text-3xl mb-1"
                    style={{ background: 'linear-gradient(135deg, #00D4FF, #9333EA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {blueprint.businessName}
                  </h2>
                  <p className="text-sm italic" style={{ color: 'var(--fsi-text-muted)' }}>{blueprint.tagline}</p>

                  {/* Color palette */}
                  {blueprint.brandIdentity?.colorPalette && (
                    <div className="flex items-center justify-center gap-2 mt-4">
                      {blueprint.brandIdentity.colorPalette.map((c, i) => (
                        <div key={i} className="w-7 h-7 rounded-full border-2 border-white/10"
                          style={{ background: c }} title={c} />
                      ))}
                      <span className="text-xs ml-1" style={{ color: 'var(--fsi-text-muted)' }}>Brand palette</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Business Model */}
              <Card icon={TrendingUp} title="Business Model" color="var(--fsi-gold)">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className="text-xs" style={{ color: 'var(--fsi-text-muted)' }}>Type</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--fsi-text)' }}>{blueprint.businessModel?.type}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs" style={{ color: 'var(--fsi-text-muted)' }}>Revenue Est.</p>
                    <p className="text-sm font-bold" style={{ color: '#00E676' }}>{blueprint.businessModel?.estimatedMonthlyRevenue}/mo</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs" style={{ color: 'var(--fsi-text-muted)' }}>Time to Revenue</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--fsi-text)' }}>{blueprint.businessModel?.timeToFirstRevenue}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs" style={{ color: 'var(--fsi-text-muted)' }}>Revenue Streams</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--fsi-text)' }}>{blueprint.businessModel?.revenueStreams?.length || 0} streams</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed mt-2" style={{ color: 'var(--fsi-text-muted)' }}>
                  {blueprint.businessModel?.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {blueprint.businessModel?.revenueStreams?.map((s, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(0,212,255,0.08)', color: 'var(--fsi-gold)', border: '1px solid rgba(0,212,255,0.15)' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </Card>

              {/* Brand Identity */}
              <Card icon={Palette} title="Brand Identity" color="var(--fsi-violet-glow)">
                <div className="space-y-2">
                  <div>
                    <p className="text-xs mb-1" style={{ color: 'var(--fsi-text-muted)' }}>Positioning</p>
                    <p className="text-sm" style={{ color: 'var(--fsi-text)' }}>{blueprint.brandIdentity?.positioning}</p>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: 'var(--fsi-text-muted)' }}>Unique Value</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--fsi-violet-glow)' }}>{blueprint.brandIdentity?.uniqueSellingProposition}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: 'var(--fsi-text-muted)' }}>Tone:</span>
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(147,51,234,0.1)', color: 'var(--fsi-violet-glow)', border: '1px solid rgba(147,51,234,0.2)' }}>
                      {blueprint.brandIdentity?.tone}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Offer Structure */}
              <Card icon={Target} title="Offer Structure" color="#F59E0B">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs" style={{ color: 'var(--fsi-text-muted)' }}>Main Offer</p>
                      <p className="text-sm font-medium" style={{ color: 'var(--fsi-text)' }}>{blueprint.offerStructure?.mainOffer}</p>
                    </div>
                    <span className="text-base font-bold whitespace-nowrap" style={{ color: '#F59E0B' }}>{blueprint.offerStructure?.pricePoint}</span>
                  </div>
                  {blueprint.offerStructure?.upsells?.length > 0 && (
                    <div>
                      <p className="text-xs mb-1" style={{ color: 'var(--fsi-text-muted)' }}>Upsells</p>
                      <div className="flex flex-wrap gap-1.5">
                        {blueprint.offerStructure.upsells.map((u, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.2)' }}>
                            + {u}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="text-xs italic" style={{ color: 'var(--fsi-text-muted)' }}>
                    Hook: {blueprint.offerStructure?.guaranteeOrHook}
                  </p>
                </div>
              </Card>

              {/* Landing Page Copy */}
              <Card icon={FileText} title="Landing Page Copy" color="#3B82F6">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs mb-1" style={{ color: 'var(--fsi-text-muted)' }}>Headline</p>
                      <p className="text-base font-bold leading-snug" style={{ color: 'var(--fsi-text)' }}>
                        {blueprint.landingPageContent?.headline}
                      </p>
                    </div>
                    <CopyBtn text={blueprint.landingPageContent?.headline || ''} />
                  </div>
                  <p className="text-sm" style={{ color: 'var(--fsi-text-muted)' }}>
                    {blueprint.landingPageContent?.subheadline}
                  </p>
                  <div className="space-y-2 pt-1">
                    {blueprint.landingPageContent?.features?.map((f, i) => (
                      <div key={i} className="flex gap-2">
                        <Check size={14} className="mt-0.5 shrink-0" style={{ color: '#3B82F6' }} />
                        <div>
                          <span className="text-sm font-medium" style={{ color: 'var(--fsi-text)' }}>{f.title}: </span>
                          <span className="text-sm" style={{ color: 'var(--fsi-text-muted)' }}>{f.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs px-3 py-1 rounded-lg font-bold"
                      style={{ background: 'rgba(59,130,246,0.15)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.3)' }}>
                      CTA: {blueprint.landingPageContent?.callToAction}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Ad Creatives */}
              <Card icon={Megaphone} title="Ad Creatives" color="#EC4899">
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-xs" style={{ color: 'var(--fsi-text-muted)' }}>Hook Lines</p>
                    </div>
                    <div className="space-y-1.5">
                      {blueprint.adCreatives?.hooks?.map((h, i) => (
                        <div key={i} className="flex items-start gap-2 group">
                          <span className="text-xs font-mono mt-0.5 shrink-0" style={{ color: '#EC4899' }}>0{i + 1}</span>
                          <p className="text-sm flex-1" style={{ color: 'var(--fsi-text)' }}>{h}</p>
                          <CopyBtn text={h} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs" style={{ color: 'var(--fsi-text-muted)' }}>Full Ad Copy</p>
                      <CopyBtn text={blueprint.adCreatives?.adCopy || ''} />
                    </div>
                    <p className="text-sm leading-relaxed p-3 rounded-xl" style={{ background: 'var(--fsi-surface-2)', color: 'var(--fsi-text)' }}>
                      {blueprint.adCreatives?.adCopy}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs" style={{ color: 'var(--fsi-text-muted)' }}>Targeting</p>
                      <p className="text-sm" style={{ color: 'var(--fsi-text)' }}>{blueprint.adCreatives?.targetingStrategy}</p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: 'var(--fsi-text-muted)' }}>Est. CPC</p>
                      <p className="text-sm font-bold" style={{ color: '#EC4899' }}>{blueprint.adCreatives?.estimatedCPC}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Monetization Roadmap */}
              <Card icon={BarChart3} title="Revenue Roadmap" color="#00E676">
                <div className="space-y-3">
                  {[
                    { phase: 'phase1', label: 'Phase 1', color: 'var(--fsi-gold)' },
                    { phase: 'phase2', label: 'Phase 2', color: 'var(--fsi-violet-glow)' },
                    { phase: 'phase3', label: 'Phase 3', color: '#00E676' },
                  ].map(({ phase, label, color }) => {
                    const p = blueprint.monetizationPlan?.[phase as keyof typeof blueprint.monetizationPlan]
                    if (!p) return null
                    return (
                      <div key={phase} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                            style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>
                            {label.split(' ')[1]}
                          </div>
                          {phase !== 'phase3' && <div className="w-px flex-1 my-1" style={{ background: 'var(--fsi-border)' }} />}
                        </div>
                        <div className="flex-1 pb-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs" style={{ color: 'var(--fsi-text-muted)' }}>{p.timeline}</span>
                            <span className="text-sm font-bold" style={{ color }}>{p.expectedRevenue}</span>
                          </div>
                          <p className="text-sm mt-0.5" style={{ color: 'var(--fsi-text)' }}>{p.action}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>

              {/* Market Analysis */}
              <Card icon={Globe} title="Market Analysis" color="var(--fsi-gold)">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="text-center p-2 rounded-xl" style={{ background: 'var(--fsi-surface-2)' }}>
                    <p className="text-xs mb-1" style={{ color: 'var(--fsi-text-muted)' }}>Market Size</p>
                    <p className="text-xs font-bold" style={{ color: 'var(--fsi-text)' }}>{blueprint.marketAnalysis?.marketSize}</p>
                  </div>
                  <div className="text-center p-2 rounded-xl" style={{ background: 'var(--fsi-surface-2)' }}>
                    <p className="text-xs mb-1" style={{ color: 'var(--fsi-text-muted)' }}>Competition</p>
                    <p className="text-xs font-bold" style={{
                      color: blueprint.marketAnalysis?.competition === 'Low' ? '#00E676'
                        : blueprint.marketAnalysis?.competition === 'High' ? '#EC4899' : '#F59E0B'
                    }}>{blueprint.marketAnalysis?.competition}</p>
                  </div>
                  <div className="text-center p-2 rounded-xl col-span-2" style={{ background: 'var(--fsi-surface-2)' }}>
                    <p className="text-xs mb-1" style={{ color: 'var(--fsi-text-muted)' }}>Market Trend</p>
                    <p className="text-xs font-bold" style={{ color: 'var(--fsi-text)' }}>{blueprint.marketAnalysis?.trend}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs mb-1.5" style={{ color: 'var(--fsi-text-muted)' }}>Key Competitors</p>
                  <div className="flex flex-wrap gap-1.5">
                    {blueprint.marketAnalysis?.keyCompetitors?.map((c, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: 'var(--fsi-surface-2)', color: 'var(--fsi-text-muted)', border: '1px solid var(--fsi-border)' }}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Next Steps */}
              <Card icon={Rocket} title="Your Next Steps" color="#00E676">
                <div className="space-y-2">
                  {blueprint.nextSteps?.map((s, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ background: 'rgba(0,230,118,0.12)', color: '#00E676', border: '1px solid rgba(0,230,118,0.3)' }}>
                        {i + 1}
                      </span>
                      <p className="text-sm leading-snug" style={{ color: 'var(--fsi-text)' }}>{s}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={reset}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm"
                  style={{ background: 'var(--fsi-surface-2)', color: 'var(--fsi-text-muted)', border: '1px solid var(--fsi-border)' }}>
                  <RefreshCw size={15} />
                  New Blueprint
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setStep('saved')}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm"
                  style={{ background: 'rgba(0,212,255,0.1)', color: 'var(--fsi-gold)', border: '1px solid rgba(0,212,255,0.25)' }}>
                  <Store size={15} />
                  My Blueprints
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── SAVED LIST ─────────────────────────────────────────────────── */}
          {step === 'saved' && (
            <motion.div key="saved" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="space-y-4 mt-2">
              <div className="flex items-center gap-2 mb-2">
                <button onClick={() => setStep('form')} style={{ color: 'var(--fsi-text-muted)' }}>
                  <ChevronLeft size={18} />
                </button>
                <h2 className="font-display font-bold text-lg" style={{ color: 'var(--fsi-text)' }}>My Blueprints</h2>
                <span className="text-xs px-2 py-0.5 rounded-full ml-auto"
                  style={{ background: 'rgba(0,212,255,0.1)', color: 'var(--fsi-gold)' }}>
                  {savedList.length} total
                </span>
              </div>

              {loadingSaved && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 size={24} className="animate-spin" style={{ color: 'var(--fsi-gold)' }} />
                </div>
              )}

              {!loadingSaved && savedList.length === 0 && (
                <div className="text-center py-16">
                  <Lightbulb size={40} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--fsi-gold)' }} />
                  <p className="font-display font-bold text-lg" style={{ color: 'var(--fsi-text)' }}>No blueprints yet</p>
                  <p className="text-sm mt-1" style={{ color: 'var(--fsi-text-muted)' }}>Generate your first business blueprint</p>
                  <button onClick={reset} className="mt-4 px-5 py-2 rounded-xl text-sm font-semibold"
                    style={{ background: 'rgba(0,212,255,0.1)', color: 'var(--fsi-gold)', border: '1px solid rgba(0,212,255,0.2)' }}>
                    Get Started →
                  </button>
                </div>
              )}

              <div className="space-y-3">
                {savedList.map((b, i) => (
                  <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="rounded-2xl p-4 group"
                    style={{ background: 'var(--fsi-surface)', border: '1px solid var(--fsi-border)' }}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(147,51,234,0.15))', border: '1px solid rgba(0,212,255,0.2)' }}>
                          <Rocket size={16} style={{ color: 'var(--fsi-gold)' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate" style={{ color: 'var(--fsi-text)' }}>{b.name}</p>
                          <p className="text-xs truncate mt-0.5" style={{ color: 'var(--fsi-text-muted)' }}>{b.tagline}</p>
                          <p className="text-xs mt-1" style={{ color: 'var(--fsi-text-muted)' }}>
                            {new Date(b.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <button onClick={() => deleteB(b.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 rounded-lg transition-all hover:bg-red-500/10"
                        style={{ color: 'var(--fsi-text-muted)' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
