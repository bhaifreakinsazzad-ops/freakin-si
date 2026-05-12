import { useEffect, useMemo, useState } from 'react'
import { marketplaceService, supportService } from '@/services'
import type { MarketplaceListing } from '@/types/domain'

const categories: Array<MarketplaceListing['category'] | 'all'> = ['all', 'Business Setup', 'Branding', 'Website', 'Marketing', 'Funding Prep', 'Consulting', 'Launch Support', 'Done-for-You Packages']

export default function MarketplaceOSPage() {
  const [listings, setListings] = useState<MarketplaceListing[]>([])
  const [category, setCategory] = useState<(typeof categories)[number]>('all')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<MarketplaceListing | null>(null)
  const [requestNote, setRequestNote] = useState('')

  useEffect(() => {
    ;(async () => {
      const res = await marketplaceService.listListings()
      if (res.success) setListings(res.data)
    })()
  }, [])

  const filtered = useMemo(() => listings.filter((l) => {
    const c = category === 'all' || l.category === category
    const q = !query || `${l.title} ${l.description}`.toLowerCase().includes(query.toLowerCase())
    return c && q
  }), [listings, category, query])

  const sendRequest = async () => {
    if (!selected) return
    await marketplaceService.requestListing(selected.id, requestNote || 'Please share scope and start date.')
    await supportService.createSupportRequest(`Marketplace inquiry: ${selected.title}`, requestNote || 'Need details and onboarding.')
    setSelected(null)
    setRequestNote('')
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[var(--fsi-border)] bg-[var(--fsi-surface)] p-5">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--bs-gold)]">The Gate</p>
        <h1 className="text-2xl font-semibold mt-1">Marketplace & Service Packages</h1>
        <p className="text-sm text-[var(--fsi-text-muted)] mt-1">Filter, open details, and submit inquiry requests directly to support flow.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search offers..." className="min-w-[220px] flex-1 rounded-xl border border-[var(--fsi-border)] bg-black/30 px-3 py-2 text-sm" />
        <select value={category} onChange={(e) => setCategory(e.target.value as any)} className="rounded-xl border border-[var(--fsi-border)] bg-black/30 px-3 py-2 text-sm">
          {categories.map((c) => <option key={c} value={c}>{c === 'all' ? 'All categories' : c}</option>)}
        </select>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map((listing) => (
          <button key={listing.id} onClick={() => setSelected(listing)} className="text-left rounded-2xl border border-[var(--fsi-border)] bg-[var(--fsi-surface)] p-4 hover:border-[var(--bs-gold)] transition">
            <p className="text-sm font-semibold">{listing.title}</p>
            <p className="text-xs text-[var(--fsi-text-muted)] mt-1">{listing.category}</p>
            <p className="text-xs text-[var(--fsi-text-muted)] mt-2 line-clamp-3">{listing.description}</p>
            <p className="text-lg font-bold mt-3 text-[var(--bs-gold-soft)]">{listing.price}</p>
          </button>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="max-w-lg mx-auto mt-24 rounded-2xl border border-[var(--fsi-border)] bg-[var(--fsi-surface)] p-5" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-semibold">{selected.title}</h2>
            <p className="text-sm text-[var(--fsi-text-muted)] mt-1">{selected.category} • {selected.price}</p>
            <p className="text-sm text-[var(--fsi-text-muted)] mt-3">{selected.description}</p>
            <textarea value={requestNote} onChange={(e) => setRequestNote(e.target.value)} placeholder="Tell us your exact need, timeline, and budget..." className="w-full min-h-[120px] rounded-xl border border-[var(--fsi-border)] bg-black/30 p-3 text-sm mt-4" />
            <div className="mt-3 flex gap-2">
              <button onClick={sendRequest} className="rounded-lg bg-[var(--bs-red)] px-4 py-2 text-sm font-semibold">Request Package</button>
              <button onClick={() => setSelected(null)} className="rounded-lg border border-[var(--fsi-border)] px-4 py-2 text-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
