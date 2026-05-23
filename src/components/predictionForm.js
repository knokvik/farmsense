/**
 * FarmSense — Prediction Form Component
 * Renders the farmer input form and prediction results
 */

import crops from '../data/crops.js';
import soils from '../data/soils.js';
import { IRRIGATION_METHODS, generatePrediction } from '../services/prediction.js';
import { calculateFinancials, formatCurrency } from '../services/market.js';
import { t } from '../services/i18n.js';

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
    `<option value="${c.id}">${c.emoji || '🌾'} ${t(c.id)} (${t(c.season) || c.season})</option>`
  ).join('');

  const soilOptions = soils.map(s =>
    `<option value="${s.id}">${s.emoji || '🟤'} ${t(s.id)}</option>`
  ).join('');

  const irrigationOptions = Object.entries(IRRIGATION_METHODS).map(([key, m]) =>
    `<option value="${key}">${t(key)}</option>`
  ).join('');

  return `
    <div class="prediction-form-card glass-card">
      <div class="pred-form-header">
        <span class="pred-form-icon">🧑‍🌾</span>
        <div>
          <h3 class="pred-form-title" data-i18n="enterFarmDetails">${t('enterFarmDetails')}</h3>
          <p class="pred-form-desc" data-i18n="enterFarmDetailsDesc">${t('enterFarmDetailsDesc')}</p>
        </div>
      </div>

      <form id="prediction-form" class="pred-form">
        <div class="pred-form-grid">
          <div class="form-group">
            <label for="pred-crop" class="form-label">🌾 ${t('cropLabel')}</label>
            <div class="select-wrap">
              <select id="pred-crop" class="form-select" required>
                <option value="" data-i18n="cropSelectPlaceholder">${t('cropSelectPlaceholder')}</option>
                ${cropOptions}
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="pred-soil" class="form-label">🟤 ${t('soilTypeLabel')}</label>
            <div class="select-wrap">
              <select id="pred-soil" class="form-select" required>
                <option value="" data-i18n="soilSelectPlaceholder">${t('soilSelectPlaceholder')}</option>
                ${soilOptions}
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="pred-area" class="form-label">📐 ${t('farmAreaLabel')}</label>
            <input type="number" id="pred-area" class="form-input" min="0.1" max="1000" step="0.1" value="2" required />
          </div>

          <div class="form-group">
            <label for="pred-irrigation" class="form-label">💧 ${t('irrigationMethodLabel')}</label>
            <div class="select-wrap">
              <select id="pred-irrigation" class="form-select" required>
                ${irrigationOptions}
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="pred-sowing" class="form-label">📅 ${t('sowingDateLabel')}</label>
            <input type="date" id="pred-sowing" class="form-input" required />
          </div>
        </div>

        <button type="submit" id="pred-submit-btn" class="pred-submit-btn">
          <span class="pred-btn-text" id="pred-btn-text-content">🔮 ${t('generatePredictionBtn')}</span>
          <span class="pred-btn-loading hidden">
            <span class="spinner"></span> ${t('analyzingBtn')}
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
      hint.textContent = t(`${soil.id}_desc`) || soil.desc;
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
      alert(t('chooseCropOption'));
      return;
    }

    const btnText = container.querySelector('#pred-btn-text-content');
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

  const financials = calculateFinancials(yieldPrediction, crop);

  // Dynamic values formatting
  const baseUnit = crop.id === 'sugarcane' ? t('sugarcane_unit') : t('general_unit');
  const localizedUnit = `${baseUnit}/${t('per_acre')}`;
  
  // Localize risk names
  const getRiskTranslationKey = (name) => {
    if (name === 'Drought Stress') return 'droughtStressRisk';
    if (name === 'Flood / Waterlogging') return 'floodRisk';
    if (name === 'Heat Stress') return 'heatStressRisk';
    if (name === 'Disease Pressure') return 'diseasePressureRisk';
    if (name === 'Pest Pressure') return 'pestPressureRisk';
    return name;
  };

  // Localize factors names
  const getFactorTranslationKey = (name) => {
    if (name === 'Weather Stress') return 'weatherStressFactor';
    if (name === 'Soil Mismatch') return 'soilMismatchFactor';
    if (name === 'Risk Factors') return 'riskFactorsFactor';
    if (name === 'Conditions Favorable') return 'conditionsFavorableFactor';
    return name;
  };

  // Localize stage names for recommendations
  const getStageTitleTranslation = (title) => {
    if (title.includes('Stage Care')) {
      const stage = title.replace(' Stage Care', '');
      return t('stageAdviceLabel', { stage: t(stage) || stage });
    }
    if (title === 'Irrigation Schedule') return t('irrigationScheduleLabel');
    if (title === 'Fungicide Application') return t('fungicideAppLabel');
    if (title === 'Heat Management') return t('heatMgmtLabel');
    if (title === 'Drainage Management') return t('drainageMgmtLabel');
    if (title === 'Soil Amendment') return t('soilAmendmentLabel');
    if (title === 'Harvest Planning') return t('harvestPlanningLabel');
    if (title === 'Favorable Conditions') return t('favorableCondLabel');
    return title;
  };

  // Localize recommendation bodies dynamically if they match standard texts
  const getRecommendationBodyTranslation = (body) => {
    if (body.includes('Apply mulch to reduce soil temperature')) {
      return t('heatStressAction1') + '. ' + t('heatStressAction2') + '. ' + t('heatStressAction3') + '.';
    }
    if (body.includes('Clear all drainage channels immediately')) {
      return t('heavyRainAction1') + '. ' + t('heavyRainAction2') + '. ' + t('heavyRainAction3') + '.';
    }
    return body;
  };

  // Localize reduction gauge messages
  const localizedReductionMessage = reduction.totalPercent <= 10
    ? '✅ ' + t('minimalYieldLoss')
    : reduction.totalPercent <= 25
      ? '⚠️ ' + t('moderateYieldLoss')
      : reduction.totalPercent <= 40
        ? '🟠 ' + t('significantYieldLoss')
        : '🔴 ' + t('severeYieldLoss');

  resultsContainer.innerHTML = `
    <!-- Weather Summary Strip -->
    <div class="pred-weather-strip glass-card">
      <div class="pws-item">
        <span class="pws-icon">${weatherSummary.dominantWeather.icon}</span>
        <span class="pws-label">${t(weatherSummary.dominantWeather.desc) || weatherSummary.dominantWeather.desc}</span>
      </div>
      <div class="pws-item">
        <span class="pws-icon">🌡️</span>
        <span class="pws-value">${weatherSummary.avgMaxTemp}° / ${weatherSummary.avgMinTemp}°</span>
      </div>
      <div class="pws-item">
        <span class="pws-icon">🌧️</span>
        <span class="pws-value">${weatherSummary.totalRain}mm</span>
        <span class="pws-label">${weatherSummary.rainyDays} ${t('per_acre') === 'प्रति एकड़' ? 'बरसात के दिन' : 'rainy days'}</span>
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
        <h3 class="pred-card-title">🌾 ${t('predictedYieldTitle')}</h3>
        <div class="yield-main">
          <span class="yield-value">${yieldPrediction.perAcre}</span>
          <span class="yield-unit">${localizedUnit}</span>
        </div>
        <div class="yield-range">
          ${t('rangeLabel')}: ${yieldPrediction.rangeLow} – ${yieldPrediction.rangeHigh} ${localizedUnit}
        </div>
        <div class="yield-total">
          ${t('totalLabel')} (${result.area} ${t('per_acre') === 'प्रति एकड़' ? 'एकड़' : 'acres'}): <strong>${yieldPrediction.total} ${baseUnit}</strong>
        </div>
        <div class="yield-confidence">
          <span class="conf-label">${t('confidenceLabel')}</span>
          <div class="conf-bar">
            <div class="conf-fill" style="width: ${yieldPrediction.confidence}%"></div>
          </div>
          <span class="conf-value">${yieldPrediction.confidence}%</span>
        </div>
        <div class="yield-multipliers">
          <div class="ym-item">
            <span class="ym-label">${t('weatherScore').replace(' Score', '').replace(' स्कोर', '')}</span>
            <span class="ym-value ${yieldPrediction.multipliers.weather >= 0.7 ? 'good' : 'bad'}">${(yieldPrediction.multipliers.weather * 100).toFixed(0)}%</span>
          </div>
          <div class="ym-item">
            <span class="ym-label">${t('soilScore').replace(' Score', '').replace(' स्कोर', '')}</span>
            <span class="ym-value ${yieldPrediction.multipliers.soil >= 0.9 ? 'good' : 'bad'}">${(yieldPrediction.multipliers.soil * 100).toFixed(0)}%</span>
          </div>
          <div class="ym-item">
            <span class="ym-label">${t('irrigation')}</span>
            <span class="ym-value ${yieldPrediction.multipliers.irrigation >= 0.9 ? 'good' : 'bad'}">${(yieldPrediction.multipliers.irrigation * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>

      <!-- Reduction Card -->
      <div class="pred-reduction-card glass-card reduction-${reduction.severity}">
        <h3 class="pred-card-title">📉 ${t('estimatedLossTitle')}</h3>
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
            <span class="reduction-severity severity-badge-${reduction.severity}">${t(reduction.severity) || reduction.severity.toUpperCase()}</span>
            <p class="reduction-message">${localizedReductionMessage}</p>
          </div>
        </div>
        <div class="reduction-factors">
          ${reduction.factors.map(f => `
            <div class="rf-item">
              <span class="rf-icon">${f.icon}</span>
              <span class="rf-name">${t(getFactorTranslationKey(f.name)) || f.name}</span>
              <span class="rf-value">-${f.value}%</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    ${financials ? `
    <!-- Financial Outlook Card -->
    <div class="pred-financial-card glass-card" style="margin-bottom: 24px;">
      <h3 class="pred-card-title">💰 ${t('expectedRevenueTitle')}</h3>
      <div class="financial-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
        <div class="fin-item" style="padding: 16px; background: rgba(34, 197, 94, 0.1); border-radius: 8px; border: 1px solid rgba(34, 197, 94, 0.2);">
          <span class="fin-label" style="display:block; font-size:0.85rem; color:var(--text-secondary); margin-bottom:4px;">${t('expectedRevenueTitle')}</span>
          <span class="fin-value" style="display:block; font-size:1.5rem; font-weight:700; color:var(--accent-main);">${formatCurrency(financials.expectedRevenue)}</span>
          <span class="fin-sub" style="display:block; font-size:0.75rem; color:var(--text-muted); margin-top:4px;">${t('per_acre') === 'प्रति एकड़' ? 'उपज पूर्वानुमान के आधार पर' : 'Based on yield prediction'}</span>
        </div>
        <div class="fin-item" style="padding: 16px; background: rgba(239, 68, 68, 0.1); border-radius: 8px; border: 1px solid rgba(239, 68, 68, 0.2);">
          <span class="fin-label" style="display:block; font-size:0.85rem; color:var(--text-secondary); margin-bottom:4px;">${t('estimatedLossTitle')}</span>
          <span class="fin-value" style="display:block; font-size:1.5rem; font-weight:700; color:var(--red-500);">${formatCurrency(financials.estimatedLoss)}</span>
          <span class="fin-sub" style="display:block; font-size:0.75rem; color:var(--text-muted); margin-top:4px;">${t('per_acre') === 'प्रति एकड़' ? 'तनाव कारकों के कारण नुकसान' : 'Loss due to stress factors'}</span>
        </div>
        <div class="fin-item" style="padding: 16px; background: var(--bg-hover); border-radius: 8px;">
          <span class="fin-label" style="display:block; font-size:0.85rem; color:var(--text-secondary); margin-bottom:4px;">${t('currentPriceTitle')}</span>
          <span class="fin-value" style="display:block; font-size:1.2rem; font-weight:600; color:var(--text-main);">${formatCurrency(financials.pricePerQuintal)}</span>
          <span class="fin-sub" style="display:block; font-size:0.75rem; color:var(--text-muted); margin-top:4px;">${t('per_acre') === 'प्रति एकड़' ? 'प्रति क्विंटल' : 'Per Quintal'}</span>
        </div>
      </div>
    </div>
    ` : ''}

    <!-- Growth Stage Timeline -->
    <div class="pred-growth-card glass-card">
      <h3 class="pred-card-title">🌱 ${t('growthStageTitle')}</h3>
      <div class="growth-info">
        <div class="gi-item">
          <span class="gi-label">${t('currentStageLabel')}</span>
          <span class="gi-value">${t(growthStage.currentStage) || growthStage.currentStage}</span>
        </div>
        <div class="gi-item">
          <span class="gi-label">${t('daysSinceSowingLabel')}</span>
          <span class="gi-value">${growthStage.daysSinceSowing}</span>
        </div>
        <div class="gi-item">
          <span class="gi-label">${t('overallProgressLabel')}</span>
          <span class="gi-value">${growthStage.overallProgress}%</span>
        </div>
        ${growthStage.isCritical ? `<div class="gi-critical">⚠️ ${t('criticalPeriodLabel')}</div>` : ''}
      </div>
      <div class="growth-timeline">
        ${growthStage.stages.map((s, i) => `
          <div class="gt-stage ${s.completed ? 'completed' : ''} ${s.current ? 'current' : ''}">
            <div class="gt-dot"></div>
            <div class="gt-label">${t(s.name) || s.name}</div>
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
      <h3 class="pred-card-title">⚡ ${t('riskAssessmentTitle')}</h3>
      <div class="risk-grid">
        ${risks.map(r => `
          <div class="risk-item risk-${r.level}">
            <div class="ri-header">
              <span class="ri-icon">${r.icon}</span>
              <span class="ri-name">${t(getRiskTranslationKey(r.name)) || r.name}</span>
              <span class="ri-badge badge-${r.level}">${t(r.level) || r.level.toUpperCase()}</span>
            </div>
            <div class="ri-bar">
              <div class="ri-fill" style="width: ${r.score}%"></div>
            </div>
            <p class="ri-detail">${t(r.detail) || r.detail}</p>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Recommendations -->
    <div class="pred-recs-card glass-card">
      <h3 class="pred-card-title">📋 ${t('recommendationsTitle')}</h3>
      <div class="recs-list">
        ${recommendations.map(r => `
          <div class="rec-item rec-${r.priority}">
            <div class="rec-header">
              <span class="rec-icon">${r.icon}</span>
              <span class="rec-title">${getStageTitleTranslation(r.title)}</span>
              <span class="rec-priority priority-${r.priority}">${t(r.priority) || r.priority.toUpperCase()}</span>
            </div>
            <p class="rec-body">${getRecommendationBodyTranslation(r.body)}</p>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Score Summary -->
    <div class="pred-summary-row">
      <div class="ps-card glass-card">
        <span class="ps-icon">⛅</span>
        <span class="ps-label">${t('weatherScore')}</span>
        <span class="ps-value">${weatherScore}/100</span>
      </div>
      <div class="ps-card glass-card">
        <span class="ps-icon">🟤</span>
        <span class="ps-label">${t('soilScore')}</span>
        <span class="ps-value">${soilScore}/100</span>
      </div>
      <div class="ps-card glass-card">
        <span class="ps-icon">💧</span>
        <span class="ps-label">${t('irrigation')}</span>
        <span class="ps-value">${t(irrigationMethod.name) || irrigationMethod.name}</span>
      </div>
      <div class="ps-card glass-card">
        <span class="ps-icon">${crop.emoji || '🌾'}</span>
        <span class="ps-label">${t(crop.id)}</span>
        <span class="ps-value">${t(crop.season) || crop.season}</span>
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
