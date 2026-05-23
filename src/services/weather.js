/**
 * FarmSense — Weather Service
 * Integrates Open-Meteo Forecast + Historical APIs
 */

const FORECAST_BASE = 'https://api.open-meteo.com/v1/forecast';
const HISTORICAL_BASE = 'https://archive-api.open-meteo.com/v1/archive';
const GEOCODING_BASE = 'https://geocoding-api.open-meteo.com/v1/search';

const HOURLY_PARAMS = [
  'temperature_2m',
  'relative_humidity_2m',
  'precipitation',
  'precipitation_probability',
  'weather_code',
  'wind_speed_10m',
  'wind_direction_10m',
  'apparent_temperature',
  'uv_index',
  'soil_temperature_6cm',
  'soil_moisture_3_to_9cm',
].join(',');

const DAILY_PARAMS = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'apparent_temperature_max',
  'apparent_temperature_min',
  'sunrise',
  'sunset',
  'precipitation_sum',
  'precipitation_probability_max',
  'wind_speed_10m_max',
  'wind_direction_10m_dominant',
  'uv_index_max',
  'et0_fao_evapotranspiration',
].join(',');

const HISTORICAL_HOURLY = [
  'temperature_2m',
  'relative_humidity_2m',
  'precipitation',
  'wind_speed_10m',
].join(',');

const HISTORICAL_DAILY = [
  'temperature_2m_max',
  'temperature_2m_min',
  'precipitation_sum',
  'wind_speed_10m_max',
].join(',');

// ─── Cache ───
const CACHE_KEY = 'farmsense_cache';
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

function getCached(key) {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    const entry = cache[key];
    if (entry && Date.now() - entry.ts < CACHE_TTL) {
      return entry.data;
    }
  } catch { /* ignore */ }
  return null;
}

function setCache(key, data) {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    cache[key] = { data, ts: Date.now() };
    // Keep cache from growing too large
    const keys = Object.keys(cache);
    if (keys.length > 20) {
      delete cache[keys[0]];
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch { /* ignore */ }
}

// ─── Fetch with retry ───
async function fetchJSON(url, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8-second timeout
    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.reason || `HTTP ${res.status}`);
      }
      return await res.json();
    } catch (e) {
      clearTimeout(timeoutId);
      if (i === retries) throw e;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
}

// ─── Weather Code → Emoji + Description ───
const WEATHER_CODES = {
  0: { icon: '☀️', desc: 'Clear sky' },
  1: { icon: '🌤️', desc: 'Mainly clear' },
  2: { icon: '⛅', desc: 'Partly cloudy' },
  3: { icon: '☁️', desc: 'Overcast' },
  45: { icon: '🌫️', desc: 'Foggy' },
  48: { icon: '🌫️', desc: 'Rime fog' },
  51: { icon: '🌦️', desc: 'Light drizzle' },
  53: { icon: '🌦️', desc: 'Moderate drizzle' },
  55: { icon: '🌦️', desc: 'Dense drizzle' },
  56: { icon: '🌧️', desc: 'Freezing drizzle' },
  57: { icon: '🌧️', desc: 'Heavy freezing drizzle' },
  61: { icon: '🌧️', desc: 'Slight rain' },
  63: { icon: '🌧️', desc: 'Moderate rain' },
  65: { icon: '🌧️', desc: 'Heavy rain' },
  66: { icon: '🌧️', desc: 'Light freezing rain' },
  67: { icon: '🌧️', desc: 'Heavy freezing rain' },
  71: { icon: '🌨️', desc: 'Slight snowfall' },
  73: { icon: '🌨️', desc: 'Moderate snowfall' },
  75: { icon: '🌨️', desc: 'Heavy snowfall' },
  77: { icon: '🌨️', desc: 'Snow grains' },
  80: { icon: '🌦️', desc: 'Slight showers' },
  81: { icon: '🌧️', desc: 'Moderate showers' },
  82: { icon: '⛈️', desc: 'Violent showers' },
  85: { icon: '🌨️', desc: 'Slight snow showers' },
  86: { icon: '🌨️', desc: 'Heavy snow showers' },
  95: { icon: '⛈️', desc: 'Thunderstorm' },
  96: { icon: '⛈️', desc: 'Thunderstorm + hail' },
  99: { icon: '⛈️', desc: 'Thunderstorm + heavy hail' },
};

