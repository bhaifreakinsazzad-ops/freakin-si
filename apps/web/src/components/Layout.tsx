import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useLang } from '@/contexts/LanguageContext'
import { useState } from 'react'
import {
  MessageSquare, Image, Wrench, CreditCard, LayoutDashboard,
  LogOut, ChevronLeft, ChevronRight, Shield, Menu, Zap,
} from 'lucide-react'
import { cn, getSubscriptionBadge } from '@/lib/utils'

export default function Layout() {
  const { user, logout } = useAuth()
  const { t, lang, toggle } = useLang()
  const navigate = useNavigate()
  const [collapsed,   setCollapsed]   = useState(false)
  const [mobileOpen, setMobileOpen]  = useState(false)

  const navItems = [
    { to: '/chat',      icon: MessageSquare,   label: t.sidebarChat },
    { to: '/image',     icon: Image,           label: t.sidebarImage },
    { to: '/tools',     icon: Wrench,          label: t.sidebarTools },
    { to: '/dashboard', icon: LayoutDashboard, label: t.sidebarDashboard },
    { to: '/payment',   icon: CreditCard,      label: t.sidebarPayment },
  ]

  const handleLogout = () => { logout(); navigate('/') }

  const subLabel = user?.subscription === 'free' ? t.subFree
    : user?.subscription === 'pro' ? t.subPro
    : t.subPremium

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn('p-4 border-b flex items-center gap-3', collapsed && 'justify-center')}
        style={{ borderColor: 'var(--fsi-border)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, var(--fsi-gold), #FFA000)', boxShadow: '0 0 16px rgba(255,182,40,0.4)' }}>
          <Zap size={18} fill="black" color="black" />
        </div>
        {!collapsed && (
          <div>
            <h1 className="font-display font-bold text-lg leading-none" style={{ color: 'var(--fsi-gold)' }}>
              Freakin SI
            </h1>
            <p className="text-xs mt-0.5" style={{ color: 'var(--fsi-text-muted)' }}>Synthetic Intelligence</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
              collapsed ? 'justify-center' : '',
              isActive
                ? 'fsi-card-active text-[var(--fsi-gold)]'
                : 'text-[var(--fsi-text-muted)] hover:text-[var(--fsi-text)] hover:bg-[var(--fsi-surface-2)]'
            )}
          >
            <Icon size={17} className="shrink-0" />
            {!collapsed && <span className="text-sm font-medium">{label}</span>}
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
        {/* Language toggle — cycles EN → BN */}
        <button
          onClick={toggle}
          className={cn(
            'flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm transition-all',
            collapsed ? 'justify-center' : '',
            'text-[var(--fsi-text-muted)] hover:text-[var(--fsi-text)] hover:bg-[var(--fsi-surface-2)]'
          )}
        >
          <span className="text-base">{lang === 'bn' ? '🇬🇧' : '🇧🇩'}</span>
          {!collapsed && <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>}
        </button>

        {!collapsed && (
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl" style={{ background: 'var(--fsi-surface-2)' }}>
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
              style={{ background: 'rgba(255,182,40,0.18)', color: 'var(--fsi-gold)' }}
            >
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--fsi-text)' }}>{user?.name}</p>
              <span className={cn('text-xs px-1.5 py-0.5 rounded-md font-mono', getSubscriptionBadge(user?.subscription || 'free'))}>
                {subLabel}
              </span>
            </div>
          </div>
        )}

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
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center transition-all z-20"
          style={{ background: 'var(--fsi-surface-2)', border: '1px solid var(--fsi-border)', color: 'var(--fsi-gold)' }}
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
          <span className="font-display font-bold" style={{ color: 'var(--fsi-gold)' }}>⚡ Freakin SI</span>
          <button onClick={toggle} className="text-xs" style={{ color: 'var(--fsi-text-muted)' }}>
            {lang === 'bn' ? '🇬🇧 EN' : '🇧🇩 বাং'}
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
