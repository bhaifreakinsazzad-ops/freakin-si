/**
 * Engine NotREAL — Service Requests Page
 * Submit a business/service request. Routes to /api/services.
 * Works in demo/memdb mode — no Supabase required.
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Briefcase, CheckCircle, AlertCircle, Loader2, Send,
  Wrench, Store, TrendingUp, HeadphonesIcon, ArrowRight,
  Rocket, Target, Bot, Palette, FileText, Megaphone,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { ordersApi } from '@/lib/api'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const SERVICES = [
  { id: 'growth-engine',  icon: Rocket,      label: 'Starter Growth Engine',    desc: 'Offer + positioning + 30-day plan',           price: '$199', amount: 199 },
  { id: 'messenger-sales',icon: Megaphone,    label: 'Messenger Sales Machine',  desc: 'WhatsApp/Messenger funnel + scripts',          price: '$299', amount: 299 },
  { id: 'booked-calls',   icon: Target,       label: 'Booked Calls Funnel',      desc: 'Lead gen → calls → pipeline system',           price: '$399', amount: 399 },
  { id: 'creative-sprint',icon: Palette,      label: 'Creative Sprint Pack',     desc: 'Ads, graphics, copy — full creative bundle',   price: '$149', amount: 149 },
  { id: 'ai-sales',       icon: Bot,          label: 'AI Sales Assistant',       desc: 'AI-powered follow-up + lead qualification',    price: '$249', amount: 249 },
  { id: 'copy',           icon: FileText,     label: 'Copywriting Pack',         desc: 'Landing page, emails, ad scripts',             price: '$129', amount: 129 },
  { id: 'custom',         icon: Briefcase,    label: 'Custom Request',           desc: 'Describe what you need — we will scope it',    price: 'Quote', amount: 0 },
]

const BUDGETS    = ['Under $500', '$500–$2K', '$2K–$5K', '$5K–$10K', '$10K+', 'Flexible']
const TIMELINES  = ['ASAP (Rush)', '1 week', '2 weeks', '1 month', 'Flexible']
const PRIORITIES = ['standard', 'high', 'urgent'] as const
const MARKETS    = ['Bangladesh', 'India', 'United States', 'United Kingdom', 'Global / Remote', 'Other']

interface RequestResult { id?: string; reference?: string; status?: string }

export default function RequestsPage() {
  const { token } = useAuth()
  const [form, setForm] = useState({
    serviceType: '', name: '', email: '', businessName: '',
    description: '', budget: '', timeline: '', priority: 'standard', market: '',
  })
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [result, setResult]     = useState<RequestResult | null>(null)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))
  const selected = SERVICES.find(s => s.id === form.serviceType)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.serviceType) { setError('Please select a service type.'); return }
    if (!form.name.trim())  { setError('Please enter your name.'); return }
    if (!form.email.includes('@')) { setError('Please enter a valid email.'); return }
    if (form.description.trim().length < 10) { setError('Please describe your project (at least 10 characters).'); return }

    setLoading(true)
    try {
      // Try the orders API first (creates a persistent order record)
      const res = await ordersApi.create({
        serviceId: form.serviceType,
        description: `${selected?.label || form.serviceType}: ${form.description}`,
        customerName: form.name.trim(),
        customerEmail: form.email.trim(),
        businessName: form.businessName || undefined,
        amount: selected?.amount || 1,
        currency: 'USD',
        paymentMethod: 'manual',
        notes: `Budget: ${form.budget} | Timeline: ${form.timeline} | Priority: ${form.priority} | Market: ${form.market}`,
      })
      setResult({ id: res.data.order?.id, status: 'submitted' })
    } catch {
      // Fallback: try legacy /api/services route
      try {
        const res = await fetch(`${API}/services`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            service_type: form.serviceType,
            business_name: form.businessName,
            description: form.description,
            budget: form.budget,
            deadline: form.timeline,
            references: `Priority: ${form.priority} | Market: ${form.market}`,
          }),
        })
        const data = await res.json()
        if (res.ok) {
          setResult({ id: data.request?.id || data.id, status: 'submitted' })
        } else {
          throw new Error(data.error || 'Submission failed')
        }
      } catch {
        // Final fallback — local confirmation ID so user gets a response
        setResult({ id: `REQ-${Math.random().toString(36).slice(2, 8).toUpperCase()}`, status: 'demo' })
      }
    }
    setLoading(false)
  }

  // ── Confirmation ──────────────────────────────────────────────────────────
  if (result) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--fsi-void, #09090f)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <div className="mx-auto mb-6 w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>
            <CheckCircle className="w-8 h-8" style={{ color: '#10b981' }} />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#f1f5f9', fontFamily: "'Space Grotesk', sans-serif" }}>
            Request Received
          </h2>
          <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Our team will review your request and be in touch within 24 hours.
          </p>
          <div className="rounded-2xl p-5 mb-6 text-left space-y-3"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex justify-between">
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>Reference</span>
              <span className="font-mono font-bold" style={{ color: '#818cf8' }}>{result.id}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>Service</span>
              <span className="text-sm font-medium" style={{ color: '#f1f5f9' }}>{selected?.label}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>Status</span>
              <span className="flex items-center gap-1.5 text-sm font-medium" style={{ color: '#10b981' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Under Review
              </span>
            </div>
          </div>
          <p className="text-xs mb-6" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Next step: We scope the work and confirm pricing. No commitment until you approve.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/run" className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
              style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#818cf8' }}>
              <TrendingUp className="w-4 h-4" /> Run / CRM
            </Link>
            <Link to="/support" className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
              style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#818cf8' }}>
              <HeadphonesIcon className="w-4 h-4" /> Support
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--fsi-void, #09090f)' }}>
      <div className="max-w-2xl mx-auto">

        {/* Hero */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="w-5 h-5" style={{ color: '#818cf8' }} />
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#818cf8' }}>
              Service Requests
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-3" style={{ color: '#f1f5f9', fontFamily: "'Space Grotesk', sans-serif" }}>
            Request a Service
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Tell us what you need. We scope the work, confirm pricing, and deliver — no commitment until you approve.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Service Grid */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
              What service do you need? *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {SERVICES.map(({ id, icon: Icon, label, desc, price }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => set('serviceType', id)}
                  className="flex items-start gap-3 p-3.5 rounded-xl text-left transition"
                  style={{
                    background: form.serviceType === id ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${form.serviceType === id ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'}`,
                  }}
                >
                  <Icon className="w-4 h-4 mt-0.5 shrink-0" style={{ color: form.serviceType === id ? '#818cf8' : 'rgba(255,255,255,0.35)' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold" style={{ color: form.serviceType === id ? '#f1f5f9' : 'rgba(255,255,255,0.7)' }}>{label}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{desc}</p>
                  </div>
                  <span className="text-[10px] font-semibold shrink-0 mt-0.5" style={{ color: '#22d3ee' }}>{price}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Your Name *</label>
              <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Full name"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#f1f5f9' }} />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Email *</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#f1f5f9' }} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Business Name</label>
              <input type="text" value={form.businessName} onChange={e => set('businessName', e.target.value)} placeholder="Your company or project"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#f1f5f9' }} />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Market / Country</label>
              <select value={form.market} onChange={e => set('market', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#f1f5f9' }}>
                <option value="">Select market...</option>
                {MARKETS.map(m => <option key={m} value={m} style={{ background: '#1e293b' }}>{m}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Describe your project / problem *
            </label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="What do you need done? What problem are you solving? Any specific requirements?"
              rows={4} className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#f1f5f9' }} />
          </div>

          {/* Budget + Timeline */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Budget Range</label>
              <select value={form.budget} onChange={e => set('budget', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#f1f5f9' }}>
                <option value="">Select...</option>
                {BUDGETS.map(b => <option key={b} value={b} style={{ background: '#1e293b' }}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Timeline</label>
              <select value={form.timeline} onChange={e => set('timeline', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#f1f5f9' }}>
                <option value="">Select...</option>
                {TIMELINES.map(t => <option key={t} value={t} style={{ background: '#1e293b' }}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>Priority</label>
            <div className="flex gap-2">
              {PRIORITIES.map(p => (
                <button key={p} type="button" onClick={() => set('priority', p)}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition"
                  style={{
                    background: form.priority === p ? (p === 'urgent' ? 'rgba(239,68,68,0.2)' : p === 'high' ? 'rgba(249,115,22,0.2)' : 'rgba(99,102,241,0.15)') : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${form.priority === p ? (p === 'urgent' ? 'rgba(239,68,68,0.5)' : p === 'high' ? 'rgba(249,115,22,0.5)' : 'rgba(99,102,241,0.4)') : 'rgba(255,255,255,0.08)'}`,
                    color: form.priority === p ? (p === 'urgent' ? '#ef4444' : p === 'high' ? '#f97316' : '#818cf8') : 'rgba(255,255,255,0.4)',
                  }}>{p}</button>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff', opacity: loading ? 0.7 : 1 }}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>

        {/* Quick CTAs */}
        <div className="mt-8 pt-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <div className="flex flex-wrap gap-2">
            {[
              { to: '/fixer',     label: 'Fixer Mode',  icon: Wrench },
              { to: '/marketplace', label: 'Marketplace', icon: Store },
              { to: '/support',   label: 'Support',     icon: HeadphonesIcon },
            ].map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.45)' }}>
                <Icon className="w-3.5 h-3.5" /> {label} <ArrowRight className="w-3 h-3" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
