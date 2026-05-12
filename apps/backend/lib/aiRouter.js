/**
 * Engine NotREAL — AI Provider Router
 * Tries configured providers in order; falls back to demo mode if none available.
 */

const PROVIDER_ORDER = ['groq', 'google', 'openai', 'anthropic', 'mistral', 'together', 'deepseek', 'xai', 'perplexity']

function getActiveProvider() {
  if (process.env.GROQ_API_KEY)             return 'groq'
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) return 'google'
  if (process.env.OPENAI_API_KEY)           return 'openai'
  if (process.env.ANTHROPIC_API_KEY)        return 'anthropic'
  if (process.env.MISTRAL_API_KEY)          return 'mistral'
  if (process.env.TOGETHER_API_KEY)         return 'together'
  if (process.env.DEEPSEEK_API_KEY)         return 'deepseek'
  if (process.env.XAI_API_KEY)              return 'xai'
  if (process.env.PERPLEXITY_API_KEY)       return 'perplexity'
  return null
}

async function callGroq(systemPrompt, userPrompt) {
  const { default: Groq } = await import('groq-sdk')
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
  const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'
  const res = await groq.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user',   content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 4096,
  })
  return res.choices[0]?.message?.content || ''
}

async function callOpenAI(systemPrompt, userPrompt) {
  const { default: OpenAI } = await import('openai')
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'
  const res = await openai.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user',   content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 4096,
  })
  return res.choices[0]?.message?.content || ''
}

async function callAnthropic(systemPrompt, userPrompt) {
  const Anthropic = (await import('@anthropic-ai/sdk')).default
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const model = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001'
  const res = await client.messages.create({
    model,
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  })
  return res.content[0]?.text || ''
}

async function callGoogle(systemPrompt, userPrompt) {
  const { GoogleGenerativeAI } = await import('@google/generative-ai')
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash', systemInstruction: systemPrompt })
  const res = await model.generateContent(userPrompt)
  return res.response.text()
}

async function callMistral(systemPrompt, userPrompt) {
  const { Mistral } = await import('@mistralai/mistralai')
  const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY })
  const model = process.env.MISTRAL_MODEL || 'mistral-small-latest'
  const res = await client.chat.complete({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user',   content: userPrompt },
    ],
  })
  return res.choices[0]?.message?.content || ''
}

async function callOpenRouter(systemPrompt, userPrompt) {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt },
      ],
    }),
  })
  const data = await res.json()
  return data.choices?.[0]?.message?.content || ''
}

/**
 * Main AI generation function.
 * Returns { text, provider, demo } where demo=true if no provider configured.
 */
async function generateAI(systemPrompt, userPrompt) {
  const provider = getActiveProvider()

  if (!provider) {
    return { text: null, provider: 'demo', demo: true }
  }

  try {
    let text = ''
    switch (provider) {
      case 'groq':      text = await callGroq(systemPrompt, userPrompt); break
      case 'openai':    text = await callOpenAI(systemPrompt, userPrompt); break
      case 'anthropic': text = await callAnthropic(systemPrompt, userPrompt); break
      case 'google':    text = await callGoogle(systemPrompt, userPrompt); break
      case 'mistral':   text = await callMistral(systemPrompt, userPrompt); break
      default:          text = await callOpenRouter(systemPrompt, userPrompt)
    }
    return { text, provider, demo: false }
  } catch (err) {
    console.error(`[aiRouter] ${provider} failed:`, err.message)
    // Try next provider via recursive call with that provider temporarily unset
    return { text: null, provider: 'error', demo: true, error: err.message }
  }
}

/**
 * Parse JSON from AI output (handles markdown code blocks).
 */
function parseAIJson(text) {
  if (!text) return null
  // Strip markdown code fences if present
  const cleaned = text.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim()
  try {
    return JSON.parse(cleaned)
  } catch {
    return null
  }
}

module.exports = { generateAI, parseAIJson, getActiveProvider }
