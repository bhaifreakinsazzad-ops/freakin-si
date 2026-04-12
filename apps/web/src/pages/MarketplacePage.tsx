/**
 * BayParee — Business Marketplace
 * 4-tab marketplace: Ready-Made Businesses, Websites & Apps, Tools & Assets, Custom AI Agents
 */

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Building2, Globe, Package, Bot, Search, X, Loader2,
  ShoppingCart, Code2, Layers, Palette, FileText, LayoutGrid,
  Target, ArrowRight, ExternalLink, Star,
  TrendingUp, DollarSign, Clock, CheckCircle, Plus,
  ChevronRight, Tag, Zap,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// ─── Tab definitions ──────────────────────────────────────────────────────────

const TABS = [
  { id: 'businesses', label: 'Ready-Made Businesses', icon: Building2 },
  { id: 'websites',   label: 'Websites & Apps',       icon: Globe },
  { id: 'tools',      label: 'Tools & Assets',        icon: Package },
  { id: 'agents',     label: 'Custom AI Agents',      icon: Bot },
] as const

type TabId = typeof TABS[number]['id']

// ─── Tab 1 data ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: 'all',       label: 'All Listings' },
  { id: 'digital',   label: 'Digital' },
  { id: 'ecommerce', label: 'E-commerce' },
  { id: 'services',  label: 'Services' },
  { id: 'saas',      label: 'SaaS' },
  { id: 'content',   label: 'Content' },
]

interface FeaturedItem {
  title: string
  niche: string
  price: number
  monthly_revenue: number
  tags: string[]
  badge: string
  originalPrice?: number
}

const FEATURED: FeaturedItem[] = [
  { title: 'SocialBoost',     niche: 'Social Media Growth System',         price: 299,  monthly_revenue: 2400,  tags: ['social', 'growth', 'automation'], badge: 'HOT' },
  { title: 'TrafficFlow',     niche: 'SEO Traffic Generation System',      price: 299,  monthly_revenue: 1800,  tags: ['seo', 'traffic', 'content'],      badge: 'NEW' },
  { title: 'ShopifyEmpires',  niche: 'Shopify Dropship Empire Blueprint',  price: 99,   monthly_revenue: 5200,  tags: ['ecommerce', 'shopify', 'dropship'], badge: 'SALE', originalPrice: 1597 },
  { title: 'TechGrove',       niche: 'SaaS Growth & Retention Toolkit',    price: 2999, monthly_revenue: 12000, tags: ['saas', 'b2b', 'growth'],           badge: 'PREMIUM' },
]

// ─── Tab 2 data ───────────────────────────────────────────────────────────────

const WEB_CATEGORIES = [
  {
    title: 'Website / Landing Pages',
    icon: Globe,
    tier: 'LOW' as const,
    price: 'from $79',
    desc: 'Professional landing pages, portfolio sites, lead gen pages',
    cta: '/services',
  },
  {
    title: 'E-commerce Stores',
    icon: ShoppingCart,
    tier: 'MED' as const,
    price: 'from $159',
    desc: 'Shopify, WooCommerce, or custom online stores ready to sell',
    cta: '/services',
  },
  {
    title: 'Web Applications',
    icon: Code2,
    tier: 'HIGH' as const,
    price: 'from $299',
    desc: 'Full-stack web apps, dashboards, SaaS platforms',
    cta: '/services',
  },
  {
    title: 'VR / AR Experiences',
    icon: Layers,
    tier: 'HIGH' as const,
    price: 'from $999',
    desc: 'Immersive 3D experiences, product configurators, virtual tours',
    cta: '/services',
  },
]

// ─── Tab 3 data ───────────────────────────────────────────────────────────────

const TOOLS = [
  { title: 'Logo Creator',    icon: Palette,    pricing: 'FREE',     tier: 'free', desc: 'AI-powered logo generation tool. Unlimited attempts.',                    cta: '/builder' },
  { title: 'Product Prompts', icon: FileText,   pricing: 'from $5',  tier: 'low',  desc: '500+ proven prompts for product descriptions, ads, email.',               cta: 'https://kaamlaa.site' },
  { title: 'AI Templates',    icon: LayoutGrid, pricing: 'from $99', tier: 'med',  desc: 'Ready-to-deploy AI workflow templates for your business.',                cta: 'https://kaamlaa.site' },
  { title: 'Lead Magnets',    icon: Target,     pricing: 'from $0',  tier: 'free', desc: 'Free and premium lead magnet templates. PDF, video, course formats.',     cta: '/builder' },
]

