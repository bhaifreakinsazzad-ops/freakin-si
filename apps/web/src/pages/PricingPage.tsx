import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { CheckCircle, Zap, Crown, Building2, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

/* ── Plan definitions ─────────────────────────────────────────────────────── */
interface Plan {
  id: string
  name: string
  price: number | string
  period: string
  popular: boolean
  icon: React.ReactNode
  color: string
  badge?: string
  desc: string
  features: string[]
  limits: string
  cta: string
}

const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 0,
    period: '/mo',
    popular: false,
    icon: <Zap size={20} />,
    color: '#64748b',
    desc: 'For new founders exploring what Engine NotREAL can do.',
    features: [
      '5 AI business blueprints / month',
      '3 Fixer Mode diagnoses / month',
      'Basic CRM (up to 10 leads)',
      'Marketplace browsing',
      'AI Chat (50 messages/day)',
      'Community access',
    ],
    limits: '5 blueprints · 3 fixer · 10 leads',
    cta: 'Start Free',
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 49,
    period: '/mo',
    popular: true,
    icon: <ArrowRight size={20} />,
    color: '#6366f1',
    badge: 'Most Popular',
    desc: 'For active operators and service providers building momentum.',
    features: [
      'Unlimited AI blueprints',
      'Unlimited Fixer diagnoses',
      'Full CRM — unlimited leads',
      'Service request submissions',
      'Priority marketplace listing',
      'AI Chat (500 messages/day)',
      'All 19 AI tools',
      'Export all reports (PDF/CSV)',
      'Email support',
    ],
    limits: 'Unlimited blueprints + fixer · 500 chat/day',
    cta: 'Go Growth',
  },
  {
    id: 'agency',
    name: 'Agency',
    price: 149,
    period: '/mo',
    popular: false,
    icon: <Building2 size={20} />,
    color: '#06b6d4',
    desc: 'For agencies, consultants, and high-volume operators.',
    features: [
      'Everything in Growth',
      'White-label branding',
      'Client sub-accounts (up to 10)',
      'API access',
      'Custom AI prompts',
      'Unlimited AI Chat',
      'Dedicated support line',
      'Onboarding call included',
      'Priority Fixer outputs',
    ],
    limits: 'Unlimited everything · 10 sub-accounts',
    cta: 'Go Agency',
  },
]

const CREDITS = [
  { name: 'AI Blueprint Pack', desc: '+20 extra blueprints', price: '$9' },
  { name: 'Fixer Credit Pack', desc: '+10 Fixer diagnoses', price: '$12' },
  { name: 'Service Request Pack', desc: '+5 service submissions', price: '$15' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.45, ease: 'easeOut' },
  }),
}

