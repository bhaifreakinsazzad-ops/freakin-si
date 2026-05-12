// Engine NotREAL — AI Model Registry
// Add models here; the AI router will pick the first available provider

export interface ModelDef {
  id: string
  label: string
  provider: 'groq' | 'openai' | 'anthropic' | 'google' | 'mistral' | 'together' | 'openrouter' | 'deepseek' | 'xai' | 'perplexity'
  contextWindow: number
  strengths: string[]
  free: boolean
}

export const MODEL_REGISTRY: ModelDef[] = [
  // ── Groq (fast, free tier) ───────────────────────────────────────────────
  { id: 'groq/llama-3.3-70b-versatile', label: 'Llama 3.3 70B (Groq)', provider: 'groq', contextWindow: 128000, strengths: ['general', 'business', 'fast'], free: true },
  { id: 'groq/llama-3.1-8b-instant',    label: 'Llama 3.1 8B (Groq)',   provider: 'groq', contextWindow: 131072, strengths: ['fast', 'light'],               free: true },
  { id: 'groq/mixtral-8x7b-32768',      label: 'Mixtral 8x7B (Groq)',   provider: 'groq', contextWindow: 32768,  strengths: ['coding', 'analysis'],           free: true },

  // ── OpenAI ───────────────────────────────────────────────────────────────
  { id: 'gpt-4o',        label: 'GPT-4o',       provider: 'openai', contextWindow: 128000, strengths: ['reasoning', 'vision'],  free: false },
  { id: 'gpt-4o-mini',   label: 'GPT-4o Mini',  provider: 'openai', contextWindow: 128000, strengths: ['fast', 'cheap'],        free: false },
  { id: 'gpt-4-turbo',   label: 'GPT-4 Turbo',  provider: 'openai', contextWindow: 128000, strengths: ['long-form', 'coding'],  free: false },

  // ── Anthropic ────────────────────────────────────────────────────────────
  { id: 'claude-sonnet-4-6',  label: 'Claude Sonnet 4.6',  provider: 'anthropic', contextWindow: 200000, strengths: ['reasoning', 'writing', 'business'], free: false },
  { id: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5', provider: 'anthropic', contextWindow: 200000, strengths: ['fast', 'cheap'], free: false },

  // ── Google ───────────────────────────────────────────────────────────────
  { id: 'gemini-2.0-flash',   label: 'Gemini 2.0 Flash',  provider: 'google', contextWindow: 1000000, strengths: ['multimodal', 'long-context'], free: false },
  { id: 'gemini-1.5-pro',     label: 'Gemini 1.5 Pro',    provider: 'google', contextWindow: 2000000, strengths: ['analysis', 'coding'],        free: false },

  // ── Mistral ──────────────────────────────────────────────────────────────
  { id: 'mistral-large-latest',  label: 'Mistral Large',  provider: 'mistral', contextWindow: 131072, strengths: ['european', 'multilingual'], free: false },
  { id: 'mistral-small-latest',  label: 'Mistral Small',  provider: 'mistral', contextWindow: 131072, strengths: ['fast', 'cheap'],            free: false },

  // ── Together / Open Source ────────────────────────────────────────────────
  { id: 'together/meta-llama/Llama-3.3-70B-Instruct-Turbo', label: 'Llama 3.3 70B Turbo (Together)', provider: 'together', contextWindow: 128000, strengths: ['general'], free: false },
  { id: 'together/deepseek-ai/DeepSeek-V3',                  label: 'DeepSeek V3 (Together)',         provider: 'together', contextWindow: 163840, strengths: ['coding', 'reasoning'], free: false },

  // ── DeepSeek ─────────────────────────────────────────────────────────────
  { id: 'deepseek-chat', label: 'DeepSeek Chat', provider: 'deepseek', contextWindow: 65536, strengths: ['coding', 'reasoning'], free: false },
  { id: 'deepseek-reasoner', label: 'DeepSeek R1', provider: 'deepseek', contextWindow: 65536, strengths: ['math', 'logic'], free: false },

  // ── xAI Grok ─────────────────────────────────────────────────────────────
  { id: 'grok-3',      label: 'Grok 3',      provider: 'xai', contextWindow: 131072, strengths: ['real-time', 'twitter'], free: false },
  { id: 'grok-3-mini', label: 'Grok 3 Mini', provider: 'xai', contextWindow: 131072, strengths: ['fast'],                free: false },

  // ── Perplexity ───────────────────────────────────────────────────────────
  { id: 'sonar-pro',    label: 'Perplexity Sonar Pro',  provider: 'perplexity', contextWindow: 127072, strengths: ['search', 'real-time'], free: false },
  { id: 'sonar-reasoning-pro', label: 'Perplexity Sonar Reasoning Pro', provider: 'perplexity', contextWindow: 127072, strengths: ['reasoning', 'search'], free: false },
]

export const DEFAULT_MODEL = MODEL_REGISTRY[0] // Groq Llama — free, fast
export const PREFERRED_PROVIDERS = ['groq', 'google', 'openai', 'anthropic', 'mistral', 'together', 'deepseek', 'xai', 'perplexity'] as const
