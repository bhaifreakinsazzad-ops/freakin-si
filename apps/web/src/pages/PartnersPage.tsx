import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CheckCircle, ArrowRight, ExternalLink, Shield, DollarSign, Megaphone } from 'lucide-react'

interface Partner {
  id: string
  letter: string
  avatarBg: string
  avatarColor: string
  name: string
  tagline: string
  tags: string[]
  description: string
  services: string[]
  icon: React.ReactNode
  accentColor: string
  borderColor: string
  tagBg: string
  tagText: string
}

const partners: Partner[] = [
  {
    id: 'paperworksquad',
    letter: 'P',
    avatarBg: 'bg-blue-600',
    avatarColor: 'text-white',
    name: 'ThePaperWorkSquad',
    tagline: 'Business Formation & Compliance Experts',
    tags: ['LLC Formation', 'Registered Agent', 'Compliance', 'Business Paperwork'],
    description:
      'ThePaperWorkSquad specializes in handling every piece of legal paperwork your new business needs to stand up properly. From LLC formation to ongoing compliance management, they keep your business protected and properly registered. Their team of specialists ensures you never miss a deadline or filing requirement.',
    services: [
      'LLC & Corporation Formation',
      'Registered Agent Services',
      'Annual Report Filing',
      'Operating Agreement Drafting',
      'EIN & Tax ID Acquisition',
      'Business License Research',
    ],
    icon: <Shield size={28} />,
    accentColor: '#4361EE',
    borderColor: 'border-blue-600/40',
    tagBg: 'bg-blue-900/30',
    tagText: 'text-blue-300',
  },
  {
    id: 'cgwsystems',
    letter: 'C',
    avatarBg: 'bg-amber-500',
    avatarColor: 'text-black',
    name: 'CGW Systems',
    tagline: 'Business Funding & Capital Access',
    tags: ['Business Funding', 'Credit Building', 'Capital Access', 'Investor Connections'],
    description:
      'CGW Systems opens doors to capital that most new founders never know exist. They connect entrepreneurs with business funding programs, credit-building strategies, and investor networks tailored to early-stage ventures. Their specialists understand exactly what lenders and investors look for and help you present your business accordingly.',
    services: [
      'Business Funding Programs',
      'Business Credit Building',
      'SBA Loan Guidance',
      'Investor Introduction Network',
      'Revenue-Based Financing Options',
      'Credit Profile Optimization',
    ],
    icon: <DollarSign size={28} />,
    accentColor: '#F5B041',
    borderColor: 'border-amber-500/40',
    tagBg: 'bg-amber-900/30',
    tagText: 'text-amber-300',
  },
  {
    id: 'dhandabuzz',
    letter: 'D',
    avatarBg: 'bg-violet-600',
    avatarColor: 'text-white',
    name: 'DhandaBuzz',
    tagline: 'Full-Service Digital Marketing Agency',
    tags: ['Digital Marketing', 'Web Development', 'SEO', 'Social Media'],
    description:
      'DhandaBuzz is a full-service digital marketing agency that helps new businesses build a powerful online presence from day one. From paid advertising to organic SEO, professional web development to compelling copywriting, their team handles every channel that drives customer acquisition. They speak the language of growth-stage startups.',
    services: [
      'Paid Ads (Meta, Google, TikTok)',
      'Brand Design & Visual Identity',
      'Website & Landing Page Development',
      'SEO & Content Strategy',
      'Social Media Management',
      'Copywriting & Brand Voice',
    ],
    icon: <Megaphone size={28} />,
    accentColor: '#9B59B6',
    borderColor: 'border-violet-600/40',
    tagBg: 'bg-violet-900/30',
    tagText: 'text-violet-300',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: 'easeOut' },
  }),
}

