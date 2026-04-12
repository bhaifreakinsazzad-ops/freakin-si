import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { subscriptionApi } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { useLang } from '@/contexts/LanguageContext'
import { CheckCircle, Zap, Crown, Star, ArrowRight, Shield, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

// ─── BDT plan types (existing) ───────────────────────────────────────────────
interface Plan {
  id: string; name: string; nameEn: string; price_bdt: number
  period: string | null; features: string[]; color: string; popular: boolean
}

// ─── USD plan definition ──────────────────────────────────────────────────────
interface UsdPlan {
  id: string
  name: string
  price: number
  period: string
  popular: boolean
  features: string[]
  cta: string
  note?: string
}

const USD_PLANS: UsdPlan[] = [
  {
    id: 'free_usd',
    name: 'Free',
    price: 0,
    period: '/mo',
    popular: false,
    cta: 'Get Started Free',
    features: [
      '3 AI blueprints / month',
      'AI Chat (limited)',
      'Growth Check tool',
      'Community support',
    ],
  },
  {
    id: 'starter_usd',
    name: 'Starter',
    price: 9,
    period: '/mo',
    popular: false,
    cta: 'Start Now',
    features: [
      '10 blueprints / month',
      'AI Chat + all models',
      'Brand assets (basic)',
      'Marketplace access',
    ],
  },
  {
    id: 'pro_usd',
    name: 'Pro',
    price: 29,
    period: '/mo',
    popular: true,
    cta: 'Go Pro',
    note: 'Most Popular',
    features: [
      'Unlimited blueprints',
      'Priority AI processing',
      'Full brand assets package',
      'Partner ecosystem access (ThePaperWorkSquad, CGW)',
      '10% off partner services',
      'Email support',
    ],
  },
  {
    id: 'elite_usd',
    name: 'Elite',
    price: 99,
    period: '/mo',
    popular: false,
    cta: 'Go Elite',
    features: [
      'Everything in Pro',
      'White-glove onboarding call',
      'Dedicated account manager',
      'Funding introduction (CGW Systems)',
      'Custom domain setup',
      'Priority support (24hr response)',
    ],
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' },
  }),
}

