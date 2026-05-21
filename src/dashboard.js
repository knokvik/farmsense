/**
 * FarmSense — Dashboard Application
 * Manages tabs, weather data, advisory, and prediction modules
 */

import { fetchForecast, fetchHistorical, searchLocation, resolveCoords, getWeatherInfo } from './services/weather.js';
import { getGPSPosition, reverseGeocode, formatCoords, getSavedLocation, saveLocation, clearLocation } from './services/location.js';
import { generateAdvisory } from './services/advisory.js';
import crops from './data/crops.js';
import { renderTemperatureChart } from './charts/temperatureChart.js';
import { renderPrecipitationChart } from './charts/precipitationChart.js';
import { renderHumidityWindChart } from './charts/humidityWindChart.js';
import { initPredictionForm } from './components/predictionForm.js';

// ─── State ───
const state = {
  location: null,   // { lat, lon, name, region }
  forecast: null,
  historical: null,
  selectedCrop: '',
  activeTab: 'weather',
};

// ─── DOM References ───
const $ = id => document.getElementById(id);

// ─── Initialize ───
document.addEventListener('DOMContentLoaded', () => {
  initEventListeners();
  initTabs();
  populateCropSelect();
  initPredictionModule();

  // Check for saved location
  const saved = getSavedLocation();
  if (saved) {
    state.location = saved;
    showActiveLocation(saved);
    loadWeatherData(saved.lat, saved.lon);
  }
});

// ─── Tab System ───
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      switchTab(tab);
    });
  });
}

function switchTab(tabName) {
  state.activeTab = tabName;

  // Update buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  // Update content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.add('hidden');
  });

  const target = $(`tab-${tabName}`);
  if (target) {
    target.classList.remove('hidden');
    target.classList.add('fade-in');
  }
}

// ─── Event Listeners ───
function initEventListeners() {
  // GPS
  $('gps-btn').addEventListener('click', handleGPS);

  // Search
  const searchInput = $('location-search');
  let debounceTimer;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    const q = e.target.value.trim();
    if (q.length < 2) {
      hideSuggestions();
      return;
    }
    debounceTimer = setTimeout(() => handleSearch(q), 350);
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const q = searchInput.value.trim();
      if (q.length >= 2) handleSearch(q);
    }
  });

  $('search-btn').addEventListener('click', () => {
    const q = searchInput.value.trim();
    if (q.length >= 2) handleSearch(q);
  });

  // Close suggestions on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrap')) {
      hideSuggestions();
    }
  });

  // Change location
  $('change-location-btn').addEventListener('click', handleChangeLocation);

  // Crop select
  $('crop-select').addEventListener('change', (e) => {
    state.selectedCrop = e.target.value;
    if (state.forecast && state.selectedCrop) {
      renderAdvisory();
    }
  });

  // Retry
  $('retry-btn').addEventListener('click', () => {
    if (state.location) {
      loadWeatherData(state.location.lat, state.location.lon);
    }
  });
}

// ─── Prediction Module ───
function initPredictionModule() {
  initPredictionForm('prediction-container', async (params) => {
    if (!state.location) {
      throw new Error('Please set your location first');
    }

    // Return current weather data
    if (state.forecast) {
      return { forecast: state.forecast, historical: state.historical };
    }

    // Fetch if not available
    const [forecast, historical] = await Promise.all([
      fetchForecast(state.location.lat, state.location.lon),
      fetchHistorical(state.location.lat, state.location.lon).catch(() => null),
    ]);

    state.forecast = forecast;
    state.historical = historical;

    return { forecast, historical };
  });
}

// ─── GPS Handler ───
async function handleGPS() {
  const btn = $('gps-btn');
  const spinner = $('gps-spinner');
  btn.disabled = true;
  spinner.classList.remove('hidden');

  try {
    const pos = await getGPSPosition();
    const geo = await reverseGeocode(pos.lat, pos.lon);

    const location = {
      lat: pos.lat,
      lon: pos.lon,
      name: geo.name,
      region: geo.region,
    };

    state.location = location;
    saveLocation(location);
    showActiveLocation(location);
    loadWeatherData(location.lat, location.lon);
  } catch (err) {
    showError(err.message);
  } finally {
    btn.disabled = false;
    spinner.classList.add('hidden');
  }
}

