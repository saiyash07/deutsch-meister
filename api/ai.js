// Vercel Serverless Function: api/ai.js - Triple Fail-Safe Version
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'CRITICAL: GEMINI_API_KEY is missing in Vercel settings. Please add it and redeploy.' });
  }

  const { messages, systemPrompt, type, image, prompt } = req.body;
  
  // Try multiple configurations in order of stability
  const configs = [
    { base: 'v1beta', model: type === 'image' ? 'gemini-1.5-flash' : 'gemini-1.5-flash' },
    { base: 'v1', model: type === 'image' ? 'gemini-1.5-flash' : 'gemini-1.5-flash' },
    { base: 'v1', model: type === 'image' ? 'gemini-pro-vision' : 'gemini-pro' }
  ];

  let lastError = null;

  for (const config of configs) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/${config.base}/models/${config.model}:generateContent?key=${apiKey}`;
      
      let payload;
      if (type === 'image') {
        payload = {
          contents: [{
            parts: [
              { text: prompt },
              { inlineData: { mimeType: 'image/jpeg', data: image } }
            ]
          }]
        };
      } else {
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
      
      if (response.ok) {
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI.';
        return res.status(200).json({ text: aiText });
      } else {
        lastError = data.error?.message || `Error ${response.status}`;
        console.warn(`Config ${config.base}/${config.model} failed: ${lastError}`);
        continue; // Try next config
      }

    } catch (err) {
      lastError = err.message;
      continue;
    }
  }

  // If all configs failed
  res.status(500).json({ 
    error: `All AI configurations failed. Last error: ${lastError}. This usually means the API key is invalid or the 'Generative Language API' is not enabled in Google Cloud Console.` 
  });
}
