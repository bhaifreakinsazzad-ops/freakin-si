import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { ChatModeProvider } from '@/contexts/ChatModeContext'
import ErrorBoundary from '@/components/ErrorBoundary'

// ── Lazy-loaded pages (code-split — each page is its own chunk) ─────────────
const LandingPage        = lazy(() => import('@/pages/LandingPage'))
const LoginPage          = lazy(() => import('@/pages/LoginPage'))
const RegisterPage       = lazy(() => import('@/pages/RegisterPage'))
const ChatPage           = lazy(() => import('@/pages/ChatPage'))
const ImagePage          = lazy(() => import('@/pages/ImagePage'))
const ToolsPage          = lazy(() => import('@/pages/ToolsPage'))
const PricingPage        = lazy(() => import('@/pages/PricingPage'))
const PaymentPage        = lazy(() => import('@/pages/PaymentPage'))
const DashboardPage      = lazy(() => import('@/pages/DashboardPage'))
const AdminPage          = lazy(() => import('@/pages/AdminPage'))
const BusinessBuilderPage= lazy(() => import('@/pages/BusinessBuilderPage'))
const MarketplacePage    = lazy(() => import('@/pages/MarketplacePage'))
const ServicesPage       = lazy(() => import('@/pages/ServicesPage'))
const GrowthCheckPage    = lazy(() => import('@/pages/GrowthCheckPage'))
const PartnersPage       = lazy(() => import('@/pages/PartnersPage'))
const HubPage            = lazy(() => import('@/pages/HubPage'))
const ChooseYourGatePage = lazy(() => import('@/pages/ChooseYourGatePage'))
const FounderIntakePage  = lazy(() => import('@/pages/FounderIntakePage'))
const Layout             = lazy(() => import('@/components/Layout'))

// Official DTG logo, compressed for lightweight public landing use only.
const DTG_LOGO_DATA_URL = 'data:image/webp;base64,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'

// ── PUBLIC ACCESS: skip all auth gates until explicitly re-enabled ──────────
// To re-enable auth: set VITE_PUBLIC_ACCESS=false in Vercel env and redeploy
const DEV = import.meta.env.DEV || import.meta.env.VITE_PUBLIC_ACCESS === 'true'

