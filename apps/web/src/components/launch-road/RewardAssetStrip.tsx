import type { AssetRecord } from '@/types/domain'
import { Award } from 'lucide-react'

interface RewardAssetStripProps {
  assets: AssetRecord[]
  onOpen: (asset: AssetRecord) => void
}

const rewardLabel: Record<AssetRecord['type'], string> = {
  document: 'Idea Summary',
  brand: 'Brand Kit',
  business_case: 'Business Case',
  website: 'Website Copy',
  setup: 'Setup Checklist',
  funding: 'Funding Pack',
  launch: 'Launch Plan',
}

export default function RewardAssetStrip({ assets, onOpen }: RewardAssetStripProps) {
  return (
    <div className="lr-panel-premium p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Award size={14} className="text-[var(--bs-gold-soft)]" />
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--bs-gold)]">Asset Rewards</p>
        </div>
        <p className="text-xs text-[var(--fsi-text-muted)]">{assets.length} collected</p>
      </div>
      <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
        {assets.slice(0, 10).map((asset) => (
          <button key={asset.id} onClick={() => onOpen(asset)} className="lr-reward-chip min-w-[176px] p-2 text-left hover:border-[var(--bs-gold)] transition">
            <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--fsi-text-dim)]">{rewardLabel[asset.type]}</p>
            <p className="text-xs font-medium truncate mt-1">{asset.title}</p>
            <div className="mt-1 flex items-center justify-between gap-2">
              <span className="text-[10px] text-[var(--fsi-text-muted)]">{asset.type}</span>
              <span className={`lr-status-badge ${asset.status === 'approved' ? 'complete' : asset.status === 'in_review' ? 'review' : 'active'}`}>{asset.status}</span>
            </div>
          </button>
        ))}
        {assets.length === 0 && <p className="text-xs text-[var(--fsi-text-muted)]">No rewards yet. Generate and save step outputs to collect assets.</p>}
      </div>
    </div>
  )
}
