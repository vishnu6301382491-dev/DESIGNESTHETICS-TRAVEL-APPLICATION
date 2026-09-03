// Vercel Serverless Function: Weather Proxy
// Securely proxies weather requests without exposing private server API keys in client bundles

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { lat, lon, q } = req.query;

  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (apiKey && apiKey !== 'YOUR_OPENWEATHER_API_KEY') {
    try {
      let url = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${apiKey}`;
      if (lat && lon) {
        url += `&lat=${lat}&lon=${lon}`;
      } else if (q) {
        url += `&q=${encodeURIComponent(q)}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        return res.status(200).json(data);
      }
    } catch (err) {
      console.error('OpenWeather proxy error:', err);
    }
  }

  // Fallback to Open-Meteo telemetry if no key or error
  if (lat && lon) {
    try {
      const fallbackUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,uv_index_max&timezone=auto`;
      const fallbackRes = await fetch(fallbackUrl);
      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json();
        return res.status(200).json({ source: 'open-meteo', ...fallbackData });
      }
    } catch (err) {
      console.error('Open-Meteo proxy error:', err);
    }
  }

  return res.status(500).json({ error: 'Weather information is temporarily unavailable.' });
}
