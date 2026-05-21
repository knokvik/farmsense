const CACHE_NAME = 'farmsense-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/index.css',
  '/public/favicon.svg',
  '/src/landing.js',
  '/src/dashboard.js',
  '/src/main.js',
  '/src/data/crops.js',
  '/src/data/soils.js',
  '/src/services/weather.js',
  '/src/services/location.js',
  '/src/services/advisory.js',
  '/src/services/prediction.js',
  '/src/components/predictionForm.js',
  '/src/charts/temperatureChart.js',
  '/src/charts/precipitationChart.js',
  '/src/charts/humidityWindChart.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Try network first for API calls, fallback to cache
  if (event.request.url.includes('api.open-meteo.com') || event.request.url.includes('geocoding-api')) {
    event.respondWith(
      fetch(event.request).then((response) => {
        const clonedResponse = response.clone();
        caches.open('farmsense-api-cache-v1').then((cache) => {
          cache.put(event.request, clonedResponse);
        });
        return response;
      }).catch(() => {
        return caches.match(event.request);
      })
    );
  } else {
    // Cache first for static assets, fallback to network
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== 'farmsense-api-cache-v1') {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
