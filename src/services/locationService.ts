import { UserLocation } from '../types/travel';

export const GLOBAL_GATEWAYS: UserLocation[] = [
  { city: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278, isCustom: true },
  { city: 'New York', country: 'United States', lat: 40.7128, lng: -74.0060, isCustom: true },
  { city: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, isCustom: true },
  { city: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, isCustom: true },
  { city: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lng: 55.2708, isCustom: true },
  { city: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, isCustom: true },
  { city: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, isCustom: true },
  { city: 'San Francisco', country: 'United States', lat: 37.7749, lng: -122.4194, isCustom: true },
  { city: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050, isCustom: true },
  { city: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777, isCustom: true },
  { city: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832, isCustom: true },
  { city: 'São Paulo', country: 'Brazil', lat: -23.5505, lng: -46.6333, isCustom: true },
];

/**
 * Calculates great-circle distance between two points in kilometers using Haversine formula
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Formats distance in km or miles
 */
export function formatDistance(km: number): string {
  if (km >= 1000) {
    return `${(km / 1000).toFixed(1)}k km`;
  }
  return `${km.toLocaleString()} km`;
}

/**
 * Attempts to reverse geocode lat/lng to City and Country
 */
export async function reverseGeocode(lat: number, lng: number): Promise<{ city: string; country: string }> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'DesignEstheticsTravelApp/1.0'
        }
      }
    );

    if (res.ok) {
      const data = await res.json();
      const addr = data.address;
      const city = addr.city || addr.town || addr.municipality || addr.state || 'Local Region';
      const country = addr.country || 'Global';
      return { city, country };
    }
  } catch (err) {
    console.warn('Reverse geocoding error:', err);
  }

  return { city: 'Detected Location', country: 'Your Region' };
}

/**
 * Request user location via browser Geolocation API
 */
export function requestBrowserLocation(): Promise<UserLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const { city, country } = await reverseGeocode(latitude, longitude);
        resolve({
          lat: latitude,
          lng: longitude,
          city,
          country,
          isCustom: false
        });
      },
      (error) => {
        reject(error);
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  });
}