export function getWeatherInfo(code) {
  return WEATHER_CODES[code] || { icon: '🌡️', desc: 'Unknown' };
}

// ─── Fetch 7-day forecast ───
export async function fetchForecast(lat, lon) {
  const cacheKey = `forecast_${lat.toFixed(2)}_${lon.toFixed(2)}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const url = `${FORECAST_BASE}?latitude=${lat}&longitude=${lon}` +
    `&hourly=${HOURLY_PARAMS}` +
    `&daily=${DAILY_PARAMS}` +
    `&timezone=Asia%2FKolkata` +
    `&forecast_days=7` +
    `&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,apparent_temperature,uv_index`;

  const data = await fetchJSON(url);
  setCache(cacheKey, data);
  return data;
}

// ─── Fetch historical (same week last year) ───
export async function fetchHistorical(lat, lon) {
  const cacheKey = `historical_${lat.toFixed(2)}_${lon.toFixed(2)}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const now = new Date();
  const lastYear = new Date(now);
  lastYear.setFullYear(lastYear.getFullYear() - 1);

  const endDate = new Date(lastYear);
  endDate.setDate(endDate.getDate() + 6);

  const fmt = d => d.toISOString().split('T')[0];

  const url = `${HISTORICAL_BASE}?latitude=${lat}&longitude=${lon}` +
    `&start_date=${fmt(lastYear)}` +
    `&end_date=${fmt(endDate)}` +
    `&daily=${HISTORICAL_DAILY}` +
    `&hourly=${HISTORICAL_HOURLY}` +
    `&timezone=Asia%2FKolkata`;

  const data = await fetchJSON(url);
  setCache(cacheKey, data);
  return data;
}

// ─── Geocoding search ───
export async function searchLocation(query) {
  if (!query || query.length < 2) return [];

  // Check if it's a pincode (6 digits for India)
  if (/^\d{6}$/.test(query.trim())) {
    return searchByPincode(query.trim());
  }

  const url = `${GEOCODING_BASE}?name=${encodeURIComponent(query)}&count=6&language=en&format=json`;
  const data = await fetchJSON(url);
  return (data.results || []).map(r => ({
    name: r.name,
    region: [r.admin1, r.country].filter(Boolean).join(', '),
    lat: r.latitude,
    lon: r.longitude,
    country: r.country,
  }));
}

// ─── Pincode lookup ───
async function searchByPincode(pincode) {
  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const data = await res.json();
    if (data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
      // Get unique districts
      const seen = new Set();
      return data[0].PostOffice
        .filter(po => {
          const key = `${po.District}_${po.State}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        })
        .slice(0, 5)
        .map(po => ({
          name: po.Name,
          region: `${po.District}, ${po.State}`,
          lat: null, // Pincode API doesn't give coords - will use geocoding
          lon: null,
          pincode,
          district: po.District,
          state: po.State,
        }));
    }
  } catch { /* fallback to geocoding */ }

  // Fallback: Search pincode as text via geocoding
  return searchLocation(pincode + ' India');
}

// ─── Resolve coordinates for pincode results ───
export async function resolveCoords(location) {
  if (location.lat && location.lon) return location;

  // Use geocoding to find coords from name
  const query = `${location.name} ${location.district || ''} ${location.state || ''} India`;
  const results = await searchLocation(query);
  if (results.length > 0 && results[0].lat) {
    return { ...location, lat: results[0].lat, lon: results[0].lon };
  }
  throw new Error('Could not resolve coordinates for this location');
}
