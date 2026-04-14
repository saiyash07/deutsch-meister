// Gemini API integration hook - Universal Smart Discovery
import { useState, useCallback } from 'react';

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1';

async function tryFetch(url, options, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.ok) return res;
      const err = await res.json();
      const msg = err.error?.message || '';
      
      // Handle quota or server busy errors with backoff
      if ((res.status === 429 || res.status === 503 || msg.toLowerCase().includes('quota') || msg.toLowerCase().includes('limit')) && i < retries) {
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

  // ULTIMATE SOLUTION: Smart Discovery
  const getBestModel = useCallback(async () => {
    try {
      // 1. Try to list models to see exactly what this key supports
      const res = await fetch(`${GEMINI_BASE}/models?key=${apiKey}`);
      const data = await res.json();
      const models = data.models || [];
      
      const modelNames = models.map(m => m.name.split('/').pop());
      
      // 2. Prioritize the most stable free-tier models in order
      const priorityOrder = [
        'gemini-1.5-flash',
        'gemini-1.5-flash-latest',
        'gemini-1.5-flash-001',
        'gemini-1.5-flash-002',
        'gemini-1.0-pro',
        'gemini-pro'
      ];

      for (const name of priorityOrder) {
        if (modelNames.includes(name)) return name;
      }
      
      // 3. If list matches nothing, return default
      return modelNames[0] || 'gemini-1.5-flash';
    } catch (e) {
      // 4. Final safety fallback
      return 'gemini-1.5-flash';
    }
  }, [apiKey]);

  const chat = useCallback(async (messages, systemPrompt = '') => {
    if (!apiKey) return 'Please set your Gemini API key in the Profile page.';
    setLoading(true);
    setError(null);
    try {
      const model = await getBestModel();
      const contents = [];
      
      // Adapt messages for Gemini format
      messages.forEach(msg => {
        contents.push({ role: msg.role === 'user' ? 'user' : 'model', parts: [{ text: msg.content }] });
      });

      // Prepare payload
      const payload = { 
        contents, 
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 } 
      };
      
      // Add system instruction if supported version/model (or prepend to first message)
      if (systemPrompt && contents.length > 0) {
        contents[0].parts[0].text = `Instructions: ${systemPrompt}\n\nUser Question: ${contents[0].parts[0].text}`;
      }

      const response = await tryFetch(`${GEMINI_BASE}/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI.';
    } catch (err) {
      setError(err.message);
      return `Error: ${err.message}`;
    } finally {
      setLoading(false);
    }
  }, [apiKey, getBestModel]);

  // Standard Image Analysis
  const analyzeImage = useCallback(async (base64Image, prompt) => {
    if (!apiKey) return 'Please set your Gemini API key in the Profile page.';
    setLoading(true);
    setError(null);
    try {
      const model = await getBestModel();
      const payload = {
        contents: [{
          parts: [
            { text: prompt },
            { inlineData: { mimeType: 'image/jpeg', data: base64Image } }
          ]
        }]
      };
      const response = await tryFetch(`${GEMINI_BASE}/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
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
