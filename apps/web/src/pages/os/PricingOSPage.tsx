import { useState } from 'react'
import { supportService } from '@/services'

const plans = [
  { id: 'starter', name: 'Starter', price: '$49/mo', features: ['Idea Generator', 'Brand Builder', 'Basic AI Modules', 'Client Dashboard'] },
  { id: 'growth', name: 'Growth', price: '$149/mo', features: ['Business Case', 'Website Preview', 'More AI Modules', 'Support Requests', 'Asset Vault'] },
  { id: 'pro', name: 'Pro', price: '$299/mo', features: ['U.S. Setup Guidance', 'Funding Prep', 'Launch Management', 'Admin Review', 'Full AI Module Library'] },
  { id: 'elite', name: 'Elite / Done-For-You', price: '$999/mo', features: ['CGWS Team Support', 'Priority Review', 'Custom Build Support', 'Launch Assistance'] },
]

export default function PricingOSPage() {
  const [selected, setSelected] = useState<string | null>(null)
  const [note, setNote] = useState('')

  const request = async () => {
    if (!selected) return
    const plan = plans.find((p) => p.id === selected)
    await supportService.createSupportRequest(`Upgrade Request: ${plan?.name}`, note || `Interested in ${plan?.name} plan.`)
    setSelected(null)
    setNote('')
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[var(--fsi-border)] bg-[var(--fsi-surface)] p-5 text-center">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--bs-gold)]">Pricing & Upgrade</p>
        <h1 className="text-3xl font-semibold mt-2">Choose Your Gate</h1>
        <p className="text-sm text-[var(--fsi-text-muted)] mt-2">Premium plans designed for founders from idea to launch-ready operations.</p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3">
        {plans.map((plan) => (
          <div key={plan.id} className={`rounded-2xl border p-4 ${plan.id === 'pro' ? 'border-[rgba(201,164,73,0.55)] bg-[rgba(201,164,73,0.08)]' : 'border-[var(--fsi-border)] bg-[var(--fsi-surface)]'}`}>
            <h2 className="text-lg font-semibold">{plan.name}</h2>
            <p className="text-2xl font-bold mt-1 text-[var(--bs-gold-soft)]">{plan.price}</p>
            <ul className="mt-3 space-y-1">
              {plan.features.map((f) => <li key={f} className="text-xs text-[var(--fsi-text-muted)]">• {f}</li>)}
            </ul>
            <button onClick={() => setSelected(plan.id)} className="mt-4 w-full rounded-lg bg-[var(--bs-red)] px-3 py-2 text-sm font-semibold">{plan.id === 'elite' ? 'Request Elite' : 'Upgrade'}</button>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="max-w-lg mx-auto mt-24 rounded-2xl border border-[var(--fsi-border)] bg-[var(--fsi-surface)] p-5" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-semibold">Upgrade Request</h3>
            <p className="text-sm text-[var(--fsi-text-muted)] mt-1">Plan: {plans.find((p) => p.id === selected)?.name}</p>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Any context (team size, urgency, goals)..." className="w-full min-h-[130px] rounded-xl border border-[var(--fsi-border)] bg-black/30 p-3 text-sm mt-4" />
            <div className="flex gap-2 mt-3">
              <button onClick={request} className="rounded-lg bg-[var(--bs-red)] px-4 py-2 text-sm font-semibold">Submit Upgrade Request</button>
              <button onClick={() => setSelected(null)} className="rounded-lg border border-[var(--fsi-border)] px-4 py-2 text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