// ─── Search Handler ───
async function handleSearch(query) {
  try {
    const results = await searchLocation(query);
    if (results.length === 0) {
      showSuggestions([{ name: 'No results found', region: 'Try a different search', noAction: true }]);
      return;
    }
    showSuggestions(results);
  } catch (err) {
    console.error('Search error:', err);
  }
}

function showSuggestions(results) {
  const container = $('search-suggestions');
  container.innerHTML = '';
  container.classList.remove('hidden');

  results.forEach(r => {
    const div = document.createElement('div');
    div.className = 'suggestion-item';
    div.innerHTML = `
      <span>📍</span>
      <div>
        <div class="suggestion-name">${r.name}</div>
        <div class="suggestion-region">${r.region || ''}</div>
      </div>
    `;
    if (!r.noAction) {
      div.addEventListener('click', () => selectSearchResult(r));
    }
    container.appendChild(div);
  });
}

function hideSuggestions() {
  $('search-suggestions').classList.add('hidden');
}

async function selectSearchResult(result) {
  hideSuggestions();
  $('location-search').value = '';

  try {
    const resolved = await resolveCoords(result);
    const location = {
      lat: resolved.lat,
      lon: resolved.lon,
      name: resolved.name,
      region: resolved.region,
    };

    state.location = location;
    saveLocation(location);
    showActiveLocation(location);
    loadWeatherData(location.lat, location.lon);
  } catch (err) {
    showError('Could not find coordinates for this location. Please try GPS or a different search.');
  }
}

// ─── Location Display ───
function showActiveLocation(location) {
  $('active-location').classList.remove('hidden');
  $('location-name').textContent = location.name;
  $('location-coords').textContent = formatCoords(location.lat, location.lon);
  $('dash-location-label').textContent = `📍 ${location.name}, ${location.region}`;
}

function handleChangeLocation() {
  clearLocation();
  state.location = null;
  state.forecast = null;
  state.historical = null;
  $('active-location').classList.add('hidden');
  $('quick-stats').classList.add('hidden');
  $('dashboard-tabs').classList.add('hidden');
  document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
  $('error-state').classList.add('hidden');
  $('location-search').value = '';
  $('location-search').focus();
  $('dash-location-label').textContent = 'Set your location to get started';
}

// ─── Load Weather Data ───
async function loadWeatherData(lat, lon) {
  showLoading(true);
  hideError();

  try {
    // Fetch forecast and historical in parallel
    const [forecast, historical] = await Promise.all([
      fetchForecast(lat, lon),
      fetchHistorical(lat, lon).catch(() => null),
    ]);

    state.forecast = forecast;
    state.historical = historical;

    showLoading(false);
    renderDashboard();
  } catch (err) {
    showLoading(false);
    showError(`Failed to fetch weather data: ${err.message}`);
    console.error('Weather fetch error:', err);
  }
}

// ─── Render Dashboard ───
function renderDashboard() {
  const { forecast, historical } = state;
  if (!forecast) return;

  // Show tabs
  $('dashboard-tabs').classList.remove('hidden');

  // Render weather tab
  renderQuickStats(forecast);
  renderTodayHighlight(forecast);
  renderForecastGrid(forecast);
  renderCharts(forecast);

  // Show the active tab
  switchTab(state.activeTab);

  if (state.selectedCrop) {
    renderAdvisory();
  }

  if (historical) {
    renderHistorical(forecast, historical);
  }

  // Re-init prediction form with fresh data
  initPredictionModule();
}

// ─── Quick Stats ───
function renderQuickStats(forecast) {
  if (!forecast.current) return;
  const c = forecast.current;

  $('stat-temp-val').textContent = `${Math.round(c.temperature_2m)}°C`;
  $('stat-humidity-val').textContent = `${c.relative_humidity_2m}%`;
  $('stat-rain-val').textContent = `${c.precipitation}mm`;
  $('stat-wind-val').textContent = `${Math.round(c.wind_speed_10m)} km/h`;
  $('quick-stats').classList.remove('hidden');
}

// ─── Today Highlight ───
function renderTodayHighlight(forecast) {
  const daily = forecast.daily;
  const current = forecast.current;

  if (!daily || !current) return;

  const weather = getWeatherInfo(current.weather_code);
  $('today-icon').textContent = weather.icon;
  $('today-temp').textContent = `${Math.round(current.temperature_2m)}°C`;
  $('today-condition').textContent = weather.desc;
  $('today-feels').textContent = `${Math.round(current.apparent_temperature)}°C`;
  $('today-humidity').textContent = `${current.relative_humidity_2m}%`;
  $('today-wind').textContent = `${Math.round(current.wind_speed_10m)} km/h`;
  $('today-uv').textContent = current.uv_index != null ? current.uv_index.toFixed(1) : '--';

  if (daily.sunrise?.[0]) {
    $('today-sunrise').textContent = formatTime(daily.sunrise[0]);
  }
  if (daily.sunset?.[0]) {
    $('today-sunset').textContent = formatTime(daily.sunset[0]);
  }

  $('forecast-location-label').textContent = state.location
    ? `${state.location.name}, ${state.location.region}`
    : '';
}

