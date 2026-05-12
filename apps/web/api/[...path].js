const BACKEND_API_BASE_URL = (process.env.BACKEND_API_BASE_URL || 'https://backend-dhandabuzz.vercel.app/api').replace(/\/+$/, '')

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    if (req.method === 'GET' || req.method === 'HEAD') return resolve(undefined)
    const chunks = []
    req.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

function send(res, status, data) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(data))
}

export default async function handler(req, res) {
  if (!BACKEND_API_BASE_URL) {
    return send(res, 503, { error: 'Backend API target is not configured' })
  }

  const targetUrl = new URL(req.url, 'http://localhost')
  const path = targetUrl.pathname.replace(/^\/api/, '') || '/'

  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,PUT,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    return res.end()
  }

  const body = await readRequestBody(req).catch((error) => {
    throw new Error(`Failed to read request body: ${error.message || error}`)
  })

  const headers = new Headers()
  for (const [key, value] of Object.entries(req.headers)) {
    if (!value) continue
    const lower = key.toLowerCase()
    if (lower === 'host' || lower === 'connection' || lower === 'content-length') continue
    headers.set(key, Array.isArray(value) ? value.join(',') : value)
  }

  const upstream = await fetch(`${BACKEND_API_BASE_URL}${path}${targetUrl.search}`, {
    method: req.method,
    headers,
    body,
  })

  res.statusCode = upstream.status
  upstream.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'transfer-encoding') return
    res.setHeader(key, value)
  })

  const responseBody = Buffer.from(await upstream.arrayBuffer())
  return res.end(responseBody)
}
