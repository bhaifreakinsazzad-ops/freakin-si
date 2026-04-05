import { useState, useCallback, useRef } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface StreamOptions {
  conversationId: string;
  content: string;
  model?: string;
  token: string;
  onToken: (delta: string) => void;
  onDone: (fullText: string) => void;
  onError: (msg: string) => void;
}

export function useStreamingChat() {
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const streamMessage = useCallback(async (opts: StreamOptions) => {
    const { conversationId, content, model, token, onToken, onDone, onError } = opts;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsStreaming(true);
    let fullText = '';

    try {
      const res = await fetch(
        `${API_BASE}/chat/conversations/${conversationId}/stream`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content, model }),
          signal: controller.signal,
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Request failed' }));
        onError(err.error || 'Failed to send message');
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) { onError('Stream not available'); return; }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (raw === '[DONE]') { onDone(fullText); setIsStreaming(false); return; }
          try {
            const parsed = JSON.parse(raw);
            if (parsed.error) { onError(parsed.error); setIsStreaming(false); return; }
            if (parsed.delta) {
              fullText += parsed.delta;
              onToken(parsed.delta);
            }
          } catch (_) {}
        }
      }
      onDone(fullText);
    } catch (err: unknown) {
      if ((err as Error).name !== 'AbortError') {
        onError((err as Error).message || 'Stream error');
      }
    } finally {
      setIsStreaming(false);
    }
  }, []);

  const cancelStream = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
  }, []);

  return { streamMessage, isStreaming, cancelStream };
}
