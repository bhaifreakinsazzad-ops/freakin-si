/**
 * BayParee — Growth Check
 * Free business assessment tool (ported from DhandaBuzz, US-market focused)
 * 8 questions → growth score + AI recommendations
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, CheckCircle, TrendingUp, AlertTriangle, Zap } from 'lucide-react'

/* ── Types ────────────────────────────────────────────────────────────────── */
interface Question {
  id: string
  text: string
  options: { label: string; value: string; score: number }[]
}

/* ── Questions ────────────────────────────────────────────────────────────── */
const QUESTIONS: Question[] = [
  {
    id: 'stage',
    text: 'What stage is your business at right now?',
    options: [
      { label: 'Just an idea', value: 'idea', score: 1 },
      { label: 'Getting first customers', value: 'early', score: 3 },
      { label: 'Making consistent revenue', value: 'revenue', score: 7 },
      { label: 'Scaling up', value: 'scaling', score: 10 },
    ],
  },
  {
    id: 'problem',
    text: 'What is your biggest challenge right now?',
    options: [
      { label: 'Getting leads / traffic', value: 'leads', score: 5 },
      { label: 'Converting leads to sales', value: 'conversion', score: 5 },
      { label: 'Creating content & branding', value: 'content', score: 6 },
      { label: 'Running ads profitably', value: 'ads', score: 6 },
    ],
  },
  {
    id: 'ads',
    text: 'Are you currently running paid ads?',
    options: [
      { label: 'No, never tried', value: 'never', score: 1 },
      { label: 'Tried but got poor results', value: 'poor', score: 4 },
      { label: 'Running but want better ROI', value: 'active', score: 7 },
      { label: 'Profitable campaigns running', value: 'profitable', score: 10 },
    ],
  },
  {
    id: 'content',
    text: 'How consistent is your content / social media presence?',
    options: [
      { label: 'Non-existent', value: 'none', score: 1 },
      { label: 'Post occasionally', value: 'occasional', score: 4 },
      { label: 'Post weekly', value: 'weekly', score: 7 },
      { label: 'Post daily with strategy', value: 'daily', score: 10 },
    ],
  },
  {
    id: 'website',
    text: 'Do you have a website or landing page?',
    options: [
      { label: 'No website at all', value: 'none', score: 1 },
      { label: 'Basic page, not converting', value: 'basic', score: 4 },
      { label: 'Good site, need more traffic', value: 'good', score: 7 },
      { label: 'Optimised and converting well', value: 'optimized', score: 10 },
    ],
  },
  {
    id: 'followup',
    text: 'How do you follow up with leads and customers?',
    options: [
      { label: 'No system in place', value: 'none', score: 1 },
      { label: 'Manually via WhatsApp / DMs', value: 'manual', score: 4 },
      { label: 'Email list, basic automation', value: 'email', score: 7 },
      { label: 'Full CRM and automation', value: 'crm', score: 10 },
    ],
  },
  {
    id: 'goal',
    text: 'What is your primary goal in the next 90 days?',
    options: [
      { label: 'Get my first 10 customers', value: 'first10', score: 5 },
      { label: 'Double my revenue', value: 'double', score: 7 },
      { label: 'Build a brand people recognize', value: 'brand', score: 6 },
      { label: 'Launch a new product or service', value: 'launch', score: 8 },
    ],
  },
  {
    id: 'budget',
    text: 'What is your monthly budget for growth?',
    options: [
      { label: 'Under $200', value: 'low', score: 3 },
      { label: '$200 – $500', value: 'mid', score: 6 },
      { label: '$500 – $2,000', value: 'high', score: 8 },
      { label: 'Over $2,000', value: 'premium', score: 10 },
    ],
  },
]

/* ── Scoring logic ────────────────────────────────────────────────────────── */
function calcResults(answers: Record<string, { value: string; score: number }>) {
  const total = Object.values(answers).reduce((sum, a) => sum + a.score, 0)
  const max = QUESTIONS.length * 10
  const pct = Math.round((total / max) * 100)

  type Rec = { title: string; desc: string; color: string; cta: string; ctaTo: string }
  const recs: Rec[] = []

  if (answers.ads?.value === 'never' || answers.ads?.value === 'poor') {
    recs.push({ title: 'Launch AdScale Engine', desc: 'Your ads are underperforming. Our managed Facebook & Instagram campaigns average 3.2x ROAS for clients at your stage.', color: '#EF4444', cta: 'Start AdScale', ctaTo: '/services' })
  }
  if (answers.website?.value === 'none' || answers.website?.value === 'basic') {
    recs.push({ title: 'Build a Converting Landing Page', desc: 'A professional landing page can 4× your conversion rate. We deliver in under 1 hour.', color: '#F5B041', cta: 'Get Web Studio', ctaTo: '/services' })
  }
  if (answers.content?.value === 'none' || answers.content?.value === 'occasional') {
    recs.push({ title: 'Activate Creative Engine', desc: 'Consistent content builds trust. Our AI delivers graphics, videos and posts on autopilot.', color: '#EC4899', cta: 'Get Creative', ctaTo: '/services' })
  }
  if (answers.followup?.value === 'none' || answers.followup?.value === 'manual') {
    recs.push({ title: 'Set Up AI Chat Agent', desc: 'You are losing leads by not following up fast enough. Our AI responds in seconds, 24/7.', color: '#F5B041', cta: 'Get AI Agent', ctaTo: '/services' })
  }
  if (recs.length === 0) {
    recs.push({ title: 'Scale with Growth Analytics', desc: 'Your foundation is strong. Now it is time to track every metric and double down on what works.', color: '#00FF94', cta: 'View Dashboard', ctaTo: '/dashboard' })
  }

  return { score: pct, recs: recs.slice(0, 3) }
}

