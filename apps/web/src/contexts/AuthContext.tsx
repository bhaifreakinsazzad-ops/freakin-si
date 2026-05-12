import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApi } from '@/lib/api'

interface User {
  id: string
  email: string
  name: string
  phone?: string
  avatar_url?: string
  subscription: 'free' | 'pro' | 'premium'
  daily_usage: number
  daily_limit: number
  image_daily_usage: number
  image_daily_limit: number
  is_admin: boolean
  subscription_ends_at?: string
  trial_ends_at?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: { email: string; password: string; name: string; phone?: string }) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const LOCAL_USERS_KEY = 'black_sheep_local_users'
const LOCAL_TOKEN_PREFIX = 'local-auth:'
const PREVIEW_TOKEN = 'preview-token'

type LocalUserRecord = {
  user: User
  password: string
}

function readLocalUsers(): LocalUserRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeLocalUsers(users: LocalUserRecord[]) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users))
}

function makeLocalUser(data: { email: string; password: string; name: string; phone?: string }) {
  return {
    user: {
      id: `local-${crypto.randomUUID()}`,
      email: data.email.toLowerCase(),
      name: data.name,
      phone: data.phone || undefined,
      subscription: 'free' as const,
      daily_usage: 0,
      daily_limit: 50,
      image_daily_usage: 0,
      image_daily_limit: 5,
      is_admin: false,
      trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    password: data.password,
  }
}

function makeLocalToken(userId: string) {
  return `${LOCAL_TOKEN_PREFIX}${userId}`
}

function findLocalUserByToken(token: string | null): User | null {
  if (!token || !token.startsWith(LOCAL_TOKEN_PREFIX)) return null
  const userId = token.slice(LOCAL_TOKEN_PREFIX.length)
  const localUser = readLocalUsers().find((entry: any) => entry?.user?.id === userId)
  return localUser?.user || null
}

function shouldFallback(error: any) {
  const contentType = error?.response?.headers?.['content-type'] || error?.response?.headers?.['Content-Type']
  const status = error?.response?.status
  return (
    !error?.response ||
    status === 404 ||
    status === 405 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504 ||
    typeof contentType === 'string' && contentType.includes('text/html')
  )
}

function hasValidAuthPayload(data: any): data is { token: string; user: User } {
  return Boolean(data && typeof data === 'object' && typeof data.token === 'string' && data.user && typeof data.user === 'object')
}

// ── DEV mock user — auto-populated in development so every page is browsable ──
const DEV_USER: User = {
  id: 'dev-preview-user',
  email: 'demo@enginenotreal.com',
  name: 'Not Real Engine Demo',
  subscription: 'premium',
  daily_usage: 3,
  daily_limit: 999,
  image_daily_usage: 0,
  image_daily_limit: 999,
  is_admin: true,
  trial_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const isPreview = import.meta.env.DEV || import.meta.env.VITE_PUBLIC_ACCESS === 'true' || import.meta.env.VITE_CLIENT_PREVIEW_MODE === 'true'
  const [user, setUser]   = useState<User | null>(isPreview ? DEV_USER : null)
  const [token, setToken] = useState<string | null>(isPreview ? PREVIEW_TOKEN : localStorage.getItem('ai_shala_token'))
  const [loading, setLoading] = useState(!isPreview)

  useEffect(() => {
    if (isPreview) {
      localStorage.setItem('ai_shala_token', PREVIEW_TOKEN)
      return
    }
    if (token) {
      const localUser = findLocalUserByToken(token)
      if (localUser) {
        setUser(localUser)
        setLoading(false)
        return
      }
      authApi.me()
        .then((res) => setUser(res.data.user))
        .catch(() => logout())
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [isPreview, token])

  const login = async (email: string, password: string) => {
    try {
      const res = await authApi.login({ email, password })
      if (!hasValidAuthPayload(res.data)) throw new Error('Malformed auth response')
      const { token: newToken, user: newUser } = res.data
      localStorage.setItem('ai_shala_token', newToken)
      setToken(newToken)
      setUser(newUser)
    } catch (error: any) {
      if (!shouldFallback(error) && error?.message !== 'Malformed auth response') throw error
      const localUser = readLocalUsers().find((entry: any) =>
        entry?.user?.email?.toLowerCase() === email.toLowerCase() && entry?.password === password
      )
      if (!localUser) throw new Error('Invalid email or password')
      const newToken = makeLocalToken(localUser.user.id)
      localStorage.setItem('ai_shala_token', newToken)
      setToken(newToken)
      setUser(localUser.user)
    }
  }

  const register = async (data: { email: string; password: string; name: string; phone?: string }) => {
    try {
      const res = await authApi.register(data)
      if (!hasValidAuthPayload(res.data)) throw new Error('Malformed auth response')
      const { token: newToken, user: newUser } = res.data
      localStorage.setItem('ai_shala_token', newToken)
      setToken(newToken)
      setUser(newUser)
    } catch (error: any) {
      if (!shouldFallback(error) && error?.message !== 'Malformed auth response') throw error
      const users = readLocalUsers()
      if (users.some((entry: any) => entry?.user?.email?.toLowerCase() === data.email.toLowerCase())) {
        throw new Error('An account with this email already exists')
      }
      const localUser = makeLocalUser(data)
      writeLocalUsers([...users, localUser])
      const newToken = makeLocalToken(localUser.user.id)
      localStorage.setItem('ai_shala_token', newToken)
      setToken(newToken)
      setUser(localUser.user)
    }
  }

  const logout = () => {
    localStorage.removeItem('ai_shala_token')
    setToken(null)
    setUser(null)
  }

  const refreshUser = async () => {
    const localUser = findLocalUserByToken(token)
    if (localUser) {
      setUser(localUser)
      return
    }
    const res = await authApi.me()
    setUser(res.data.user)
  }

  const updateUser = (updated: User) => setUser(updated)

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
