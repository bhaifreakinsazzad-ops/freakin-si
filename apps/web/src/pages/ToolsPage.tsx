import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { toolsApi } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { useLang } from '@/contexts/LanguageContext'
import { ALL_TOOLS as ALL_TOOLS_CONST, TOOL_CATEGORIES, CATEGORY_COLORS, ToolCategory } from '@/lib/toolConstants'
import { chatApi } from '@/lib/api'
import { Search, X, Play, Lock, Wrench } from 'lucide-react'
import { cn } from '@/lib/utils'
import * as Dialog from '@radix-ui/react-dialog'
import ReactMarkdown from 'react-markdown'

interface ApiTool { id: string; name: string; nameEn?: string; icon: string; category: string; description: string; free: boolean }

interface LocalTool {
  id: string; name: string; nameBn: string; icon: string; category: ToolCategory;
  description: string; descriptionBn: string; prompt: string; free: boolean;
}

// Merge API tools + local static tools, deduplicate by id
function mergeTools(apiTools: ApiTool[]): LocalTool[] {
  const apiIds = new Set(apiTools.map(t => t.id))
  const extras: LocalTool[] = ALL_TOOLS_CONST
    .filter(t => !apiIds.has(t.id))
    .map(t => ({ ...t, category: t.category as ToolCategory }))
  const mapped: LocalTool[] = apiTools.map(t => ({
    id: t.id, name: t.name, nameBn: t.name, icon: t.icon,
    category: t.category as ToolCategory, description: t.description,
    descriptionBn: t.description, prompt: '', free: t.free,
  }))
  return [...mapped, ...extras]
}

