const previewApiMode =
  import.meta.env.VITE_CLIENT_PREVIEW_MODE === 'true' ||
  import.meta.env.VITE_PUBLIC_ACCESS === 'true'

export const API_BASE_URL = previewApiMode
  ? '/api'
  : import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '/api'
