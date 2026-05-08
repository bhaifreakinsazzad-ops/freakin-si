import type { ReviewTicket } from '@/types/domain'

interface ReviewGatePanelProps {
  reviews: ReviewTicket[]
}

export default function ReviewGatePanel({ reviews }: ReviewGatePanelProps) {
  const pending = reviews.filter((r) => r.status === 'pending').length
  const approved = reviews.filter((r) => r.status === 'approved').length
  const rejected = reviews.filter((r) => r.status === 'rejected').length

  return (
    <div className="lr-panel-premium p-3">
      <p className="text-xs uppercase tracking-[0.16em] text-[var(--bs-gold)]">Admin Review Gate</p>
      <div className="grid grid-cols-3 gap-2 mt-2 text-center">
        <div className="rounded-lg border border-[var(--fsi-border)] bg-black/20 p-2">
          <p className="text-lg font-semibold">{pending}</p>
          <p className="text-[10px] text-[var(--fsi-text-muted)]">Pending</p>
        </div>
        <div className="rounded-lg border border-[rgba(94,195,134,0.45)] bg-[rgba(37,70,52,0.6)] p-2">
          <p className="text-lg font-semibold">{approved}</p>
          <p className="text-[10px] text-[var(--fsi-text-muted)]">Approved</p>
        </div>
        <div className="rounded-lg border border-[rgba(181,18,27,0.45)] bg-[rgba(80,18,23,0.6)] p-2">
          <p className="text-lg font-semibold">{rejected}</p>
          <p className="text-[10px] text-[var(--fsi-text-muted)]">Revise</p>
        </div>
      </div>
      <p className="text-[11px] text-[var(--fsi-text-muted)] mt-2">Gate status reflects live review tickets from your admin workflow.</p>
    </div>
  )
}
