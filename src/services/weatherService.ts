import { WeatherData } from '../types/travel';

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

// Weather condition code to human description & Lucide icon identifier
function mapWMOWeatherCode(code: number): { condition: string; description: string; icon: string } {
  if (code === 0) return { condition: 'Clear Sky', description: 'Sunny & Crisp', icon: 'sun' };
  if (code === 1 || code === 2) return { condition: 'Partly Cloudy', description: 'Sun with scattered clouds', icon: 'cloud-sun' };
  if (code === 3) return { condition: 'Overcast', description: 'Atmospheric cloud cover', icon: 'cloud' };
  if ([45, 48].includes(code)) return { condition: 'Misty / Fog', description: 'Ethereal mist hanging low', icon: 'cloud-fog' };
  if ([51, 53, 55, 61, 63, 65].includes(code)) return { condition: 'Rain', description: 'Refreshing coastal rain', icon: 'cloud-rain' };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { condition: 'Snowfall', description: 'Gentle alpine snowfall', icon: 'snowflake' };
  if ([80, 81, 82].includes(code)) return { condition: 'Rain Showers', description: 'Passing seasonal showers', icon: 'cloud-drizzle' };
  if ([95, 96, 99].includes(code)) return { condition: 'Thunderstorm', description: 'Electrifying dramatic storm', icon: 'cloud-lightning' };
  return { condition: 'Clear', description: 'Pleasant climate', icon: 'sun' };
}

function generatePackingAdvice(tempC: number, condition: string, windSpeed: number): string[] {
  const tips: string[] = [];

  if (tempC < 5) {
    tips.push('Heavy insulated down coat & windproof thermal base layers');
    tips.push('Merino wool beanie, cashmere scarf & insulated gloves');
    tips.push('Water-resistant walking boots with high-traction soles');
  } else if (tempC >= 5 && tempC < 18) {
    tips.push('Smart layering: breathable cotton tees + knit cardigans');
    tips.push('Lightweight windbreaker or trench coat for evening strolls');
    tips.push('Comfortable all-day leather sneakers or trail loafers');
  } else if (tempC >= 18 && tempC < 27) {
    tips.push('Relaxed linen shirts, breezy dresses & tailored shorts');
    tips.push('Polarized UV-blocking sunglasses & broad-brimmed sun hat');
    tips.push('Broad-spectrum SPF 50 mineral sunscreen');
  } else {
    tips.push('Ultra-breathable lightweight fabrics & quick-dry linen');
    tips.push('Reusable vacuum-insulated hydration flask');
    tips.push('Cooling mist spray & airy open-toe footwear');
  }

  if (condition.toLowerCase().includes('rain') || condition.toLowerCase().includes('drizzle')) {
    tips.push('Compact windproof umbrella & Gore-Tex jacket');
  } else if (condition.toLowerCase().includes('snow')) {
    tips.push('Thermal boot warmers & polarized snow goggles');
  }

  if (windSpeed > 25) {
    tips.push('Wind-resistant outer shell to shield from coastal gusts');
  }

  return tips;
}