// ─── 7-Day Forecast Grid ───
function renderForecastGrid(forecast) {
  const daily = forecast.daily;
  if (!daily) return;

  const grid = $('forecast-grid');
  grid.innerHTML = '';
  grid.classList.add('stagger-in');

  const today = new Date().toISOString().split('T')[0];

  for (let i = 0; i < daily.time.length; i++) {
    const date = daily.time[i];
    const weather = getWeatherInfo(daily.weather_code[i]);
    const isToday = date === today;
    const dt = new Date(date + 'T00:00:00');
    const dayName = isToday ? 'Today' : dt.toLocaleDateString('en-IN', { weekday: 'short' });
    const dateLabel = dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    const rainProb = daily.precipitation_probability_max[i] || 0;

    const card = document.createElement('div');
    card.className = `forecast-card${isToday ? ' today' : ''}`;
    card.innerHTML = `
      <div class="fc-day">${dayName}</div>
      <div class="fc-date">${dateLabel}</div>
      <span class="fc-icon">${weather.icon}</span>
      <div class="fc-temp">${Math.round(daily.temperature_2m_max[i])}°</div>
      <div class="fc-temp-low">${Math.round(daily.temperature_2m_min[i])}°</div>
      <div class="fc-rain">💧 ${rainProb}%</div>
      <div class="fc-rain-bar">
        <div class="fc-rain-fill" style="width: ${rainProb}%"></div>
      </div>
    `;
    grid.appendChild(card);
  }
}

// ─── Charts ───
function renderCharts(forecast) {
  const daily = forecast.daily;
  if (!daily) return;

  renderTemperatureChart('temp-chart', daily);
  renderPrecipitationChart('precip-chart', daily);

  if (forecast.hourly) {
    renderHumidityWindChart('humidity-wind-chart', daily, forecast.hourly);
  }
}

// ─── Crop Advisory ───
function populateCropSelect() {
  const select = $('crop-select');
  crops.forEach(crop => {
    const opt = document.createElement('option');
    opt.value = crop.id;
    opt.textContent = `${crop.emoji} ${crop.name}`;
    select.appendChild(opt);
  });
}

function renderAdvisory() {
  if (!state.forecast || !state.selectedCrop) {
    $('advisory-cards').innerHTML = `
      <div class="advice-card severity-safe">
        <div class="advice-header">
          <span class="advice-icon">🌱</span>
          <span class="advice-title">Select a crop above to get personalized farming advice</span>
        </div>
      </div>
    `;
    $('best-days-panel').classList.add('hidden');
    $('risk-score-card').classList.add('hidden');
    return;
  }

  const result = generateAdvisory(state.selectedCrop, state.forecast);

  // Advisory cards
  const cardsContainer = $('advisory-cards');
  cardsContainer.innerHTML = '';
  cardsContainer.classList.add('stagger-in');

  result.advisories.forEach(adv => {
    const severityClass = `severity-${adv.severity}`;
    const badgeClass = `badge-${adv.severity}`;
    const badgeLabel = adv.severity === 'safe' ? 'Safe' : adv.severity === 'caution' ? 'Caution' : 'Alert';

    const card = document.createElement('div');
    card.className = `advice-card ${severityClass}`;
    card.innerHTML = `
      <div class="advice-header">
        <span class="advice-icon">${adv.icon}</span>
        <span class="advice-title">${adv.title}</span>
        <span class="advice-badge ${badgeClass}">${badgeLabel}</span>
      </div>
      <p class="advice-body">${adv.body}</p>
      <ul class="advice-actions">
        ${adv.actions.map(a => `<li class="advice-action">${a}</li>`).join('')}
      </ul>
    `;
    cardsContainer.appendChild(card);
  });

  // Best days
  if (result.bestDays.length > 0) {
    const bdGrid = $('best-days-grid');
    bdGrid.innerHTML = '';
    bdGrid.classList.add('stagger-in');

    result.bestDays.forEach(bd => {
      const card = document.createElement('div');
      card.className = 'best-day-card';
      card.innerHTML = `
        <div class="bd-activity">${bd.emoji} ${bd.activity}</div>
        <div class="bd-day">${bd.day}</div>
        <div class="bd-reason">${bd.reason}</div>
      `;
      bdGrid.appendChild(card);
    });

    $('best-days-panel').classList.remove('hidden');
  } else {
    $('best-days-panel').classList.add('hidden');
  }

  // Risk score
  const riskCard = $('risk-score-card');
  const riskFill = $('risk-fill');
  const riskValue = $('risk-value');
  const riskDesc = $('risk-desc');

  riskValue.textContent = result.riskScore;
  riskDesc.textContent = result.riskDesc;

  // Remove old classes
  riskFill.classList.remove('low', 'medium', 'high');
  riskFill.classList.add(result.riskLevel);

  // Animate risk fill
  riskFill.style.width = '0%';
  riskCard.classList.remove('hidden');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      riskFill.style.width = `${result.riskScore}%`;
    });
  });
}

