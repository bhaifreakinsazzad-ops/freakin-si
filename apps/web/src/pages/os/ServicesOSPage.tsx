import { useState } from 'react'
import { supportService } from '@/services'

const services = [
  { id: 'branding', name: 'Branding Sprint', note: 'Name, tagline, visual direction, positioning.' },
  { id: 'website', name: 'Website Build', note: 'Landing + sections + CTA + analytics.' },
  { id: 'marketing', name: 'Marketing Setup', note: 'Ad copy, content plan, channel strategy.' },
  { id: 'funding', name: 'Funding Prep Support', note: 'Readiness scoring and lender docs.' },
  { id: 'launch', name: 'Launch Management', note: 'Task board, CRM, handoff and KPI plan.' },
]

export default function ServicesOSPage() {
  const [serviceId, setServiceId] = useState(services[0].id)
  const [businessName, setBusinessName] = useState('')
  const [budget, setBudget] = useState('')
  const [deadline, setDeadline] = useState('')
  const [details, setDetails] = useState('')
  const [done, setDone] = useState(false)

  const submit = async () => {
    const selected = services.find((s) => s.id === serviceId)
    await supportService.createSupportRequest(
      `Build Request: ${selected?.name}`,
      `Business: ${businessName}\nBudget: ${budget}\nDeadline: ${deadline}\nDetails: ${details}`,
    )
    setDone(true)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="rounded-2xl border border-[var(--fsi-border)] bg-[var(--fsi-surface)] p-5">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--bs-gold)]">Build Request</p>
        <h1 className="text-2xl font-semibold mt-1">Request Expert Execution</h1>
        <p className="text-sm text-[var(--fsi-text-muted)] mt-1">Every request creates a support thread so admin can triage and respond.</p>
      </div>

      {done ? (
        <div className="rounded-2xl border border-[var(--fsi-border)] bg-[var(--fsi-surface)] p-5">
          <h2 className="text-xl font-semibold">Request Submitted</h2>
          <p className="text-sm text-[var(--fsi-text-muted)] mt-2">Your request was pushed into support workflow. You can track updates from Support Requests.</p>
          <button onClick={() => setDone(false)} className="mt-4 rounded-lg border border-[var(--fsi-border)] px-4 py-2 text-sm">Create Another</button>
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--fsi-border)] bg-[var(--fsi-surface)] p-5 space-y-3">
          <label className="text-xs uppercase text-[var(--fsi-text-dim)]">Service</label>
          <select value={serviceId} onChange={(e) => setServiceId(e.target.value)} className="w-full rounded-xl border border-[var(--fsi-border)] bg-black/30 px-3 py-2 text-sm">
            {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <p className="text-xs text-[var(--fsi-text-muted)]">{services.find((s) => s.id === serviceId)?.note}</p>

          <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Business / project name" className="w-full rounded-xl border border-[var(--fsi-border)] bg-black/30 px-3 py-2 text-sm" />
          <div className="grid sm:grid-cols-2 gap-3">
            <input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Budget range" className="rounded-xl border border-[var(--fsi-border)] bg-black/30 px-3 py-2 text-sm" />
            <input value={deadline} onChange={(e) => setDeadline(e.target.value)} placeholder="Deadline" className="rounded-xl border border-[var(--fsi-border)] bg-black/30 px-3 py-2 text-sm" />
          </div>
          <textarea value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Describe scope, goals, constraints..." className="w-full min-h-[140px] rounded-xl border border-[var(--fsi-border)] bg-black/30 px-3 py-2 text-sm" />
          <button onClick={submit} className="rounded-lg bg-[var(--bs-red)] px-4 py-2 text-sm font-semibold">Submit Build Request</button>
        </div>
      )}
    </div>
  )
}
