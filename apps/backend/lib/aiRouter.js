/**
 * Engine NotREAL - AI Provider Router
 * Uses direct HTTP calls so live providers work without extra SDK dependencies.
 */

const PROVIDER_ORDER = ['groq', 'google', 'openai', 'anthropic', 'mistral', 'together', 'deepseek', 'xai', 'perplexity']

function getActiveProvider() {
  if (process.env.GROQ_API_KEY) return 'groq'
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) return 'google'
  if (process.env.OPENAI_API_KEY) return 'openai'
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic'
  if (process.env.MISTRAL_API_KEY) return 'mistral'
  if (process.env.TOGETHER_API_KEY) return 'together'
  if (process.env.DEEPSEEK_API_KEY) return 'deepseek'
  if (process.env.XAI_API_KEY) return 'xai'
  if (process.env.PERPLEXITY_API_KEY) return 'perplexity'
  return null
}

async function callOpenAICompatible({ baseUrl, apiKey, model, systemPrompt, userPrompt, headers = {} }) {
  const response = await fetch(`${baseUrl.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  })

  if (!response.ok) {
    throw new Error(`Provider request failed with ${response.status}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}

async function callGroq(systemPrompt, userPrompt) {
  return callOpenAICompatible({
    baseUrl: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY,
    model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
    systemPrompt,
    userPrompt,
  })
}

async function callOpenAI(systemPrompt, userPrompt) {
  return callOpenAICompatible({
    baseUrl: 'https://api.openai.com/v1',
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    systemPrompt,
    userPrompt,
  })
}

async function callAnthropic(systemPrompt, userPrompt) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || 'claude-3-5-haiku-latest',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  })
  if (!response.ok) throw new Error(`Provider request failed with ${response.status}`)
  const data = await response.json()
  return data.content?.[0]?.text || ''
}

async function callGoogle(systemPrompt, userPrompt) {
  const model = process.env.GOOGLE_GENERATIVE_AI_MODEL || 'gemini-2.0-flash'
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GOOGLE_GENERATIVE_AI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    }),
  })
  if (!response.ok) throw new Error(`Provider request failed with ${response.status}`)
  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('') || ''
}

async function callMistral(systemPrompt, userPrompt) {
  return callOpenAICompatible({
    baseUrl: 'https://api.mistral.ai/v1',
    apiKey: process.env.MISTRAL_API_KEY,
    model: process.env.MISTRAL_MODEL || 'mistral-small-latest',
    systemPrompt,
    userPrompt,
  })
}

async function callTogether(systemPrompt, userPrompt) {
  return callOpenAICompatible({
    baseUrl: 'https://api.together.xyz/v1',
    apiKey: process.env.TOGETHER_API_KEY,
    model: process.env.TOGETHER_MODEL || 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
    systemPrompt,
    userPrompt,
  })
}

async function callDeepSeek(systemPrompt, userPrompt) {
  return callOpenAICompatible({
    baseUrl: 'https://api.deepseek.com/v1',
    apiKey: process.env.DEEPSEEK_API_KEY,
    model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
    systemPrompt,
    userPrompt,
  })
}

async function callXAI(systemPrompt, userPrompt) {
  return callOpenAICompatible({
    baseUrl: 'https://api.x.ai/v1',
    apiKey: process.env.XAI_API_KEY,
    model: process.env.XAI_MODEL || 'grok-3-mini',
    systemPrompt,
    userPrompt,
  })
}

async function callPerplexity(systemPrompt, userPrompt) {
  return callOpenAICompatible({
    baseUrl: 'https://api.perplexity.ai',
    apiKey: process.env.PERPLEXITY_API_KEY,
    model: process.env.PERPLEXITY_MODEL || 'sonar-pro',
    systemPrompt,
    userPrompt,
  })
}

async function generateAI(systemPrompt, userPrompt) {
  const provider = getActiveProvider()
  if (!provider) {
    return { text: null, provider: 'demo', demo: true }
  }

  try {
    let text = ''
    switch (provider) {
      case 'groq': text = await callGroq(systemPrompt, userPrompt); break
      case 'google': text = await callGoogle(systemPrompt, userPrompt); break
      case 'openai': text = await callOpenAI(systemPrompt, userPrompt); break
      case 'anthropic': text = await callAnthropic(systemPrompt, userPrompt); break
      case 'mistral': text = await callMistral(systemPrompt, userPrompt); break
      case 'together': text = await callTogether(systemPrompt, userPrompt); break
      case 'deepseek': text = await callDeepSeek(systemPrompt, userPrompt); break
      case 'xai': text = await callXAI(systemPrompt, userPrompt); break
      default: text = await callPerplexity(systemPrompt, userPrompt); break
    }
    return { text, provider, demo: false }
  } catch (error) {
    console.error(`[aiRouter] ${provider} failed:`, error.message)
    return { text: null, provider: 'error', demo: true, error: error.message }
  }
}

function parseAIJson(text) {
  if (!text) return null
  const cleaned = text.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim()
  try {
    return JSON.parse(cleaned)
  } catch {
    return null
  }
}

module.exports = { generateAI, parseAIJson, getActiveProvider }
