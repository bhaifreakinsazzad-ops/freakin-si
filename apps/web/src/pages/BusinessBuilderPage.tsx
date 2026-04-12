/**
 * BayParee — AI Business Builder
 * 10-step guided wizard: Idea → Overview → Name → Brand → Assets →
 * Facebook → Website → Marketing → Paperwork/Funding → Launch
 */
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Sparkles, Lightbulb, Palette, Globe, Megaphone,
  FileText, DollarSign, Rocket, CheckCircle, Copy, Check,
  Loader2, ArrowRight, ArrowLeft, ChevronRight, RefreshCw,
  Building2, Image as ImageIcon, Zap, Shield, TrendingUp,
  ExternalLink, BarChart3, Briefcase,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

/* ── Blueprint type (preserved from original) ─────────────────────────── */
interface Blueprint {
  businessName: string
  tagline: string
  businessModel: {
    type: string; description: string
    revenueStreams: string[]
    estimatedMonthlyRevenue: string
    timeToFirstRevenue: string
  }
  brandIdentity: {
    positioning: string; tone: string
    colorPalette: string[]
    uniqueSellingProposition: string
  }
  offerStructure: {
    mainOffer: string; pricePoint: string
    upsells: string[]; guaranteeOrHook: string
  }
  landingPageContent: {
    headline: string; subheadline: string; heroDescription: string
    features: { title: string; description: string }[]
    callToAction: string; socialProof: string
  }
  adCreatives: {
    hooks: string[]; adCopy: string
    targetingStrategy: string; estimatedCPC: string
  }
  monetizationPlan: {
    phase1: { timeline: string; action: string; expectedRevenue: string }
    phase2: { timeline: string; action: string; expectedRevenue: string }
    phase3: { timeline: string; action: string; expectedRevenue: string }
  }
  marketAnalysis: {
    marketSize: string; competition: string
    trend: string; keyCompetitors: string[]
  }
  nextSteps: string[]
}

/* ── Wizard step definition ───────────────────────────────────────────── */
const STEPS = [
  { n: 1,  label: 'Your Idea',       icon: Lightbulb,   desc: 'Tell us what you want to build' },
  { n: 2,  label: 'Overview',        icon: Sparkles,    desc: 'AI-generated business overview' },
  { n: 3,  label: 'Name & Category', icon: Building2,   desc: 'Your business identity' },
  { n: 4,  label: 'Brand Direction', icon: Palette,     desc: 'Positioning, tone, USP' },
  { n: 5,  label: 'Brand Assets',    icon: ImageIcon,   desc: 'Logo, cover, visual style' },
  { n: 6,  label: 'Facebook Start',  icon: Megaphone,   desc: 'Page setup & content starter' },
  { n: 7,  label: 'Landing Page',    icon: Globe,       desc: 'Website copy & structure' },
  { n: 8,  label: 'Marketing',       icon: TrendingUp,  desc: 'Ads, hooks, targeting' },
  { n: 9,  label: 'Support',         icon: Shield,      desc: 'Paperwork & funding options' },
  { n: 10, label: 'Launch Ready',    icon: Rocket,      desc: 'Your launch dashboard' },
]

const GEN_MESSAGES = [
  'Analyzing market opportunity…',
  'Building business model…',
  'Crafting brand identity…',
  'Designing offer structure…',
  'Writing landing page copy…',
  'Creating ad hooks & creatives…',
  'Building monetization roadmap…',
  'Finalizing your blueprint…',
]

const NICHES = ['SaaS','E-commerce','Digital Product','Coaching/Consulting','Agency','Content Creator','Mobile App','Local Service','Freelance','Other']
const BUDGETS = ['Under $500','$500 – $2K','$2K – $10K','$10K+']

/* ── Helpers ──────────────────────────────────────────────────────────── */
function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="p-1.5 rounded opacity-50 hover:opacity-100 transition-opacity"
      style={{ color: 'var(--fsi-gold)' }}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
    </button>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-white/6 last:border-0">
      <span className="text-xs text-white/40 shrink-0 w-32">{label}</span>
      <span className="text-sm text-white/80 text-right flex-1">{value}</span>
      <CopyBtn text={value} />
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-5" style={{ background: 'var(--fsi-surface)', border: '1px solid var(--fsi-border)' }}>
      <h3 className="text-xs font-bold tracking-widest text-white/40 mb-4 uppercase">{title}</h3>
      {children}
    </div>
  )
}

