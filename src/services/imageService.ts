// Dynamic Image Service using Unsplash API & Curated Photo CDNs
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

const imageCache = new Map<string, string>();

/**
 * Dynamically fetches high-resolution travel photography based on a search query.
 * Falls back gracefully to curated CDN images if API keys are absent or rate limits apply.
 */
export async function fetchDynamicImage(query: string, fallbackUrl: string): Promise<string> {
  const cleanQuery = query.trim().toLowerCase();
  if (imageCache.has(cleanQuery)) {
    return imageCache.get(cleanQuery)!;
  }

  // 1. Try Unsplash API if key is present
  if (UNSPLASH_ACCESS_KEY && UNSPLASH_ACCESS_KEY !== 'YOUR_UNSPLASH_KEY') {
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=landscape&per_page=1`,
        {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
          }
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          const imgUrl = `${data.results[0].urls.regular}&auto=format&fit=crop&w=1400&q=80`;
          imageCache.set(cleanQuery, imgUrl);
          return imgUrl;
        }
      }
    } catch (err) {
      console.warn(`Unsplash API query error for "${query}":`, err);
    }
  }

  // 2. Try Pexels API if key is present
  if (PEXELS_API_KEY && PEXELS_API_KEY !== 'YOUR_PEXELS_KEY') {
    try {
      const res = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
        {
          headers: {
            Authorization: PEXELS_API_KEY
          }
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.photos && data.photos.length > 0) {
          const imgUrl = data.photos[0].src.large2x || data.photos[0].src.large;
          imageCache.set(cleanQuery, imgUrl);
          return imgUrl;
        }
      }
    } catch (err) {
      console.warn(`Pexels API query error for "${query}":`, err);
    }
  }

  // 3. High quality CDN lookup with specific query tag
  imageCache.set(cleanQuery, fallbackUrl);
  return fallbackUrl;
}
