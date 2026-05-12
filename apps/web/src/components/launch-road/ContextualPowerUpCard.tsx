import type { MarketplaceListing } from '@/types/domain'
import { Gem } from 'lucide-react'

interface ContextualPowerUpCardProps {
  listing?: MarketplaceListing
  onUse: (listing: MarketplaceListing) => void
}

export default function ContextualPowerUpCard({ listing, onUse }: ContextualPowerUpCardProps) {
  if (!listing) {
    return (
      <div className="lr-cockpit-panel p-3">
        <p className="text-xs uppercase text-[var(--bs-gold)]">Contextual Power-Up</p>
        <p className="text-xs text-[var(--fsi-text-muted)] mt-2">Marketplace assistance appears here based on active mission zone.</p>
      </div>
    )
  }

  return (
    <div className="lr-cockpit-panel p-3">
      <div className="flex items-start gap-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(201,164,73,0.34)] bg-[rgba(201,164,73,0.1)] text-[var(--bs-gold-soft)]">
          <Gem size={15} />
        </span>
        <div className="min-w-0">
          <p className="text-xs uppercase text-[var(--bs-gold)]">Contextual Power-Up</p>
          <p className="mt-1 text-sm font-semibold">{listing.title}</p>
        </div>
      </div>
      <p className="mt-2 text-xs text-[var(--fsi-text-muted)]">{listing.category} / {listing.price}</p>
      <p className="mt-2 line-clamp-2 text-xs leading-5 text-[var(--fsi-text-muted)]">{listing.description}</p>
      <button onClick={() => onUse(listing)} className="lr-mission-btn mt-3 rounded-lg px-3 py-2 text-xs w-full">
        Request This Support
      </button>
    </div>
  )
}