function ClientRevisionPatches() {
  const location = useLocation()

  useEffect(() => {
    const isLanding = () => window.location.pathname === '/'
    if (!isLanding()) return

    const addStyles = () => {
      if (document.getElementById('dtg-client-revision-styles')) return
      const style = document.createElement('style')
      style.id = 'dtg-client-revision-styles'
      style.textContent = `
        .dtg-logo img[data-dtg-official-logo], .dtg-official-logo-inline {
          width: 64px !important;
          height: 64px !important;
          object-fit: contain !important;
          border-radius: 50%;
          border: 1px solid rgba(239,35,60,.38);
          box-shadow: 0 0 34px rgba(239,35,60,.24);
          background: rgba(0,0,0,.58);
          padding: 3px;
          filter: none !important;
        }
        .dtg-funding-emphasis {
          margin: 0 0 16px;
          padding: 14px 16px;
          border-radius: 18px;
          border: 1px solid rgba(201,164,73,.58);
          background: linear-gradient(135deg, rgba(201,164,73,.18), rgba(239,35,60,.12), rgba(0,0,0,.28));
          color: #f5f0e8;
          font-family: 'Montserrat','Space Grotesk',sans-serif;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: .08em;
          line-height: 1.45;
          text-transform: uppercase;
          box-shadow: 0 0 30px rgba(201,164,73,.12);
        }
        #dtg-lightweight-proof {
          position: relative;
          z-index: 2;
          padding: 92px 24px;
          background: #050505;
          color: #f5f0e8;
          border-top: 1px solid rgba(255,255,255,.10);
          border-bottom: 1px solid rgba(181,18,27,.28);
        }
        #dtg-lightweight-proof .dtg-proof-inner { max-width: 1120px; margin: 0 auto; text-align: center; }
        #dtg-lightweight-proof .dtg-proof-kicker {
          display: inline-flex; align-items: center; gap: 10px;
          margin-bottom: 16px; color: #c9a449;
          font-family: 'Montserrat','Space Grotesk',sans-serif;
          font-size: 12px; font-weight: 800; letter-spacing: .22em; text-transform: uppercase;
        }
        #dtg-lightweight-proof .dtg-proof-kicker:before { content: ''; width: 6px; height: 6px; border-radius: 999px; background: #b5121b; }
        #dtg-lightweight-proof h2 {
          margin: 0 auto 14px; max-width: 780px;
          font-family: 'Playfair Display','Sora',serif;
          font-size: clamp(32px, 5vw, 54px); line-height: 1.05; font-weight: 900;
        }
        #dtg-lightweight-proof p { max-width: 760px; margin: 0 auto 38px; color: rgba(245,240,232,.70); font-size: 18px; line-height: 1.7; }
        #dtg-lightweight-proof .dtg-proof-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; text-align: left; }
        #dtg-lightweight-proof .dtg-proof-card {
          min-height: 150px; padding: 22px; border-radius: 24px;
          background: linear-gradient(180deg, rgba(255,255,255,.055), rgba(255,255,255,.025));
          border: 1px solid rgba(255,255,255,.12);
          box-shadow: 0 22px 52px rgba(0,0,0,.22);
        }
        #dtg-lightweight-proof .dtg-proof-card strong { display: block; color: #fff; font-family: 'Montserrat','Space Grotesk',sans-serif; font-size: 14px; letter-spacing: .06em; text-transform: uppercase; margin-bottom: 10px; }
        #dtg-lightweight-proof .dtg-proof-card span { display: block; color: rgba(245,240,232,.66); font-size: 14px; line-height: 1.6; }
        @media (max-width: 900px) { #dtg-lightweight-proof .dtg-proof-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 560px) { #dtg-lightweight-proof { padding: 70px 18px; } #dtg-lightweight-proof .dtg-proof-grid { grid-template-columns: 1fr; } .dtg-logo img[data-dtg-official-logo], .dtg-official-logo-inline { width: 52px !important; height: 52px !important; } }
      `
      document.head.appendChild(style)
    }

    const replaceTextNodes = () => {
      if (!isLanding() || !document.body) return
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          const parent = node.parentElement
          if (!parent) return NodeFilter.FILTER_REJECT
          const tag = parent.tagName.toLowerCase()
          if (['script', 'style', 'textarea', 'input'].includes(tag)) return NodeFilter.FILTER_REJECT
          return NodeFilter.FILTER_ACCEPT
        },
      })

      const replacements: Array<[RegExp, string]> = [
        [/NEW\s+COHORT\s+FORMING\s+NOW\s*[—-]\s*LIMITED\s+APPLICATIONS\s+ACCEPTED/gi, 'BLACK SHEEP EXECUTIVE BLUEPRINT → FREE SCHOLARSHIP OPENS EVERY 90 DAYS → APPLY NOW'],
        [/New\s+cohort\s+forming\s*[—-]\s*limited\s+seats/gi, 'Free scholarship opens every 90 days'],
        [/\bcohort\b/gi, 'scholarship opportunity'],
        [/Guaranteed\s+or\s+money\s+back/gi, 'Funding pathway support included'],
        [/guaranteed\s+or\s+money\s+back/gi, 'funding pathway support included'],
      ]

      let node = walker.nextNode()
      while (node) {
        let next = node.nodeValue || ''
        for (const [pattern, replacement] of replacements) next = next.replace(pattern, replacement)
        if (next !== node.nodeValue) node.nodeValue = next
        node = walker.nextNode()
      }
    }

    const applyLogo = () => {
      if (!isLanding()) return
      const existingIcon = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
      const icon = existingIcon ?? document.createElement('link')
      icon.rel = 'icon'
      icon.href = DTG_LOGO_DATA_URL
      if (!existingIcon) document.head.appendChild(icon)

      const logoHosts = Array.from(document.querySelectorAll<HTMLElement>('.dtg-logo'))
      logoHosts.forEach((host) => {
        const existing = host.querySelector<HTMLImageElement>('img')
        const img = existing ?? document.createElement('img')
        img.src = DTG_LOGO_DATA_URL
        img.alt = 'Divorcing The Game DTG official logo'
        img.dataset.dtgOfficialLogo = 'true'
        img.loading = 'eager'
        img.decoding = 'async'
        if (!existing) host.prepend(img)
      })
    }

    const retargetBackendLinks = () => {
      if (!isLanding()) return
      const backendPaths = [
        '/login', '/register', '/chat', '/dashboard', '/builder', '/uncover-my-gold',
        '/tools', '/image', '/payment', '/admin', '/marketplace', '/the-gate', '/services', '/build-request'
      ]
      document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((anchor) => {
        const href = anchor.getAttribute('href') || ''
        const shouldRetarget = backendPaths.some((path) => href === path || href.startsWith(`${path}/`))
        if (!shouldRetarget) return
        anchor.setAttribute('href', '#dtg-apply')
        anchor.setAttribute('data-dtg-retargeted', 'true')
        anchor.setAttribute('title', 'Apply for your Vision Extraction Call')
        const label = (anchor.textContent || '').trim()
        if (!label || /login|register|portal|dashboard|builder|sheep|access|enter/i.test(label)) {
          anchor.textContent = 'Apply for Your Vision Extraction Call'
        }
      })
    }

    const addFundingBadges = () => {
      if (!isLanding()) return
      const gates = [
        { label: 'Silver Gate', price: '$3,497', copy: 'Funding Gate Opens: up to $250K business credit/funding pathway support is included with this path.' },
        { label: 'Gold Gate', price: '$4,497', copy: 'Up to $250K funding pathway support included for qualified founders.' },
        { label: 'Platinum Gate', price: '$9,497', copy: 'Up to $250K funding pathway support plus buildout guidance for qualified founders.' },
      ]

      gates.forEach((gate) => {
        const candidates = Array.from(document.querySelectorAll<HTMLElement>('div, article, section, li'))
          .filter((el) => {
            const text = (el.textContent || '').replace(/\s+/g, ' ')
            return text.includes(gate.label) && (text.includes(gate.price) || text.includes(gate.price.replace('$', '')))
          })
          .sort((a, b) => (a.textContent || '').length - (b.textContent || '').length)

        const card = candidates[0]
        if (!card || card.querySelector('.dtg-funding-emphasis')) return
        const badge = document.createElement('div')
        badge.className = 'dtg-funding-emphasis'
        badge.textContent = gate.copy
        card.prepend(badge)
        card.setAttribute('data-dtg-funding-enhanced', 'true')
      })
    }

    const addLightweightProof = () => {
      if (!isLanding() || document.getElementById('dtg-lightweight-proof')) return
      const proof = document.createElement('section')
      proof.id = 'dtg-lightweight-proof'
      proof.innerHTML = `
        <div class="dtg-proof-inner">
          <div class="dtg-proof-kicker">Black Sheep Founder Proof</div>
          <h2>Real founders. Real structure. Clearer next moves.</h2>
          <p>Short founder proof from people whose vision was turned into structure, without slowing the page with heavy videos.</p>
          <div class="dtg-proof-grid">
            <div class="dtg-proof-card"><strong>Montoiya Williams</strong><span>Vision moved from her head into a clear Silver Blueprint with direction, structure, and funding-path clarity.</span></div>
            <div class="dtg-proof-card"><strong>Willie Lee Burgess Jr.</strong><span>Constructive Landscaping™ founder spotlight proof for real-world business structure and ownership.</span></div>
            <div class="dtg-proof-card"><strong>Adreanna Fontecchio</strong><span>Dose of Anna story-to-business transformation: purpose, offer, and brand direction made clear.</span></div>
            <div class="dtg-proof-card"><strong>Dialvin Broomfield</strong><span>Kingdom Keys Logistics™ founder spotlight supporting the Black Sheep business-building movement.</span></div>
          </div>
        </div>
      `
      const applySection = document.getElementById('dtg-apply')
      if (applySection?.parentElement) applySection.parentElement.insertBefore(proof, applySection)
      else document.body.appendChild(proof)
    }

    const applyAll = () => {
      if (!isLanding()) return
      addStyles()
      replaceTextNodes()
      applyLogo()
      retargetBackendLinks()
      addFundingBadges()
      addLightweightProof()
    }

    let frame = 0
    const schedule = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(applyAll)
    }

    applyAll()
    const observer = new MutationObserver(schedule)
    observer.observe(document.body, { childList: true, subtree: true })
    const interval = window.setInterval(applyAll, 1200)

    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
      window.clearInterval(interval)
    }
  }, [location.pathname])

  return null
}