export default function ToolsPage() {
  const { user }   = useAuth()
  const { lang }   = useLang()
  const navigate   = useNavigate()

  const [apiTools,       setApiTools]       = useState<ApiTool[]>([])
  const [search,         setSearch]         = useState('')
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all'>('all')
  const [modalTool,      setModalTool]      = useState<LocalTool | null>(null)
  const [modalInput,     setModalInput]     = useState('')
  const [running,        setRunning]        = useState(false)
  const [result,         setResult]         = useState('')
  const [runError,       setRunError]       = useState('')

  useEffect(() => {
    toolsApi.getTools().then(res => setApiTools(res.data.tools || [])).catch(() => {})
  }, [])

  const allTools = useMemo(() => mergeTools(apiTools), [apiTools])

  const filtered = useMemo(() => {
    let list = activeCategory === 'all' ? allTools : allTools.filter(t => t.category === activeCategory)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.nameBn.includes(q) ||
        t.description.toLowerCase().includes(q)
      )
    }
    return list
  }, [allTools, activeCategory, search])

  const openModal = (tool: LocalTool) => {
    setModalTool(tool)
    setModalInput('')
    setResult('')
    setRunError('')
  }

  const runTool = async () => {
    if (!modalTool || !modalInput.trim() || running) return
    setRunning(true)
    setResult('')
    setRunError('')

    try {
      // Try backend tool API first
      const res = await toolsApi.runTool(modalTool.id, { input: modalInput })
      setResult(res.data.result)
    } catch (apiErr: any) {
      // If backend doesn't have this tool, open in chat with prompt
      if (apiErr.response?.status === 404 && modalTool.prompt) {
        const promptText = modalTool.prompt.replace('{input}', modalInput)
        // Create a new conversation and navigate to chat
        try {
          const res = await chatApi.createConversation({
            model: 'groq/llama-3.3-70b-versatile',
            chat_mode: 'chat',
          })
          const conv = res.data.conversation
          // Pre-fill: navigate to chat with the prompt stored in sessionStorage
          sessionStorage.setItem(`pending_msg_${conv.id}`, promptText)
          navigate(`/chat/${conv.id}`)
          setModalTool(null)
        } catch {
          setRunError('দুঃখিত, এই টুলটি চালু করতে সমস্যা হয়েছে।')
        }
      } else {
        setRunError(apiErr.response?.data?.error || 'টুল চালাতে সমস্যা হয়েছে।')
      }
    } finally {
      setRunning(false)
    }
  }

  const catColor = (cat: string) => CATEGORY_COLORS[cat as ToolCategory] ?? '#8B949E'

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: 'rgba(255,182,40,0.12)', border: '1px solid rgba(255,182,40,0.25)' }}>
            🛠️
          </div>
          <div>
            <h1 className="font-display text-xl font-bold" style={{ color: 'var(--fsi-gold)' }}>AI Tools</h1>
            <p className="text-xs text-[var(--fsi-text-muted)]">{allTools.length} specialized tools</p>
          </div>
        </div>

        {/* Search + Category chips */}
        <div className="space-y-3">
          <div className="relative max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--fsi-text-muted)]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search tools..."
              className="w-full bg-[var(--fsi-surface)] border border-[var(--fsi-border)] rounded-xl pl-9 pr-9 py-2.5 text-sm text-[var(--fsi-text)] placeholder-[var(--fsi-text-dim)] focus:outline-none focus:border-[var(--fsi-border-hover)] transition-colors"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--fsi-text-muted)] hover:text-[var(--fsi-text)]">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveCategory('all')}
              className={cn('cat-chip', activeCategory === 'all' && 'active')}
            >
              All ({allTools.length})
            </button>
            {TOOL_CATEGORIES.map(cat => {
              const count = allTools.filter(t => t.category === cat).length
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn('cat-chip', activeCategory === cat && 'active')}
                  style={activeCategory === cat ? { background: catColor(cat), borderColor: 'transparent', color: '#000' } : {}}
                >
                  {cat} ({count})
                </button>
              )
            })}
          </div>
        </div>

        {/* Tools grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-[var(--fsi-text-muted)]">
            <Wrench size={40} className="mx-auto mb-3 opacity-30" />
            <p>No tools found for "{search}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filtered.map(tool => {
              const color = catColor(tool.category)
              return (
                <button
                  key={tool.id}
                  onClick={() => openModal(tool)}
                  className="fsi-card shimmer-card p-4 text-left flex flex-col gap-2.5 group"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{ background: color + '18', border: `1px solid ${color}30` }}
                  >
                    {/* Try to render icon as emoji, fallback to text */}
                    {tool.icon.length <= 2 ? tool.icon : '🔧'}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-semibold text-[var(--fsi-text)] group-hover:text-[var(--fsi-gold)] transition-colors leading-tight">
                        {lang === 'bn' ? tool.nameBn : tool.name}
                      </span>
                      {!tool.free && <Lock size={10} className="text-amber-400 shrink-0" />}
                    </div>
                    <p className="text-xs text-[var(--fsi-text-muted)] mt-0.5 leading-tight line-clamp-2">
                      {lang === 'bn' ? tool.descriptionBn : tool.description}
                    </p>
                  </div>
                  <div
                    className="mt-auto text-xs font-medium px-2 py-0.5 rounded-full self-start"
                    style={{ background: color + '18', color }}
                  >
                    {tool.category}
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Tool Modal ── */}
      <Dialog.Root open={!!modalTool} onOpenChange={open => !open && setModalTool(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
          <Dialog.Content
            className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg glass rounded-2xl p-6 shadow-2xl"
            style={{ border: '1px solid var(--fsi-border-hover)' }}
          >
            {modalTool && (
              <>
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                      style={{ background: catColor(modalTool.category) + '18', border: `1px solid ${catColor(modalTool.category)}30` }}
                    >
                      {modalTool.icon.length <= 2 ? modalTool.icon : '🔧'}
                    </div>
                    <div>
                      <Dialog.Title className="font-display font-bold text-[var(--fsi-text)]">
                        {lang === 'bn' ? modalTool.nameBn : modalTool.name}
                      </Dialog.Title>
                      <p className="text-xs text-[var(--fsi-text-muted)]">
                        {lang === 'bn' ? modalTool.descriptionBn : modalTool.description}
                      </p>
                    </div>
                  </div>
                  <Dialog.Close className="text-[var(--fsi-text-muted)] hover:text-[var(--fsi-text)] p-1">
                    <X size={18} />
                  </Dialog.Close>
                </div>

                <textarea
                  value={modalInput}
                  onChange={e => setModalInput(e.target.value)}
                  rows={4}
                  autoFocus
                  placeholder={`Describe what you want for ${modalTool.name}...`}
                  className="w-full bg-[var(--fsi-surface)] border border-[var(--fsi-border)] focus:border-[var(--fsi-border-hover)] rounded-xl px-4 py-3 text-[var(--fsi-text)] placeholder-[var(--fsi-text-dim)] focus:outline-none resize-none text-sm mb-3"
                  onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) runTool() }}
                />

                {runError && (
                  <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2 mb-3">
                    {runError}
                  </div>
                )}

                {result ? (
                  <div className="space-y-3">
                    <div className="glass rounded-xl p-4 max-h-60 overflow-y-auto prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown>{result}</ReactMarkdown>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setResult(''); setModalInput('') }} className="flex-1 py-2 rounded-xl text-sm border border-[var(--fsi-border)] text-[var(--fsi-text-muted)] hover:border-[var(--fsi-border-hover)] transition-colors">
                        Try again
                      </button>
                      <button onClick={() => setModalTool(null)} className="flex-1 btn-gold py-2 rounded-xl text-sm">
                        Done
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs text-[var(--fsi-text-dim)]">Ctrl+Enter to run</p>
                    <button
                      onClick={runTool}
                      disabled={!modalInput.trim() || running}
                      className="btn-gold flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm disabled:opacity-40"
                    >
                      {running
                        ? <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Running...</>
                        : <><Play size={16} /> Run Tool</>
                      }
                    </button>
                  </div>
                )}
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