// ─── Tab 4 data ───────────────────────────────────────────────────────────────

const AGENTS = [
  { name: 'Assistant Elite', role: 'Executive Personal Assistant', price: '$116/mo', avatar: 'A', color: '#F5B041' },
  { name: 'LeadHunterPro',   role: 'Automated Lead Generation',    price: '$163/mo', avatar: 'L', color: '#E67E22' },
  { name: 'EcommercePro',    role: 'Full E-commerce Automation',   price: '$89/mo',  avatar: 'E', color: '#1A8A7A' },
]

// ─── Listing interface ────────────────────────────────────────────────────────

interface Listing {
  id: string
  title: string
  description: string
  niche: string
  category: string
  price: number
  monthly_revenue: number
  business_age: string
  tags: string[]
  status: string
  created_at: string
}

// ─── Helper: tier badge colours ───────────────────────────────────────────────

function tierStyle(tier: 'LOW' | 'MED' | 'HIGH') {
  if (tier === 'LOW') return { bg: 'rgba(0,194,122,0.12)', color: '#00C27A', border: 'rgba(0,194,122,0.3)' }
  if (tier === 'MED') return { bg: 'rgba(230,126,34,0.12)', color: '#E67E22', border: 'rgba(230,126,34,0.3)' }
  return { bg: 'rgba(220,53,53,0.12)', color: '#E05555', border: 'rgba(220,53,53,0.3)' }
}

// ─── FeaturedCard ─────────────────────────────────────────────────────────────

function FeaturedCard({ item }: { item: FeaturedItem }) {
  const badgeColors: Record<string, string> = {
    HOT:     '#E05555',
    NEW:     '#00C27A',
    SALE:    '#E67E22',
    PREMIUM: '#F5B041',
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className="rounded-2xl p-5 relative flex flex-col gap-3"
      style={{ background: 'var(--fsi-surface)', border: '1px solid var(--fsi-border)' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(245,176,65,0.35)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--fsi-border)')}
    >
      {/* FEATURED pill */}
      <span className="absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full"
        style={{ background: 'rgba(245,176,65,0.15)', color: 'var(--fsi-gold)', border: '1px solid rgba(245,176,65,0.3)' }}>
        FEATURED
      </span>

      {/* Badge */}
      <span className="self-start text-xs font-bold px-2 py-0.5 rounded-full"
        style={{ background: `${badgeColors[item.badge]}22`, color: badgeColors[item.badge], border: `1px solid ${badgeColors[item.badge]}44` }}>
        {item.badge}
      </span>

      {/* Title + niche */}
      <div>
        <h3 className="font-display font-bold text-base leading-snug pr-16" style={{ color: 'var(--fsi-text)' }}>
          {item.title}
        </h3>
        <p className="text-sm mt-0.5" style={{ color: 'var(--fsi-text-muted)' }}>{item.niche}</p>
      </div>

      {/* Price */}
      <div className="flex items-center gap-3">
        <span className="font-bold text-xl" style={{ color: 'var(--fsi-gold)' }}>
          ${item.price.toLocaleString()}
        </span>
        {item.originalPrice && (
          <span className="text-sm line-through" style={{ color: 'var(--fsi-text-muted)' }}>
            ${item.originalPrice.toLocaleString()}
          </span>
        )}
      </div>

      {/* Monthly revenue stat */}
      <div className="flex items-center gap-1.5 text-sm" style={{ color: '#00C27A' }}>
        <TrendingUp size={13} />
        <span className="font-semibold">${item.monthly_revenue.toLocaleString()}/mo</span>
        <span style={{ color: 'var(--fsi-text-muted)' }}>est. revenue</span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {item.tags.map((tag, i) => (
          <span key={i} className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: 'var(--fsi-surface-2)', color: 'var(--fsi-text-muted)', border: '1px solid var(--fsi-border)' }}>
            {tag}
          </span>
        ))}
      </div>

      {/* CTA */}
      <button className="mt-auto self-start flex items-center gap-1.5 text-sm font-semibold px-4 py-1.5 rounded-xl transition-all"
        style={{ border: '1px solid rgba(245,176,65,0.4)', color: 'var(--fsi-gold)', background: 'transparent' }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,176,65,0.1)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
        Make an Offer <ArrowRight size={13} />
      </button>
    </motion.div>
  )
}

// ─── ListingCard ──────────────────────────────────────────────────────────────