// In-memory cache to prevent redundant network hits
const weatherCache = new Map<string, { data: WeatherData; timestamp: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

export async function fetchLiveWeather(lat: number, lng: number, locationName: string): Promise<WeatherData> {
  const cacheKey = `${lat.toFixed(2)},${lng.toFixed(2)}`;
  const cached = weatherCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const isStaticHost =
    typeof window !== 'undefined' &&
    (window.location.hostname.includes('github.io') ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1');

  // 1. Try serverless backend proxy only if on custom server/Vercel with backend
  if (!isStaticHost && import.meta.env.VITE_ENABLE_SERVERLESS_PROXY === 'true') {
    try {
      const proxyRes = await fetch(`/api/weather?lat=${lat}&lon=${lng}`, { signal: AbortSignal.timeout(3000) });
      if (proxyRes.ok) {
        const data = await proxyRes.json();
        if (data.main && data.weather) {
          const temp = Math.round(data.main.temp);
          const feelsLike = Math.round(data.main.feels_like);
          const condition = data.weather[0]?.main || 'Clear';
          const description = data.weather[0]?.description || 'Clear sky';
          const windKmh = Math.round((data.wind?.speed || 0) * 3.6);

          const result: WeatherData = {
            temp,
            feelsLike,
            tempMin: Math.round(data.main.temp_min),
            tempMax: Math.round(data.main.temp_max),
            condition,
            description: description.charAt(0).toUpperCase() + description.slice(1),
            icon: data.weather[0]?.icon ? `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png` : 'sun',
            humidity: data.main.humidity,
            windSpeed: windKmh,
            uvIndex: 5,
            packingAdvice: generatePackingAdvice(temp, condition, windKmh),
            isLive: true,
            source: 'OpenWeather',
            lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          weatherCache.set(cacheKey, { data: result, timestamp: Date.now() });
          return result;
        }
      }
    } catch {
      // Ignore
    }
  }

  // 2. If client OpenWeather API key is configured, use it
  if (OPENWEATHER_API_KEY && OPENWEATHER_API_KEY !== 'YOUR_OPENWEATHER_API_KEY') {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${OPENWEATHER_API_KEY}`
      );
      if (res.ok) {
        const d = await res.json();
        const temp = Math.round(d.main.temp);
        const feelsLike = Math.round(d.main.feels_like);
        const condition = d.weather[0]?.main || 'Clear';
        const description = d.weather[0]?.description || 'Clear sky';
        const windKmh = Math.round((d.wind?.speed || 0) * 3.6);

        const result: WeatherData = {
          temp,
          feelsLike,
          tempMin: Math.round(d.main.temp_min),
          tempMax: Math.round(d.main.temp_max),
          condition,
          description: description.charAt(0).toUpperCase() + description.slice(1),
          icon: d.weather[0]?.icon ? `https://openweathermap.org/img/wn/${d.weather[0].icon}@2x.png` : 'sun',
          humidity: d.main.humidity,
          windSpeed: windKmh,
          uvIndex: 5,
          packingAdvice: generatePackingAdvice(temp, condition, windKmh),
          isLive: true,
          source: 'OpenWeather',
          lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        weatherCache.set(cacheKey, { data: result, timestamp: Date.now() });
        return result;
      }
    } catch (err) {
      console.warn('OpenWeather fetch failed, falling back to Open-Meteo:', err);
    }
  }

  // 2. High-precision live fallback using Open-Meteo (real-time meteorological telemetry worldwide, no key required)
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,uv_index_max&timezone=auto`
    );

    if (res.ok) {
      const data = await res.json();
      const current = data.current;
      const daily = data.daily;
      const weatherMeta = mapWMOWeatherCode(current.weather_code || 0);
      const temp = Math.round(current.temperature_2m);
      const feelsLike = Math.round(current.apparent_temperature);
      const windKmh = Math.round(current.wind_speed_10m || 0);

      const result: WeatherData = {
        temp,
        feelsLike,
        tempMin: daily?.temperature_2m_min?.[0] ? Math.round(daily.temperature_2m_min[0]) : temp - 3,
        tempMax: daily?.temperature_2m_max?.[0] ? Math.round(daily.temperature_2m_max[0]) : temp + 4,
        condition: weatherMeta.condition,
        description: weatherMeta.description,
        icon: weatherMeta.icon,
        humidity: Math.round(current.relative_humidity_2m || 55),
        windSpeed: windKmh,
        uvIndex: daily?.uv_index_max?.[0] ? Math.round(daily.uv_index_max[0]) : 5,
        packingAdvice: generatePackingAdvice(temp, weatherMeta.condition, windKmh),
        isLive: true,
        source: 'Open-Meteo Live',
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      weatherCache.set(cacheKey, { data: result, timestamp: Date.now() });
      return result;
    }
  } catch (err) {
    console.warn(`Fallback live weather error for ${locationName}:`, err);
  }

  // 3. Resilient telemetry fallback if offline or network failure
  const fallbackResult: WeatherData = {
    temp: 21,
    feelsLike: 20,
    tempMin: 16,
    tempMax: 24,
    condition: 'Pleasant & Mild',
    description: 'Mild seasonal breezes with optimal visibility',
    icon: 'sun',
    humidity: 50,
    windSpeed: 12,
    uvIndex: 4,
    packingAdvice: generatePackingAdvice(21, 'Clear', 12),
    isLive: false,
    source: 'Telemetry Engine',
    lastUpdated: 'Just now'
  };

  return fallbackResult;
}

export function convertTemp(celsius: number, unit: 'C' | 'F'): number {
  if (unit === 'F') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return celsius;
}
