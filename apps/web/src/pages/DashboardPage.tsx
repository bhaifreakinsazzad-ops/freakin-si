import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useLang } from '@/contexts/LanguageContext'
import { authApi, subscriptionApi } from '@/lib/api'
import { MessageSquare, Image, Wrench, CreditCard, Crown, TrendingUp, Calendar, Zap, Briefcase, Store, Sparkles, ArrowRight, Shield, Target, FileText, ChevronRight } from 'lucide-react'
import { cn, getSubscriptionBadge, formatDate } from '@/lib/utils'

export default function DashboardPage() {
  const { user, refreshUser, updateUser } = useAuth()
  const { t } = useLang()
  const [payments, setPayments] = useState<any[]>([])
  const [editName, setEditName] = useState(false)
  const [newName, setNewName] = useState(user?.name || '')
  const [savingName, setSavingName] = useState(false)

  useEffect(() => {
    refreshUser()
    subscriptionApi.getMyPayments().then(r => setPayments(r.data.payments.slice(0, 3))).catch(() => {})
  }, [])

  const saveName = async () => {
    if (!newName.trim()) return
    setSavingName(true)
    try {
      const res = await authApi.updateProfile({ name: newName })
      updateUser(res.data.user)
      setEditName(false)
    } catch {}
    setSavingName(false)
  }

  if (!user) return null

  const usagePct = Math.min(100, (user.daily_usage / user.daily_limit) * 100)
  const imgPct = Math.min(100, ((user.image_daily_usage || 0) / (user.image_daily_limit || 5)) * 100)

  const trialDaysLeft = user.trial_ends_at
    ? Math.max(0, Math.ceil((new Date(user.trial_ends_at).getTime() - Date.now()) / 86400000))
    : null

  const subEndsIn = user.subscription_ends_at
    ? Math.max(0, Math.ceil((new Date(user.subscription_ends_at).getTime() - Date.now()) / 86400000))
    : null

  const subLabel = user.subscription === 'free' ? `🆓 ${t.subFree}`
    : user.subscription === 'pro' ? `⚡ ${t.subPro}`
    : `👑 ${t.subPremium}`

  const subNameLabel = user.subscription === 'free' ? t.subFree
    : user.subscription === 'pro' ? t.subPro
    : t.subPremium

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield size={14} style={{ color: '#c9a449' }} />
              <span style={{ fontSize:11, fontFamily:"'Montserrat',sans-serif", fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#c9a449' }}>
                Divorcing The Game™
              </span>
            </div>
            <h1 className="font-display font-bold" style={{ fontSize:'1.75rem', color:'#f5f0e8' }}>Legacy Dashboard</h1>
            <p className="text-sm mt-0.5" style={{ color:'var(--bs-steel)' }}>Welcome home, {user.name}. Your vision becomes structure here.</p>
          </div>
          <span className={cn('px-3 py-1.5 rounded-full text-sm font-bold', getSubscriptionBadge(user.subscription))}>
            {subLabel}
          </span>
        </div>

        {/* Founder Status Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Founder Status', value: 'Active', icon: Shield, color: '#c9a449' },
            { label: 'Blueprint Progress', value: 'Start Now', icon: FileText, color: '#b5121b' },
            { label: 'Gate Recommended', value: 'Uncover First', icon: Target, color: '#c9c9c9' },
            { label: 'Next Best Step', value: 'Uncover My Gold', icon: Sparkles, color: '#e0c878' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} style={{ background:'linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))', border:'1px solid rgba(201,201,201,0.14)', borderRadius:16, padding:'16px 20px', backdropFilter:'blur(12px)' }}>
              <Icon size={16} style={{ color, marginBottom:8 }} />
              <p style={{ fontSize:10, fontFamily:"'Montserrat',sans-serif", fontWeight:700, letterSpacing:'0.10em', textTransform:'uppercase', color:'var(--bs-steel)', marginBottom:4 }}>{label}</p>
              <p style={{ fontSize:13, fontWeight:700, color:'#f5f0e8' }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Trial banner */}
        {user.subscription === 'free' && trialDaysLeft !== null && trialDaysLeft > 0 && (
          <div className="bg-blue-900/20 border border-blue-700/40 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap size={20} className="text-blue-400" />
              <div>
                <p className="text-sm font-medium text-blue-300">{t.dashFreeTrial}</p>
                <p className="text-xs text-blue-400/70">{trialDaysLeft} {t.dashDaysLeft}</p>
              </div>
            </div>
            <Link to="/payment" className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-500 transition-colors">
              {t.dashUpgrade}
            </Link>
          </div>
        )}

        {/* Subscription expiry */}
        {user.subscription !== 'free' && subEndsIn !== null && (
          <div className={cn('rounded-xl p-4 flex items-center justify-between border',
            subEndsIn <= 5 ? 'bg-red-900/20 border-red-700/40' : 'bg-green-900/10 border-green-700/20')}>
            <div className="flex items-center gap-3">
              <Calendar size={20} className={subEndsIn <= 5 ? 'text-red-400' : 'text-green-400'} />
              <div>
                <p className="text-sm font-medium text-gray-300">{t.dashSubscriptionLabel}</p>
                <p className="text-xs text-gray-500">{subEndsIn} {t.dashDaysLeft} · {new Date(user.subscription_ends_at!).toLocaleDateString()}</p>
              </div>
            </div>
            {subEndsIn <= 7 && (
              <Link to="/payment" className="text-xs bg-green-500 text-black px-3 py-1.5 rounded-lg">
                {t.dashRenew}
              </Link>
            )}
          </div>
        )}

        {/* Quick access */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Uncover My Gold', icon: Sparkles, colorHex: '#c9a449', action: '/builder', actionLabel: 'Start Now' },
            { label: 'The Gate', icon: Store, colorHex: '#b5121b', action: '/marketplace', actionLabel: 'Enter' },
            { label: 'Build Request', icon: Briefcase, colorHex: '#c9c9c9', action: '/services', actionLabel: 'Send Request' },
            { label: 'Choose Your Gate', icon: Crown, colorHex: '#e0c878', action: '/payment', actionLabel: 'View Gates' },
          ].map(({ label, icon: Icon, colorHex, action, actionLabel }) => (
            <Link key={label} to={action}
              className="rounded-xl p-4 transition-all group"
              style={{ background:'linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))', border:'1px solid rgba(201,201,201,0.14)', backdropFilter:'blur(12px)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = `${colorHex}40` }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(201,201,201,0.14)' }}
            >
              <Icon size={20} style={{ color: colorHex, marginBottom: 12 }} />
              <p className="font-medium text-sm" style={{ color:'#f5f0e8' }}>{label}</p>
              <p className="text-xs mt-1 transition-colors" style={{ color:'var(--bs-steel)' }}>{actionLabel} →</p>
            </Link>
          ))}
        </div>

        {/* Black Sheep Platform Overview */}
        <div className="rounded-2xl p-5 space-y-4"
          style={{ background:'linear-gradient(135deg,rgba(181,18,27,0.08),rgba(201,164,73,0.04))', border:'1px solid rgba(201,164,73,0.22)' }}>
          <div className="flex items-center justify-between">
            <h2 className="font-bold flex items-center gap-2 text-sm" style={{ color:'#c9a449', fontFamily:"'Montserrat',sans-serif", letterSpacing:'0.05em', textTransform:'uppercase' }}>
              <Shield size={14} style={{ color:'#c9a449' }} /> Black Sheep Platform
            </h2>
            <Link to="/builder" className="text-xs flex items-center gap-1" style={{ color:'var(--bs-steel)' }}>
              Uncover My Gold <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Sparkles, label: 'Uncover My Gold', sublabel: 'Build your blueprint', to: '/builder',    color: '#c9a449' },
              { icon: Briefcase, label: 'Build Request',  sublabel: 'Send project request', to: '/services',   color: '#c9c9c9' },
              { icon: Store,     label: 'The Gate',       sublabel: 'Enter & explore',       to: '/marketplace', color: '#b5121b' },
            ].map(({ icon: Icon, label, sublabel, to, color }) => (
              <Link key={to} to={to}
                className="rounded-xl p-3 flex flex-col items-center text-center gap-2 transition-all hover:scale-105"
                style={{ background:`${color}0F`, border:`1px solid ${color}25` }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background:`${color}18` }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <div>
                  <p className="text-xs font-bold" style={{ color:'#f5f0e8' }}>{label}</p>
                  <p className="text-xs" style={{ color:'var(--bs-steel)' }}>{sublabel}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Usage */}
        <div className="glass rounded-xl p-6 border border-green-900/20">
          <h2 className="font-bold text-gray-300 mb-5 flex items-center gap-2">
            <TrendingUp size={18} className="text-green-400" /> {t.dashTodayUsage}
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">{t.dashAIMessages}</span>
                <span className="text-gray-300">
                  {user.subscription === 'free'
                    ? `${user.daily_usage} / ${user.daily_limit}`
                    : <span className="text-green-400">{t.dashUnlimited}</span>}
                </span>
              </div>
              {user.subscription === 'free' && (
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className={cn('h-full rounded-full transition-all', usagePct >= 90 ? 'bg-red-500' : usagePct >= 70 ? 'bg-yellow-500' : 'bg-green-500')}
                    style={{ width: `${usagePct}%` }} />
                </div>
              )}
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">{t.dashImagesLabel}</span>
                <span className="text-gray-300">
                  {user.subscription === 'free'
                    ? `${user.image_daily_usage || 0} / ${user.image_daily_limit || 5}`
                    : <span className="text-green-400">{t.dashUnlimited}</span>}
                </span>
              </div>
              {user.subscription === 'free' && (
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className={cn('h-full rounded-full transition-all', imgPct >= 90 ? 'bg-red-500' : imgPct >= 70 ? 'bg-yellow-500' : 'bg-blue-500')}
                    style={{ width: `${imgPct}%` }} />
                </div>
              )}
            </div>
          </div>
          {user.subscription === 'free' && usagePct >= 80 && (
            <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-700/30 rounded-lg flex items-center justify-between">
              <p className="text-yellow-300 text-xs">{t.dashNearLimit}</p>
              <Link to="/payment" className="text-xs text-green-400 hover:underline">{t.dashGetPro} →</Link>
            </div>
          )}
        </div>

        {/* Profile + Payments */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass rounded-xl p-6 border border-green-900/20">
            <h2 className="font-bold text-gray-300 mb-4">{t.dashProfile}</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xl font-bold">
                {user.name?.[0]?.toUpperCase()}
              </div>
              <div>
                {editName ? (
                  <div className="flex items-center gap-2">
                    <input
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      className="bg-black/50 border border-green-900/30 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-green-500/50 w-36"
                    />
                    <button onClick={saveName} disabled={savingName} className="text-xs text-green-400 hover:underline">{t.dashSave}</button>
                    <button onClick={() => setEditName(false)} className="text-xs text-gray-500 hover:underline">{t.dashCancel}</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-white">{user.name}</p>
                    <button onClick={() => setEditName(true)} className="text-xs text-gray-600 hover:text-green-400">✏️</button>
                  </div>
                )}
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              {user.phone && (
                <div className="flex justify-between">
                  <span className="text-gray-500">{t.dashMobile}</span>
                  <span className="text-gray-300">{user.phone}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">{t.dashPlan}</span>
                <span className={cn('font-medium', user.subscription === 'pro' ? 'text-green-400' : user.subscription === 'premium' ? 'text-purple-400' : 'text-gray-300')}>
                  {subNameLabel}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t.dashJoined}</span>
                <span className="text-gray-300">{formatDate(user.id)}</span>
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-6 border border-green-900/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-300">{t.dashPayments}</h2>
              <Link to="/payment" className="text-xs text-green-400 hover:underline">View all →</Link>
            </div>
            {payments.length === 0 ? (
              <div className="text-center py-6">
                <CreditCard size={28} className="text-gray-700 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">{t.dashNoPayments}</p>
                <Link to="/payment" className="text-xs text-green-400 mt-2 block hover:underline">{t.dashUpgrade} →</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {payments.map(p => (
                  <div key={p.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-gray-300 capitalize">{p.plan_name}</p>
                      <p className="text-xs text-gray-600">{p.payment_method.toUpperCase()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-medium">৳{p.amount}</p>
                      <span className={cn('text-xs px-1.5 py-0.5 rounded',
                        p.status === 'approved' ? 'text-green-400' : p.status === 'pending' ? 'text-yellow-400' : 'text-red-400')}>
                        {p.status === 'approved' ? '✅' : p.status === 'pending' ? '⏳' : '❌'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
