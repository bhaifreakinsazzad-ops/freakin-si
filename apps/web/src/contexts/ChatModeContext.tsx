import { createContext, useContext, useState, ReactNode } from 'react';

export const CHAT_MODES = [
  { id: 'chat',      label: 'General',   labelBn: 'সাধারণ',   icon: '💬', color: '#FFB628', systemPrompt: 'You are Freakin SI, a helpful and intelligent Synthetic Intelligence assistant. Be knowledgeable, friendly, and speak clearly in English or Bengali as requested.' },
  { id: 'code',      label: 'Code',      labelBn: 'কোড',      icon: '💻', color: '#8B5CF6', systemPrompt: 'You are Freakin SI in Code Mode — an expert software engineer. Write clean, efficient, well-commented code. Always explain what the code does. Support all major languages.' },
  { id: 'creative',  label: 'Creative',  labelBn: 'ক্রিয়েটিভ',icon: '🎨', color: '#EC4899', systemPrompt: 'You are Freakin SI in Creative Mode — a creative writing assistant with vivid imagination. Help with stories, poems, scripts, and imaginative content. Be expressive and original.' },
  { id: 'math',      label: 'Math',      labelBn: 'গণিত',     icon: '🧮', color: '#00E676', systemPrompt: 'You are Freakin SI in Math Mode — an expert mathematics tutor. Solve problems step-by-step, show all working clearly, and explain concepts in simple terms.' },
  { id: 'translate', label: 'Translate', labelBn: 'অনুবাদ',   icon: '🌐', color: '#3B82F6', systemPrompt: 'You are Freakin SI in Translate Mode — an expert multilingual translator fluent in 150+ languages with special expertise in Bengali, English, Hindi, Arabic, Spanish. Provide accurate, natural translations.' },
  { id: 'write',     label: 'Write',     labelBn: 'লেখা',     icon: '✍️', color: '#F59E0B', systemPrompt: 'You are Freakin SI in Write Mode — a professional writing coach and content creator. Help with emails, essays, blog posts, and all forms of written content. Focus on clarity and structure.' },
] as const;

export type ChatModeId = typeof CHAT_MODES[number]['id'];
export type ChatMode   = typeof CHAT_MODES[number];

interface ChatModeContextType {
  mode:    ChatMode;
  modeId:  ChatModeId;
  setMode: (id: ChatModeId) => void;
}

const ChatModeContext = createContext<ChatModeContextType | null>(null);

export function ChatModeProvider({ children }: { children: ReactNode }) {
  const [modeId, setModeId] = useState<ChatModeId>('chat');
  const mode = CHAT_MODES.find(m => m.id === modeId) ?? CHAT_MODES[0];

  const setMode = (id: ChatModeId) => setModeId(id);

  return (
    <ChatModeContext.Provider value={{ mode, modeId, setMode }}>
      {children}
    </ChatModeContext.Provider>
  );
}

export function useChatMode() {
  const ctx = useContext(ChatModeContext);
  if (!ctx) throw new Error('useChatMode must be inside ChatModeProvider');
  return ctx;
}
