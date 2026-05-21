/**
 * FarmSense — Location Service
 * GPS, Pincode, and Search with persistence
 */

const STORAGE_KEY = 'farmsense_location';

// ─── Get saved location ───
export function getSavedLocation() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return null;
}

// ─── Save location ───
export function saveLocation(location) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
  } catch { /* ignore */ }
}

// ─── Clear saved location ───
export function clearLocation() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch { /* ignore */ }
}

// ─── Get GPS position ───
export function getGPSPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('GPS not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error('Location permission denied. Please allow GPS access in your browser settings.'));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error('Location unavailable. Please try again or enter your location manually.'));
            break;
          case error.TIMEOUT:
            reject(new Error('Location request timed out. Please try again.'));
            break;
          default:
            reject(new Error('Could not get your location. Please enter it manually.'));
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000, // 5 min cache
      }
    );
  });
}

// ─── Reverse geocode (lat/lon → place name) ───
export async function reverseGeocode(lat, lon) {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=_&count=1&language=en&format=json`;
    // Open-Meteo doesn't have reverse geocoding, so we use a free alternative
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=10`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    if (data && data.address) {
      const a = data.address;
      const name = a.village || a.town || a.city || a.county || a.state_district || 'Your Location';
      const region = [a.state_district || a.county, a.state].filter(Boolean).join(', ');
      return { name, region };
    }
  } catch { /* fallback */ }
  return { name: 'Your Location', region: `${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E` };
}

// ─── Format coordinates for display ───
export function formatCoords(lat, lon) {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lon).toFixed(4)}°${lonDir}`;
}