function ListingCard({ listing, onClick }: { listing: Listing; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="rounded-2xl p-5 cursor-pointer group transition-all"
      style={{ background: 'var(--fsi-surface)', border: '1px solid var(--fsi-border)' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(245,176,65,0.3)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--fsi-border)')}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <span className="text-xs px-2 py-0.5 rounded-full capitalize mb-2 inline-block"
            style={{ background: 'rgba(245,176,65,0.1)', color: 'var(--fsi-gold)', border: '1px solid rgba(245,176,65,0.2)' }}>
            {listing.category}
          </span>
          <h3 className="font-display font-bold text-base leading-snug" style={{ color: 'var(--fsi-text)' }}>
            {listing.title}
          </h3>
        </div>
        <div className="ml-3 text-right shrink-0">
          <p className="font-bold text-lg" style={{ color: 'var(--fsi-gold)' }}>
            ${listing.price.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm line-clamp-2 mb-3" style={{ color: 'var(--fsi-text-muted)' }}>
        {listing.description || listing.niche}
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center rounded-lg py-1.5" style={{ background: 'var(--fsi-surface-2)' }}>
          <p className="text-xs font-bold" style={{ color: '#00C27A' }}>
            ${listing.monthly_revenue.toLocaleString()}/mo
          </p>
          <p className="text-xs" style={{ color: 'var(--fsi-text-muted)' }}>Revenue</p>
        </div>
        <div className="text-center rounded-lg py-1.5" style={{ background: 'var(--fsi-surface-2)' }}>
          <p className="text-xs font-bold" style={{ color: 'var(--fsi-text)' }}>
            {listing.business_age || 'New'}
          </p>
          <p className="text-xs" style={{ color: 'var(--fsi-text-muted)' }}>Age</p>
        </div>
        <div className="text-center rounded-lg py-1.5" style={{ background: 'var(--fsi-surface-2)' }}>
          <p className="text-xs font-bold" style={{ color: 'var(--fsi-text)' }}>
            {listing.price > 0 && listing.monthly_revenue > 0
              ? `${(listing.price / listing.monthly_revenue).toFixed(1)}x`
              : '—'}
          </p>
          <p className="text-xs" style={{ color: 'var(--fsi-text-muted)' }}>Multiple</p>
        </div>
      </div>

      {/* Tags */}
      {listing.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {(Array.isArray(listing.tags) ? listing.tags : []).slice(0, 3).map((tag: string, i: number) => (
            <span key={i} className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: 'var(--fsi-surface-2)', color: 'var(--fsi-text-muted)', border: '1px solid var(--fsi-border)' }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-1 mt-3 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: 'var(--fsi-gold)' }}>
        View Details <ChevronRight size={12} />
      </div>
    </motion.div>
  )
}

// ─── ListingModal ─────────────────────────────────────────────────────────────

function ListingModal({ listing, onClose }: { listing: Listing; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose() }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <motion.div ref={ref} initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
        className="w-full max-w-md rounded-2xl p-6 relative"
        style={{ background: 'var(--fsi-surface)', border: '1px solid rgba(245,176,65,0.3)' }}>
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg"
          style={{ color: 'var(--fsi-text-muted)', background: 'var(--fsi-surface-2)' }}>
          <X size={16} />
        </button>

        <div className="mb-4">
          <span className="text-xs px-2 py-0.5 rounded-full capitalize"
            style={{ background: 'rgba(245,176,65,0.1)', color: 'var(--fsi-gold)', border: '1px solid rgba(245,176,65,0.2)' }}>
            {listing.category}
          </span>
          <h2 className="font-display font-bold text-xl mt-2" style={{ color: 'var(--fsi-text)' }}>{listing.title}</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--fsi-text-muted)' }}>{listing.description}</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Asking Price',    value: `$${listing.price.toLocaleString()}`,          color: 'var(--fsi-gold)' },
            { label: 'Monthly Revenue', value: `$${listing.monthly_revenue.toLocaleString()}`, color: '#00C27A' },
            { label: 'Business Age',    value: listing.business_age || 'New',                 color: 'var(--fsi-text)' },
          ].map(s => (
            <div key={s.label} className="text-center rounded-xl p-3" style={{ background: 'var(--fsi-surface-2)' }}>
              <p className="text-sm font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--fsi-text-muted)' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {listing.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {(Array.isArray(listing.tags) ? listing.tags : []).map((tag: string, i: number) => (
              <span key={i} className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'var(--fsi-surface-2)', color: 'var(--fsi-text-muted)', border: '1px solid var(--fsi-border)' }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #F5B041, #D4830A)', color: '#000' }}>
          <ArrowRight size={16} />
          Make an Offer
        </motion.button>
        <p className="text-xs text-center mt-2" style={{ color: 'var(--fsi-text-muted)' }}>
          🔒 Secure escrow · Money-back if not satisfied
        </p>
      </motion.div>
    </motion.div>
  )
}