export default function PricingPage() {
  const { user } = useAuth()
  const { t, lang, toggle } = useLang()
  const navigate = useNavigate()
  const [plans, setPlans] = useState<Plan[]>([])
  const [currency, setCurrency] = useState<'usd' | 'bdt'>('usd')

  useEffect(() => {
    subscriptionApi.getPlans().then(r => setPlans(r.data.plans)).catch(() => {})
  }, [])

  // ── BDT helpers (unchanged) ──
  const planIcons: Record<string, React.ReactNode> = {
    free: <Star size={22} className="text-gray-400" />,
    pro: <Zap size={22} className="text-green-400" />,
    premium: <Crown size={22} className="text-purple-400" />,
  }

  const planColors: Record<string, string> = {
    free: 'border-gray-700/40',
    pro: 'border-green-500/40 bg-green-500/5',
    premium: 'border-purple-500/40 bg-purple-500/5',
  }

  const btnColors: Record<string, string> = {
    free: 'border border-gray-600 text-gray-300 hover:bg-white/5',
    pro: 'bg-green-500 text-black hover:bg-green-400',
    premium: 'bg-purple-600 text-white hover:bg-purple-500',
  }

  const handleSelect = (planId: string) => {
    if (planId === 'free') return
    if (!user) { navigate('/register'); return }
    navigate('/payment', { state: { planId } })
  }

  const handleUsdSelect = (planId: string) => {
    if (planId === 'free_usd') {
      if (!user) navigate('/register')
      return
    }
    if (!user) { navigate('/register'); return }
    navigate('/payment', { state: { planId, currency: 'usd' } })
  }

  const subLabel = (sub: string) =>
    sub === 'free' ? t.subFree : sub === 'pro' ? `${t.subPro} ✓` : `${t.subPremium} ✓`

  // ── USD icon mapping ──
  const usdPlanIcon = (id: string) => {
    if (id === 'free_usd') return <Star size={20} className="text-gray-400" />
    if (id === 'starter_usd') return <Zap size={20} style={{ color: '#4361EE' }} />
    if (id === 'pro_usd') return <Shield size={20} style={{ color: '#4361EE' }} />
    return <Crown size={20} style={{ color: '#F5B041' }} />
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ── Header (unchanged) ── */}
      <div className="border-b border-green-900/20 glass px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          <span className="font-bold text-green-400 font-mono">AI Shala</span>
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-green-900/40 text-xs font-medium text-gray-300 hover:border-green-500/50 hover:text-green-400 transition-all"
          >
            <span>{lang === 'bn' ? '🇬🇧' : '🇧🇩'}</span>
            <span>{lang === 'bn' ? 'EN' : 'বাং'}</span>
          </button>
          {user ? (
            <Link to="/chat" className="text-sm text-green-400 hover:underline">{t.pricingGotoDash} →</Link>
          ) : (
            <Link to="/login" className="text-sm text-gray-400 hover:text-green-400">{t.login}</Link>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* ── Hero ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 text-sm text-green-400 mb-5">
            <Zap size={14} /> {t.pricingPageBadge}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t.pricingPageTitle.split(' ').slice(0, -1).join(' ')}{' '}
            <span className="gradient-text">{t.pricingPageTitle.split(' ').slice(-1)}</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">{t.pricingPageSub}</p>
          {user && (
            <div className="mt-4 inline-flex items-center gap-2 text-sm">
              <span className="text-gray-500">{t.pricingCurrentPlan}</span>
              <span className={cn('font-bold', user.subscription === 'pro' ? 'text-green-400' : user.subscription === 'premium' ? 'text-purple-400' : 'text-gray-300')}>
                {subLabel(user.subscription)}
              </span>
            </div>
          )}
        </motion.div>

        {/* ── Currency toggle ── */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-xl border border-gray-700/50 p-1" style={{ background: '#0d0d1a' }}>
            <button
              onClick={() => setCurrency('usd')}
              className={cn(
                'px-5 py-2 rounded-lg text-sm font-semibold transition-all',
                currency === 'usd'
                  ? 'text-white'
                  : 'text-gray-500 hover:text-gray-300'
              )}
              style={currency === 'usd' ? { background: '#4361EE' } : {}}
            >
              <DollarSign size={13} className="inline -mt-0.5 mr-1" />
              USD Plans
            </button>
            <button
              onClick={() => setCurrency('bdt')}
              className={cn(
                'px-5 py-2 rounded-lg text-sm font-semibold transition-all',
                currency === 'bdt'
                  ? 'text-white'
                  : 'text-gray-500 hover:text-gray-300'
              )}
              style={currency === 'bdt' ? { background: '#22c55e' } : {}}
            >
              ৳ BDT Plans
            </button>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════
            USD PLANS
        ════════════════════════════════════════════════════ */}
        {currency === 'usd' && (
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center mb-10"
            >
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium mb-3"
                style={{ background: 'rgba(67,97,238,0.12)', border: '1px solid rgba(67,97,238,0.35)', color: '#4361EE' }}
              >
                BayParee USD Pricing
              </div>
              <p className="text-gray-400 text-sm">
                Billed monthly. Cancel any time.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-5 mb-14">
              {USD_PLANS.map((plan, i) => {
                const isPopular = plan.popular
                const isElite = plan.id === 'elite_usd'
                return (
                  <motion.div
                    key={plan.id}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    className="rounded-2xl p-6 border relative flex flex-col"
                    style={{
                      background: isPopular ? 'rgba(67,97,238,0.08)' : '#0d0d1a',
                      borderColor: isPopular ? '#4361EE' : isElite ? 'rgba(245,176,65,0.4)' : 'rgba(255,255,255,0.08)',
                      boxShadow: isPopular ? '0 0 40px rgba(67,97,238,0.18)' : 'none',
                    }}
                  >
                    {isPopular && (
                      <div
                        className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1 rounded-full shadow-lg whitespace-nowrap"
                        style={{ background: '#4361EE', color: '#fff' }}
                      >
                        Most Popular
                      </div>
                    )}

                    {/* Icon + Name */}
                    <div className="flex items-center gap-2.5 mb-4">
                      {usdPlanIcon(plan.id)}
                      <h2 className="text-lg font-bold text-white">{plan.name}</h2>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                      {plan.price === 0 ? (
                        <div className="text-4xl font-extrabold" style={{ color: '#4361EE' }}>Free</div>
                      ) : (
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-3xl font-extrabold" style={{ color: isElite ? '#F5B041' : '#4361EE' }}>
                            ${plan.price}
                          </span>
                          <span className="text-gray-500 text-sm">{plan.period}</span>
                        </div>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-2.5 flex-1 mb-7">
                      {plan.features.map(f => (
                        <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                          <CheckCircle
                            size={14}
                            className="mt-0.5 shrink-0"
                            style={{ color: isElite ? '#F5B041' : '#4361EE' }}
                          />
                          {f}
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <button
                      onClick={() => handleUsdSelect(plan.id)}
                      className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2"
                      style={
                        isPopular
                          ? { background: '#4361EE', color: '#fff' }
                          : isElite
                          ? { background: 'rgba(245,176,65,0.15)', border: '1px solid rgba(245,176,65,0.5)', color: '#F5B041' }
                          : plan.price === 0
                          ? { border: '1px solid rgba(255,255,255,0.12)', color: '#9ca3af' }
                          : { border: '1px solid rgba(67,97,238,0.5)', color: '#4361EE' }
                      }
                    >
                      {plan.cta} {plan.price > 0 && <ArrowRight size={14} />}
                    </button>
                  </motion.div>
                )
              })}
            </div>

            {/* Partner note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl p-6 border mb-6 text-center"
              style={{ background: 'rgba(67,97,238,0.06)', borderColor: 'rgba(67,97,238,0.2)' }}
            >
              <p className="text-sm text-gray-400">
                <span className="font-semibold" style={{ color: '#4361EE' }}>Pro &amp; Elite</span> plans unlock the{' '}
                <Link to="/partners" className="underline" style={{ color: '#F5B041' }}>Partner Ecosystem</Link>{' '}
                — ThePaperWorkSquad (LLC formation), CGW Systems (business funding), and DhandaBuzz (digital marketing) — all integrated into Step 9 of your AI Business Builder.
              </p>
            </motion.div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            BDT PLANS (existing logic, unchanged)
        ════════════════════════════════════════════════════ */}
        {currency === 'bdt' && (
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center mb-10"
            >
              <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 text-sm text-green-400 mb-3">
                বাংলাদেশ — BDT Pricing
              </div>
              <p className="text-gray-400 text-sm">Pay via bKash, Nagad, Rocket, or Bank.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 mb-14">
              {plans.map((plan, i) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={cn('rounded-2xl p-7 border relative flex flex-col', planColors[plan.id] || 'border-gray-700/40')}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-green-500 text-black text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                      {t.pricingMostPopular}
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    {planIcons[plan.id]}
                    <div>
                      <h2 className="text-xl font-bold text-white">{lang === 'en' && plan.nameEn ? plan.nameEn : plan.name}</h2>
                    </div>
                    {user?.subscription === plan.id && (
                      <span className="ml-auto text-xs bg-green-900/50 text-green-300 border border-green-700/50 px-2 py-0.5 rounded-full">
                        {t.pricingActive}
                      </span>
                    )}
                  </div>

                  <div className="mb-6">
                    {plan.price_bdt === 0 ? (
                      <div className="text-4xl font-bold gradient-text">{t.pricingFreeLabel}</div>
                    ) : (
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold gradient-text">৳{plan.price_bdt}</span>
                        <span className="text-gray-500 text-sm">
                          {plan.period === 'month' ? t.pricingMonthSuffix : plan.period}
                        </span>
                      </div>
                    )}
                  </div>

                  <ul className="space-y-3 flex-1 mb-7">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-gray-300">
                        <CheckCircle size={15} className={cn('mt-0.5 shrink-0', plan.id === 'premium' ? 'text-purple-400' : 'text-green-400')} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSelect(plan.id)}
                    disabled={user?.subscription === plan.id}
                    className={cn(
                      'w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2',
                      btnColors[plan.id],
                      user?.subscription === plan.id && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {user?.subscription === plan.id
                      ? t.pricingCurrentPlanBtn
                      : plan.id === 'free'
                        ? t.pricingStartFree
                        : <>{t.pricingPayNow} <ArrowRight size={16} /></>
                    }
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ── Payment methods (always visible) ── */}
        <div className="mt-4 glass-light rounded-2xl p-8 border border-green-900/20">
          <h3 className="text-center text-lg font-bold text-gray-300 mb-6">{t.pricingPaymentTitle}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'bKash',  color: 'bg-pink-900/20 border-pink-800/30',   emoji: '💳', text: 'text-pink-300' },
              { name: 'Nagad',  color: 'bg-orange-900/20 border-orange-800/30', emoji: '📲', text: 'text-orange-300' },
              { name: 'Rocket', color: 'bg-purple-900/20 border-purple-800/30', emoji: '🚀', text: 'text-purple-300' },
              { name: lang === 'en' ? 'Bank' : 'ব্যাংক', color: 'bg-blue-900/20 border-blue-800/30', emoji: '🏦', text: 'text-blue-300' },
            ].map(m => (
              <div key={m.name} className={cn('rounded-xl p-4 border text-center', m.color)}>
                <div className="text-3xl mb-2">{m.emoji}</div>
                <div className={cn('font-bold text-sm', m.text)}>{m.name}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-5">
            {t.pricingPaymentNote} <span className="text-green-400">{t.pricingPaymentNoteHighlight}</span>{t.pricingPaymentNoteEnd && ` ${t.pricingPaymentNoteEnd}`}
          </p>
          {currency === 'usd' && (
            <p className="text-center text-xs text-gray-600 mt-2">
              USD plans are billed via card. BDT plans support the local payment methods above.
            </p>
          )}
        </div>

        {/* ── FAQ (unchanged) ── */}
        <div className="mt-14">
          <h3 className="text-2xl font-bold text-center mb-8 gradient-text">{t.pricingFaqTitle}</h3>
          <div className="space-y-4 max-w-2xl mx-auto">
            {(lang === 'en' ? [
              { q: 'How quickly will my account be upgraded after payment?', a: 'Usually within 2–24 hours. Payments made after midnight will be processed the next morning.' },
              { q: 'What do I get with the Free plan?', a: '50 daily AI messages, 5 image generations, all basic tools, and 25+ AI models.' },
              { q: 'How do I pay with bKash?', a: 'Go to the payment page, select "bKash", send the amount to the provided number, and submit your transaction ID.' },
              { q: 'Who do I contact if I have a problem?', a: 'WhatsApp or SMS the payment number, or write to us via AI Chat.' },
              { q: 'What is included in Pro USD partner access?', a: 'Pro and Elite USD subscribers get access to ThePaperWorkSquad (LLC & compliance), CGW Systems (funding & credit), and DhandaBuzz (digital marketing) — all connected through Step 9 of your AI Business Builder.' },
            ] : [
              { q: 'পেমেন্ট করলে কতক্ষণে অ্যাকাউন্ট আপগ্রেড হবে?', a: 'সাধারণত ২-২৪ ঘণ্টার মধ্যে অ্যাকাউন্ট আপগ্রেড হয়। রাত ১২টার পর করলে পরের দিন সকালে হয়।' },
              { q: 'ফ্রি প্ল্যানে কী কী পাব?', a: 'দৈনিক ৫০টি AI মেসেজ, ৫টি ছবি তৈরি, সব বেসিক টুলস এবং ২৫+ AI মডেল।' },
              { q: 'bKash দিয়ে কীভাবে পেমেন্ট করব?', a: 'পেমেন্ট পেজে গিয়ে "bKash" সিলেক্ট করুন। দেওয়া নম্বরে টাকা পাঠান এবং ট্রানজেকশন আইডি সাবমিট করুন।' },
              { q: 'কোনো সমস্যা হলে কোথায় যোগাযোগ করব?', a: 'পেমেন্ট নম্বরে WhatsApp বা SMS করুন অথবা AI চ্যাটে লিখুন।' },
            ] as { q: string; a: string }[]).map(({ q, a }) => (
              <div key={q} className="glass-light rounded-xl p-5 border border-green-900/20">
                <p className="font-medium text-green-300 mb-2">❓ {q}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
