/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_API_BASE_URL?: string
  readonly VITE_SERVICE_MODE?: 'mock' | 'live' | 'hybrid'
  readonly VITE_PUBLIC_ACCESS?: string
  readonly VITE_CLIENT_PREVIEW_MODE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
