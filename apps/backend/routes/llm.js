const axios = require('axios');

/**
 * Central LLM caller — supports Groq, Gemini, OpenRouter, Cohere
 * Model ID format: "provider/model-name"
 */
async function callLLM(modelId, messages, systemPrompt = null) {
  const parts    = modelId.split('/');
  const provider = parts[0];

  const allMessages = systemPrompt
    ? [{ role: 'system', content: systemPrompt }, ...messages]
    : messages;

  try {
    switch (provider) {
      case 'groq':        return await callGroq(parts.slice(1).join('/'), allMessages);
      case 'gemini':      return await callGemini(parts.slice(1).join('/'), allMessages);
      case 'openrouter':  return await callOpenRouter(parts.slice(1).join('/'), allMessages);
      case 'cohere':      return await callCohere(parts.slice(1).join('/'), allMessages);
      default:
        return 'দুঃখিত, এই মডেলটি সংযুক্ত নয়।';
    }
  } catch (err) {
    console.error(`LLM error [${modelId}]:`, err?.response?.data || err.message);
    const msg = err?.response?.data?.error?.message
             || err?.response?.data?.message
             || err.message
             || 'Unknown error';
    throw new Error(msg);
  }
}

/**
 * Streaming version — writes SSE chunks to Express response object.
 * Emits: data: {"delta":"..."}\n\n  and finally  data: [DONE]\n\n
 */
async function callLLMStream(modelId, messages, systemPrompt, res) {
  const parts    = modelId.split('/');
  const provider = parts[0];

  const allMessages = systemPrompt
    ? [{ role: 'system', content: systemPrompt }, ...messages]
    : messages;

  try {
    switch (provider) {
      case 'groq':
        return await streamGroq(parts.slice(1).join('/'), allMessages, res);
      case 'openrouter':
        return await streamOpenRouter(parts.slice(1).join('/'), allMessages, res);
      case 'gemini':
        return await streamGemini(parts.slice(1).join('/'), allMessages, res);
      case 'cohere':
        // Cohere streaming uses different protocol — fall back to non-streaming + fake stream
        return await fakeStream(await callCohere(parts.slice(1).join('/'), allMessages), res);
      default:
        res.write(`data: ${JSON.stringify({ delta: 'দুঃখিত, এই মডেলটি সংযুক্ত নয়।' })}\n\n`);
        res.write('data: [DONE]\n\n');
    }
  } catch (err) {
    console.error(`LLM stream error [${modelId}]:`, err?.message);
    const msg = err?.response?.data?.error?.message || err.message || 'Unknown error';
    res.write(`data: ${JSON.stringify({ error: msg })}\n\n`);
    res.write('data: [DONE]\n\n');
  }
}

// ── Groq (OpenAI-compatible streaming) ───────────────────────────────────────
async function callGroq(model, messages) {
  const response = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    { model, messages, temperature: 0.7, max_tokens: 4096 },
    {
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      timeout: 30000,
    }
  );
  return response.data.choices[0].message.content;
}

async function streamGroq(model, messages, res) {
  const response = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    { model, messages, temperature: 0.7, max_tokens: 4096, stream: true },
    {
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      responseType: 'stream',
      timeout: 60000,
    }
  );
  return pipeOpenAIStream(response.data, res);
}

// ── OpenRouter (OpenAI-compatible streaming) ─────────────────────────────────
async function callOpenRouter(model, messages) {
  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    { model, messages, temperature: 0.7, max_tokens: 4096 },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.FRONTEND_URL || 'https://freakin-si.com',
        'X-Title': 'Freakin SI',
        'Content-Type': 'application/json',
      },
      timeout: 60000,
    }
  );
  return response.data.choices[0].message.content;
}

async function streamOpenRouter(model, messages, res) {
  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    { model, messages, temperature: 0.7, max_tokens: 4096, stream: true },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.FRONTEND_URL || 'https://freakin-si.com',
        'X-Title': 'Freakin SI',
        'Content-Type': 'application/json',
      },
      responseType: 'stream',
      timeout: 60000,
    }
  );
  return pipeOpenAIStream(response.data, res);
}

