// Gemini API integration hook - Dynamic Model Discovery
import { useState, useCallback } from 'react';

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';

async function tryFetch(url, options, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.ok) return res;
      const err = await res.json();
      const msg = err.error?.message || '';
      if ((res.status === 429 || res.status === 503 || msg.includes('high demand') || msg.includes('quota')) && i < retries) {
        await new Promise(r => setTimeout(r, 2000 * (i + 1)));
        continue;
      }
      throw new Error(msg || `API error ${res.status}`);
    } catch (e) {
      if (i === retries) throw e;
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

export function useAI(apiKey) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Dynamically find available models
  const getBestModel = useCallback(async () => {
    try {
      const res = await fetch(`${GEMINI_BASE}/models?key=${apiKey}`);
      const data = await res.json();
      const models = data.models || [];
      // Pick first flash or pro model
      const preferred = models.find(m => m.name.includes('gemini-2.0-flash') || m.name.includes('gemini-1.5-flash') || m.name.includes('gemini-flash-latest'));
      if (preferred) return preferred.name.split('/').pop();
      return 'gemini-1.5-flash-latest'; // final fallback
    } catch (e) {
      return 'gemini-1.5-flash-latest'; // fallback if list fails
    }
  }, [apiKey]);

  const chat = useCallback(async (messages, systemPrompt = '') => {
    if (!apiKey) return 'Please set your Gemini API key in the Profile page.';
    setLoading(true);
    setError(null);
    try {
      const model = await getBestModel();
      const contents = [];
      if (systemPrompt) {
        contents.push({ role: 'user', parts: [{ text: `System instruction: ${systemPrompt}` }] });
        contents.push({ role: 'model', parts: [{ text: 'Understood.' }] });
      }
      messages.forEach(msg => {
        contents.push({ role: msg.role === 'user' ? 'user' : 'model', parts: [{ text: msg.content }] });
      });

      const body = JSON.stringify({ contents, generationConfig: { temperature: 0.7, maxOutputTokens: 1024 } });
      const response = await tryFetch(`${GEMINI_BASE}/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body
      });
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
    } catch (err) {
      setError(err.message);
      return `Error: ${err.message}`;
    } finally {
      setLoading(false);
    }
  }, [apiKey, getBestModel]);

  const analyzeImage = useCallback(async (base64Image, prompt) => {
    if (!apiKey) return 'Please set your Gemini API key in the Profile page.';
    setLoading(true);
    setError(null);
    try {
      const model = await getBestModel();
      const body = JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inlineData: { mimeType: 'image/jpeg', data: base64Image } }
          ]
        }]
      });
      const response = await tryFetch(`${GEMINI_BASE}/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body
      });
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
    } catch (err) {
      setError(err.message);
      return `Error: ${err.message}`;
    } finally {
      setLoading(false);
    }
  }, [apiKey, getBestModel]);

  return { chat, analyzeImage, loading, error };
}
