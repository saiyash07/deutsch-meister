// Vercel Serverless Function: api/ai.js
export default async function handler(req, res) {
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Master API Key not configured on server.' });
  }

  const { messages, systemPrompt, type, image, prompt } = req.body;
  const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';
  const model = 'gemini-1.5-flash'; // Fixed model for stability

  try {
    let payload;
    let endpoint = `${GEMINI_BASE}/models/${model}:generateContent?key=${apiKey}`;

    if (type === 'image') {
      // Handle Image Analysis
      payload = {
        contents: [{
          parts: [
            { text: prompt },
            { inlineData: { mimeType: 'image/jpeg', data: image } }
          ]
        }]
      };
    } else {
      // Handle Standard Chat
      const contents = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      if (systemPrompt && contents.length > 0) {
        contents[0].parts[0].text = `Instructions: ${systemPrompt}\n\nUser Question: ${contents[0].parts[0].text}`;
      }

      payload = {
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
      };
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || `Google API error: ${response.status}`);
    }

    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI.';
    res.status(200).json({ text: aiText });

  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({ error: error.message });
  }
}
