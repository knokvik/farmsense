/**
 * FarmSense — Prediction Form Component
 * Renders the farmer input form and prediction results
 */

import crops from '../data/crops.js';
import soils from '../data/soils.js';
import { IRRIGATION_METHODS, generatePrediction } from '../services/prediction.js';

/**
 * Render the prediction form into a container
 * @param {string} containerId
 * @param {function} onPredict - Callback receiving prediction params, returns { forecast, historical }
 */
export function initPredictionForm(containerId, onPredict) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = buildFormHTML();
  attachFormEvents(container, onPredict);
}

function buildFormHTML() {
  const cropOptions = crops.map(c =>
    `<option value="${c.id}">${c.emoji} ${c.name} (${c.season})</option>`
  ).join('');

  const soilOptions = soils.map(s =>
    `<option value="${s.id}">${s.emoji} ${s.name}</option>`
  ).join('');

  const irrigationOptions = Object.entries(IRRIGATION_METHODS).map(([key, m]) =>
    `<option value="${key}">${m.name}</option>`
  ).join('');

  return `
    <div class="prediction-form-card glass-card">
      <div class="pred-form-header">
        <span class="pred-form-icon">🧑‍🌾</span>
        <div>
          <h3 class="pred-form-title">Enter Your Farm Details</h3>
          <p class="pred-form-desc">Get AI-powered yield predictions based on real weather data</p>
        </div>
      </div>

      <form id="prediction-form" class="pred-form">
        <div class="pred-form-grid">
          <div class="form-group">
            <label for="pred-crop" class="form-label">🌾 Crop</label>
            <div class="select-wrap">
              <select id="pred-crop" class="form-select" required>
                <option value="">Select your crop</option>
                ${cropOptions}
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="pred-soil" class="form-label">🟤 Soil Type</label>
            <div class="select-wrap">
              <select id="pred-soil" class="form-select" required>
                <option value="">Select soil type</option>
                ${soilOptions}
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="pred-area" class="form-label">📐 Farm Area (Acres)</label>
            <input type="number" id="pred-area" class="form-input" min="0.1" max="1000" step="0.1" value="2" required />
          </div>

          <div class="form-group">
            <label for="pred-irrigation" class="form-label">💧 Irrigation Method</label>
            <div class="select-wrap">
              <select id="pred-irrigation" class="form-select" required>
                ${irrigationOptions}
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="pred-sowing" class="form-label">📅 Sowing Date</label>
            <input type="date" id="pred-sowing" class="form-input" required />
          </div>
        </div>

        <button type="submit" id="pred-submit-btn" class="pred-submit-btn">
          <span class="pred-btn-text">🔮 Generate Prediction</span>
          <span class="pred-btn-loading hidden">
            <span class="spinner"></span> Analyzing...
          </span>
        </button>
      </form>
    </div>

    <!-- Results Container -->
    <div id="prediction-results" class="prediction-results hidden"></div>
  `;
}

function attachFormEvents(container, onPredict) {
  const form = container.querySelector('#prediction-form');
  const sowingInput = container.querySelector('#pred-sowing');

  // Set default sowing date to 30 days ago
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() - 30);
  sowingInput.value = defaultDate.toISOString().split('T')[0];

  // Soil description tooltip
  const soilSelect = container.querySelector('#pred-soil');
  soilSelect.addEventListener('change', () => {
    const soil = soils.find(s => s.id === soilSelect.value);
    const existing = container.querySelector('.soil-hint');
    if (existing) existing.remove();
    if (soil) {
      const hint = document.createElement('p');
      hint.className = 'soil-hint';
      hint.textContent = soil.desc;
      soilSelect.closest('.form-group').appendChild(hint);
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const params = {
      cropId: container.querySelector('#pred-crop').value,
      soilId: container.querySelector('#pred-soil').value,
      area: parseFloat(container.querySelector('#pred-area').value),
      irrigation: container.querySelector('#pred-irrigation').value,
      sowingDate: container.querySelector('#pred-sowing').value,
    };

    if (!params.cropId || !params.soilId) {
      alert('Please select a crop and soil type');
      return;
    }

    const btnText = container.querySelector('.pred-btn-text');
    const btnLoading = container.querySelector('.pred-btn-loading');
    const submitBtn = container.querySelector('#pred-submit-btn');

    btnText.classList.add('hidden');
    btnLoading.classList.remove('hidden');
    submitBtn.disabled = true;

    try {
      const weatherData = await onPredict(params);
      const result = generatePrediction({
        ...params,
        forecast: weatherData.forecast,
        historical: weatherData.historical,
      });

      if (result.error) {
        alert(result.error);
        return;
      }

      renderResults(container, result);
    } catch (err) {
      console.error('Prediction error:', err);
      alert('Failed to generate prediction. Please set your location first.');
    } finally {
      btnText.classList.remove('hidden');
      btnLoading.classList.add('hidden');
      submitBtn.disabled = false;
    }
  });
}

