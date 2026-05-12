import type { AssetRecord } from '@/types/domain'
import { Award, FileText } from 'lucide-react'

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

const rewardTypes = Object.keys(rewardLabel) as AssetRecord['type'][]

export default function RewardAssetStrip({ assets, onOpen }: RewardAssetStripProps) {
  return (
    <div className="lr-cockpit-panel p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Award size={14} className="text-[var(--bs-gold-soft)]" />
          <p className="text-xs uppercase text-[var(--bs-gold)]">Asset Rewards</p>
        </div>
        <p className="text-xs text-[var(--fsi-text-muted)]">{assets.length} collected</p>
      </div>
      <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
        {rewardTypes.map((type) => {
          const asset = assets.find((item) => item.type === type)
          if (!asset) {
            return (
              <div key={type} className="lr-reward-chip min-w-[162px] p-2 opacity-55">
                <div className="flex items-center gap-2">
                  <span className="lr-reward-badge reward-badge" data-reward-badge={type}>
                    <FileText size={13} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase text-[var(--fsi-text-dim)]">{rewardLabel[type]}</p>
                    <p className="mt-1 truncate text-xs text-[var(--fsi-text-muted)]">Not collected</p>
                  </div>
                </div>
              </div>
            )
          }

          return (
            <button key={asset.id} onClick={() => onOpen(asset)} className="lr-reward-chip min-w-[176px] p-2 text-left transition hover:border-[var(--bs-gold)]">
              <div className="flex items-center gap-2">
                <span className="lr-reward-badge reward-badge" data-reward-badge={asset.type}>
                  <FileText size={13} />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase text-[var(--fsi-text-dim)]">{rewardLabel[asset.type]}</p>
                  <p className="mt-1 truncate text-xs font-medium">{asset.title}</p>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="text-[10px] text-[var(--fsi-text-muted)]">{asset.type}</span>
                <span className={`lr-status-badge ${asset.status === 'approved' ? 'complete' : asset.status === 'in_review' ? 'review' : 'active'}`}>{asset.status}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
