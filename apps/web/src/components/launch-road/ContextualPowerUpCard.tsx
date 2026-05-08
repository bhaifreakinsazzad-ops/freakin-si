import type { MarketplaceListing } from '@/types/domain'

interface ContextualPowerUpCardProps {
  listing?: MarketplaceListing
  onUse: (listing: MarketplaceListing) => void
}

export default function ContextualPowerUpCard({ listing, onUse }: ContextualPowerUpCardProps) {
  if (!listing) {
    return (
      <div className="lr-panel-premium p-3">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--bs-gold)]">Contextual Power-Up</p>
        <p className="text-xs text-[var(--fsi-text-muted)] mt-2">Marketplace assistance appears here based on active mission zone.</p>
      </div>
    )
  }

  return (
    <div className="lr-panel-premium p-3">
      <p className="text-xs uppercase tracking-[0.16em] text-[var(--bs-gold)]">Contextual Power-Up</p>
      <p className="text-sm font-semibold mt-1">{listing.title}</p>
      <p className="text-xs text-[var(--fsi-text-muted)] mt-1">{listing.category} • {listing.price}</p>
      <p className="text-xs text-[var(--fsi-text-muted)] mt-2 line-clamp-2">{listing.description}</p>
      <button onClick={() => onUse(listing)} className="lr-mission-btn mt-3 rounded-lg px-3 py-2 text-xs w-full">
        Request This Support
      </button>
    </div>
  )
}
