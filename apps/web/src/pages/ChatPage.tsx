import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { chatApi, modelsApi } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { useLang } from '@/contexts/LanguageContext'
import { CHAT_MODES, ChatModeId } from '@/contexts/ChatModeContext'
import { useStreamingChat } from '@/hooks/useStreamingChat'
import {
  Send, Plus, Trash2, MessageSquare, Copy, ChevronDown, Bot, User, Square,
} from 'lucide-react'
import { cn, formatDate, copyToClipboard } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'

interface Message      { id: string; role: 'user' | 'assistant'; content: string; model?: string; created_at: string }
interface Conversation { id: string; title: string; model: string; updated_at: string; pinned?: boolean }
interface Model        { id: string; name: string; provider: string; free: boolean }

export default function ChatPage() {
  const { conversationId } = useParams()
  const navigate            = useNavigate()
  const { user, refreshUser, token } = useAuth()
  const { t, lang }         = useLang()
  const { streamMessage, isStreaming, cancelStream } = useStreamingChat()

  const [conversations,    setConversations]    = useState<Conversation[]>([])
  const [messages,         setMessages]         = useState<Message[]>([])
  const [activeConv,       setActiveConv]       = useState<Conversation | null>(null)
  const [models,           setModels]           = useState<Model[]>([])
  const [selectedModel,    setSelectedModel]    = useState('groq/llama-3.3-70b-versatile')
  const [input,            setInput]            = useState('')
  const [showModelPicker,  setShowModelPicker]  = useState(false)
  const [streamingText,    setStreamingText]    = useState('')
  const [activeModeId,     setActiveModeId]     = useState<ChatModeId>('chat')

  const bottomRef   = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const activeMode = CHAT_MODES.find(m => m.id === activeModeId) ?? CHAT_MODES[0]

  useEffect(() => { loadConversations(); loadModels() }, [])
  useEffect(() => { if (conversationId) loadMessages(conversationId) }, [conversationId])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, streamingText])

  const loadConversations = async () => {
    try { const res = await chatApi.getConversations(); setConversations(res.data.conversations) } catch {}
  }

  const loadModels = async () => {
    try {
      const res = await modelsApi.getAll({ free: true })
      setModels(res.data.models.filter((m: Model) => m.free))
    } catch {}
  }

  const loadMessages = async (id: string) => {
    try {
      const res = await chatApi.getMessages(id)
      setMessages(res.data.messages)
      setActiveConv(res.data.conversation)
      setSelectedModel(res.data.conversation.model)
    } catch {}
  }

  const newConversation = async () => {
    try {
      const res = await chatApi.createConversation({ model: selectedModel })
      const conv = res.data.conversation
      setConversations(prev => [conv, ...prev])
      navigate(`/chat/${conv.id}`)
    } catch {}
  }

  const deleteConversation = async (id: string, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    await chatApi.deleteConversation(id)
    setConversations(prev => prev.filter(c => c.id !== id))
    if (conversationId === id) { setMessages([]); setActiveConv(null); navigate('/chat') }
  }

  const switchMode = async (modeId: ChatModeId) => {
    setActiveModeId(modeId)
    if (conversationId) {
      const mode = CHAT_MODES.find(m => m.id === modeId)
      try {
        await chatApi.updateConversation(conversationId, {
          chat_mode:     modeId,
          system_prompt: mode?.systemPrompt,
        })
      } catch {}
    }
  }

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isStreaming) return

    if (!conversationId) {
      // Create conversation first, then send
      try {
        const mode = CHAT_MODES.find(m => m.id === activeModeId)
        const res  = await chatApi.createConversation({
          model:         selectedModel,
          chat_mode:     activeModeId,
          system_prompt: mode?.systemPrompt,
        })
        const conv = res.data.conversation
        setConversations(prev => [conv, ...prev])
        navigate(`/chat/${conv.id}`)
        // After navigation the useEffect will re-trigger — store pending input
        setInput(input)
      } catch {}
      return
    }

    const content = input.trim()
    setInput('')
    textareaRef.current?.focus()

    // Optimistically add user message
    const tempUser: Message = { id: 'temp-user', role: 'user', content, created_at: new Date().toISOString() }
    setMessages(prev => [...prev, tempUser])
    setStreamingText('')

    const authToken = token || localStorage.getItem('ai_shala_token') || ''

    await streamMessage({
      conversationId,
      content,
      model: selectedModel,
      token: authToken,
      onToken: (delta) => setStreamingText(prev => prev + delta),
      onDone: (fullText) => {
        const aiMsg: Message = {
          id:         `ai-${Date.now()}`,
          role:       'assistant',
          content:    fullText,
          model:      selectedModel,
          created_at: new Date().toISOString(),
        }
        setMessages(prev => [
          ...prev.filter(m => m.id !== 'temp-user'),
          tempUser,
          aiMsg,
        ])
        setStreamingText('')
        loadConversations()
        refreshUser()
      },
      onError: (msg) => {
        setMessages(prev => [
          ...prev.filter(m => m.id !== 'temp-user'),
          tempUser,
          { id: 'err', role: 'assistant', content: `❌ ${msg}`, created_at: new Date().toISOString() },
        ])
        setStreamingText('')
      },
    })
  }, [input, isStreaming, conversationId, selectedModel, activeModeId, token, streamMessage, navigate, refreshUser])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const selectedModelInfo = models.find(m => m.id === selectedModel)

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── Conversations sidebar ── */}
      <div className="hidden lg:flex flex-col w-64 xl:w-72 border-r border-[var(--fsi-border)] glass overflow-hidden">
        <div className="p-3 border-b border-[var(--fsi-border)]">
          <button onClick={newConversation} className="btn-gold w-full flex items-center justify-center gap-2 py-2.5 text-sm">
            <Plus size={16} /> {t.chatNewChat}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.length === 0 && (
            <p className="text-[var(--fsi-text-muted)] text-sm text-center py-8">{t.chatNoConvs}</p>
          )}
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => navigate(`/chat/${conv.id}`)}
              className={cn(
                'w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between group transition-all',
                conversationId === conv.id
                  ? 'fsi-card-active text-[var(--fsi-gold)]'
                  : 'text-[var(--fsi-text-muted)] hover:bg-white/5 hover:text-[var(--fsi-text)]'
              )}
            >
              <div className="flex items-center gap-2 min-w-0">
                <MessageSquare size={14} className="shrink-0 opacity-60" />
                <span className="text-sm truncate">{conv.title}</span>
              </div>
              <button
                onClick={e => deleteConversation(conv.id, e)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity shrink-0"
              >
                <Trash2 size={12} />
              </button>
            </button>
          ))}
        </div>

        {/* Usage bar */}
        {user?.subscription === 'free' && (
          <div className="p-3 border-t border-[var(--fsi-border)]">
            <div className="flex justify-between text-xs text-[var(--fsi-text-muted)] mb-1.5">
              <span>{t.chatToday}</span>
              <span>{user.daily_usage}/{user.daily_limit}</span>
            </div>
            <div className="h-1.5 bg-[var(--fsi-surface-2)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(100, (user.daily_usage / user.daily_limit) * 100)}%`,
                  background: 'linear-gradient(90deg, var(--fsi-gold), var(--fsi-gold-glow))',
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Chat area ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--fsi-border)] glass-light shrink-0">
          <span className="text-[var(--fsi-gold)] font-medium text-sm font-display truncate max-w-[200px]">
            {activeConv?.title || t.chatNewChat}
          </span>

          {/* Model picker */}
          <div className="relative">
            <button
              onClick={() => setShowModelPicker(!showModelPicker)}
              className="flex items-center gap-2 text-xs bg-[var(--fsi-surface)] border border-[var(--fsi-border)] rounded-lg px-3 py-1.5 text-[var(--fsi-text-muted)] hover:border-[var(--fsi-border-hover)] transition-colors"
            >
              <Bot size={13} style={{ color: 'var(--fsi-gold)' }} />
              {selectedModelInfo?.name || selectedModel.split('/').pop()}
              <ChevronDown size={11} />
            </button>
            {showModelPicker && (
              <div className="absolute right-0 top-10 w-72 glass border border-[var(--fsi-border)] rounded-xl overflow-hidden z-50 shadow-2xl">
                <div className="p-2 border-b border-[var(--fsi-border)]">
                  <p className="text-xs text-[var(--fsi-text-muted)] px-2">{models.length} models available</p>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {models.map(m => (
                    <button
                      key={m.id}
                      onClick={() => { setSelectedModel(m.id); setShowModelPicker(false) }}
                      className={cn(
                        'w-full text-left px-3 py-2.5 flex items-center justify-between hover:bg-white/5 transition-colors',
                        selectedModel === m.id && 'bg-[rgba(255,182,40,0.08)] text-[var(--fsi-gold)]'
                      )}
                    >
                      <div>
                        <div className="text-sm font-medium">{m.name}</div>
                        <div className="text-xs text-[var(--fsi-text-muted)]">{m.provider}</div>
                      </div>
                      {selectedModel === m.id && (
                        <div className="w-2 h-2 rounded-full" style={{ background: 'var(--fsi-gold)' }} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Chat Mode Chips ── */}
        <div className="flex gap-2 px-4 py-2 border-b border-[var(--fsi-border)] overflow-x-auto scrollbar-none shrink-0">
          {CHAT_MODES.map(mode => (
            <button
              key={mode.id}
              onClick={() => switchMode(mode.id)}
              className={cn('mode-chip', activeModeId === mode.id && 'active')}
              style={activeModeId === mode.id ? { background: mode.color, borderColor: 'transparent' } : {}}
            >
              <span>{mode.icon}</span>
              <span>{lang === 'bn' ? mode.labelBn : mode.label}</span>
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {messages.length === 0 && !streamingText && (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-lg"
                style={{ background: activeMode.color + '22', border: `1px solid ${activeMode.color}44` }}
              >
                {activeMode.icon}
              </div>
              <h2 className="text-xl font-bold font-display mb-1" style={{ color: activeMode.color }}>
                {lang === 'bn' ? activeMode.labelBn : activeMode.label} Mode
              </h2>
              <p className="text-[var(--fsi-text-muted)] text-sm max-w-sm mb-6">{t.chatWelcomeSub}</p>
              <div className="grid grid-cols-2 gap-3 max-w-sm w-full">
                {[t.chatPrompt1, t.chatPrompt2, t.chatPrompt3, t.chatPrompt4].map(s => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
                    className="text-left text-xs glass rounded-lg px-3 py-2.5 text-[var(--fsi-text-muted)] hover:text-[var(--fsi-text)] transition-all"
                    style={{ borderColor: activeMode.color + '22' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map(msg => (
            <div key={msg.id} className={cn('flex gap-3 animate-fade-in', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
              {msg.role === 'assistant' && (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 text-xs font-bold"
                  style={{ background: activeMode.color + '22', border: `1px solid ${activeMode.color}44`, color: activeMode.color }}
                >
                  BS
                </div>
              )}
              <div className={cn('max-w-[80%] xl:max-w-[70%]', msg.role === 'user' ? 'message-user px-4 py-3' : 'message-ai px-4 py-3')}>
                {msg.role === 'assistant'
                  ? <div className="prose prose-invert prose-sm max-w-none"><ReactMarkdown>{msg.content}</ReactMarkdown></div>
                  : <p className="text-[var(--fsi-text)] whitespace-pre-wrap text-sm">{msg.content}</p>
                }
                <div className="flex items-center justify-between mt-2 gap-4">
                  <span className="text-xs text-[var(--fsi-text-dim)]">{msg.model?.split('/').pop() || ''}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--fsi-text-dim)]">{formatDate(msg.created_at)}</span>
                    <button onClick={() => copyToClipboard(msg.content)} className="text-[var(--fsi-text-dim)] hover:text-[var(--fsi-gold)] transition-colors">
                      <Copy size={12} />
                    </button>
                  </div>
                </div>
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-[var(--fsi-surface-2)] flex items-center justify-center text-[var(--fsi-text-muted)] shrink-0 mt-1 border border-[var(--fsi-border)]">
                  <User size={15} />
                </div>
              )}
            </div>
          ))}

          {/* Streaming message */}
          {isStreaming && streamingText && (
            <div className="flex gap-3 animate-fade-in">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 text-xs font-bold"
                style={{ background: activeMode.color + '22', border: `1px solid ${activeMode.color}44`, color: activeMode.color }}
              >
                BS
              </div>
              <div className="message-ai px-4 py-3 max-w-[80%] xl:max-w-[70%]">
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{streamingText}</ReactMarkdown>
                </div>
                <span className="stream-cursor" />
              </div>
            </div>
          )}

          {/* Typing indicator when streaming starts */}
          {isStreaming && !streamingText && (
            <div className="flex gap-3 animate-fade-in">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 text-xs font-bold"
                style={{ background: activeMode.color + '22', border: `1px solid ${activeMode.color}44`, color: activeMode.color }}
              >
                BS
              </div>
              <div className="message-ai px-4 py-3">
                <div className="flex items-center gap-1">
                  <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-[var(--fsi-border)] glass-light shrink-0">
          <div className="flex gap-3 items-end max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                className="w-full bg-[var(--fsi-surface)] border border-[var(--fsi-border)] focus:border-[var(--fsi-border-hover)] rounded-xl px-4 py-3 text-[var(--fsi-text)] placeholder-[var(--fsi-text-dim)] focus:outline-none resize-none transition-colors text-sm"
                placeholder={activeMode.icon + '  ' + (lang === 'bn' ? activeMode.labelBn : activeMode.label) + ' mode — ' + t.chatPlaceholder}
                style={{ maxHeight: '120px', height: 'auto' }}
                onInput={e => {
                  const el = e.target as HTMLTextAreaElement
                  el.style.height = 'auto'
                  el.style.height = Math.min(el.scrollHeight, 120) + 'px'
                }}
              />
            </div>
            {isStreaming ? (
              <button
                onClick={cancelStream}
                className="p-3 rounded-xl shrink-0 border transition-all"
                style={{ background: 'rgba(239,68,68,0.15)', borderColor: 'rgba(239,68,68,0.3)', color: '#f87171' }}
              >
                <Square size={20} />
              </button>
            ) : (
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="btn-gold p-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <Send size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      {showModelPicker && <div className="fixed inset-0 z-40" onClick={() => setShowModelPicker(false)} />}
    </div>
  )
}