// ─── Tab 1: Ready-Made Businesses ────────────────────────────────────────────

function BusinessesTab() {
  const { token } = useAuth()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [selected, setSelected] = useState<Listing | null>(null)

  const fetchListings = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (category !== 'all') params.set('category', category)
      if (search) params.set('search', search)
      const r = await fetch(`${API}/businesses/marketplace/listings?${params}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const d = await r.json()
      setListings(d.listings || [])
    } catch {
      setListings([])
    }
    setLoading(false)
  }

  useEffect(() => { fetchListings() }, [category])
  useEffect(() => {
    const t = setTimeout(fetchListings, 400)
    return () => clearTimeout(t)
  }, [search])

  return (
    <div className="space-y-6">

      {/* Featured cards */}
      <div>
        <h2 className="font-display font-bold text-lg mb-3" style={{ color: 'var(--fsi-text)' }}>
          Featured Businesses
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURED.map((item, i) => (
            <FeaturedCard key={i} item={item} />
          ))}
        </div>
      </div>

      {/* Flow indicator */}
      <div className="flex items-center justify-center gap-2 py-2">
        {['Browse', 'Buy', 'Build'].map((step, i, arr) => (
          <div key={step} className="flex items-center gap-2">
            <span className="font-semibold text-sm" style={{ color: 'var(--fsi-gold)' }}>{step}</span>
            {i < arr.length - 1 && <ArrowRight size={14} style={{ color: 'rgba(245,176,65,0.4)' }} />}
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--fsi-text-muted)' }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search businesses..."
          className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none"
          style={{ background: 'var(--fsi-surface)', border: '1px solid var(--fsi-border)', color: 'var(--fsi-text)' }}
        />
        {search && (
          <button className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setSearch('')}
            style={{ color: 'var(--fsi-text-muted)' }}>
            <X size={14} />
          </button>
        )}
      </div>

      {/* Category filters */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setCategory(c.id)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: category === c.id ? 'rgba(245,176,65,0.15)' : 'var(--fsi-surface)',
              color: category === c.id ? 'var(--fsi-gold)' : 'var(--fsi-text-muted)',
              border: `1px solid ${category === c.id ? 'rgba(245,176,65,0.35)' : 'var(--fsi-border)'}`,
            }}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Listings */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin" style={{ color: 'var(--fsi-gold)' }} />
        </div>
      )}

      {!loading && listings.length === 0 && (
        <div className="text-center py-12">
          <Package size={40} className="mx-auto mb-3 opacity-25" style={{ color: 'var(--fsi-gold)' }} />
          <p className="font-display font-bold text-lg" style={{ color: 'var(--fsi-text)' }}>No listings found</p>
          <p className="text-sm mt-1 mb-5" style={{ color: 'var(--fsi-text-muted)' }}>
            Try a different search or category
          </p>
          <Link to="/builder"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: 'linear-gradient(135deg, #F5B041, #D4830A)', color: '#000' }}>
            <Plus size={15} />
            Create a Blueprint
          </Link>
        </div>
      )}

      {!loading && listings.length > 0 && (
        <div>
          <h2 className="font-display font-bold text-lg mb-3" style={{ color: 'var(--fsi-text)' }}>
            All Listings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {listings.map(l => (
              <ListingCard key={l.id} listing={l} onClick={() => setSelected(l)} />
            ))}
          </div>
        </div>
      )}

      {/* CTA banner */}
      {!loading && (
        <div className="rounded-2xl p-5 flex items-center gap-4"
          style={{ background: 'var(--fsi-surface)', border: '1px solid var(--fsi-border)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(245,176,65,0.1)', border: '1px solid rgba(245,176,65,0.2)' }}>
            <DollarSign size={18} style={{ color: 'var(--fsi-gold)' }} />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm" style={{ color: 'var(--fsi-text)' }}>Have a business blueprint?</p>
            <p className="text-xs" style={{ color: 'var(--fsi-text-muted)' }}>List it on the marketplace and get offers from buyers</p>
          </div>
          <Link to="/builder"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg, #F5B041, #D4830A)', color: '#000' }}>
            List Now <ExternalLink size={12} />
          </Link>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {selected && <ListingModal listing={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  )
}

// ─── Tab 2: Websites & Apps ───────────────────────────────────────────────────

function WebsitesTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {WEB_CATEGORIES.map((cat, i) => {
          const Icon = cat.icon
          const ts = tierStyle(cat.tier)
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl p-5 flex flex-col gap-3 relative"
              style={{ background: 'var(--fsi-surface)', border: '1px solid var(--fsi-border)' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(245,176,65,0.3)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--fsi-border)')}
            >
              {/* Tier badge */}
              <span className="absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: ts.bg, color: ts.color, border: `1px solid ${ts.border}` }}>
                {cat.tier}
              </span>

              {/* Icon */}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(245,176,65,0.1)', border: '1px solid rgba(245,176,65,0.15)' }}>
                <Icon size={20} style={{ color: 'var(--fsi-gold)' }} />
              </div>

              {/* Title */}
              <h3 className="font-display font-bold text-base pr-12" style={{ color: 'var(--fsi-text)' }}>
                {cat.title}
              </h3>

              {/* Price */}
              <p className="font-semibold text-sm" style={{ color: 'var(--fsi-gold)' }}>
                {cat.price}
              </p>

              {/* Desc */}
              <p className="text-sm flex-1" style={{ color: 'var(--fsi-text-muted)' }}>
                {cat.desc}
              </p>

              {/* CTA */}
              <Link to={cat.cta}
                className="mt-1 self-start flex items-center gap-1.5 text-sm font-semibold px-4 py-1.5 rounded-xl transition-all"
                style={{ border: '1px solid rgba(245,176,65,0.4)', color: 'var(--fsi-gold)', background: 'transparent' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,176,65,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                Request Build <ArrowRight size={13} />
              </Link>
            </motion.div>
          )
        })}
      </div>

      <p className="text-sm text-center py-2" style={{ color: 'var(--fsi-text-muted)' }}>
        All projects include revision rounds, source files, and post-launch support.
      </p>
    </div>
  )
}

// ─── Tab 3: Tools & Assets ────────────────────────────────────────────────────

function ToolsTab() {
  const toolTierColors: Record<string, { bg: string; color: string; border: string }> = {
    free: { bg: 'rgba(0,194,122,0.12)',  color: '#00C27A', border: 'rgba(0,194,122,0.3)' },
    low:  { bg: 'rgba(245,176,65,0.12)', color: '#F5B041', border: 'rgba(245,176,65,0.3)' },
    med:  { bg: 'rgba(230,126,34,0.12)', color: '#E67E22', border: 'rgba(230,126,34,0.3)' },
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TOOLS.map((tool, i) => {
          const Icon = tool.icon
          const tc = toolTierColors[tool.tier]
          const isExternal = tool.cta.startsWith('http')
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl p-5 flex flex-col gap-3"
              style={{ background: 'var(--fsi-surface)', border: '1px solid var(--fsi-border)' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(245,176,65,0.3)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--fsi-border)')}
            >
              {/* Header row: icon + pricing */}
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(245,176,65,0.1)', border: '1px solid rgba(245,176,65,0.15)' }}>
                  <Icon size={20} style={{ color: 'var(--fsi-gold)' }} />
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: tc.bg, color: tc.color, border: `1px solid ${tc.border}` }}>
                  {tool.pricing}
                </span>
              </div>

              <h3 className="font-display font-bold text-base" style={{ color: 'var(--fsi-text)' }}>
                {tool.title}
              </h3>

              <p className="text-sm flex-1" style={{ color: 'var(--fsi-text-muted)' }}>
                {tool.desc}
              </p>

              {isExternal ? (
                <a href={tool.cta} target="_blank" rel="noopener noreferrer"
                  className="mt-1 self-start flex items-center gap-1.5 text-sm font-semibold px-4 py-1.5 rounded-xl transition-all"
                  style={{ border: '1px solid rgba(245,176,65,0.4)', color: 'var(--fsi-gold)', background: 'transparent' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,176,65,0.1)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                  Get Access <ExternalLink size={12} />
                </a>
              ) : (
                <Link to={tool.cta}
                  className="mt-1 self-start flex items-center gap-1.5 text-sm font-semibold px-4 py-1.5 rounded-xl transition-all"
                  style={{ border: '1px solid rgba(245,176,65,0.4)', color: 'var(--fsi-gold)', background: 'transparent' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,176,65,0.1)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                  Open Tool <ArrowRight size={13} />
                </Link>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// ─── AgentCard ────────────────────────────────────────────────────────────────

function AgentCard({ agent }: { agent: typeof AGENTS[number] }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width / 2)
    const dy = (e.clientY - cy) / (rect.height / 2)
    setTilt({ x: dy * -8, y: dx * 8 })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }) }}
      style={{
        width: 200,
        background: 'var(--fsi-surface)',
        border: hovered ? '1px solid rgba(245,176,65,0.45)' : '1px solid var(--fsi-border)',
        borderRadius: 16,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        transform: `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'border-color 0.2s, transform 0.15s',
        cursor: 'default',
      }}
    >
      {/* Avatar */}
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        background: agent.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20, fontWeight: 700, color: '#000',
        boxShadow: `0 0 20px ${agent.color}44`,
      }}>
        {agent.avatar}
      </div>

      {/* Name */}
      <p className="font-display font-bold text-sm text-center" style={{ color: 'var(--fsi-text)' }}>
        {agent.name}
      </p>

      {/* Role */}
      <p className="text-xs text-center" style={{ color: 'var(--fsi-text-muted)' }}>
        {agent.role}
      </p>

      {/* Price */}
      <p className="font-bold text-sm" style={{ color: 'var(--fsi-gold)' }}>
        {agent.price}
      </p>
    </motion.div>
  )
}

