/**
 * BhaiFreakin'sBI — Business Marketplace
 * Browse, search, and buy AI-generated businesses
 */

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Store, Search, X, TrendingUp, DollarSign, Clock, Star,
  Tag, Plus, ChevronRight, Loader2, Package, ExternalLink,
  ArrowUpRight, Sparkles,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Link } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const CATEGORIES = [
  { id: 'all',        label: 'All Listings' },
  { id: 'digital',    label: 'Digital' },
  { id: 'ecommerce',  label: 'E-commerce' },
  { id: 'services',   label: 'Services' },
  { id: 'saas',       label: 'SaaS' },
  { id: 'content',    label: 'Content' },
]

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
            { label: 'Asking Price', value: `$${listing.price.toLocaleString()}`, color: 'var(--fsi-gold)' },
            { label: 'Monthly Revenue', value: `$${listing.monthly_revenue.toLocaleString()}`, color: '#00C27A' },
            { label: 'Business Age', value: listing.business_age || 'New', color: 'var(--fsi-text)' },
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
          <ArrowUpRight size={16} />
          Make an Offer
        </motion.button>
        <p className="text-xs text-center mt-2" style={{ color: 'var(--fsi-text-muted)' }}>
          🔒 Secure escrow · Money-back if not satisfied
        </p>
      </motion.div>
    </motion.div>
  )
}

export default function MarketplacePage() {
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
    } catch { setListings([]) }
    setLoading(false)
  }

  useEffect(() => { fetchListings() }, [category])
  useEffect(() => {
    const t = setTimeout(fetchListings, 400)
    return () => clearTimeout(t)
  }, [search])

  return (
    <div className="h-full overflow-y-auto" style={{ background: 'var(--fsi-void)' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 px-4 py-3 flex items-center justify-between"
        style={{ background: 'rgba(8,8,8,0.88)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--fsi-border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #F5B041, #D4830A)', boxShadow: '0 0 12px rgba(245,176,65,0.3)' }}>
            <Store size={16} color="#000" />
          </div>
          <div>
            <h1 className="font-display font-bold text-sm leading-none" style={{ color: 'var(--fsi-gold)' }}>Marketplace</h1>
            <p className="text-xs mt-0.5" style={{ color: 'var(--fsi-text-muted)' }}>Buy & Sell AI Businesses</p>
          </div>
        </div>
        <Link to="/money-machine"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{ background: 'rgba(245,176,65,0.1)', color: 'var(--fsi-gold)', border: '1px solid rgba(245,176,65,0.2)' }}>
          <Plus size={13} />
          List Business
        </Link>
      </div>

      <div className="max-w-3xl mx-auto p-4 pb-12 space-y-4">

        {/* Hero */}
        <div className="rounded-2xl p-6 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(245,176,65,0.06), rgba(230,126,34,0.06))', border: '1px solid rgba(245,176,65,0.15)' }}>
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, #F5B041, transparent 50%), radial-gradient(circle at 70% 70%, #E67E22, transparent 50%)' }} />
          <div className="relative z-10">
            <h2 className="font-display font-bold text-2xl sm:text-3xl mb-2"
              style={{ background: 'linear-gradient(135deg, #F5B041, #E67E22)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Business Marketplace
            </h2>
            <p className="text-sm max-w-sm mx-auto" style={{ color: 'var(--fsi-text-muted)' }}>
              Browse ready-made AI-generated businesses or list your own blueprint for sale.
            </p>
            <div className="flex items-center justify-center gap-4 mt-3">
              {[
                { icon: Package, label: `${listings.length} Listed` },
                { icon: TrendingUp, label: 'Verified BI' },
                { icon: Star, label: 'Escrow Safe' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--fsi-text-muted)' }}>
                  <Icon size={12} style={{ color: 'var(--fsi-gold)' }} />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--fsi-text-muted)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search businesses..."
            className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm"
            style={{ background: 'var(--fsi-surface)', border: '1px solid var(--fsi-border)', color: 'var(--fsi-text)' }}
          />
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
          <div className="text-center py-16">
            <Store size={40} className="mx-auto mb-3 opacity-25" style={{ color: 'var(--fsi-gold)' }} />
            <p className="font-display font-bold text-lg" style={{ color: 'var(--fsi-text)' }}>No listings yet</p>
            <p className="text-sm mt-1 mb-5" style={{ color: 'var(--fsi-text-muted)' }}>
              Generate a business blueprint and list it here
            </p>
            <Link to="/money-machine"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: 'linear-gradient(135deg, #F5B041, #D4830A)', color: '#000' }}>
              <Sparkles size={15} />
              Create a Blueprint
            </Link>
          </div>
        )}

        {!loading && listings.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {listings.map((l, i) => (
              <ListingCard key={l.id} listing={l} onClick={() => setSelected(l)} />
            ))}
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
            <Link to="/money-machine"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg, #F5B041, #D4830A)', color: '#000' }}>
              List Now <ExternalLink size={12} />
            </Link>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && <ListingModal listing={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  )
}
