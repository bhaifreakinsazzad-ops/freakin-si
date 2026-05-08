import { useState } from 'react'
import { Link } from 'react-router-dom'
import { projectService, reviewService, trackingService } from '@/services'

export default function BuilderOSPage() {
  const [idea, setIdea] = useState('')
  const [audience, setAudience] = useState('')
  const [budget, setBudget] = useState('')
  const [loading, setLoading] = useState(false)
  const [output, setOutput] = useState('')

  const generate = async () => {
    setLoading(true)
    const res = await projectService.saveBusinessIdea(idea, audience, budget)
    if (res.success) {
      setOutput(JSON.stringify(res.data, null, 2))
      await trackingService.track('builder_generate', { idea, audience, budget })
    }
    setLoading(false)
  }

  const submit = async () => {
    await reviewService.submitForReview('builder-blueprint', 1)
  }

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <div className="rounded-2xl border border-[var(--fsi-border)] bg-[var(--fsi-surface)] p-5">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--bs-gold)]">Uncover My Gold</p>
        <h1 className="text-2xl font-semibold mt-1">Business Builder Workspace</h1>
        <p className="text-sm text-[var(--fsi-text-muted)] mt-1">Legacy builder upgraded into THE SHEEP service contract. For full 7-step experience, continue in Journey.</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <section className="rounded-2xl border border-[var(--fsi-border)] bg-[var(--fsi-surface)] p-4 space-y-3">
          <input value={idea} onChange={(e) => setIdea(e.target.value)} placeholder="Raw business idea" className="w-full rounded-xl border border-[var(--fsi-border)] bg-black/30 px-3 py-2 text-sm" />
          <input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Target audience" className="w-full rounded-xl border border-[var(--fsi-border)] bg-black/30 px-3 py-2 text-sm" />
          <input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Budget range" className="w-full rounded-xl border border-[var(--fsi-border)] bg-black/30 px-3 py-2 text-sm" />
          <div className="flex flex-wrap gap-2">
            <button onClick={generate} disabled={loading} className="rounded-lg bg-[var(--bs-red)] px-4 py-2 text-sm font-semibold disabled:opacity-60">{loading ? 'Generating...' : 'Generate Strategy'}</button>
            <button onClick={() => navigator.clipboard.writeText(output)} className="rounded-lg border border-[var(--fsi-border)] px-4 py-2 text-sm">Copy</button>
            <button onClick={submit} className="rounded-lg border border-[var(--fsi-border)] px-4 py-2 text-sm">Submit for Review</button>
            <Link to="/journey" className="rounded-lg border border-[var(--fsi-border)] px-4 py-2 text-sm">Open 7-Step Journey</Link>
          </div>
        </section>
        <section className="rounded-2xl border border-[var(--fsi-border)] bg-[var(--fsi-surface)] p-4">
          <h2 className="font-semibold">Builder Output</h2>
          <pre className="whitespace-pre-wrap text-xs text-[var(--fsi-text-muted)] mt-2 min-h-[220px]">{output || 'No output yet.'}</pre>
        </section>
      </div>
    </div>
  )
}
