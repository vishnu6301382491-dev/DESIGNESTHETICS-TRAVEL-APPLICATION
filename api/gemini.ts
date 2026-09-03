// Vercel Serverless Function: Gemini AI Proxy
// Securely proxies Gemini API requests for chat and structured itinerary synthesis

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'YOUR_GEMINI_KEY') {
    return res.status(503).json({
      error: 'GEMINI_API_KEY is not configured on the server. Falling back to local assistant.',
      fallbackNeeded: true
    });
  }

  try {
    const { prompt, contents, generationConfig } = req.body;

    const geminiPayload = contents
      ? { contents, generationConfig: generationConfig || { temperature: 0.7 } }
      : {
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: generationConfig || { temperature: 0.7 }
        };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiPayload)
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: 'Gemini upstream error', details: errText });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err: any) {
    console.error('Gemini proxy error:', err);
    return res.status(500).json({ error: 'Internal server error while processing AI request', message: err?.message });
  }
}