/* ════════════════════════════ PAGE ═══════════════════════════════════════════ */
export default function GrowthCheckPage() {
  const [step, setStep] = useState<'intro' | 'quiz' | 'result'>('intro')
  const [qIndex, setQIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, { value: string; score: number }>>({})
  const [selected, setSelected] = useState<string | null>(null)

  const q = QUESTIONS[qIndex]
  const progress = (qIndex / QUESTIONS.length) * 100

  function handleSelect(value: string, score: number) {
    setSelected(value)
    setTimeout(() => {
      const next = { ...answers, [q.id]: { value, score } }
      setAnswers(next)
      setSelected(null)
      if (qIndex + 1 < QUESTIONS.length) {
        setQIndex(i => i + 1)
      } else {
        setStep('result')
      }
    }, 320)
  }

  const results = step === 'result' ? calcResults(answers) : null

  const scoreColor = results
    ? results.score >= 70 ? '#00FF94'
    : results.score >= 45 ? '#F5B041'
    : '#EF4444'
    : '#F5B041'

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* NAV */}
      <nav className="border-b border-white/8 bg-[#080808]">
        <div className="max-w-[900px] mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/fsi-icon.svg" alt="BayParee" className="w-6 h-6" />
            <span className="font-black text-sm tracking-widest" style={{ color: '#F5B041' }}>BAYPAREE</span>
          </Link>
          <Link to="/" className="text-xs text-white/40 hover:text-white transition-colors flex items-center gap-1.5">
            <ArrowLeft size={12} /> Back
          </Link>
        </div>
      </nav>

      <div className="max-w-[900px] mx-auto px-6 py-16">
        <AnimatePresence mode="wait">

          {/* ── INTRO ─────────────────────────────────────────────────────── */}
          {step === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}>
              <div className="text-center max-w-[600px] mx-auto">
                <div className="inline-flex items-center gap-2 border border-[#F5B041]/30 px-3 py-1 mb-8">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00FF94] animate-pulse" />
                  <span className="text-[10px] tracking-[0.3em] text-[#F5B041] font-bold">FREE · 2 MINUTES · INSTANT RESULTS</span>
                </div>
                <h1 className="font-black text-5xl md:text-6xl leading-none mb-6">
                  WHAT IS YOUR<br /><span style={{ color: '#F5B041' }}>BUSINESS SCORE?</span>
                </h1>
                <p className="text-white/50 text-base mb-10 leading-relaxed">
                  Answer 8 quick questions. Get a personalised growth score,
                  your top 3 bottlenecks, and a step-by-step action plan — free, instant, zero fluff.
                </p>
                <div className="flex flex-wrap justify-center gap-6 mb-12 text-sm text-white/40">
                  {['8 questions', '2 minutes', 'Free forever', 'No sign-up needed'].map(t => (
                    <div key={t} className="flex items-center gap-2">
                      <CheckCircle size={13} className="text-[#00FF94]" />{t}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setStep('quiz')}
                  className="inline-flex items-center gap-3 px-12 py-5 font-black text-sm tracking-widest transition-all hover:gap-5"
                  style={{ background: '#F5B041', color: '#000' }}
                >
                  START MY ASSESSMENT <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── QUIZ ──────────────────────────────────────────────────────── */}
          {step === 'quiz' && (
            <motion.div key={`q-${qIndex}`} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
              {/* progress */}
              <div className="mb-12">
                <div className="flex justify-between text-[10px] text-white/30 tracking-widest mb-3">
                  <span>QUESTION {qIndex + 1} OF {QUESTIONS.length}</span>
                  <span>{Math.round(progress)}% COMPLETE</span>
                </div>
                <div className="h-0.5 bg-white/8">
                  <motion.div
                    className="h-full"
                    style={{ background: '#F5B041' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>

              <h2 className="font-black text-3xl md:text-4xl mb-10 leading-tight">{q.text}</h2>

              <div className="grid sm:grid-cols-2 gap-3">
                {q.options.map(opt => (
                  <motion.button
                    key={opt.value}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleSelect(opt.value, opt.score)}
                    className="text-left p-6 border transition-all"
                    style={
                      selected === opt.value
                        ? { background: '#F5B041', borderColor: '#F5B041', color: '#000' }
                        : { background: '#0D0D0D', borderColor: 'rgba(255,255,255,0.08)', color: '#fff' }
                    }
                  >
                    <div className="font-semibold text-sm leading-snug">{opt.label}</div>
                  </motion.button>
                ))}
              </div>

              {qIndex > 0 && (
                <button
                  onClick={() => setQIndex(i => i - 1)}
                  className="mt-8 flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition-colors"
                >
                  <ArrowLeft size={12} /> Previous question
                </button>
              )}
            </motion.div>
          )}

          {/* ── RESULT ────────────────────────────────────────────────────── */}
          {step === 'result' && results && (
            <motion.div key="result" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
              <div className="text-center mb-16">
                <p className="text-[10px] tracking-[0.4em] text-[#F5B041] font-bold mb-6">YOUR GROWTH REPORT</p>
                <div
                  className="inline-flex flex-col items-center justify-center w-44 h-44 border-4 mb-6"
                  style={{ borderColor: scoreColor }}
                >
                  <span className="font-black text-6xl" style={{ color: scoreColor }}>{results.score}</span>
                  <span className="text-white/40 text-xs tracking-widest">/ 100</span>
                </div>
                <h2 className="font-black text-4xl mb-3">
                  {results.score >= 70
                    ? 'STRONG FOUNDATION'
                    : results.score >= 45
                    ? 'ROOM TO GROW'
                    : 'NEEDS WORK'}
                </h2>
                <p className="text-white/50 text-base max-w-[480px] mx-auto">
                  {results.score >= 70
                    ? 'You have solid fundamentals. Now it is time to scale aggressively and track every metric.'
                    : results.score >= 45
                    ? 'You have good bones but key gaps are costing you growth. Here is where to focus first.'
                    : 'Your biggest wins are ahead of you. Tackle these bottlenecks in order and you will see fast results.'}
                </p>
              </div>

              {/* recommendations */}
              <div className="mb-12">
                <p className="text-[10px] tracking-[0.4em] text-white/30 font-bold mb-6">TOP RECOMMENDATIONS FOR YOU</p>
                <div className="space-y-px bg-white/5">
                  {results.recs.map((rec, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.15 }}
                      className="bg-[#0D0D0D] p-6 flex items-start gap-6"
                      style={{ borderLeft: `3px solid ${rec.color}` }}
                    >
                      <div
                        className="w-8 h-8 flex items-center justify-center shrink-0 font-black text-sm"
                        style={{ background: rec.color + '20', color: rec.color }}
                      >{i + 1}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base mb-1" style={{ color: rec.color }}>{rec.title}</h3>
                        <p className="text-white/50 text-sm leading-relaxed">{rec.desc}</p>
                      </div>
                      <Link
                        to={rec.ctaTo}
                        className="shrink-0 text-xs font-bold px-4 py-2 tracking-widest transition-all hover:opacity-80 whitespace-nowrap"
                        style={{ background: rec.color, color: '#000' }}
                      >{rec.cta} →</Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* score breakdown */}
              <div className="bg-[#080808] border border-white/8 p-8 mb-12">
                <p className="text-[10px] tracking-[0.4em] text-white/30 font-bold mb-6">SCORE BREAKDOWN</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {QUESTIONS.map(q => {
                    const a = answers[q.id]
                    const pct = a ? Math.round((a.score / 10) * 100) : 0
                    const c = pct >= 70 ? '#00FF94' : pct >= 40 ? '#F5B041' : '#EF4444'
                    return (
                      <div key={q.id}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-white/50 truncate pr-4">{q.text.slice(0, 36)}…</span>
                          <span style={{ color: c }} className="shrink-0">{pct}</span>
                        </div>
                        <div className="h-1 bg-white/8">
                          <motion.div
                            className="h-full"
                            style={{ background: c }}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6, delay: 0.05 }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* CTA */}
              <div className="text-center space-y-4">
                <p className="text-white/40 text-sm mb-6">Ready to fix your biggest gaps?</p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-10 py-4 font-black text-sm tracking-widest hover:gap-4 transition-all"
                    style={{ background: '#F5B041', color: '#000' }}
                  >START FOR FREE <ArrowRight size={16} /></Link>
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-2 px-10 py-4 font-bold text-sm tracking-widest border border-white/15 text-white/70 hover:border-white/40 hover:text-white transition-all"
                  >VIEW SERVICES</Link>
                </div>
                <button
                  onClick={() => { setStep('intro'); setQIndex(0); setAnswers({}); setSelected(null) }}
                  className="block mx-auto text-xs text-white/25 hover:text-white/50 transition-colors mt-4"
                >Retake assessment</button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
