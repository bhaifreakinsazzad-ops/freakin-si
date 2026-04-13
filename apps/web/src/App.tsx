import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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
const Layout             = lazy(() => import('@/components/Layout'))

// ── PUBLIC ACCESS: skip all auth gates until explicitly re-enabled ──────────
// To re-enable auth: set VITE_PUBLIC_ACCESS=false in Vercel env and redeploy
const DEV = import.meta.env.DEV || import.meta.env.VITE_PUBLIC_ACCESS === 'true'

// ── Page loader (shown while lazy chunks load) ──────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--fsi-void)' }}>
      <div className="text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl overflow-hidden mx-auto animate-pulse"
          style={{ boxShadow: '0 0 28px rgba(245,176,65,0.45)' }}>
          <img src="/fsi-icon.svg" alt="BayParee" className="w-full h-full" />
        </div>
        <p className="font-display font-semibold text-sm tracking-widest"
          style={{ color: 'var(--fsi-gold)' }}>BAYPAREE</p>
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
      <Route path="/"           element={!DEV && user ? <Navigate to="/chat" replace /> : <LandingPage />} />
      <Route path="/login"      element={!DEV && user ? <Navigate to="/chat" replace /> : <LoginPage />} />
      <Route path="/register"   element={!DEV && user ? <Navigate to="/chat" replace /> : <RegisterPage />} />
      <Route path="/pricing"      element={<PricingPage />} />
      <Route path="/growth-check" element={<GrowthCheckPage />} />
      <Route path="/partners"     element={<PartnersPage />} />
      <Route path="/hub"          element={<HubPage />} />

      {/* Protected app routes — wrapped in Layout sidebar */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/chat"                 element={<ChatPage />} />
        <Route path="/chat/:conversationId" element={<ChatPage />} />
        <Route path="/image"                element={<ImagePage />} />
        <Route path="/tools"                element={<ToolsPage />} />
        <Route path="/payment"              element={<PaymentPage />} />
        <Route path="/dashboard"            element={<DashboardPage />} />
        <Route path="/builder"              element={<BusinessBuilderPage />} />
        <Route path="/marketplace"          element={<MarketplacePage />} />
        <Route path="/services"             element={<ServicesPage />} />
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