// ─── Tab 4: Custom AI Agents ─────────────────────────────────────────────────

function AgentsTab() {
  return (
    <div className="space-y-8">
      {/* Agent cards */}
      <div className="flex flex-wrap justify-center gap-4">
        {AGENTS.map((agent, i) => (
          <AgentCard key={i} agent={agent} />
        ))}
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <a
          href="https://kaamlaa.site"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all"
          style={{ background: 'linear-gradient(135deg, #F5B041, #D4830A)', color: '#000' }}>
          Browse All Agents <ArrowRight size={15} />
        </a>
        <a
          href="https://kaamlaa.site"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all"
          style={{ border: '1px solid rgba(245,176,65,0.4)', color: 'var(--fsi-gold)', background: 'transparent' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,176,65,0.08)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
          Commission Custom Agent <ExternalLink size={14} />
        </a>
      </div>

      {/* Note */}
      <p className="text-sm text-center" style={{ color: 'var(--fsi-text-muted)' }}>
        Agents are fully customized to your workflow. Subscription or one-time.
      </p>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState<TabId>('businesses')

  return (
    <div className="h-full overflow-y-auto" style={{ background: '#080808' }}>

      {/* Page header */}
      <div className="sticky top-0 z-20"
        style={{ background: 'rgba(8,8,8,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--fsi-border)' }}>
        <div className="max-w-3xl mx-auto px-4 py-3">
          {/* Title row */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h1 className="font-display font-bold text-xl leading-none" style={{ color: 'var(--fsi-text)' }}>
                Marketplace
              </h1>
              <p className="text-xs mt-0.5" style={{ color: 'var(--fsi-text-muted)' }}>
                Build, Launch, Fund & Scale a Business
              </p>
              <p className="text-xs mt-1" style={{ color: 'rgba(245,176,65,0.6)' }}>
                27,403+ Businesses Built · 16,250 Funded · 4 Categories
              </p>
            </div>
            <Link to="/builder"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0"
              style={{ background: 'rgba(245,176,65,0.1)', color: 'var(--fsi-gold)', border: '1px solid rgba(245,176,65,0.25)' }}>
              <Plus size={13} />
              List Business
            </Link>
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 overflow-x-auto hide-scrollbar -mx-1 px-1">
            {TABS.map(tab => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium whitespace-nowrap transition-all relative shrink-0"
                  style={{ color: isActive ? 'var(--fsi-gold)' : 'var(--fsi-text-muted)', background: 'transparent', border: 'none' }}
                >
                  <Icon size={13} />
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="tabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                      style={{ background: 'var(--fsi-gold)' }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-3xl mx-auto p-4 pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {activeTab === 'businesses' && <BusinessesTab />}
            {activeTab === 'websites'   && <WebsitesTab />}
            {activeTab === 'tools'      && <ToolsTab />}
            {activeTab === 'agents'     && <AgentsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
