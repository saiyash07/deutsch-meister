// Gemini API integration hook - Proxied via Vercel for Security
import { useState, useCallback } from 'react';

export function useAI(userApiKey) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callProxy = useCallback(async (body) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Server error');
      return data.text;
    } catch (err) {
      setError(err.message);
      return `Error: ${err.message}`;
    } finally {
      setLoading(false);
    }
  }, []);

  const chat = useCallback(async (messages, systemPrompt = '') => {
    // If user has their own key, we could still support direct calls, 
    // but for 200 members, we'll default to the proxy.
    return await callProxy({ messages, systemPrompt });
  }, [callProxy]);

  const analyzeImage = useCallback(async (base64Image, prompt) => {
    return await callProxy({ type: 'image', image: base64Image, prompt });
  }, [callProxy]);

  return { chat, analyzeImage, loading, error };
}