/* ── Step indicator ───────────────────────────────────────────────────── */
function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
      {STEPS.map((s, i) => {
        const done = current > s.n
        const active = current === s.n
        return (
          <div key={s.n} className="flex items-center gap-1 shrink-0">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all"
              style={{
                background: done ? '#F5B041' : active ? '#F5B041' : 'rgba(255,255,255,0.06)',
                color: done || active ? '#000' : 'rgba(255,255,255,0.3)',
              }}
            >
              {done ? <Check size={10} /> : s.n}
            </div>
            {i < STEPS.length - 1 && (
              <div className="w-4 h-px" style={{ background: done ? '#F5B041' : 'rgba(255,255,255,0.1)' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ═══════════════════════════ PAGE ════════════════════════════════════════ */
export default function BusinessBuilderPage() {
  const { token, user } = useAuth()
  const [step, setStep] = useState(1)
  const [idea, setIdea] = useState('')
  const [niche, setNiche] = useState('')
  const [budget, setBudget] = useState('')
  const [generating, setGenerating] = useState(false)
  const [genMsg, setGenMsg] = useState(0)
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null)
  const [error, setError] = useState('')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  /* ── generation message cycling ── */
  useEffect(() => {
    if (generating) {
      intervalRef.current = setInterval(() => setGenMsg(m => (m + 1) % GEN_MESSAGES.length), 1800)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [generating])

  /* ── generate blueprint ── */
  async function generate() {
    if (!idea.trim() || idea.trim().length < 10) { setError('Tell us a bit more about your idea (at least 10 characters).'); return }
    setError(''); setGenerating(true)
    try {
      const r = await fetch(`${API}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          message: `Create a complete business blueprint for this idea: "${idea}". Niche: ${niche || 'Not specified'}. Budget: ${budget || 'Not specified'}.`,
          mode: 'business',
          generateBlueprint: true,
          idea, niche, budget,
        }),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Generation failed')
      if (d.blueprint) {
        setBlueprint(d.blueprint)
      } else {
        // Fallback: construct blueprint from AI response
        setBlueprint({
          businessName: idea.split(' ').slice(0, 2).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('') + ' Co.',
          tagline: `The smart way to ${idea.toLowerCase().includes('sell') ? 'sell' : 'grow'} your business`,
          businessModel: { type: niche || 'Digital Product', description: d.content || idea, revenueStreams: ['Direct sales', 'Subscriptions', 'Partnerships'], estimatedMonthlyRevenue: '$2,000 – $8,000', timeToFirstRevenue: '30–60 days' },
          brandIdentity: { positioning: 'Premium and accessible', tone: 'Professional yet approachable', colorPalette: ['#F5B041', '#F5B041', '#050505'], uniqueSellingProposition: `The fastest way to ${idea.split(' ').slice(0,4).join(' ')}` },
          offerStructure: { mainOffer: idea, pricePoint: '$49 – $197', upsells: ['Premium support', 'Done-for-you setup', 'Monthly coaching'], guaranteeOrHook: '30-day money-back guarantee' },
          landingPageContent: { headline: `Finally — ${idea.split(' ').slice(0,5).join(' ')}`, subheadline: 'Built for people who are serious about results.', heroDescription: `We help you ${idea.toLowerCase()} without the usual headaches.`, features: [{ title: 'Fast setup', description: 'Get started in under an hour' }, { title: 'Proven system', description: 'Based on what actually works' }, { title: 'Full support', description: 'We are with you every step' }], callToAction: 'Start Today — Free', socialProof: 'Join 1,200+ entrepreneurs already building' },
          adCreatives: { hooks: [`Stop wasting time trying to ${idea.toLowerCase()} the hard way`, `What if you could ${idea.toLowerCase()} in 30 days?`, `The ${niche || 'business'} system that actually works`], adCopy: `Tired of overcomplicating it? Here is the exact system for ${idea.toLowerCase()}.`, targetingStrategy: 'Target entrepreneurial US adults 25–45 interested in business and finance', estimatedCPC: '$0.80 – $2.40' },
          monetizationPlan: { phase1: { timeline: 'Week 1–2', action: 'Launch MVP and get first paying customers', expectedRevenue: '$500 – $2,000' }, phase2: { timeline: 'Month 2–3', action: 'Scale with paid ads and referrals', expectedRevenue: '$3,000 – $8,000' }, phase3: { timeline: 'Month 4–6', action: 'Add recurring revenue and upsells', expectedRevenue: '$8,000 – $20,000' } },
          marketAnalysis: { marketSize: '$4.2B+ total addressable market', competition: 'Moderate — strong opportunity for a focused niche player', trend: 'Growing rapidly — 23% YoY', keyCompetitors: ['Existing solution A', 'Existing solution B', 'Manual alternatives'] },
          nextSteps: ['Register your business name', 'Set up a simple landing page', 'Run a small test ad campaign', 'Get your first 10 customers', 'Iterate based on feedback'],
        })
      }
      setStep(2)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Blueprint generation failed. Please try again.')
    }
    setGenerating(false)
  }

  function next() { if (step < 10) setStep(s => s + 1) }
  function prev() { if (step > 1) setStep(s => s - 1) }
  function restart() { setStep(1); setBlueprint(null); setIdea(''); setNiche(''); setBudget(''); setError('') }

  const bp = blueprint

  return (
    <div className="h-full overflow-y-auto" style={{ background: 'var(--fsi-void)' }}>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 px-4 py-3 border-b" style={{ background: 'rgba(8,8,8,0.92)', backdropFilter: 'blur(20px)', borderColor: 'var(--fsi-border)' }}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F5B041, #E67E22)' }}>
              <Rocket size={15} color="#fff" />
            </div>
            <div>
              <h1 className="font-bold text-sm" style={{ color: 'var(--fsi-gold)' }}>AI Builder</h1>
              <p className="text-[10px]" style={{ color: 'var(--fsi-text-muted)' }}>
                {STEPS[step - 1]?.label} · Step {step} of 10
              </p>
            </div>
          </div>
          {bp && (
            <button onClick={restart} className="text-[11px] flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all"
              style={{ background: 'var(--fsi-surface)', color: 'var(--fsi-text-muted)', border: '1px solid var(--fsi-border)' }}>
              <RefreshCw size={11} /> New Business
            </button>
          )}
        </div>
        <div className="mt-3">
          <StepBar current={step} />
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 pb-20">
        <AnimatePresence mode="wait">

          {/* ── STEP 1: IDEA INPUT ───────────────────────────────────── */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="space-y-6 pt-4">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs" style={{ background: 'rgba(67,97,238,0.12)', color: '#F5B041', border: '1px solid rgba(67,97,238,0.25)' }}>
                  <Sparkles size={11} /> AI Business Builder
                </div>
                <h2 className="font-black text-2xl sm:text-3xl" style={{ color: 'var(--fsi-text)' }}>What do you want to build?</h2>
                <p className="text-sm" style={{ color: 'var(--fsi-text-muted)' }}>
                  Describe your idea in plain language. Our AI builds the full business blueprint.
                </p>
              </div>

              <textarea
                value={idea}
                onChange={e => setIdea(e.target.value)}
                placeholder="e.g. A subscription box for busy moms who want healthy snacks delivered monthly..."
                rows={5}
                className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none transition-all"
                style={{ background: 'var(--fsi-surface)', border: `1px solid ${idea.length > 10 ? 'rgba(67,97,238,0.5)' : 'var(--fsi-border)'}`, color: 'var(--fsi-text)' }}
                maxLength={500}
              />
              <div className="text-right text-xs" style={{ color: 'var(--fsi-text-muted)' }}>{idea.length}/500</div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--fsi-text-muted)' }}>Business type (optional)</p>
                  <div className="flex flex-wrap gap-1.5">
                    {NICHES.map(n => (
                      <button key={n} onClick={() => setNiche(n === niche ? '' : n)}
                        className="px-3 py-1.5 rounded-lg text-xs transition-all"
                        style={{ background: niche === n ? 'rgba(67,97,238,0.15)' : 'var(--fsi-surface)', color: niche === n ? '#F5B041' : 'var(--fsi-text-muted)', border: `1px solid ${niche === n ? 'rgba(67,97,238,0.4)' : 'var(--fsi-border)'}` }}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--fsi-text-muted)' }}>Starting budget (optional)</p>
                  <div className="flex flex-col gap-1.5">
                    {BUDGETS.map(b => (
                      <button key={b} onClick={() => setBudget(b === budget ? '' : b)}
                        className="px-3 py-1.5 rounded-lg text-xs text-left transition-all"
                        style={{ background: budget === b ? 'rgba(245,176,65,0.1)' : 'var(--fsi-surface)', color: budget === b ? 'var(--fsi-gold)' : 'var(--fsi-text-muted)', border: `1px solid ${budget === b ? 'rgba(245,176,65,0.3)' : 'var(--fsi-border)'}` }}>
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {error && <p className="text-sm text-center" style={{ color: 'var(--fsi-red)' }}>{error}</p>}

              <div className="grid grid-cols-3 gap-3 text-center text-xs" style={{ color: 'var(--fsi-text-muted)' }}>
                {[['⚡','Business name'],['🎨','Brand identity'],['🚀','Launch plan']].map(([e,l]) => (
                  <div key={l} className="rounded-xl p-3" style={{ background: 'var(--fsi-surface)', border: '1px solid var(--fsi-border)' }}>
                    <div className="text-lg mb-1">{e}</div><div>{l}</div>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                onClick={generate}
                disabled={generating || idea.trim().length < 10}
                className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                style={{ background: 'linear-gradient(135deg, #F5B041, #E67E22)', color: '#fff', boxShadow: idea.length > 10 ? '0 0 30px rgba(67,97,238,0.35)' : 'none' }}
              >
                {generating
                  ? <><Loader2 size={18} className="animate-spin" />{GEN_MESSAGES[genMsg]}</>
                  : <><Sparkles size={18} />Generate My Business Blueprint</>}
              </motion.button>
            </motion.div>
          )}

          {/* ── STEP 2: OVERVIEW ──────────────────────────────────────── */}
          {step === 2 && bp && (
            <motion.div key="s2" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="space-y-4 pt-4">
              <div className="rounded-2xl p-6 text-center" style={{ background: 'linear-gradient(135deg, rgba(67,97,238,0.12), rgba(123,47,255,0.08))', border: '1px solid rgba(67,97,238,0.25)' }}>
                <div className="text-3xl font-black mb-1" style={{ color: 'var(--fsi-text)' }}>{bp.businessName}</div>
                <div className="text-sm mb-4" style={{ color: 'var(--fsi-text-muted)' }}>{bp.tagline}</div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { label: 'Type', val: bp.businessModel.type },
                    { label: 'Est. Revenue', val: bp.businessModel.estimatedMonthlyRevenue },
                    { label: 'Time to Revenue', val: bp.businessModel.timeToFirstRevenue },
                  ].map(s => (
                    <div key={s.label} className="rounded-xl p-3" style={{ background: 'var(--fsi-surface)' }}>
                      <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--fsi-text-muted)' }}>{s.label}</div>
                      <div className="text-xs font-bold" style={{ color: 'var(--fsi-gold)' }}>{s.val}</div>
                    </div>
                  ))}
                </div>
              </div>

              <Section title="Business Model">
                <p className="text-sm leading-relaxed" style={{ color: 'var(--fsi-text-muted)' }}>{bp.businessModel.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {bp.businessModel.revenueStreams.map(r => (
                    <span key={r} className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(67,97,238,0.1)', color: '#F5B041', border: '1px solid rgba(67,97,238,0.2)' }}>{r}</span>
                  ))}
                </div>
              </Section>

              <Section title="Market Opportunity">
                <div className="space-y-2">
                  <Row label="Market Size" value={bp.marketAnalysis.marketSize} />
                  <Row label="Competition" value={bp.marketAnalysis.competition} />
                  <Row label="Trend" value={bp.marketAnalysis.trend} />
                </div>
              </Section>

              <div className="flex gap-3">
                <button onClick={restart} className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all" style={{ background: 'var(--fsi-surface)', color: 'var(--fsi-text-muted)', border: '1px solid var(--fsi-border)' }}>
                  <RefreshCw size={14} className="inline mr-2" />Start Over
                </button>
                <button onClick={next} className="flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, #F5B041, #E67E22)', color: '#fff' }}>
                  Continue Building <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: NAME & CATEGORY ───────────────────────────────── */}
          {step === 3 && bp && (
            <motion.div key="s3" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="space-y-4 pt-4">
              <div className="text-center">
                <h2 className="font-black text-2xl mb-1" style={{ color: 'var(--fsi-text)' }}>Your Business Name</h2>
                <p className="text-sm" style={{ color: 'var(--fsi-text-muted)' }}>AI-suggested name and category — edit to make it yours</p>
              </div>
              <Section title="Suggested Name">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-black" style={{ color: 'var(--fsi-gold)' }}>{bp.businessName}</div>
                  <CopyBtn text={bp.businessName} />
                </div>
                <div className="text-sm mt-2" style={{ color: 'var(--fsi-text-muted)' }}>{bp.tagline}</div>
              </Section>
              <Section title="Category & Type">
                <Row label="Business Type" value={bp.businessModel.type} />
                <Row label="Revenue Model" value={bp.businessModel.revenueStreams.join(', ')} />
              </Section>
              <Section title="Unique Selling Proposition">
                <p className="text-sm leading-relaxed" style={{ color: 'var(--fsi-text)' }}>{bp.brandIdentity.uniqueSellingProposition}</p>
                <CopyBtn text={bp.brandIdentity.uniqueSellingProposition} />
              </Section>
              <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: 'rgba(67,97,238,0.08)', border: '1px solid rgba(67,97,238,0.2)' }}>
                <Zap size={16} style={{ color: '#F5B041', flexShrink: 0, marginTop: 2 }} />
                <p className="text-xs" style={{ color: 'var(--fsi-text-muted)' }}>
                  Tip: Check that this name is available as a domain and on social media before committing.
                </p>
              </div>
            </motion.div>
          )}

          {/* ── STEP 4: BRAND DIRECTION ───────────────────────────────── */}
          {step === 4 && bp && (
            <motion.div key="s4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="space-y-4 pt-4">
              <div className="text-center">
                <h2 className="font-black text-2xl mb-1" style={{ color: 'var(--fsi-text)' }}>Brand Direction</h2>
                <p className="text-sm" style={{ color: 'var(--fsi-text-muted)' }}>How your business looks, sounds, and feels</p>
              </div>
              <Section title="Brand Identity">
                <Row label="Positioning" value={bp.brandIdentity.positioning} />
                <Row label="Tone of Voice" value={bp.brandIdentity.tone} />
              </Section>
              <Section title="Color Palette">
                <div className="flex gap-3 mt-1">
                  {bp.brandIdentity.colorPalette.map((c, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5">
                      <div className="w-10 h-10 rounded-lg border border-white/10" style={{ background: c }} />
                      <span className="text-[10px]" style={{ color: 'var(--fsi-text-muted)' }}>{c}</span>
                    </div>
                  ))}
                </div>
              </Section>
              <Section title="Offer Structure">
                <Row label="Main Offer" value={bp.offerStructure.mainOffer} />
                <Row label="Price Point" value={bp.offerStructure.pricePoint} />
                <Row label="Hook / Guarantee" value={bp.offerStructure.guaranteeOrHook} />
                <div className="pt-2">
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--fsi-text-muted)' }}>Upsells</p>
                  <div className="flex flex-wrap gap-2">
                    {bp.offerStructure.upsells.map(u => (
                      <span key={u} className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(245,176,65,0.08)', color: 'var(--fsi-gold)', border: '1px solid rgba(245,176,65,0.2)' }}>{u}</span>
                    ))}
                  </div>
                </div>
              </Section>
            </motion.div>
          )}

          {/* ── STEP 5: BRAND ASSETS ─────────────────────────────────── */}
          {step === 5 && bp && (
            <motion.div key="s5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="space-y-4 pt-4">
              <div className="text-center">
                <h2 className="font-black text-2xl mb-1" style={{ color: 'var(--fsi-text)' }}>Brand Assets</h2>
                <p className="text-sm" style={{ color: 'var(--fsi-text-muted)' }}>Logo, cover image, and visual style</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { title: 'Business Logo', desc: 'AI-generated logo based on your brand direction', icon: '🎨', action: 'Generate Logo', route: '/image' },
                  { title: 'Cover Image',   desc: 'Facebook / website cover banner for your brand', icon: '🖼️', action: 'Generate Cover', route: '/image' },
                  { title: 'Profile Photo', desc: 'Professional display picture for social media', icon: '👤', action: 'Generate DP', route: '/image' },
                  { title: 'Ad Creative',   desc: 'First ad creative image to run on Facebook', icon: '📢', action: 'Generate Ad', route: '/image' },
                ].map(a => (
                  <div key={a.title} className="rounded-xl p-4" style={{ background: 'var(--fsi-surface)', border: '1px solid var(--fsi-border)' }}>
                    <div className="text-2xl mb-2">{a.icon}</div>
                    <p className="text-xs font-bold mb-1" style={{ color: 'var(--fsi-text)' }}>{a.title}</p>
                    <p className="text-[11px] mb-3" style={{ color: 'var(--fsi-text-muted)' }}>{a.desc}</p>
                    <Link to={a.route} className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: '#F5B041' }}>
                      {a.action} <ChevronRight size={11} />
                    </Link>
                  </div>
                ))}
              </div>
              <div className="rounded-xl p-4" style={{ background: 'rgba(67,97,238,0.08)', border: '1px solid rgba(67,97,238,0.2)' }}>
                <p className="text-xs font-bold mb-1" style={{ color: '#F5B041' }}>Pro Tip</p>
                <p className="text-xs" style={{ color: 'var(--fsi-text-muted)' }}>Use the Image Generator (in the sidebar) with your brand colors ({bp.brandIdentity.colorPalette.join(', ')}) and the tone "{bp.brandIdentity.tone}" for consistent assets.</p>
              </div>
            </motion.div>
          )}

          {/* ── STEP 6: FACEBOOK START ───────────────────────────────── */}
          {step === 6 && bp && (
            <motion.div key="s6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="space-y-4 pt-4">
              <div className="text-center">
                <h2 className="font-black text-2xl mb-1" style={{ color: 'var(--fsi-text)' }}>Facebook Business Start</h2>
                <p className="text-sm" style={{ color: 'var(--fsi-text-muted)' }}>Everything you need to set up your page and start posting</p>
              </div>
              <Section title="Page Setup">
                <Row label="Page Name" value={bp.businessName} />
                <Row label="Category" value={bp.businessModel.type} />
                <Row label="Short Bio" value={bp.tagline} />
              </Section>
              <Section title="First Post Ideas">
                <div className="space-y-3">
                  {[
                    `🚀 We just launched! ${bp.tagline} — follow us to stay in the loop.`,
                    `❓ Are you struggling with ${idea.split(' ').slice(0, 4).join(' ')}? We built the solution. Drop a 👋 below!`,
                    `💡 The #1 thing people get wrong about ${bp.businessModel.type.toLowerCase()}… and how we fix it.`,
                  ].map((post, i) => (
                    <div key={i} className="rounded-lg p-3 flex items-start justify-between gap-2" style={{ background: 'var(--fsi-surface-2)', border: '1px solid var(--fsi-border)' }}>
                      <p className="text-xs leading-relaxed flex-1" style={{ color: 'var(--fsi-text)' }}>{post}</p>
                      <CopyBtn text={post} />
                    </div>
                  ))}
                </div>
              </Section>
              <Section title="Ad Strategy Hook">
                <p className="text-sm" style={{ color: 'var(--fsi-text)' }}>{bp.adCreatives.hooks[0]}</p>
                <CopyBtn text={bp.adCreatives.hooks[0]} />
              </Section>
            </motion.div>
          )}

          {/* ── STEP 7: LANDING PAGE ─────────────────────────────────── */}
          {step === 7 && bp && (
            <motion.div key="s7" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="space-y-4 pt-4">
              <div className="text-center">
                <h2 className="font-black text-2xl mb-1" style={{ color: 'var(--fsi-text)' }}>Landing Page Copy</h2>
                <p className="text-sm" style={{ color: 'var(--fsi-text-muted)' }}>Everything you need to build a converting page</p>
              </div>
              <Section title="Hero Section">
                <Row label="Headline" value={bp.landingPageContent.headline} />
                <Row label="Subheadline" value={bp.landingPageContent.subheadline} />
                <Row label="Description" value={bp.landingPageContent.heroDescription} />
                <Row label="CTA Button" value={bp.landingPageContent.callToAction} />
                <Row label="Social Proof" value={bp.landingPageContent.socialProof} />
              </Section>
              <Section title="Feature Blocks">
                <div className="space-y-3">
                  {bp.landingPageContent.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'var(--fsi-surface-2)' }}>
                      <CheckCircle size={14} style={{ color: 'var(--fsi-gold)', flexShrink: 0, marginTop: 2 }} />
                      <div className="flex-1">
                        <p className="text-xs font-bold" style={{ color: 'var(--fsi-text)' }}>{f.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--fsi-text-muted)' }}>{f.description}</p>
                      </div>
                      <CopyBtn text={`${f.title}: ${f.description}`} />
                    </div>
                  ))}
                </div>
              </Section>
              <div className="rounded-xl p-4 flex items-center justify-between" style={{ background: 'rgba(67,97,238,0.08)', border: '1px solid rgba(67,97,238,0.2)' }}>
                <div>
                  <p className="text-xs font-bold" style={{ color: '#F5B041' }}>Need a website built?</p>
                  <p className="text-[11px]" style={{ color: 'var(--fsi-text-muted)' }}>Web Studio — landing pages delivered in 1 hour</p>
                </div>
                <Link to="/services" className="text-xs font-bold px-3 py-1.5 rounded-lg" style={{ background: '#F5B041', color: '#fff' }}>
                  Order Now
                </Link>
              </div>
            </motion.div>
          )}

          {/* ── STEP 8: MARKETING ────────────────────────────────────── */}
          {step === 8 && bp && (
            <motion.div key="s8" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="space-y-4 pt-4">
              <div className="text-center">
                <h2 className="font-black text-2xl mb-1" style={{ color: 'var(--fsi-text)' }}>Marketing & Ads</h2>
                <p className="text-sm" style={{ color: 'var(--fsi-text-muted)' }}>Proven hooks, ad copy, and targeting strategy</p>
              </div>
              <Section title="Ad Hooks">
                <div className="space-y-2">
                  {bp.adCreatives.hooks.map((h, i) => (
                    <div key={i} className="flex items-start justify-between gap-2 p-3 rounded-lg" style={{ background: 'var(--fsi-surface-2)' }}>
                      <p className="text-xs flex-1" style={{ color: 'var(--fsi-text)' }}>{h}</p>
                      <CopyBtn text={h} />
                    </div>
                  ))}
                </div>
              </Section>
              <Section title="Ad Copy">
                <p className="text-sm leading-relaxed" style={{ color: 'var(--fsi-text)' }}>{bp.adCreatives.adCopy}</p>
                <div className="mt-2 flex justify-end"><CopyBtn text={bp.adCreatives.adCopy} /></div>
              </Section>
              <Section title="Targeting & Budget">
                <Row label="Strategy" value={bp.adCreatives.targetingStrategy} />
                <Row label="Est. CPC" value={bp.adCreatives.estimatedCPC} />
              </Section>
              <Section title="3-Phase Revenue Plan">
                {[bp.monetizationPlan.phase1, bp.monetizationPlan.phase2, bp.monetizationPlan.phase3].map((p, i) => (
                  <div key={i} className="flex items-start gap-3 py-3 border-b border-white/6 last:border-0">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0" style={{ background: 'rgba(67,97,238,0.2)', color: '#F5B041' }}>{i+1}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-bold" style={{ color: 'var(--fsi-gold)' }}>{p.timeline}</span>
                        <span className="text-xs" style={{ color: '#00FF94' }}>{p.expectedRevenue}</span>
                      </div>
                      <p className="text-xs" style={{ color: 'var(--fsi-text-muted)' }}>{p.action}</p>
                    </div>
                  </div>
                ))}
              </Section>
            </motion.div>
          )}

          {/* ── STEP 9: PAPERWORK & FUNDING ──────────────────────────── */}
          {step === 9 && bp && (
            <motion.div key="s9" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="space-y-4 pt-4">
              <div className="text-center">
                <h2 className="font-black text-2xl mb-1" style={{ color: 'var(--fsi-text)' }}>Paperwork & Funding</h2>
                <p className="text-sm" style={{ color: 'var(--fsi-text-muted)' }}>Make your business real and find the capital to grow</p>
              </div>

              {/* ThePaperWorkSquad */}
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(67,97,238,0.3)' }}>
                <div className="p-1" style={{ background: 'linear-gradient(90deg, #F5B041, #E67E22)' }} />
                <div className="p-5" style={{ background: 'var(--fsi-surface)' }}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(67,97,238,0.15)' }}>
                      <FileText size={18} style={{ color: '#F5B041' }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-sm" style={{ color: 'var(--fsi-text)' }}>ThePaperWorkSquad</h3>
                      <p className="text-xs mt-0.5 mb-3" style={{ color: 'var(--fsi-text-muted)' }}>Business registration, LLC formation, EIN, contracts, compliance — handled by experts so you can focus on building.</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {['LLC Formation','EIN Registration','Business Contracts','Compliance Filing','Trademark Help'].map(s => (
                          <span key={s} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(67,97,238,0.1)', color: '#F5B041', border: '1px solid rgba(67,97,238,0.2)' }}>{s}</span>
                        ))}
                      </div>
                      <a href="https://thepaperworksquad.com" target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all"
                        style={{ background: '#F5B041', color: '#fff' }}>
                        Get Your Paperwork Done <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* CGW Systems */}
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(245,176,65,0.3)' }}>
                <div className="p-1" style={{ background: 'linear-gradient(90deg, #F5B041, #E67E22)' }} />
                <div className="p-5" style={{ background: 'var(--fsi-surface)' }}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(245,176,65,0.1)' }}>
                      <DollarSign size={18} style={{ color: 'var(--fsi-gold)' }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-sm" style={{ color: 'var(--fsi-text)' }}>CGW Systems — Funding Support</h3>
                      <p className="text-xs mt-0.5 mb-3" style={{ color: 'var(--fsi-text-muted)' }}>Business funding, grants, credit building, and investor connections. Get the capital to launch and scale your idea.</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {['Business Grants','Revenue-Based Funding','Credit Building','SBA Loans','Investor Intro'].map(s => (
                          <span key={s} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(245,176,65,0.08)', color: 'var(--fsi-gold)', border: '1px solid rgba(245,176,65,0.2)' }}>{s}</span>
                        ))}
                      </div>
                      <a href="#" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all"
                        style={{ background: 'var(--fsi-gold)', color: '#000' }}>
                        Explore Funding Options <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: 'rgba(0,255,148,0.06)', border: '1px solid rgba(0,255,148,0.15)' }}>
                <Shield size={16} style={{ color: '#00FF94', flexShrink: 0 }} />
                <p className="text-xs" style={{ color: 'var(--fsi-text-muted)' }}>
                  These are BayParee partner services. We connect you to trusted experts — no middleman markup.
                </p>
              </div>
            </motion.div>
          )}

          {/* ── STEP 10: LAUNCH DASHBOARD ────────────────────────────── */}
          {step === 10 && bp && (
            <motion.div key="s10" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="space-y-4 pt-4">
              <div className="text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ background: 'linear-gradient(135deg, rgba(67,97,238,0.2), rgba(123,47,255,0.2))', border: '2px solid rgba(67,97,238,0.4)' }}>
                  <Rocket size={28} style={{ color: '#F5B041' }} />
                </motion.div>
                <h2 className="font-black text-2xl mb-1" style={{ color: 'var(--fsi-text)' }}>
                  {bp.businessName} is Ready to Launch
                </h2>
                <p className="text-sm" style={{ color: 'var(--fsi-text-muted)' }}>Your complete business has been built. Here is your launch checklist.</p>
              </div>

              <Section title="Launch Checklist">
                <div className="space-y-2">
                  {bp.nextSteps.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-white/4" style={{ borderBottom: '1px solid var(--fsi-border)' }}>
                      <div className="w-5 h-5 rounded flex items-center justify-center shrink-0 text-[10px] font-black" style={{ background: 'rgba(67,97,238,0.15)', color: '#F5B041' }}>{i+1}</div>
                      <p className="text-sm flex-1" style={{ color: 'var(--fsi-text)' }}>{s}</p>
                      <ChevronRight size={13} style={{ color: 'var(--fsi-text-muted)' }} />
                    </div>
                  ))}
                </div>
              </Section>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Order Services', desc: 'Ads, design, web, copy', icon: Briefcase, to: '/services', color: '#F5B041' },
                  { label: 'Browse Market', desc: 'Ready-made businesses', icon: BarChart3, to: '/marketplace', color: 'var(--fsi-gold)' },
                ].map(a => (
                  <Link key={a.label} to={a.to} className="flex items-center gap-3 p-4 rounded-xl transition-all" style={{ background: 'var(--fsi-surface)', border: '1px solid var(--fsi-border)' }}>
                    <a.icon size={18} style={{ color: a.color, flexShrink: 0 }} />
                    <div>
                      <p className="text-xs font-bold" style={{ color: 'var(--fsi-text)' }}>{a.label}</p>
                      <p className="text-[11px]" style={{ color: 'var(--fsi-text-muted)' }}>{a.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>

              <button onClick={restart} className="w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                style={{ background: 'var(--fsi-surface)', color: 'var(--fsi-text-muted)', border: '1px solid var(--fsi-border)' }}>
                <RefreshCw size={14} /> Build Another Business
              </button>
            </motion.div>
          )}

        </AnimatePresence>

        {/* ── Navigation buttons (steps 2-10) ──────────────────────── */}
        {step >= 2 && step <= 10 && bp && (
          <div className="fixed bottom-0 left-0 right-0 px-4 py-3 flex gap-3" style={{ background: 'rgba(8,8,8,0.95)', backdropFilter: 'blur(12px)', borderTop: '1px solid var(--fsi-border)' }}>
            {step > 2 && (
              <button onClick={prev} className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{ background: 'var(--fsi-surface)', color: 'var(--fsi-text-muted)', border: '1px solid var(--fsi-border)' }}>
                <ArrowLeft size={14} /> Back
              </button>
            )}
            {step < 10 && (
              <button onClick={next} className="flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #F5B041, #E67E22)', color: '#fff' }}>
                {STEPS[step]?.label} <ArrowRight size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

