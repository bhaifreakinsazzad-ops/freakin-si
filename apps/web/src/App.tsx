import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { ChatModeProvider } from '@/contexts/ChatModeContext'
import LandingPage    from '@/pages/LandingPage'
import LoginPage      from '@/pages/LoginPage'
import RegisterPage   from '@/pages/RegisterPage'
import ChatPage       from '@/pages/ChatPage'
import ImagePage      from '@/pages/ImagePage'
import ToolsPage      from '@/pages/ToolsPage'
import PricingPage    from '@/pages/PricingPage'
import PaymentPage    from '@/pages/PaymentPage'
import DashboardPage  from '@/pages/DashboardPage'
import AdminPage         from '@/pages/AdminPage'
import MoneyMachinePage from '@/pages/MoneyMachinePage'
import MarketplacePage  from '@/pages/MarketplacePage'
import ServicesPage     from '@/pages/ServicesPage'
import Layout            from '@/components/Layout'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--fsi-void)' }}>
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto animate-pulse"
          style={{ boxShadow: '0 0 30px rgba(245,176,65,0.5)' }}>
          <img src="/fsi-icon.svg" alt="F-Bi" className="w-full h-full" />
        </div>
        <p className="font-display font-semibold tracking-wide" style={{ color: 'var(--fsi-gold)' }}>BhaiFreakin'sBI</p>
        <p className="text-xs" style={{ color: 'var(--fsi-text-muted)' }}>Synthetic Business Intelligence</p>
      </div>
    </div>
  )
  return user ? <>{children}</> : <Navigate to="/login" replace />
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user?.is_admin ? <>{children}</> : <Navigate to="/" replace />
}

function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/"        element={user ? <Navigate to="/chat" replace /> : <LandingPage />} />
      <Route path="/login"   element={user ? <Navigate to="/chat" replace /> : <LoginPage />} />
      <Route path="/register"element={user ? <Navigate to="/chat" replace /> : <RegisterPage />} />
      <Route path="/pricing" element={<PricingPage />} />

      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/chat"                  element={<ChatPage />} />
        <Route path="/chat/:conversationId"  element={<ChatPage />} />
        <Route path="/image"                 element={<ImagePage />} />
        <Route path="/tools"                 element={<ToolsPage />} />
        <Route path="/payment"               element={<PaymentPage />} />
        <Route path="/dashboard"             element={<DashboardPage />} />
        <Route path="/money-machine"         element={<MoneyMachinePage />} />
        <Route path="/marketplace"           element={<MarketplacePage />} />
        <Route path="/services"              element={<ServicesPage />} />
      </Route>

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
            {/* Subtle grid overlay */}
            <div className="grid-pattern fixed inset-0 pointer-events-none z-0" aria-hidden="true" />
            <div className="relative z-10">
              <AppRoutes />
            </div>
          </ChatModeProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}
