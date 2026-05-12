import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { ChatModeProvider } from '@/contexts/ChatModeContext'
import ErrorBoundary from '@/components/ErrorBoundary'

// Lazy-loaded pages (code-split; each page is its own chunk)
const LandingPage        = lazy(() => import('@/pages/LandingPage'))
const LoginPage          = lazy(() => import('@/pages/LoginPage'))
const RegisterPage       = lazy(() => import('@/pages/RegisterPage'))
const ChatPage           = lazy(() => import('@/pages/ChatPage'))
const ImagePage          = lazy(() => import('@/pages/ImagePage'))
const ToolsPage          = lazy(() => import('@/pages/ToolsPage'))
const PricingPage        = lazy(() => import('@/pages/PricingPage'))
const PaymentPage        = lazy(() => import('@/pages/PaymentPage'))
const FixerPage          = lazy(() => import('@/pages/FixerPage'))
const RunPage            = lazy(() => import('@/pages/RunPage'))
const DashboardPage      = lazy(() => import('@/pages/DashboardPage'))
const AdminPage          = lazy(() => import('@/pages/AdminPage'))
const BusinessBuilderPage= lazy(() => import('@/pages/BusinessBuilderPage'))
const MarketplacePage    = lazy(() => import('@/pages/MarketplacePage'))
const ServicesPage       = lazy(() => import('@/pages/ServicesPage'))
const GrowthCheckPage    = lazy(() => import('@/pages/GrowthCheckPage'))
const PartnersPage       = lazy(() => import('@/pages/PartnersPage'))
const HubPage            = lazy(() => import('@/pages/HubPage'))
const CommandPage        = lazy(() => import('@/pages/CommandPage'))
const SupportPage        = lazy(() => import('@/pages/SupportPage'))
const RequestsPage       = lazy(() => import('@/pages/RequestsPage'))
const Layout             = lazy(() => import('@/components/Layout'))

// ── PUBLIC ACCESS: skip all auth gates until explicitly re-enabled ──────────
// To re-enable auth: set VITE_PUBLIC_ACCESS=false in Vercel env and redeploy
const DEV = import.meta.env.DEV || import.meta.env.VITE_PUBLIC_ACCESS === 'true'

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--fsi-void)' }}>
      <div className="text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl overflow-hidden mx-auto animate-pulse flex items-center justify-center"
          style={{ background: 'rgba(99,102,241,0.15)', boxShadow: '0 0 28px rgba(99,102,241,0.35)' }}>
          <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:18, color:'#818cf8' }}>EN</span>
        </div>
        <p className="font-semibold text-sm tracking-widest"
          style={{ color: '#818cf8', fontFamily:"'Space Grotesk',sans-serif" }}>ENGINE NOTREAL</p>
        <p style={{ color:'rgba(255,255,255,0.35)', fontSize:10, letterSpacing:'0.15em', textTransform:'uppercase' }}>
          AI Business Engine
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
  const { user, loading } = useAuth()

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/"                element={loading ? <PageLoader /> : user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
      <Route path="/landing"         element={<LandingPage />} />
      <Route path="/login"           element={!DEV && user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/register"        element={!DEV && user ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
      <Route path="/pricing"         element={<PricingPage />} />
      {/* Legacy routes — redirect to current equivalents */}
      <Route path="/choose-your-gate" element={<Navigate to="/" replace />} />
      <Route path="/apply"           element={<Navigate to="/register" replace />} />
      <Route path="/founder-intake"  element={<Navigate to="/register" replace />} />
      <Route path="/command"         element={<CommandPage />} />
      <Route path="/support"         element={<SupportPage />} />
      <Route path="/growth-check"    element={<GrowthCheckPage />} />
      <Route path="/partners"        element={<PartnersPage />} />
      <Route path="/hub"             element={<HubPage />} />

      {/* Protected app routes wrapped in Layout sidebar */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/chat"                 element={<ChatPage />} />
        <Route path="/chat/:conversationId" element={<ChatPage />} />
        <Route path="/image"                element={<ImagePage />} />
        <Route path="/tools"                element={<ToolsPage />} />
        <Route path="/payment"              element={<PaymentPage />} />
        <Route path="/dashboard"            element={<DashboardPage />} />
        <Route path="/builder"              element={<BusinessBuilderPage />} />
        <Route path="/create"               element={<BusinessBuilderPage />} />
        <Route path="/uncover-my-gold"      element={<BusinessBuilderPage />} />
        <Route path="/fixer"                element={<FixerPage />} />
        <Route path="/run"                  element={<RunPage />} />
        <Route path="/marketplace"          element={<MarketplacePage />} />
        <Route path="/the-gate"             element={<MarketplacePage />} />
        <Route path="/requests"             element={<RequestsPage />} />
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

