import { useEffect, useState } from 'react'
import { assetService, reviewService } from '@/services'
import type { AssetRecord } from '@/types/domain'

export default function AssetsDocumentsPage() {
  const [assets, setAssets] = useState<AssetRecord[]>([])

  useEffect(() => {
    ;(async () => {
      const res = await assetService.listAssets()
      if (res.success) setAssets(res.data)
    })()
  }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Assets & Documents Vault</h1>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
        {assets.map((asset) => (
          <div key={asset.id} className="rounded-xl border border-[var(--fsi-border)] bg-[var(--fsi-surface)] p-4">
            <p className="text-sm font-semibold">{asset.title}</p>
            <p className="text-xs text-[var(--fsi-text-muted)] mt-1">Type: {asset.type} • Status: {asset.status}</p>
            <pre className="mt-2 text-xs text-[var(--fsi-text-muted)] whitespace-pre-wrap max-h-24 overflow-y-auto">{asset.content}</pre>
            <div className="mt-3 flex gap-2 flex-wrap">
              <button onClick={() => navigator.clipboard.writeText(asset.content)} className="text-xs rounded-lg border border-[var(--fsi-border)] px-3 py-1.5">Copy</button>
              <button onClick={async () => { const r = await assetService.exportDocument(asset.id); if (r.success) alert('Document prepared for export.') }} className="text-xs rounded-lg border border-[var(--fsi-border)] px-3 py-1.5">Download</button>
              <button onClick={async () => { await reviewService.submitForReview(asset.id) }} className="text-xs rounded-lg border border-[var(--fsi-border)] px-3 py-1.5">Send Review</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
