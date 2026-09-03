// Vercel Serverless Function: Images Proxy
// Securely queries Unsplash / Pexels APIs without exposing API keys to the browser

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { query, provider = 'unsplash' } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Search query parameter is required.' });
  }

  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
  const pexelsKey = process.env.PEXELS_API_KEY;

  // 1. Try Unsplash if requested or available
  if (provider === 'unsplash' && unsplashKey && unsplashKey !== 'YOUR_UNSPLASH_KEY') {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=landscape&per_page=1`,
        {
          headers: { Authorization: `Client-ID ${unsplashKey}` }
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const photo = data.results[0];
          return res.status(200).json({
            imageUrl: `${photo.urls.regular}&auto=format&fit=crop&w=1400&q=80`,
            photographer: photo.user?.name,
            source: 'Unsplash'
          });
        }
      }
    } catch (err) {
      console.error('Unsplash serverless proxy error:', err);
    }
  }

  // 2. Try Pexels if requested or available
  if (pexelsKey && pexelsKey !== 'YOUR_PEXELS_KEY') {
    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
        {
          headers: { Authorization: pexelsKey }
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.photos && data.photos.length > 0) {
          const photo = data.photos[0];
          return res.status(200).json({
            imageUrl: photo.src.large2x || photo.src.large,
            photographer: photo.photographer,
            source: 'Pexels'
          });
        }
      }
    } catch (err) {
      console.error('Pexels serverless proxy error:', err);
    }
  }

  return res.status(404).json({ error: 'No dynamic image returned from provider, use fallback CDN.' });
}
