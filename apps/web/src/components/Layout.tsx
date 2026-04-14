import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useLang } from '@/contexts/LanguageContext'
import { useState } from 'react'
import {
  MessageSquare, Image, Wrench, CreditCard, LayoutDashboard,
  LogOut, ChevronLeft, ChevronRight, Shield, Menu, DollarSign,
  Store, Briefcase, TrendingUp, Users, Globe2,
} from 'lucide-react'
import { cn, getSubscriptionBadge } from '@/lib/utils'

export default function Layout() {
  const { user, logout } = useAuth()
  const { t, lang } = useLang()
  const navigate = useNavigate()
  const [collapsed,   setCollapsed]   = useState(false)
  const [mobileOpen, setMobileOpen]  = useState(false)

  const navItems = [
    { to: '/chat',         icon: MessageSquare,   label: t.sidebarChat },
    { to: '/image',        icon: Image,           label: t.sidebarImage },
    { to: '/tools',        icon: Wrench,          label: t.sidebarTools },
    { to: '/builder',      icon: TrendingUp,      label: 'AI Builder',   highlight: true },
    { to: '/hub',          icon: Globe2,          label: 'Business Hub' },
    { to: '/marketplace',  icon: Store,           label: 'Marketplace' },
    { to: '/services',     icon: Briefcase,       label: 'Services' },
    { to: '/partners',     icon: Users,           label: 'Partners' },
    { to: '/dashboard',    icon: LayoutDashboard, label: t.sidebarDashboard },
    { to: '/payment',      icon: CreditCard,      label: t.sidebarPayment },
  ]

  const handleLogout = () => { logout(); navigate('/') }

  const subLabel = user?.subscription === 'free' ? t.subFree
    : user?.subscription === 'pro' ? t.subPro
    : t.subPremium

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className={cn('p-4 border-b flex items-center gap-3', collapsed && 'justify-center')}
        style={{ borderColor: 'var(--fsi-border)' }}
      >
        <div
          className="w-9 h-9 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
          style={{ boxShadow: '0 0 16px rgba(245,176,65,0.30)' }}
        >
          <img src="/fsi-icon.svg" alt="BayParee" className="w-9 h-9" />
        </div>
        {!collapsed && (
          <div>
            <h1 className="font-display font-bold text-base leading-none" style={{ color: 'var(--fsi-text)' }}>
              <span style={{ color: 'var(--fsi-gold)' }}>BayParee</span>
            </h1>
            <p
              className="mt-0.5"
              style={{
                color: 'rgba(255,255,255,0.35)',
                fontSize: '10px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              AI Business Builder
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, highlight }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
              collapsed ? 'justify-center' : '',
              isActive
                ? 'fsi-card-active text-[var(--fsi-gold)]'
                : highlight
                  ? 'text-[var(--fsi-gold)] bg-[rgba(245,176,65,0.07)] hover:bg-[rgba(245,176,65,0.13)] border border-[rgba(245,176,65,0.20)]'
                  : 'hover:bg-[rgba(255,255,255,0.04)]'
            )}
            style={({ isActive }) => ({
              color: isActive
                ? 'var(--fsi-gold)'
                : highlight
                  ? 'var(--fsi-gold)'
                  : undefined,
            })}
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={17}
                  className="shrink-0"
                  style={{
                    color: isActive || highlight
                      ? 'var(--fsi-gold)'
                      : 'rgba(255,255,255,0.55)',
                  }}
                />
                {!collapsed && (
                  <span
                    className="text-sm font-medium"
                    style={{
                      color: isActive || highlight
                        ? 'var(--fsi-gold)'
                        : 'rgba(255,255,255,0.55)',
                    }}
                  >
                    {label}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}

        {user?.is_admin && (
          <NavLink
            to="/admin"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
              collapsed ? 'justify-center' : '',
              isActive
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : 'text-[var(--fsi-text-muted)] hover:text-amber-400 hover:bg-amber-500/10'
            )}
          >
            <Shield size={17} className="shrink-0" />
            {!collapsed && <span className="text-sm font-medium">{t.sidebarAdmin}</span>}
          </NavLink>
        )}
      </nav>

      {/* User info + controls */}
      <div className="p-3 space-y-1" style={{ borderTop: '1px solid var(--fsi-border)' }}>
        {/* User card */}
        {!collapsed && (
          <div
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-default"
            style={{
              background: 'var(--fsi-surface-2)',
              border: '1px solid transparent',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'transparent'
            }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0"
              style={{
                background: 'rgba(245,176,65,0.15)',
                color: 'var(--fsi-gold)',
                fontWeight: 700,
              }}
            >
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="truncate"
                style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}
              >
                {user?.name}
              </p>
              <span className={cn('text-xs px-1.5 py-0.5 rounded-md font-mono', getSubscriptionBadge(user?.subscription || 'free'))}>
                {subLabel}
              </span>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm transition-all',
            collapsed ? 'justify-center' : '',
            'text-[var(--fsi-text-muted)] hover:text-red-400 hover:bg-red-500/10'
          )}
        >
          <LogOut size={15} />
          {!collapsed && t.sidebarLogout}
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--fsi-void)' }}>
      {/* Desktop Sidebar */}
      <aside
        className={cn('hidden md:flex flex-col glass transition-all duration-300 relative z-10', collapsed ? 'w-16' : 'w-60')}
        style={{ borderRight: '1px solid var(--fsi-border)' }}
      >
        <SidebarContent />
        {/* Collapse button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 flex items-center justify-center transition-all duration-200 z-20"
          style={{
            background: 'var(--fsi-surface-2)',
            border: '1px solid var(--fsi-border)',
            borderRadius: '12px',
            color: 'rgba(255,255,255,0.55)',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.background = 'rgba(255,255,255,0.04)'
            el.style.color = 'var(--fsi-gold)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.background = 'var(--fsi-surface-2)'
            el.style.color = 'rgba(255,255,255,0.55)'
          }}
        >
          {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
        </button>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-60 glass z-50" style={{ borderRight: '1px solid var(--fsi-border)' }}>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-3 glass" style={{ borderBottom: '1px solid var(--fsi-border)' }}>
          <button onClick={() => setMobileOpen(true)} style={{ color: 'var(--fsi-gold)' }}>
            <Menu size={22} />
          </button>
          <span className="font-display font-bold text-sm" style={{ color: 'var(--fsi-text)' }}>
            <span style={{ color: 'var(--fsi-gold)' }}>BayParee</span>
          </span>
          {/* empty placeholder to keep title centered */}
          <div className="w-6" />
        </div>

        <div className="flex-1 overflow-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
