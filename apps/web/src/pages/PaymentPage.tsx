import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Copy, Clock, AlertCircle, CreditCard, ArrowRight, ReceiptText, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { ordersApi } from '@/lib/api'
import { copyToClipboard, cn } from '@/lib/utils'

const PACKS = [
  { id: 'growth-engine', label: 'Starter Growth Engine', amount: 199, description: 'Offer, positioning, and 30-day execution plan.' },
  { id: 'messenger-sales', label: 'Messenger Sales Machine', amount: 299, description: 'WhatsApp or Messenger funnel with scripts.' },
  { id: 'booked-calls', label: 'Booked Calls Funnel', amount: 399, description: 'Lead generation, follow-up, and pipeline setup.' },
  { id: 'creative-sprint', label: 'Creative Sprint Pack', amount: 149, description: 'Ads, graphics, and conversion copy.' },
  { id: 'ai-sales', label: 'AI Sales Assistant', amount: 249, description: 'Lead qualification and follow-up workflows.' },
]

const PAYMENT_METHODS = [
  { id: 'bkash', label: 'bKash' },
  { id: 'nagad', label: 'Nagad' },
  { id: 'bank_transfer', label: 'Bank Transfer' },
  { id: 'manual', label: 'Manual Review' },
]

export default function PaymentPage() {
  const { user } = useAuth()
  const location = useLocation()
  const [selectedPack, setSelectedPack] = useState(location.state?.serviceId || PACKS[0].id)
  const [paymentMethod, setPaymentMethod] = useState('manual')
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', businessName: '', notes: '', paymentReference: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [order, setOrder] = useState<any>(null)
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    if (user) {
      setForm((prev) => ({ ...prev, name: user.name || '', email: user.email || '', phone: user.phone || '' }))
    }
  }, [user])

  useEffect(() => {
    if (!user) return
    ordersApi.getMyOrders().then((res) => setHistory(res.data.orders || [])).catch(() => {})
  }, [user])

  const selected = useMemo(() => PACKS.find((pack) => pack.id === selectedPack) || PACKS[0], [selectedPack])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) return setError('Enter your name.')
    if (!form.email.includes('@')) return setError('Enter a valid email.')
    setLoading(true)
    try {
      const res = await ordersApi.create({
        serviceId: selected.id,
        description: `${selected.label}: ${form.notes || selected.description}`,
        customerName: form.name.trim(),
        customerEmail: form.email.trim(),
        customerPhone: form.phone.trim() || undefined,
        businessName: form.businessName.trim() || undefined,
        amount: selected.amount,
        currency: 'USD',
        paymentMethod,
        notes: [
          form.notes ? `Notes: ${form.notes}` : '',
          form.paymentReference ? `Payment reference: ${form.paymentReference}` : '',
          'Status: pending_review',
        ].filter(Boolean).join(' | '),
      })
      setOrder(res.data.order)
      setHistory((prev) => [res.data.order, ...prev])
    } catch (err: any) {
      setError(err.response?.data?.error || 'Could not create order right now.')
    } finally {
      setLoading(false)
    }
  }

  if (order) {
    return (
      <div className="min-h-screen p-4 md:p-8" style={{ background: 'linear-gradient(180deg, #06070b 0%, #0b1020 100%)' }}>
        <div className="mx-auto max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-cyan-500/20 bg-white/5 p-6 md:p-8 backdrop-blur-xl">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10">
              <CheckCircle className="h-7 w-7 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-semibold text-white">Order received</h1>
            <p className="mt-2 text-sm text-slate-400">Your manual payment request is pending review.</p>
            <div className="mt-6 space-y-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-slate-300">
              <div className="flex items-center justify-between gap-4"><span className="text-slate-500">Order ID</span><span className="font-mono text-cyan-300">{order.id}</span></div>
              <div className="flex items-center justify-between gap-4"><span className="text-slate-500">Service</span><span>{selected.label}</span></div>
              <div className="flex items-center justify-between gap-4"><span className="text-slate-500">Status</span><span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-xs text-amber-300">pending_review</span></div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Link to="/dashboard" className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm text-white transition hover:border-cyan-400/40">Go to dashboard</Link>
              <Link to="/support" className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm text-white transition hover:border-cyan-400/40">Contact support</Link>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: 'linear-gradient(180deg, #05060a 0%, #0a1120 100%)' }}>
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-cyan-300 text-xs uppercase tracking-[0.24em]"><ReceiptText className="h-4 w-4" /> Manual Checkout</div>
            <h1 className="mt-2 text-3xl font-semibold text-white">Request growth access</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">Choose a service pack, submit your details, and receive a pending review order ID. No fake instant payment claims.</p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-xs text-cyan-200">
            <ShieldCheck className="h-4 w-4" /> Manual review enabled
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-4 md:p-6 backdrop-blur-xl">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Select a pack</h2>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {PACKS.map((pack) => (
                  <button
                    key={pack.id}
                    type="button"
                    onClick={() => setSelectedPack(pack.id)}
                    className={cn('rounded-2xl border p-4 text-left transition', selectedPack === pack.id ? 'border-cyan-400/40 bg-cyan-500/10' : 'border-white/10 bg-black/20 hover:border-white/20')}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-white">{pack.label}</div>
                        <div className="mt-1 text-xs text-slate-400">{pack.description}</div>
                      </div>
                      <div className="text-sm font-semibold text-cyan-300">${pack.amount}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Name" value={form.name} onChange={(value) => setForm((prev) => ({ ...prev, name: value }))} />
                <Field label="Email" value={form.email} onChange={(value) => setForm((prev) => ({ ...prev, email: value }))} type="email" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Phone / WhatsApp" value={form.phone} onChange={(value) => setForm((prev) => ({ ...prev, phone: value }))} />
                <Field label="Business name" value={form.businessName} onChange={(value) => setForm((prev) => ({ ...prev, businessName: value }))} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-[0.18em] text-slate-400">Payment method preference</label>
                <div className="flex flex-wrap gap-2">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={cn('rounded-full border px-3 py-2 text-xs transition', paymentMethod === method.id ? 'border-cyan-400/40 bg-cyan-500/10 text-cyan-200' : 'border-white/10 bg-black/20 text-slate-300')}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-[0.18em] text-slate-400">Notes</label>
                <textarea
                  rows={4}
                  value={form.notes}
                  onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600"
                  placeholder="Tell us what you want built, fixed, or reviewed."
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-[0.18em] text-slate-400">Payment reference or transaction ID</label>
                <div className="flex gap-2">
                  <input
                    value={form.paymentReference}
                    onChange={(e) => setForm((prev) => ({ ...prev, paymentReference: e.target.value }))}
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600"
                    placeholder="Optional if not yet paid"
                  />
                  <button
                    type="button"
                    onClick={() => { copyToClipboard(order?.id || selected.id); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-200"
                  >
                    <Copy className="h-4 w-4" /> {copied ? 'Copied' : 'Copy ID'}
                  </button>
                </div>
              </div>
              {error && (
                <div className="flex items-center gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                  <AlertCircle className="h-4 w-4" /> {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-60"
              >
                {loading ? 'Submitting...' : 'Submit manual order'} <ArrowRight className="h-4 w-4" />
              </button>
              <p className="flex items-center justify-center gap-2 text-xs text-slate-500"><Clock className="h-3.5 w-3.5" /> Orders are reviewed manually before activation.</p>
            </form>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-sm font-semibold text-white"><CreditCard className="h-4 w-4 text-cyan-300" /> Current selection</div>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <Row label="Service" value={selected.label} />
                <Row label="Amount" value={`$${selected.amount}`} />
                <Row label="Payment mode" value="manual / pending_review" />
                <Row label="Status" value="not paid yet" />
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <div className="text-sm font-semibold text-white">Recent orders</div>
              <div className="mt-4 space-y-3">
                {history.length ? history.slice(0, 3).map((item) => (
                  <div key={item.id} className="rounded-2xl border border-white/10 bg-black/20 p-3 text-sm text-slate-300">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-cyan-300">{item.id}</span>
                      <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-xs text-amber-300">{item.status}</span>
                    </div>
                    <div className="mt-1 text-xs text-slate-400">{item.description || item.serviceId || 'Order'}</div>
                  </div>
                )) : <div className="text-sm text-slate-500">No orders yet.</div>}
              </div>
            </div>

            <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-5 text-sm text-cyan-100 backdrop-blur-xl">
              <div className="font-semibold text-white">Allowed wording</div>
              <ul className="mt-2 space-y-1 text-cyan-100/90">
                <li>Manual Checkout</li>
                <li>Request Invoice</li>
                <li>Submit Payment Reference</li>
                <li>Pending Review</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs uppercase tracking-[0.18em] text-slate-400">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600"
      />
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4"><span className="text-slate-500">{label}</span><span className="text-right">{value}</span></div>
}
