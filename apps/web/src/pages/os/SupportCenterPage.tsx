import { useEffect, useState } from 'react'
import { supportService } from '@/services'
import type { SupportThread } from '@/types/domain'

export default function SupportCenterPage() {
  const [threads, setThreads] = useState<SupportThread[]>([])
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')

  const refresh = async () => {
    const res = await supportService.listThreads()
    if (res.success) setThreads(res.data)
  }

  useEffect(() => { void refresh() }, [])

  return (
    <div className="grid xl:grid-cols-[1.1fr,1fr] gap-4">
      <section className="rounded-2xl border border-[var(--fsi-border)] bg-[var(--fsi-surface)] p-4">
        <h1 className="text-xl font-semibold">Support Requests</h1>
        <p className="text-sm text-[var(--fsi-text-muted)] mt-1">Create request, track status, and review response timeline.</p>
        <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className="w-full rounded-lg border border-[var(--fsi-border)] bg-black/30 px-3 py-2 text-sm mt-4" />
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Describe your issue or request..." className="w-full min-h-[140px] rounded-lg border border-[var(--fsi-border)] bg-black/30 px-3 py-2 text-sm mt-2" />
        <button onClick={async () => { if (!subject || !body) return; await supportService.createSupportRequest(subject, body); setSubject(''); setBody(''); await refresh() }} className="mt-2 rounded-lg bg-[var(--bs-red)] px-4 py-2 text-sm font-semibold">Create Support Request</button>
      </section>
      <section className="rounded-2xl border border-[var(--fsi-border)] bg-[var(--fsi-surface)] p-4">
        <h2 className="text-sm font-semibold">Request Timeline</h2>
        <div className="space-y-3 mt-3 max-h-[520px] overflow-y-auto pr-1">
          {threads.map((thread) => (
            <div key={thread.id} className="rounded-xl border border-[var(--fsi-border)] p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{thread.subject}</p>
                <span className="text-[11px] uppercase text-[var(--fsi-text-dim)]">{thread.status}</span>
              </div>
              <p className="text-xs text-[var(--fsi-text-muted)] mt-1">Priority: {thread.priority}</p>
              <div className="mt-2 space-y-1">
                {thread.messages.map((m) => <p key={m.id} className="text-xs"><span className="font-semibold">{m.sender}:</span> <span className="text-[var(--fsi-text-muted)]">{m.body}</span></p>)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