function renderResults(container, result) {
  const resultsContainer = container.querySelector('#prediction-results');
  resultsContainer.innerHTML = '';
  resultsContainer.classList.remove('hidden');
  resultsContainer.classList.add('stagger-in');

  const { crop, soil, yieldPrediction, growthStage, weatherScore, soilScore, risks, reduction, recommendations, weatherSummary, irrigationMethod } = result;

  resultsContainer.innerHTML = `
    <!-- Weather Summary Strip -->
    <div class="pred-weather-strip glass-card">
      <div class="pws-item">
        <span class="pws-icon">${weatherSummary.dominantWeather.icon}</span>
        <span class="pws-label">${weatherSummary.dominantWeather.desc}</span>
      </div>
      <div class="pws-item">
        <span class="pws-icon">🌡️</span>
        <span class="pws-value">${weatherSummary.avgMaxTemp}° / ${weatherSummary.avgMinTemp}°</span>
      </div>
      <div class="pws-item">
        <span class="pws-icon">🌧️</span>
        <span class="pws-value">${weatherSummary.totalRain}mm</span>
        <span class="pws-label">${weatherSummary.rainyDays} rainy days</span>
      </div>
      <div class="pws-item">
        <span class="pws-icon">💨</span>
        <span class="pws-value">${weatherSummary.avgWind} km/h</span>
      </div>
    </div>

    <!-- Score Cards Row -->
    <div class="pred-scores-row">
      <!-- Yield Prediction Card -->
      <div class="pred-yield-card glass-card">
        <h3 class="pred-card-title">🌾 Predicted Yield</h3>
        <div class="yield-main">
          <span class="yield-value">${yieldPrediction.perAcre}</span>
          <span class="yield-unit">${yieldPrediction.unit}</span>
        </div>
        <div class="yield-range">
          Range: ${yieldPrediction.rangeLow} – ${yieldPrediction.rangeHigh} ${yieldPrediction.unit}
        </div>
        <div class="yield-total">
          Total for ${result.area} acres: <strong>${yieldPrediction.total} ${yieldPrediction.unit.replace('/acre', '')}</strong>
        </div>
        <div class="yield-confidence">
          <span class="conf-label">Confidence</span>
          <div class="conf-bar">
            <div class="conf-fill" style="width: ${yieldPrediction.confidence}%"></div>
          </div>
          <span class="conf-value">${yieldPrediction.confidence}%</span>
        </div>
        <div class="yield-multipliers">
          <div class="ym-item">
            <span class="ym-label">Weather</span>
            <span class="ym-value ${yieldPrediction.multipliers.weather >= 0.7 ? 'good' : 'bad'}">${(yieldPrediction.multipliers.weather * 100).toFixed(0)}%</span>
          </div>
          <div class="ym-item">
            <span class="ym-label">Soil</span>
            <span class="ym-value ${yieldPrediction.multipliers.soil >= 0.9 ? 'good' : 'bad'}">${(yieldPrediction.multipliers.soil * 100).toFixed(0)}%</span>
          </div>
          <div class="ym-item">
            <span class="ym-label">Irrigation</span>
            <span class="ym-value ${yieldPrediction.multipliers.irrigation >= 0.9 ? 'good' : 'bad'}">${(yieldPrediction.multipliers.irrigation * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>

      <!-- Reduction Card -->
      <div class="pred-reduction-card glass-card reduction-${reduction.severity}">
        <h3 class="pred-card-title">📉 Estimated Yield Reduction</h3>
        <div class="reduction-main">
          <div class="reduction-gauge" style="width:140px; height:140px; margin: 0 auto 20px; position:relative;">
            <svg viewBox="0 0 120 120" class="reduction-svg" style="width:100%; height:100%; transform: rotate(-90deg);">
              <circle cx="60" cy="60" r="50" class="reduction-bg-circle" fill="transparent" stroke="var(--border)" stroke-width="8"/>
              <circle cx="60" cy="60" r="50" class="reduction-fill-circle" fill="transparent" stroke="var(--red-500)" stroke-width="8" stroke-linecap="round"
                stroke-dasharray="314.16"
                stroke-dashoffset="${314.16 * (1 - reduction.totalPercent / 100)}" />
            </svg>
            <span class="reduction-value" style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); font-size:1.75rem; font-weight:800;">${reduction.totalPercent}%</span>
          </div>
          <div class="reduction-info">
            <span class="reduction-severity severity-badge-${reduction.severity}">${reduction.severity.toUpperCase()}</span>
            <p class="reduction-message">${reduction.message}</p>
          </div>
        </div>
        <div class="reduction-factors">
          ${reduction.factors.map(f => `
            <div class="rf-item">
              <span class="rf-icon">${f.icon}</span>
              <span class="rf-name">${f.name}</span>
              <span class="rf-value">-${f.value}%</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Growth Stage Timeline -->
    <div class="pred-growth-card glass-card">
      <h3 class="pred-card-title">🌱 Growth Stage Timeline</h3>
      <div class="growth-info">
        <div class="gi-item">
          <span class="gi-label">Current Stage</span>
          <span class="gi-value">${growthStage.currentStage}</span>
        </div>
        <div class="gi-item">
          <span class="gi-label">Days Since Sowing</span>
          <span class="gi-value">${growthStage.daysSinceSowing}</span>
        </div>
        <div class="gi-item">
          <span class="gi-label">Overall Progress</span>
          <span class="gi-value">${growthStage.overallProgress}%</span>
        </div>
        ${growthStage.isCritical ? '<div class="gi-critical">⚠️ CRITICAL GROWTH PERIOD</div>' : ''}
      </div>
      <div class="growth-timeline">
        ${growthStage.stages.map((s, i) => `
          <div class="gt-stage ${s.completed ? 'completed' : ''} ${s.current ? 'current' : ''}">
            <div class="gt-dot"></div>
            <div class="gt-label">${s.name}</div>
            <div class="gt-duration">${s.duration}d</div>
          </div>
        `).join('')}
      </div>
      <div class="growth-progress-bar">
        <div class="gpb-fill" style="width: ${growthStage.overallProgress}%"></div>
      </div>
    </div>

    <!-- Risk Assessment -->
    <div class="pred-risk-card glass-card">
      <h3 class="pred-card-title">⚡ Risk Assessment</h3>
      <div class="risk-grid">
        ${risks.map(r => `
          <div class="risk-item risk-${r.level}">
            <div class="ri-header">
              <span class="ri-icon">${r.icon}</span>
              <span class="ri-name">${r.name}</span>
              <span class="ri-badge badge-${r.level}">${r.level.toUpperCase()}</span>
            </div>
            <div class="ri-bar">
              <div class="ri-fill" style="width: ${r.score}%"></div>
            </div>
            <p class="ri-detail">${r.detail}</p>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Recommendations -->
    <div class="pred-recs-card glass-card">
      <h3 class="pred-card-title">📋 Recommendations</h3>
      <div class="recs-list">
        ${recommendations.map(r => `
          <div class="rec-item rec-${r.priority}">
            <div class="rec-header">
              <span class="rec-icon">${r.icon}</span>
              <span class="rec-title">${r.title}</span>
              <span class="rec-priority priority-${r.priority}">${r.priority.toUpperCase()}</span>
            </div>
            <p class="rec-body">${r.body}</p>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Score Summary -->
    <div class="pred-summary-row">
      <div class="ps-card glass-card">
        <span class="ps-icon">⛅</span>
        <span class="ps-label">Weather Score</span>
        <span class="ps-value">${weatherScore}/100</span>
      </div>
      <div class="ps-card glass-card">
        <span class="ps-icon">🟤</span>
        <span class="ps-label">Soil Score</span>
        <span class="ps-value">${soilScore}/100</span>
      </div>
      <div class="ps-card glass-card">
        <span class="ps-icon">💧</span>
        <span class="ps-label">Irrigation</span>
        <span class="ps-value">${irrigationMethod.name}</span>
      </div>
      <div class="ps-card glass-card">
        <span class="ps-icon">${crop.emoji}</span>
        <span class="ps-label">${crop.name}</span>
        <span class="ps-value">${crop.season}</span>
      </div>
    </div>
  `;

  // Animate reduction gauge
  requestAnimationFrame(() => {
    const fillCircle = resultsContainer.querySelector('.reduction-fill-circle');
    if (fillCircle) {
      fillCircle.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)';
    }
    // Animate risk bars
    resultsContainer.querySelectorAll('.ri-fill').forEach(fill => {
      const w = fill.style.width;
      fill.style.width = '0%';
      requestAnimationFrame(() => {
        fill.style.width = w;
      });
    });
    // Animate confidence bar
    const confFill = resultsContainer.querySelector('.conf-fill');
    if (confFill) {
      const w = confFill.style.width;
      confFill.style.width = '0%';
      requestAnimationFrame(() => {
        confFill.style.width = w;
      });
    }
    // Animate growth progress
    const gpbFill = resultsContainer.querySelector('.gpb-fill');
    if (gpbFill) {
      const w = gpbFill.style.width;
      gpbFill.style.width = '0%';
      requestAnimationFrame(() => {
        gpbFill.style.width = w;
      });
    }
  });

  // Scroll to results
  setTimeout(() => {
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 200);
}