export default function PricingPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')

  const annualPrice = (monthly: number) => Math.round(monthly * 10) // 2 months free

  const handleSelect = (planId: string) => {
    if (planId === 'starter') {
      if (!user) navigate('/register')
      else navigate('/dashboard')
      return
    }
    if (!user) { navigate('/register'); return }
    navigate('/payment', { state: { planId, billing } })
  }

  const displayPrice = (plan: Plan) => {
    if (plan.price === 0) return 'Free'
    if (billing === 'annual') return `$${annualPrice(plan.price as number)}/mo`
    return `$${plan.price}/mo`
  }

  return (
    <div className="min-h-screen" style={{ background: '#070710', color: '#f1f5f9' }}>
      {/* ── Nav ── */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(7,7,16,0.85)', backdropFilter: 'blur(20px)' }}
        className="sticky top-0 z-10 px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 900, fontSize: 13, color: '#fff' }}>EN</span>
          </div>
          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 16, color: '#f1f5f9' }}>Engine NotREAL</span>
        </Link>
        <div className="flex items-center gap-3">
          {user ? (
            <Link to="/dashboard" className="text-sm" style={{ color: '#6366f1' }}>Dashboard →</Link>
          ) : (
            <Link to="/login" className="text-sm" style={{ color: '#94a3b8' }}>Sign In</Link>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* ── Hero ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm mb-5"
            style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', color: '#6366f1', fontWeight: 600 }}>
            <Zap size={14} /> Simple, transparent pricing
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, marginBottom: 16 }}>
            Start free.{' '}
            <span style={{ background: 'linear-gradient(90deg, #6366f1, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Scale when ready.
            </span>
          </h1>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 17, color: '#94a3b8', maxWidth: 480, margin: '0 auto' }}>
            Every plan includes demo mode — no API key needed to start. Add your own keys to unlock live AI.
          </p>

          {/* Billing toggle */}
          <div className="flex justify-center mt-8 mb-2">
            <div className="inline-flex rounded-xl p-1" style={{ background: '#0f0f1a', border: '1px solid rgba(255,255,255,0.08)' }}>
              {(['monthly', 'annual'] as const).map(b => (
                <button key={b} onClick={() => setBilling(b)}
                  className={cn('px-6 py-2 rounded-lg text-sm font-semibold transition-all capitalize')}
                  style={{
                    background: billing === b ? 'linear-gradient(135deg, #6366f1, #06b6d4)' : 'transparent',
                    color: billing === b ? '#fff' : '#64748b',
                  }}>
                  {b} {b === 'annual' && <span style={{ fontSize: 11, opacity: 0.8 }}>· 2 months free</span>}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Plan cards ── */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {PLANS.map((plan, i) => (
            <motion.div key={plan.id} custom={i} initial="hidden" animate="visible" variants={fadeUp}
              style={{
                borderRadius: 20, padding: '32px 28px',
                background: plan.popular ? 'rgba(99,102,241,0.08)' : '#0f0f1a',
                border: `1px solid ${plan.popular ? 'rgba(99,102,241,0.45)' : 'rgba(255,255,255,0.08)'}`,
                position: 'relative',
                transform: plan.popular ? 'scale(1.03)' : 'scale(1)',
                display: 'flex', flexDirection: 'column',
              }}>
              {plan.badge && (
                <div style={{
                  position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                  color: '#fff', fontSize: 12, fontWeight: 700, padding: '4px 16px', borderRadius: 999,
                  whiteSpace: 'nowrap',
                }}>
                  {plan.badge}
                </div>
              )}

              {/* Plan header */}
              <div className="flex items-center gap-3 mb-4" style={{ color: plan.color }}>
                {plan.icon}
                <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 18, color: '#f1f5f9' }}>{plan.name}</span>
              </div>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: '#64748b', marginBottom: 20, lineHeight: 1.6 }}>{plan.desc}</p>

              {/* Price */}
              <div style={{ marginBottom: 24 }}>
                <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 42, fontWeight: 900, color: '#f1f5f9' }}>
                  {displayPrice(plan)}
                </span>
                {billing === 'annual' && plan.price !== 0 && (
                  <div style={{ fontSize: 12, color: '#22d3ee', marginTop: 4 }}>
                    billed ${annualPrice(plan.price as number) * 10}/year
                  </div>
                )}
              </div>

              {/* Features */}
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5">
                    <CheckCircle size={15} style={{ color: plan.color, marginTop: 2, flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 13.5, color: '#cbd5e1', lineHeight: 1.5 }}>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button onClick={() => handleSelect(plan.id)}
                style={{
                  width: '100%', padding: '12px 24px', borderRadius: 12,
                  fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 15,
                  cursor: 'pointer',
                  background: plan.popular ? 'linear-gradient(135deg, #6366f1, #06b6d4)' : 'rgba(255,255,255,0.07)',
                  color: plan.popular ? '#fff' : '#f1f5f9',
                  border: plan.popular ? 'none' : '1px solid rgba(255,255,255,0.12)',
                  transition: 'opacity 0.2s',
                }}>
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

        {/* ── Credit packs ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="text-center mb-8">
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 26, fontWeight: 800, marginBottom: 8 }}>
              Need more? Buy credits.
            </h2>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, color: '#94a3b8' }}>
              Top up any plan with additional AI credits. No subscription required.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {CREDITS.map(c => (
              <div key={c.name} style={{
                padding: '24px', borderRadius: 16,
                background: '#0f0f1a', border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 15, color: '#f1f5f9', marginBottom: 4 }}>{c.name}</div>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: '#64748b' }}>{c.desc}</div>
                </div>
                <div>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: 20, color: '#f1f5f9', textAlign: 'right' }}>{c.price}</div>
                  <button
                    onClick={() => { if (!user) navigate('/register') }}
                    style={{
                      marginTop: 8, padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                      background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)',
                      cursor: 'pointer',
                    }}>
                    Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── FAQ strip ── */}
        <div className="mt-16 text-center">
          <div style={{
            display: 'inline-flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center',
            padding: '28px 40px', borderRadius: 16,
            background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)',
          }}>
            {[
              { q: 'No credit card for Starter?', a: 'Correct — start free forever.' },
              { q: 'Demo mode included?', a: 'Yes. No AI key required to explore.' },
              { q: 'Cancel any time?', a: 'Yes. No lock-in contracts.' },
              { q: 'bKash / Nagad?', a: 'Available on request for BD users.' },
            ].map(f => (
              <div key={f.q} style={{ maxWidth: 200, textAlign: 'center' }}>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 13, color: '#f1f5f9', marginBottom: 4 }}>{f.q}</div>
                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: '#64748b' }}>{f.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Final CTA ── */}
        <div className="text-center mt-16">
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, color: '#64748b', marginBottom: 16 }}>
            Still unsure? Start free and upgrade when you're ready.
          </p>
          <Link to="/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 32px', borderRadius: 12, textDecoration: 'none',
            fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 15, color: '#fff',
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
          }}>
            Start Free — No Card Needed
          </Link>
        </div>
      </div>
    </div>
  )
}
