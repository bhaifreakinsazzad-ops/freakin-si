import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle, Crown, DollarSign, Shield, Sparkles, Zap } from 'lucide-react'
import { brand } from '@/config/brand'
import { subscriptionApi } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { useLang } from '@/contexts/LanguageContext'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

type Plan = {
  id: string
  name: string
  nameEn?: string
  price_bdt: number
  period: string | null
  features: string[]
  popular: boolean
}

type UsdPlan = {
  name: string
  price: string
  cta: string
  note: string
  href: string
  features: string[]
  highlight?: boolean
}

const USD_PLANS: UsdPlan[] = [
  {
    name: 'Starter',
    price: '$0',
    cta: 'Create Account',
    note: 'Best for trying the engine and exploring the workflow.',
    href: '/register',
    features: ['Public landing and portal access', 'Fixer preview', 'Marketplace preview'],
  },
  {
    name: 'Growth',
    price: '$49/mo',
    cta: 'Submit Payment Reference',
    note: 'Manual activation during beta. Stripe comes later.',
    href: '/payment',
    highlight: true,
    features: ['Business blueprint flow', 'CRM tools', 'Service requests', 'Support routing'],
  },
  {
    name: 'Agency',
    price: '$149/mo',
    cta: 'Request Quote',
    note: 'For operators running multiple client workflows.',
    href: '/requests',
    features: ['Multi-project handling', 'Admin overview', 'Priority support', 'Execution tooling'],
  },
]

export default function PricingPage() {
  const { user } = useAuth()
  const { t, lang } = useLang()
  const navigate = useNavigate()
  const [plans, setPlans] = useState<Plan[]>([])

  useEffect(() => {
    subscriptionApi.getPlans().then((r) => setPlans(r.data.plans || [])).catch(() => {})
  }, [])

  const go = (href: string) => {
    if (href === '/payment' && !user) {
      navigate('/register')
      return
    }
    navigate(href)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-white/10 glass px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link to="/" className="flex items-center gap-2">
          <span
            style={{
              fontFamily: "'Montserrat',sans-serif",
              fontWeight: 900,
              fontSize: 16,
              color: '#c8102e',
              background: 'rgba(200,16,46,0.12)',
              padding: '2px 8px',
              borderRadius: 6,
              border: '1px solid rgba(200,16,46,0.25)',
            }}
          >
            {brand.shortName}
          </span>
          <span className="font-bold font-mono" style={{ color: '#c8102e' }}>
            {brand.brandName}
          </span>
        </Link>
        <div className="flex items-center gap-3">
          {user ? (
            <Link to="/dashboard" className="text-sm text-cyan-300 hover:underline">
              Go to Dashboard
            </Link>
          ) : (
            <Link to="/login" className="text-sm text-gray-400 hover:text-cyan-300">
              {t.login}
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-2 text-sm text-cyan-300 mb-5">
            <Sparkles size={14} /> Manual review is active
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Pricing built for the beta flow</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Choose a starting path, submit a payment reference when needed, and let the operator confirm activation.
            Stripe checkout will be added later.
          </p>
          {user && (
            <div className="mt-4 inline-flex items-center gap-2 text-sm">
              <span className="text-gray-500">Current plan:</span>
              <span className="text-gray-300 font-bold">{user.subscription}</span>
            </div>
          )}
        </motion.div>

        <div className="grid gap-4 lg:grid-cols-3">
          {USD_PLANS.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                'rounded-3xl border p-6 flex flex-col',
                plan.highlight ? 'border-cyan-300/30 bg-cyan-400/10' : 'border-white/10 bg-white/5'
              )}
            >
              {plan.highlight && (
                <div className="mb-3 inline-flex rounded-full border border-cyan-300/25 bg-cyan-400/15 px-3 py-1 text-xs font-bold text-cyan-200">
                  Most Popular
                </div>
              )}
              <div className="flex items-center gap-2 text-sm uppercase tracking-[0.28em] text-cyan-300">
                <Shield size={14} /> {plan.name}
              </div>
              <div className="mt-4 text-4xl font-black text-white">{plan.price}</div>
              <p className="mt-3 text-sm text-slate-300">{plan.note}</p>
              <div className="mt-6 space-y-3 flex-1">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-sm text-slate-300">
                    <CheckCircle size={15} className="text-emerald-300" />
                    {feature}
                  </div>
                ))}
              </div>
              <button
                onClick={() => go(plan.href)}
                className="mt-7 rounded-2xl py-4 text-center font-black"
                style={plan.highlight ? { background: '#22d3ee', color: '#04111f' } : { border: '1px solid rgba(255,255,255,0.12)' }}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-3xl border border-white/10 bg-white/5 p-7">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/90">
            <DollarSign size={14} />
            Manual payment honesty
          </div>
          <h2 className="mt-4 text-2xl font-semibold">Manual review is the current beta payment mode.</h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Customers can submit payment or order details, and the operator confirms activation before work begins.
            No fake instant checkout is shown.
          </p>
        </div>

        <div className="mt-14 rounded-3xl border border-white/10 bg-white/5 p-7">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/90">
            <Zap size={14} />
            BDT plans
          </div>
          <p className="mt-4 text-sm text-slate-300">
            The live plan data from the backend still loads below for existing beta users.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {plans.map((plan, i) => (
              <div key={plan.id} className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <div className="flex items-center gap-2">
                  {i === 0 ? <Sparkles size={16} className="text-cyan-300" /> : i === 1 ? <Shield size={16} className="text-cyan-300" /> : <Crown size={16} className="text-cyan-300" />}
                  <h3 className="font-semibold">{lang === 'en' && plan.nameEn ? plan.nameEn : plan.name}</h3>
                </div>
                <div className="mt-3 text-3xl font-black text-white">৳{plan.price_bdt}</div>
                <div className="mt-4 space-y-2">
                  {plan.features.slice(0, 4).map((feature) => (
                    <div key={feature} className="flex items-start gap-2 text-sm text-slate-300">
                      <CheckCircle size={14} className="mt-0.5 text-emerald-300" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 rounded-3xl border border-white/10 bg-gradient-to-r from-cyan-500/15 via-white/5 to-indigo-500/10 p-8 text-center">
          <h3 className="text-2xl font-semibold">Ready to start?</h3>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Create an account, run a fixer diagnosis, or submit a service request from the public beta.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to="/register" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950">
              Create Account
            </Link>
            <Link to="/fixer" className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white">
              Run Diagnosis
            </Link>
            <Link to="/requests" className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white">
              Submit Service Request
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