export default function PartnersPage() {
  return (
    <div
      className="min-h-screen text-white"
      style={{ background: '#050505', fontFamily: 'inherit' }}
    >
      {/* ── Nav ── */}
      <nav
        className="sticky top-0 z-20 border-b px-6 py-4 flex items-center justify-between"
        style={{ background: 'rgba(5,5,5,0.92)', borderColor: 'var(--fsi-border, #1a1a2e)', backdropFilter: 'blur(12px)' }}
      >
        <Link to="/" className="flex items-center gap-2">
          <span className="font-extrabold text-xl tracking-tight" style={{ color: '#4361EE' }}>
            BayParee
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/pricing"
            className="text-sm font-medium transition-colors"
            style={{ color: 'var(--fsi-text-muted, #9ca3af)' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--fsi-text-muted, #9ca3af)')}
          >
            Pricing
          </Link>
          <Link
            to="/builder"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{ background: '#4361EE', color: '#fff' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#3451d1')}
            onMouseLeave={e => (e.currentTarget.style.background = '#4361EE')}
          >
            Start Building <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* ── Hero Header ── */}
      <div className="max-w-5xl mx-auto px-6 pt-20 pb-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium mb-6"
            style={{ background: 'rgba(67,97,238,0.12)', border: '1px solid rgba(67,97,238,0.35)', color: '#4361EE' }}
          >
            <ExternalLink size={13} /> Partner Ecosystem
          </div>
          <h1
            className="text-5xl md:text-6xl font-extrabold leading-tight mb-5"
            style={{ letterSpacing: '-0.02em' }}
          >
            Our{' '}
            <span style={{ color: '#4361EE' }}>Partner</span>{' '}
            Ecosystem
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--fsi-text-muted, #9ca3af)' }}>
            Expert services integrated directly into your BayParee journey — available at exactly
            the moment you need them inside Step&nbsp;9 of the AI Business Builder.
          </p>
        </motion.div>
      </div>

      {/* ── Partner Cards ── */}
      <div className="max-w-5xl mx-auto px-6 pb-16 space-y-8">
        {partners.map((partner, i) => (
          <motion.div
            key={partner.id}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
            className={`rounded-2xl border p-8 ${partner.borderColor}`}
            style={{
              background: 'var(--fsi-surface, #0d0d1a)',
              boxShadow: `0 0 40px ${partner.accentColor}18`,
            }}
          >
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left column */}
              <div className="md:w-64 shrink-0">
                {/* Avatar */}
                <div
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-5 ${partner.avatarBg}`}
                >
                  <span className={`text-4xl font-black ${partner.avatarColor}`}>
                    {partner.letter}
                  </span>
                </div>

                {/* Name */}
                <h2 className="text-2xl font-extrabold text-white mb-1">{partner.name}</h2>
                <p className="text-sm mb-4" style={{ color: 'var(--fsi-text-muted, #9ca3af)' }}>
                  {partner.tagline}
                </p>

                {/* Category tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {partner.tags.map(tag => (
                    <span
                      key={tag}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${partner.tagBg} ${partner.tagText}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Step 9 badge */}
                <div
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold mb-6"
                  style={{
                    background: 'rgba(245,176,65,0.12)',
                    border: '1px solid rgba(245,176,65,0.35)',
                    color: '#F5B041',
                  }}
                >
                  <CheckCircle size={12} />
                  Available in Step 9
                </div>

                {/* CTA */}
                <Link
                  to="/builder"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={{ background: '#4361EE', color: '#fff' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#3451d1')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#4361EE')}
                >
                  Get Started <ArrowRight size={14} />
                </Link>
              </div>

              {/* Right column */}
              <div className="flex-1">
                {/* Icon + description */}
                <div className="flex items-start gap-3 mb-6">
                  <div
                    className="p-2.5 rounded-xl shrink-0"
                    style={{ background: `${partner.accentColor}20`, color: partner.accentColor }}
                  >
                    {partner.icon}
                  </div>
                  <p className="text-base leading-relaxed" style={{ color: 'var(--fsi-text, #e5e7eb)' }}>
                    {partner.description}
                  </p>
                </div>

                {/* Services list */}
                <div
                  className="rounded-xl p-5"
                  style={{ background: 'var(--fsi-surface-2, #111127)' }}
                >
                  <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--fsi-text-muted, #9ca3af)' }}>
                    Services Included
                  </p>
                  <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
                    {partner.services.map(svc => (
                      <li key={svc} className="flex items-center gap-2 text-sm" style={{ color: 'var(--fsi-text, #e5e7eb)' }}>
                        <CheckCircle size={14} style={{ color: partner.accentColor, flexShrink: 0 }} />
                        {svc}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── How It Works ── */}
      <div
        className="py-20"
        style={{ background: 'var(--fsi-surface, #0d0d1a)', borderTop: '1px solid var(--fsi-border, #1a1a2e)', borderBottom: '1px solid var(--fsi-border, #1a1a2e)' }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              How It{' '}
              <span style={{ color: '#F5B041' }}>Works</span>
            </h2>
            <p style={{ color: 'var(--fsi-text-muted, #9ca3af)' }}>
              Partners are built into your journey — no hunting for help separately.
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
            {[
              {
                step: '01',
                label: 'Build Your Plan',
                detail: 'Use the AI Business Builder to map your business strategy step by step.',
                color: '#4361EE',
              },
              {
                step: '02',
                label: 'Reach Step 9',
                detail: 'Step 9 is dedicated to launching — formation, funding, and marketing.',
                color: '#F5B041',
              },
              {
                step: '03',
                label: 'Partner Connects',
                detail: 'Your matched partner gets introduced with context from your blueprint.',
                color: '#27AE60',
              },
            ].map((item, i) => (
              <div key={item.step} className="flex flex-col md:flex-row items-center">
                <motion.div
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="flex flex-col items-center text-center w-56 px-4"
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black mb-4"
                    style={{ background: `${item.color}20`, color: item.color, border: `2px solid ${item.color}40` }}
                  >
                    {item.step}
                  </div>
                  <p className="font-bold text-white mb-2">{item.label}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--fsi-text-muted, #9ca3af)' }}>
                    {item.detail}
                  </p>
                </motion.div>

                {i < 2 && (
                  <div className="flex items-center justify-center mx-2 my-4 md:my-0">
                    <ArrowRight size={22} style={{ color: 'var(--fsi-border, #2a2a40)' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA Strip ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto px-6 py-20 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
          Ready to launch with the{' '}
          <span style={{ color: '#F5B041' }}>right support?</span>
        </h2>
        <p className="mb-8 text-lg" style={{ color: 'var(--fsi-text-muted, #9ca3af)' }}>
          Your partners are waiting inside the AI Business Builder — start your blueprint today.
        </p>
        <Link
          to="/builder"
          className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold transition-all"
          style={{ background: '#F5B041', color: '#050505' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#e6a030')}
          onMouseLeave={e => (e.currentTarget.style.background = '#F5B041')}
        >
          Start Building <ArrowRight size={18} />
        </Link>
        <p className="mt-5 text-sm" style={{ color: 'var(--fsi-text-muted, #9ca3af)' }}>
          Free plan available. Partners accessible from Starter tier and above.
        </p>
      </motion.div>
    </div>
  )
}