// ── Google Gemini ─────────────────────────────────────────────────────────────
const GEMINI_MODEL_MAP = {
  'gemini-2.0-flash-exp': 'gemini-2.0-flash',
  'gemini-2.0-flash':     'gemini-2.0-flash',
  'gemini-1.5-flash':     'gemini-1.5-flash',
  'gemini-1.5-flash-8b':  'gemini-1.5-flash-8b',
  'gemini-1.5-pro':       'gemini-1.5-pro',
};

async function callGemini(rawModel, messages) {
  const model = GEMINI_MODEL_MAP[rawModel] || rawModel;
  const url   = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const systemMsg = messages.find(m => m.role === 'system');
  const convMsgs  = messages.filter(m => m.role !== 'system');

  const body = {
    contents: convMsgs.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
    generationConfig: { maxOutputTokens: 4096, temperature: 0.7 },
  };
  if (systemMsg) body.systemInstruction = { parts: [{ text: systemMsg.content }] };

  const response = await axios.post(url, body, { timeout: 30000 });
  return response.data.candidates[0].content.parts[0].text;
}

async function streamGemini(rawModel, messages, res) {
  const model = GEMINI_MODEL_MAP[rawModel] || rawModel;
  const url   = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?key=${process.env.GEMINI_API_KEY}&alt=sse`;

  const systemMsg = messages.find(m => m.role === 'system');
  const convMsgs  = messages.filter(m => m.role !== 'system');

  const body = {
    contents: convMsgs.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
    generationConfig: { maxOutputTokens: 4096, temperature: 0.7 },
  };
  if (systemMsg) body.systemInstruction = { parts: [{ text: systemMsg.content }] };

  const response = await axios.post(url, body, {
    headers: { 'Content-Type': 'application/json' },
    responseType: 'stream',
    timeout: 60000,
  });

  return new Promise((resolve, reject) => {
    let buffer = '';
    response.data.on('data', chunk => {
      buffer += chunk.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const raw = line.slice(6).trim();
        if (!raw || raw === '[DONE]') continue;
        try {
          const parsed = JSON.parse(raw);
          const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) res.write(`data: ${JSON.stringify({ delta: text })}\n\n`);
        } catch (_) {}
      }
    });
    response.data.on('end', () => { res.write('data: [DONE]\n\n'); resolve(); });
    response.data.on('error', reject);
  });
}

// ── Cohere ────────────────────────────────────────────────────────────────────
const COHERE_MODEL_MAP = {
  'command-r':      'command-r-08-2024',
  'command-r-plus': 'command-r-plus-08-2024',
};

async function callCohere(rawModel, messages) {
  const model       = COHERE_MODEL_MAP[rawModel] || rawModel;
  const chatHistory = messages.slice(0, -1).map(m => ({
    role:    m.role === 'user' ? 'USER' : 'CHATBOT',
    message: m.content,
  }));
  const lastMessage = messages[messages.length - 1].content;

  const response = await axios.post(
    'https://api.cohere.ai/v1/chat',
    { model, chat_history: chatHistory, message: lastMessage, temperature: 0.7 },
    {
      headers: { Authorization: `Bearer ${process.env.COHERE_API_KEY}`, 'Content-Type': 'application/json' },
      timeout: 30000,
    }
  );
  return response.data.text;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Parse OpenAI-format SSE stream and emit our normalized format */
function pipeOpenAIStream(stream, res) {
  return new Promise((resolve, reject) => {
    let buffer = '';
    stream.on('data', chunk => {
      buffer += chunk.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const raw = line.slice(6).trim();
        if (raw === '[DONE]') { res.write('data: [DONE]\n\n'); continue; }
        try {
          const parsed = JSON.parse(raw);
          const delta  = parsed.choices?.[0]?.delta?.content;
          if (delta)  res.write(`data: ${JSON.stringify({ delta })}\n\n`);
        } catch (_) {}
      }
    });
    stream.on('end', () => { res.write('data: [DONE]\n\n'); resolve(); });
    stream.on('error', reject);
  });
}

/** For providers without streaming — simulate word-by-word output */
async function fakeStream(text, res) {
  const words = text.split(' ');
  for (const word of words) {
    res.write(`data: ${JSON.stringify({ delta: word + ' ' })}\n\n`);
    await new Promise(r => setTimeout(r, 15));
  }
  res.write('data: [DONE]\n\n');
}

module.exports = { callLLM, callLLMStream };
