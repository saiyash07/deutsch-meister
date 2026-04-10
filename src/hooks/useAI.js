// Gemini API integration hook - v1.0.1
import { useState, useCallback } from 'react';

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash-lite', 'gemini-2.0-flash'];

async function tryFetch(url, options, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.ok) return res;
      const err = await res.json();
      const msg = err.error?.message || '';
      // If overloaded or rate limited, wait and retry
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

  const chat = useCallback(async (messages, systemPrompt = '') => {
    if (!apiKey) {
      return 'Please set your Gemini API key in the Profile page to use the AI features.';
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const contents = [];
      
      if (systemPrompt) {
        contents.push({
          role: 'user',
          parts: [{ text: `System instruction: ${systemPrompt}` }]
        });
        contents.push({
          role: 'model',
          parts: [{ text: 'Understood. I will follow these instructions.' }]
        });
      }
      
      messages.forEach(msg => {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        });
      });

      const body = JSON.stringify({
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
      });
      
      // Try each model until one works
      let lastError = '';
      for (const model of MODELS) {
        try {
          const response = await tryFetch(
            `${GEMINI_BASE}/${model}:generateContent?key=${apiKey}`,
            { method: 'POST', headers: { 'Content-Type': 'application/json' }, body }
          );
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) return text;
        } catch (e) {
          lastError = e.message;
          continue; // try next model
        }
      }
      
      throw new Error(lastError || 'All models failed');
    } catch (err) {
      setError(err.message);
      return `Error: ${err.message}`;
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  const analyzeImage = useCallback(async (base64Image, prompt) => {
    if (!apiKey) {
      return 'Please set your Gemini API key in the Profile page to use writing analysis.';
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const body = JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inlineData: { mimeType: 'image/jpeg', data: base64Image } }
          ]
        }]
      });

      let lastError = '';
      for (const model of MODELS) {
        try {
          const response = await tryFetch(
            `${GEMINI_BASE}/${model}:generateContent?key=${apiKey}`,
            { method: 'POST', headers: { 'Content-Type': 'application/json' }, body }
          );
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) return text;
        } catch (e) {
          lastError = e.message;
          continue;
        }
      }
      
      throw new Error(lastError || 'All models failed');
    } catch (err) {
      setError(err.message);
      return `Error: ${err.message}`;
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  return { chat, analyzeImage, loading, error };
}
