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
      <div className="black-sheep-avatar relative" style={{ animation: 'lr-avatar-pulse 3.2s ease-in-out infinite' }}>
        <div className="absolute -inset-2 rounded-full bg-[radial-gradient(circle,rgba(181,18,27,0.36),transparent_62%)] blur-md" />
        <div className="relative flex h-[76px] w-[76px] items-center justify-center overflow-hidden rounded-full border border-[rgba(202,208,218,0.35)] bg-[linear-gradient(160deg,rgba(32,36,44,0.98),rgba(5,6,8,0.98))] shadow-[0_18px_34px_rgba(0,0,0,0.48),inset_0_1px_0_rgba(255,255,255,0.12)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_22%,rgba(255,255,255,0.18),transparent_42%)]" />
          <div className="absolute bottom-0 h-7 w-full bg-[linear-gradient(180deg,transparent,rgba(181,18,27,0.22))]" />

          {/* Drop-in slot for future realistic sheep asset */}
          <div className="black-sheep-avatar-image absolute inset-0 opacity-0" data-avatar-slot="black-sheep-avatar" />

          {/* Premium SVG sheep mark fallback */}
          <svg viewBox="0 0 76 76" className="relative h-14 w-14" aria-label="Premium black sheep avatar">
            <defs>
              <radialGradient id="lrSheepWool" cx="35%" cy="25%" r="70%">
                <stop offset="0%" stopColor="#3f434b" />
                <stop offset="48%" stopColor="#15171c" />
                <stop offset="100%" stopColor="#050608" />
              </radialGradient>
              <linearGradient id="lrSheepHorn" x1="0%" x2="100%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#f0d48d" />
                <stop offset="100%" stopColor="#83642a" />
              </linearGradient>
            </defs>
            <ellipse cx="38" cy="39" rx="22" ry="19" fill="url(#lrSheepWool)" />
            <circle cx="24" cy="34" r="9" fill="#121419" />
            <circle cx="52" cy="34" r="9" fill="#121419" />
            <path d="M21 27c-6 0-9-4-8-9 7 0 12 4 13 9" fill="url(#lrSheepHorn)" opacity="0.9" />
            <path d="M55 27c6 0 9-4 8-9-7 0-12 4-13 9" fill="url(#lrSheepHorn)" opacity="0.9" />
            <rect x="27" y="38" width="22" height="16" rx="8" fill="#08090c" />
            <circle cx="31" cy="37" r="2.4" fill="#d8dbe0" />
            <circle cx="45" cy="37" r="2.4" fill="#d8dbe0" />
            <path d="M34 49c3 2 6 2 9 0" stroke="#c9a449" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M24 24c4-8 24-8 28 0" stroke="rgba(202,208,218,0.55)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          </svg>

          <div className="absolute bottom-1 text-[9px] uppercase text-[var(--bs-gold-soft)]">DTG</div>
        </div>
        <div className="mt-1 text-center text-[10px] uppercase text-[var(--bs-gold-soft)]">{progressPct}%</div>
      </div>
    </div>
  )
}
