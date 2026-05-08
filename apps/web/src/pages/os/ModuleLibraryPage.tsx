import { useEffect, useMemo, useState } from 'react'
import { aiModuleService, journeyService, reviewService } from '@/services'
import type { ModuleDefinition, ModuleRun } from '@/types/domain'

export default function ModuleLibraryPage() {
  const [modules, setModules] = useState<ModuleDefinition[]>([])
  const [runs, setRuns] = useState<ModuleRun[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [activeId, setActiveId] = useState<string>('1')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      const [m, r] = await Promise.all([aiModuleService.listModules(), aiModuleService.getRecentRuns()])
      if (m.success) setModules(m.data)
      if (r.success) setRuns(r.data)
    })()
  }, [])

  const categories = Array.from(new Set(modules.map((m) => m.category)))

  const filtered = useMemo(() => modules.filter((m) => {
    const okSearch = !search || m.name.toLowerCase().includes(search.toLowerCase())
    const okCat = category === 'all' || m.category === category
    return okSearch && okCat
  }), [modules, search, category])

  const active = modules.find((m) => m.id === activeId)

  const run = async () => {
    setLoading(true)
    const res = await aiModuleService.runAIModule(activeId, input || `Generate ${active?.name} result for my project`)
    if (res.success) {
      setOutput(res.data.output)
      setRuns((prev) => [res.data, ...prev])
    }
    setLoading(false)
  }

  return (
    <div className="grid xl:grid-cols-[1.2fr,1fr] gap-4">
      <section className="rounded-2xl border border-[var(--fsi-border)] bg-[var(--fsi-surface)] p-4">
        <div className="flex flex-wrap gap-2 mb-3">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search 52 modules..." className="flex-1 min-w-[220px] rounded-lg border border-[var(--fsi-border)] bg-black/30 px-3 py-2 text-sm" />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-[var(--fsi-border)] bg-black/30 px-3 py-2 text-sm">
            <option value="all">All categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="grid md:grid-cols-2 gap-2 max-h-[70vh] overflow-y-auto pr-1">
          {filtered.map((m) => (
            <button key={m.id} onClick={() => setActiveId(m.id)} className={`text-left rounded-xl border p-3 transition ${activeId === m.id ? 'border-[var(--bs-gold)] bg-[rgba(201,164,73,0.08)]' : 'border-[var(--fsi-border)]'}`}>
              <div className="flex justify-between items-start gap-2">
                <p className="text-sm font-medium">{m.id}. {m.name}</p>
                <span className="text-[10px] uppercase text-[var(--fsi-text-dim)]">{m.status}</span>
              </div>
              <p className="text-xs text-[var(--fsi-text-muted)] mt-1">{m.category}</p>
              <p className="text-xs text-[var(--fsi-text-muted)] mt-1">Usage: {m.usageCount}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--fsi-border)] bg-[var(--fsi-surface)] p-4">
        <h2 className="font-semibold">Module Workspace</h2>
        <p className="text-sm text-[var(--fsi-text-muted)] mt-1">{active?.name} • {active?.category}</p>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full min-h-[140px] rounded-xl mt-3 bg-black/30 border border-[var(--fsi-border)] p-3 text-sm" placeholder="Add project context and generation instructions..." />
        <div className="flex gap-2 mt-3 flex-wrap">
          <button onClick={run} disabled={loading} className="rounded-lg bg-[var(--bs-red)] px-4 py-2 text-sm font-semibold disabled:opacity-60">{loading ? 'Running...' : 'Run Module'}</button>
          <button onClick={() => navigator.clipboard.writeText(output)} className="rounded-lg border border-[var(--fsi-border)] px-4 py-2 text-sm">Copy</button>
          <button onClick={async () => { await reviewService.submitForReview(`module-${activeId}`) }} className="rounded-lg border border-[var(--fsi-border)] px-4 py-2 text-sm">Submit for Review</button>
          <button onClick={async () => { await journeyService.updateStepProgress(Number(activeId) > 45 ? 7 : Number(activeId) > 38 ? 6 : Number(activeId) > 30 ? 5 : Number(activeId) > 21 ? 4 : Number(activeId) > 14 ? 3 : Number(activeId) > 7 ? 2 : 1, 100) }} className="rounded-lg border border-[var(--fsi-border)] px-4 py-2 text-sm">Send to Journey Step</button>
        </div>
        <pre className="whitespace-pre-wrap rounded-xl mt-3 bg-black/25 border border-[var(--fsi-border)] p-3 text-xs text-[var(--fsi-text-muted)] min-h-[180px]">{output || 'Module output appears here after run.'}</pre>
        <h3 className="text-sm font-medium mt-4">Recently Used</h3>
        <div className="mt-2 space-y-2 max-h-[170px] overflow-y-auto pr-1">
          {runs.slice(0, 8).map((r) => <div key={r.id} className="rounded-lg border border-[var(--fsi-border)] p-2 text-xs"><p className="font-medium">Module {r.moduleId}</p><p className="text-[var(--fsi-text-muted)]">{new Date(r.createdAt).toLocaleString()}</p></div>)}
        </div>
      </section>
    </div>
  )
}