// ─── Historical Comparison ───
function renderHistorical(forecast, historical) {
  const grid = $('historical-grid');
  const section = $('historical-section');
  if (!grid || !section || !historical?.daily || !forecast?.daily) return;

  grid.innerHTML = '';
  grid.classList.add('stagger-in');

  const currentDaily = forecast.daily;
  const histDaily = historical.daily;

  const metrics = [
    {
      title: '🌡️ Avg Max Temperature',
      currentVal: avg(currentDaily.temperature_2m_max),
      histVal: avg(histDaily.temperature_2m_max),
      unit: '°C',
      precision: 1,
    },
    {
      title: '🌡️ Avg Min Temperature',
      currentVal: avg(currentDaily.temperature_2m_min),
      histVal: avg(histDaily.temperature_2m_min),
      unit: '°C',
      precision: 1,
    },
    {
      title: '🌧️ Total Rainfall',
      currentVal: sum(currentDaily.precipitation_sum),
      histVal: sum(histDaily.precipitation_sum),
      unit: 'mm',
      precision: 1,
    },
    {
      title: '💨 Max Wind Speed',
      currentVal: Math.max(...(currentDaily.wind_speed_10m_max || [0])),
      histVal: Math.max(...(histDaily.wind_speed_10m_max || [0])),
      unit: 'km/h',
      precision: 0,
    },
  ];

  metrics.forEach(m => {
    const diff = m.currentVal - m.histVal;
    const absDiff = Math.abs(diff).toFixed(m.precision);
    const direction = diff > 0.5 ? 'up' : diff < -0.5 ? 'down' : 'neutral';
    const arrow = diff > 0.5 ? '↑' : diff < -0.5 ? '↓' : '→';
    const label = diff > 0.5 ? `+${absDiff} ${m.unit}` : diff < -0.5 ? `-${absDiff} ${m.unit}` : 'Similar';

    const card = document.createElement('div');
    card.className = 'historical-card';
    card.innerHTML = `
      <div class="hc-title">${m.title}</div>
      <div class="hc-compare">
        <div class="hc-year">
          <span class="hc-year-label">This Year</span>
          <span class="hc-year-value">${m.currentVal.toFixed(m.precision)}${m.unit}</span>
        </div>
        <div class="hc-year">
          <span class="hc-year-label">Last Year</span>
          <span class="hc-year-value">${m.histVal.toFixed(m.precision)}${m.unit}</span>
        </div>
      </div>
      <span class="hc-diff ${direction}">${arrow} ${label}</span>
    `;
    grid.appendChild(card);
  });

  section.classList.remove('hidden');
}

// ─── UI Helpers ───
function showLoading(show) {
  $('loading-state').classList.toggle('hidden', !show);
  if (show) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    $('dashboard-tabs').classList.add('hidden');
    $('error-state').classList.add('hidden');
  }
}

function showError(message) {
  $('error-message').textContent = message;
  $('error-state').classList.remove('hidden');
}

function hideError() {
  $('error-state').classList.add('hidden');
}

function formatTime(isoTime) {
  const d = new Date(isoTime);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function avg(arr) {
  if (!arr || arr.length === 0) return 0;
  return arr.reduce((s, v) => s + (v || 0), 0) / arr.length;
}

function sum(arr) {
  if (!arr) return 0;
  return arr.reduce((s, v) => s + (v || 0), 0);
}
