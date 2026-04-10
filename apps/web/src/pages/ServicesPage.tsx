/**
 * BhaiFreakin'sBI — Service Request Portal
 * Request professional Ads, Dev, Design, Copy, SEO, Social services
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Target, Code2, Palette, FileText, TrendingUp, Users,
  CheckCircle, Send, Briefcase, Clock, Loader2, ArrowLeft,
  Zap, RefreshCw,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const SERVICES = [
  { id: 'ads',    icon: Target,    label: 'Ads',    desc: 'Facebook, Google, TikTok ads', color: '#E74C3C' },
  { id: 'dev',    icon: Code2,     label: 'Dev',    desc: 'Website, landing page, store',  color: '#3B82F6' },
  { id: 'design', icon: Palette,   label: 'Design', desc: 'Brand, UI/UX, graphics',        color: '#8B5CF6' },
  { id: 'copy',   icon: FileText,  label: 'Copy',   desc: 'Emails, sales copy, content',   color: '#F5B041' },
  { id: 'seo',    icon: TrendingUp,label: 'SEO',    desc: 'Blog posts, keyword strategy',  color: '#00C27A' },
  { id: 'social', icon: Users,     label: 'Social', desc: 'Content calendar, management',  color: '#EC4899' },
]

const BUDGETS  = ['Under $500', '$500–$1K', '$1K–$2.5K', '$2.5K–$5K', '$5K+']
const DEADLINES = ['ASAP (Rush)', '3 days', '1 week', '2 weeks', 'Flexible']

export default function ServicesPage() {
  const { token, user } = useAuth()
  const [serviceType, setServiceType]     = useState('')
  const [businessName, setBusinessName]   = useState('')
  const [description, setDescription]     = useState('')
  const [budget, setBudget]               = useState('')
  const [deadline, setDeadline]           = useState('')
  const [references, setReferences]       = useState('')
  const [loading, setLoading]             = useState(false)
  const [error, setError]                 = useState('')
  const [success, setSuccess]             = useState(false)

  const selected = SERVICES.find(s => s.id === serviceType)

  const handleSubmit = async () => {
    if (!serviceType) { setError('Please select a service type.'); return }
    if (description.trim().length < 10) { setError('Please describe your project in at least 10 characters.'); return }
    setError('')
    setLoading(true)
    try {
      const r = await fetch(`${API}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          service_type:  serviceType,
          name:          user?.name || '',
          email:         user?.email || '',
          business_name: businessName,
          description:   description.trim(),
          budget,
          deadline,
          references_url: references,
        }),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Submission failed')
      setSuccess(true)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Submission failed'
      setError(message)
    }
    setLoading(false)
  }

  const reset = () => {
    setServiceType('')
    setBusinessName('')
    setDescription('')
    setBudget('')
    setDeadline('')
    setReferences('')
    setError('')
    setSuccess(false)
  }

  return (
    <div className="h-full overflow-y-auto" style={{ background: 'var(--fsi-void)' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 px-4 py-3 flex items-center justify-between"
        style={{ background: 'rgba(8,8,8,0.88)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--fsi-border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #F5B041, #D4830A)', boxShadow: '0 0 12px rgba(245,176,65,0.3)' }}>
            <Briefcase size={16} color="#000" />
          </div>
          <div>
            <h1 className="font-display font-bold text-sm leading-none" style={{ color: 'var(--fsi-gold)' }}>Services</h1>
            <p className="text-xs mt-0.5" style={{ color: 'var(--fsi-text-muted)' }}>Request Expert Help</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 pb-12">
        <AnimatePresence mode="wait">

          {/* ── SUCCESS ────────────────────────────────────────────── */}
          {success && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(0,194,122,0.15)', border: '2px solid rgba(0,194,122,0.4)' }}>
                <CheckCircle size={36} style={{ color: '#00C27A' }} />
              </motion.div>
              <div>
                <h2 className="font-display font-bold text-2xl mb-2" style={{ color: 'var(--fsi-text)' }}>
                  Request Submitted!
                </h2>
                <p className="text-sm max-w-xs" style={{ color: 'var(--fsi-text-muted)' }}>
                  Our team will review your{' '}
                  <span style={{ color: 'var(--fsi-gold)' }}>{selected?.label}</span> request
                  and reach out within 24 hours.
                </p>
              </div>
              <div className="flex gap-3">
                <button onClick={reset}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: 'rgba(245,176,65,0.1)', color: 'var(--fsi-gold)', border: '1px solid rgba(245,176,65,0.2)' }}>
                  <RefreshCw size={14} />
                  New Request
                </button>
              </div>
            </motion.div>
          )}

          {/* ── FORM ───────────────────────────────────────────────── */}
          {!success && (
            <motion.div key="form" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 mt-2">

              {/* Hero */}
              <div className="text-center pt-2">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3 text-xs font-medium"
                  style={{ background: 'rgba(245,176,65,0.08)', color: 'var(--fsi-gold)', border: '1px solid rgba(245,176,65,0.2)' }}>
                  <Zap size={12} />
                  Typical delivery: 24–72 hours
                </div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl mb-2"
                  style={{ background: 'linear-gradient(135deg, #F5B041, #E67E22)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Request Expert Help
                </h2>
                <p className="text-sm" style={{ color: 'var(--fsi-text-muted)' }}>
                  Our team of creatives, developers & marketers are standing by.
                </p>
              </div>

              {/* Service type selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--fsi-text-muted)' }}>
                  What do you need? *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SERVICES.map(s => (
                    <motion.button key={s.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => setServiceType(s.id === serviceType ? '' : s.id)}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all text-center"
                      style={{
                        background: serviceType === s.id ? `${s.color}15` : 'var(--fsi-surface)',
                        border: `1px solid ${serviceType === s.id ? `${s.color}50` : 'var(--fsi-border)'}`,
                      }}>
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{ background: `${s.color}18` }}>
                        <s.icon size={18} style={{ color: s.color }} />
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: serviceType === s.id ? s.color : 'var(--fsi-text)' }}>{s.label}</p>
                        <p className="text-xs" style={{ color: 'var(--fsi-text-muted)' }}>{s.desc}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Form fields */}
              <div className="rounded-2xl p-5 space-y-4"
                style={{ background: 'var(--fsi-surface)', border: '1px solid var(--fsi-border)' }}>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--fsi-text-muted)' }}>
                    Business / Project Name
                  </label>
                  <input value={businessName} onChange={e => setBusinessName(e.target.value)}
                    placeholder="e.g. GlowPure Skincare"
                    className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                    style={{ background: 'var(--fsi-surface-2)', border: '1px solid var(--fsi-border)', color: 'var(--fsi-text)' }} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--fsi-text-muted)' }}>
                    Project Description *
                  </label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)}
                    placeholder={`Describe what you need${selected ? ` for ${selected.label.toLowerCase()}` : ''}...`}
                    rows={4}
                    className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none"
                    style={{ background: 'var(--fsi-surface-2)', border: `1px solid ${description.length >= 10 ? 'rgba(245,176,65,0.3)' : 'var(--fsi-border)'}`, color: 'var(--fsi-text)' }} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--fsi-text-muted)' }}>Budget</label>
                    <div className="flex flex-col gap-1">
                      {BUDGETS.map(b => (
                        <button key={b} onClick={() => setBudget(b === budget ? '' : b)}
                          className="px-3 py-1.5 rounded-lg text-xs text-left transition-all"
                          style={{
                            background: budget === b ? 'rgba(245,176,65,0.12)' : 'var(--fsi-surface-2)',
                            color: budget === b ? 'var(--fsi-gold)' : 'var(--fsi-text-muted)',
                            border: `1px solid ${budget === b ? 'rgba(245,176,65,0.3)' : 'transparent'}`,
                          }}>
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--fsi-text-muted)' }}>Deadline</label>
                    <div className="flex flex-col gap-1">
                      {DEADLINES.map(d => (
                        <button key={d} onClick={() => setDeadline(d === deadline ? '' : d)}
                          className="px-3 py-1.5 rounded-lg text-xs text-left transition-all"
                          style={{
                            background: deadline === d ? 'rgba(245,176,65,0.12)' : 'var(--fsi-surface-2)',
                            color: deadline === d ? 'var(--fsi-gold)' : 'var(--fsi-text-muted)',
                            border: `1px solid ${deadline === d ? 'rgba(245,176,65,0.3)' : 'transparent'}`,
                          }}>
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--fsi-text-muted)' }}>
                    References / Examples (optional)
                  </label>
                  <input value={references} onChange={e => setReferences(e.target.value)}
                    placeholder="URLs or names of examples you like..."
                    className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                    style={{ background: 'var(--fsi-surface-2)', border: '1px solid var(--fsi-border)', color: 'var(--fsi-text)' }} />
                </div>
              </div>

              {/* Guarantee badges */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: '⚡', label: '24-hr response' },
                  { icon: '🔄', label: 'Unlimited revisions' },
                  { icon: '💰', label: 'Money-back guarantee' },
                ].map(g => (
                  <div key={g.label} className="rounded-xl p-3 text-center"
                    style={{ background: 'var(--fsi-surface)', border: '1px solid var(--fsi-border)' }}>
                    <div className="text-lg mb-1">{g.icon}</div>
                    <p className="text-xs" style={{ color: 'var(--fsi-text-muted)' }}>{g.label}</p>
                  </div>
                ))}
              </div>

              {error && <p className="text-sm text-center" style={{ color: '#E74C3C' }}>{error}</p>}

              {/* Submit */}
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={loading || !serviceType}
                className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                style={{
                  background: 'linear-gradient(135deg, #F5B041, #D4830A)',
                  color: '#000',
                  boxShadow: serviceType ? '0 0 30px rgba(245,176,65,0.25)' : 'none',
                }}>
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                {loading ? 'Submitting...' : 'Submit Service Request'}
              </motion.button>

              <p className="text-xs text-center" style={{ color: 'var(--fsi-text-muted)' }}>
                <Clock size={12} className="inline mr-1" />
                Our team reviews requests and responds within 24 hours
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
