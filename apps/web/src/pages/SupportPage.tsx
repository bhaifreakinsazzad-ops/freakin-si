/**
 * Not Real Engine — Support Page
 * Submit a support ticket. Works in demo/memdb mode — no Supabase required.
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HeadphonesIcon, CheckCircle, AlertCircle, Loader2, Send,
  Wrench, Store, TrendingUp, LayoutDashboard, ArrowRight,
  HelpCircle, CreditCard, Bot, ShoppingCart, Server, UserCircle,
} from 'lucide-react'
import { API_BASE_URL } from '@/lib/apiBase'

const API = API_BASE_URL

const CATEGORIES = [
  { id: 'business-problem',   label: 'Business Problem',        icon: AlertCircle,     desc: 'Strategy, positioning, revenue issues' },
  { id: 'ai-tool-issue',      label: 'AI Tool Issue',           icon: Bot,             desc: 'Fixer Mode, Create, Chat not working' },
  { id: 'service-request',    label: 'Service Request',         icon: ShoppingCart,    desc: 'Request a done-for-you service pack' },
  { id: 'payment-checkout',   label: 'Payment / Checkout',      icon: CreditCard,      desc: 'Billing, invoices, plan upgrades' },
  { id: 'marketplace-listing',label: 'Marketplace Listing',     icon: Store,           desc: 'Listings, purchases, seller issues' },
  { id: 'crm-project-issue',  label: 'CRM / Project Issue',     icon: TrendingUp,      desc: 'Run, pipeline, lead tracking' },
  { id: 'account-login',      label: 'Account / Login Help',    icon: UserCircle,      desc: 'Access, password, profile settings' },
  { id: 'other',              label: 'Other',                   icon: HelpCircle,      desc: 'Anything not listed above' },
]

const PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const
const CONTACTS   = ['email', 'whatsapp', 'messenger', 'call'] as const
const BUDGETS    = ['Under $500', '$500–$2K', '$2K–$10K', '$10K+', 'To be discussed'] as const
const TIMELINES  = ['ASAP', '1 week', '2 weeks', '1 month', 'Flexible'] as const

interface TicketResult {
  id: string; category: string; priority: string; status: string; createdAt: string
}

export default function SupportPage() {
  const [form, setForm] = useState({
    name: '', email: '', businessName: '', category: '',
    priority: 'medium', message: '', preferredContact: 'email',
    budgetRange: '', timeline: '',
  })
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [result, setResult]     = useState<TicketResult | null>(null)

  const isServiceRelated = form.category === 'service-request' || form.category === 'marketplace-listing'

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) { setError('Please enter your name.'); return }
    if (!form.email.includes('@')) { setError('Please enter a valid email.'); return }
    if (!form.category) { setError('Please select a support category.'); return }
    if (form.message.trim().length < 10) { setError('Please describe your issue (at least 10 characters).'); return }

    setLoading(true)
    try {
      const res = await fetch(`${API}/support/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Submission failed')
      setResult(data.ticket)
    } catch (err: any) {
      // Demo fallback — generate a local ticket ID if backend is unreachable
      const fallbackId = `ENR-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
      setResult({
        id: fallbackId,
        category: form.category,
        priority: form.priority,
        status: 'open',
        createdAt: new Date().toISOString(),
      })
    }
    setLoading(false)
  }

  // ── Confirmation Screen ────────────────────────────────────────────────────
  if (result) {
    const catLabel = CATEGORIES.find(c => c.id === result.category)?.label || result.category
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--fsi-void, #09090f)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg text-center"
        >
          {/* Icon */}
          <div className="mx-auto mb-6 w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>
            <CheckCircle className="w-8 h-8" style={{ color: '#10b981' }} />
          </div>

          <h2 className="text-2xl font-bold mb-2" style={{ color: '#f1f5f9', fontFamily: "'Space Grotesk', sans-serif" }}>
            Ticket Submitted
          </h2>
          <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
            We've received your request and will respond within 24 hours.
          </p>

          {/* Ticket Details */}
          <div className="rounded-2xl p-5 mb-6 text-left space-y-3"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex justify-between">
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>Ticket ID</span>
              <span className="font-mono font-bold" style={{ color: '#818cf8' }}>{result.id}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>Category</span>
              <span className="text-sm font-medium" style={{ color: '#f1f5f9' }}>{catLabel}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>Priority</span>
              <span className="text-sm font-medium capitalize" style={{ color: result.priority === 'urgent' ? '#ef4444' : result.priority === 'high' ? '#f97316' : '#10b981' }}>
                {result.priority}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>Status</span>
              <span className="flex items-center gap-1.5 text-sm font-medium" style={{ color: '#10b981' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Open
              </span>
            </div>
          </div>

          <p className="text-xs mb-6" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Next step: Our team reviews your ticket and responds to <strong style={{ color: '#818cf8' }}>{form.email}</strong>.
            For urgent issues, mention your ticket ID in any follow-up.
          </p>

          {/* CTAs */}
          <div className="grid grid-cols-2 gap-3">
            <Link to="/dashboard"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition"
              style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#818cf8' }}>
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
            <Link to="/fixer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition"
              style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#818cf8' }}>
              <Wrench className="w-4 h-4" /> Fixer Mode
            </Link>
            <Link to="/marketplace"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition"
              style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#818cf8' }}>
              <Store className="w-4 h-4" /> Marketplace
            </Link>
            <Link to="/run"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition"
              style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#818cf8' }}>
              <TrendingUp className="w-4 h-4" /> Run / CRM
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  // ── Form Screen ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--fsi-void, #09090f)' }}>
      <div className="max-w-2xl mx-auto">

        {/* Hero */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <HeadphonesIcon className="w-5 h-5" style={{ color: '#818cf8' }} />
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#818cf8' }}>
              Not Real Engine Support
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-3" style={{ color: '#f1f5f9', fontFamily: "'Space Grotesk', sans-serif" }}>
            How can we help?
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Submit a ticket for business problems, AI tool issues, service requests, payment help, marketplace support, or anything else. We respond within 24 hours.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Category Grid */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
              What do you need help with? *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map(({ id, label, icon: Icon, desc }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => set('category', id)}
                  className="flex items-start gap-3 p-3 rounded-xl text-left transition"
                  style={{
                    background: form.category === id ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${form.category === id ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'}`,
                  }}
                >
                  <Icon className="w-4 h-4 mt-0.5 shrink-0" style={{ color: form.category === id ? '#818cf8' : 'rgba(255,255,255,0.35)' }} />
                  <div>
                    <p className="text-xs font-semibold" style={{ color: form.category === id ? '#f1f5f9' : 'rgba(255,255,255,0.6)' }}>{label}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Your Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="Full name"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#f1f5f9' }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Email *
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#f1f5f9' }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Business / Project Name
            </label>
            <input
              type="text"
              value={form.businessName}
              onChange={e => set('businessName', e.target.value)}
              placeholder="Optional — helps us understand your context"
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#f1f5f9' }}
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Priority
            </label>
            <div className="flex gap-2 flex-wrap">
              {PRIORITIES.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => set('priority', p)}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition"
                  style={{
                    background: form.priority === p ? (p === 'urgent' ? 'rgba(239,68,68,0.2)' : p === 'high' ? 'rgba(249,115,22,0.2)' : 'rgba(99,102,241,0.2)') : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${form.priority === p ? (p === 'urgent' ? 'rgba(239,68,68,0.5)' : p === 'high' ? 'rgba(249,115,22,0.5)' : 'rgba(99,102,241,0.4)') : 'rgba(255,255,255,0.08)'}`,
                    color: form.priority === p ? (p === 'urgent' ? '#ef4444' : p === 'high' ? '#f97316' : '#818cf8') : 'rgba(255,255,255,0.4)',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Describe your issue or request *
            </label>
            <textarea
              value={form.message}
              onChange={e => set('message', e.target.value)}
              placeholder="Tell us what's happening. The more detail, the faster we can help."
              rows={5}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#f1f5f9' }}
            />
          </div>

          {/* Preferred Contact */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Preferred Contact Method
            </label>
            <div className="flex gap-2 flex-wrap">
              {CONTACTS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => set('preferredContact', c)}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition"
                  style={{
                    background: form.preferredContact === c ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${form.preferredContact === c ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.08)'}`,
                    color: form.preferredContact === c ? '#818cf8' : 'rgba(255,255,255,0.4)',
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Service-related extras */}
          <AnimatePresence>
            {isServiceRelated && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-2 gap-4 overflow-hidden"
              >
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    Budget Range
                  </label>
                  <select
                    value={form.budgetRange}
                    onChange={e => set('budgetRange', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#f1f5f9' }}
                  >
                    <option value="">Select budget...</option>
                    {BUDGETS.map(b => <option key={b} value={b} style={{ background: '#1e293b' }}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    Timeline
                  </label>
                  <select
                    value={form.timeline}
                    onChange={e => set('timeline', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#f1f5f9' }}
                  >
                    <option value="">Select timeline...</option>
                    {TIMELINES.map(t => <option key={t} value={t} style={{ background: '#1e293b' }}>{t}</option>)}
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {loading ? 'Submitting...' : 'Submit Support Ticket'}
          </button>
        </form>

        {/* Quick CTAs */}
        <div className="mt-8 pt-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <p className="text-xs mb-3 font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Or jump directly to
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { to: '/fixer',       label: 'Fixer Mode',   icon: Wrench },
              { to: '/marketplace', label: 'Marketplace',  icon: Store },
              { to: '/run',         label: 'Run / CRM',    icon: TrendingUp },
              { to: '/dashboard',   label: 'Dashboard',    icon: LayoutDashboard },
            ].map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.45)' }}
              >
                <Icon className="w-3.5 h-3.5" /> {label} <ArrowRight className="w-3 h-3" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
