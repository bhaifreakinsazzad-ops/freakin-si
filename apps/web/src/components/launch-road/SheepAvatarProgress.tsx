import type { CSSProperties } from 'react'

interface SheepAvatarProgressProps {
  leftPct: number
  topPct: number
  progressPct: number
  mobile?: boolean
}

export default function SheepAvatarProgress({ leftPct, topPct, progressPct, mobile = false }: SheepAvatarProgressProps) {
  const style: CSSProperties = mobile
    ? { top: `${topPct}%` }
    : { left: `${leftPct}%`, top: `${topPct}%` }

  return (
    <div className={`absolute z-20 transition-all duration-700 ease-out ${mobile ? 'left-1/2 -translate-x-1/2' : '-translate-x-1/2 -translate-y-1/2'}`} style={style}>
      <div className="relative">
        <div className="absolute -inset-1 rounded-full lr-crimson-glow blur-sm" />
        <div className="relative w-16 h-16 rounded-full lr-panel-premium lr-metal-border overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.28),transparent_58%)]" />

          {/* Drop-in slot for future realistic sheep asset */}
          <div className="absolute inset-0 opacity-0" data-avatar-slot="sheep-premium-image" />

          {/* Premium SVG sheep mark fallback */}
          <svg viewBox="0 0 64 64" className="relative w-10 h-10" aria-label="SHEEP avatar mark">
            <defs>
              <linearGradient id="lrSheepMetal" x1="0%" x2="100%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#f5f0e8" stopOpacity="0.95" />
                <stop offset="45%" stopColor="#c9c9c9" stopOpacity="0.88" />
                <stop offset="100%" stopColor="#8f9299" stopOpacity="0.92" />
              </linearGradient>
            </defs>
            <circle cx="32" cy="28" r="15" fill="url(#lrSheepMetal)" />
            <circle cx="24" cy="24" r="4" fill="#111" />
            <circle cx="40" cy="24" r="4" fill="#111" />
            <rect x="23" y="35" width="18" height="11" rx="5" fill="#111" />
            <path d="M20 17c2-4 6-6 12-6s10 2 12 6" stroke="#c9a449" strokeWidth="2" fill="none" />
          </svg>

          <div className="absolute bottom-1 text-[9px] tracking-[0.16em] uppercase text-[var(--bs-gold-soft)]">dtg</div>
        </div>
        <div className="mt-1 text-[10px] tracking-[0.15em] uppercase text-center text-[var(--bs-gold-soft)]">{progressPct}%</div>
      </div>
    </div>
  )
}