// ── Page loader (shown while lazy chunks load) ──────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--fsi-void)' }}>
      <div className="text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl overflow-hidden mx-auto animate-pulse flex items-center justify-center"
          style={{ background: 'rgba(200,16,46,0.15)', boxShadow: '0 0 28px rgba(200,16,46,0.35)' }}>
          <span style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:900, fontSize:18, color:'#c8102e' }}>BS</span>
        </div>
        <p className="font-display font-semibold text-sm tracking-widest"
          style={{ color: '#c8102e' }}>BLACK SHEEP</p>
        <p style={{ color:'rgba(255,255,255,0.35)', fontSize:10, letterSpacing:'0.15em', textTransform:'uppercase' }}>
          Divorcing The Game™
        </p>
      </div>
    </div>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (DEV) return <>{children}</>
  if (loading) return <PageLoader />
  return user ? <>{children}</> : <Navigate to="/login" replace />
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (DEV) return <>{children}</>
  if (loading) return null
  return user?.is_admin ? <>{children}</> : <Navigate to="/" replace />
}

function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/"                element={!DEV && user ? <Navigate to="/chat" replace /> : <LandingPage />} />
      <Route path="/login"           element={!DEV && user ? <Navigate to="/chat" replace /> : <LoginPage />} />
      <Route path="/register"        element={!DEV && user ? <Navigate to="/chat" replace /> : <RegisterPage />} />
      <Route path="/pricing"         element={<PricingPage />} />
      <Route path="/choose-your-gate" element={<ChooseYourGatePage />} />
      <Route path="/apply"           element={<FounderIntakePage />} />
      <Route path="/founder-intake"  element={<FounderIntakePage />} />
      <Route path="/growth-check"    element={<GrowthCheckPage />} />
      <Route path="/partners"        element={<PartnersPage />} />
      <Route path="/hub"             element={<HubPage />} />

      {/* Protected app routes — wrapped in Layout sidebar */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/chat"                 element={<ChatPage />} />
        <Route path="/chat/:conversationId" element={<ChatPage />} />
        <Route path="/image"                element={<ImagePage />} />
        <Route path="/tools"                element={<ToolsPage />} />
        <Route path="/payment"              element={<PaymentPage />} />
        <Route path="/dashboard"            element={<DashboardPage />} />
        <Route path="/builder"              element={<BusinessBuilderPage />} />
        <Route path="/uncover-my-gold"      element={<BusinessBuilderPage />} />
        <Route path="/marketplace"          element={<MarketplacePage />} />
        <Route path="/the-gate"             element={<MarketplacePage />} />
        <Route path="/services"             element={<ServicesPage />} />
        <Route path="/build-request"        element={<ServicesPage />} />
      </Route>

      {/* Admin */}
      <Route path="/admin" element={
        <ProtectedRoute><AdminRoute><AdminPage /></AdminRoute></ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <ChatModeProvider>
            <ClientRevisionPatches />
            <div className="grid-pattern fixed inset-0 pointer-events-none z-0" aria-hidden="true" />
            <div className="relative z-10">
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <AppRoutes />
                </Suspense>
              </ErrorBoundary>
            </div>
          </ChatModeProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}
