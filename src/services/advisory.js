/**
 * FarmSense — Crop Advisory Engine
 * Rule-based AI advisory: weather data × crop thresholds → actionable advice
 */

import { getCropById } from '../data/crops.js';
import { getWeatherInfo } from './weather.js';
import { t } from './i18n.js';

/**
 * Generate comprehensive advisory for a crop given forecast data
 * @param {string} cropId - Crop ID from crops database
 * @param {object} forecast - Open-Meteo forecast response
 * @returns {{ advisories: Array, bestDays: Array, riskScore: number, riskLevel: string, riskDesc: string }}
 */
export function generateAdvisory(cropId, forecast) {
  const crop = getCropById(cropId);
  if (!crop || !forecast?.daily) {
    return { advisories: [], bestDays: [], riskScore: 0, riskLevel: 'low', riskDesc: t('selectCropAdvisoryDefault') };
  }

  const daily = forecast.daily;
  const days = daily.time.length;
  const advisories = [];
  let riskPoints = 0;
  let maxRisk = 0;

  // ─── 1. Temperature Analysis ───
  const tempAnalysis = analyzeTemperature(crop, daily, days);
  advisories.push(...tempAnalysis.advisories);
  riskPoints += tempAnalysis.risk;

  // ─── 2. Rain & Irrigation Analysis ───
  const rainAnalysis = analyzeRain(crop, daily, days);
  advisories.push(...rainAnalysis.advisories);
  riskPoints += rainAnalysis.risk;

  // ─── 3. Wind Analysis ───
  const windAnalysis = analyzeWind(crop, daily, days);
  advisories.push(...windAnalysis.advisories);
  riskPoints += windAnalysis.risk;

  // ─── 4. Disease Risk (Humidity) ───
  if (forecast.hourly) {
    const diseaseAnalysis = analyzeDisease(crop, forecast.hourly, days);
    advisories.push(...diseaseAnalysis.advisories);
    riskPoints += diseaseAnalysis.risk;
  }

  // ─── 5. UV Analysis ───
  const uvAnalysis = analyzeUV(crop, daily, days);
  advisories.push(...uvAnalysis.advisories);
  riskPoints += uvAnalysis.risk;

  // ─── Calculate overall risk score (0-100) ───
  maxRisk = 5 * 25; // 5 categories × 25 max each
  const riskScore = Math.min(100, Math.round((riskPoints / maxRisk) * 100));
  const riskLevel = riskScore <= 30 ? 'low' : riskScore <= 65 ? 'medium' : 'high';
  const riskDesc = riskScore <= 30
    ? '✅ ' + t('conditionFavorableDefault')
    : riskScore <= 65
      ? '⚠️ ' + t('weatherStressExpected')
      : '🚨 ' + t('highStressAhead');

  // ─── Best Days ───
  const bestDays = calculateBestDays(crop, daily, days);

  // Sort advisories: alerts first, then caution, then safe
  const severityOrder = { alert: 0, caution: 1, safe: 2 };
  advisories.sort((a, b) => (severityOrder[a.severity] || 2) - (severityOrder[b.severity] || 2));

  return { advisories, bestDays, riskScore, riskLevel, riskDesc };
}

// ─── Temperature ───
function analyzeTemperature(crop, daily, days) {
  const advisories = [];
  let risk = 0;
  let heatDays = 0;
  let coldDays = 0;
  let optimalDays = 0;

  for (let i = 0; i < days; i++) {
    const max = daily.temperature_2m_max[i];
    const min = daily.temperature_2m_min[i];

    if (max >= crop.heatStress) heatDays++;
    if (min <= crop.frostThreshold) coldDays++;
    if (max <= crop.tempOptMax && min >= crop.tempOptMin) optimalDays++;
  }

  if (heatDays > 0) {
    risk += Math.min(25, heatDays * 8);
    advisories.push({
      icon: '🌡️',
      severity: heatDays >= 3 ? 'alert' : 'caution',
      title: t('heatStressTitle', { days: heatDays, s: heatDays > 1 ? 's' : '' }),
      body: t('heatStressBody', { temp: crop.heatStress, crop: t(crop.id) }),
      actions: [
        t('heatStressAction1'),
        t('heatStressAction2'),
        t('heatStressAction3'),
        t('heatStressAction4'),
      ],
    });
  }

  if (coldDays > 0) {
    risk += Math.min(25, coldDays * 10);
    advisories.push({
      icon: '❄️',
      severity: coldDays >= 2 ? 'alert' : 'caution',
      title: t('coldFrostTitle', { days: coldDays, s: coldDays > 1 ? 's' : '' }),
      body: t('coldFrostBody', { temp: crop.frostThreshold, crop: t(crop.id) }),
      actions: [
        t('coldFrostAction1'),
        t('coldFrostAction2'),
        t('coldFrostAction3'),
      ],
    });
  }

  if (optimalDays >= 5 && heatDays === 0 && coldDays === 0) {
    advisories.push({
      icon: '🌡️',
      severity: 'safe',
      title: t('idealTempTitle'),
      body: t('idealTempBody', { minOpt: crop.tempOptMin, maxOpt: crop.tempOptMax, crop: t(crop.id) }),
      actions: [t('idealTempAction1')],
    });
  }

  return { advisories, risk };
}

// ─── Rain & Irrigation ───
function analyzeRain(crop, daily, days) {
  const advisories = [];
  let risk = 0;
  const totalRain = daily.precipitation_sum.reduce((s, v) => s + (v || 0), 0);
  const heavyRainDays = daily.precipitation_sum.filter(v => v > 30).length;
  const dryDays = daily.precipitation_sum.filter(v => v < 1).length;
  const deficit = crop.waterNeedWeekly - totalRain;

  if (heavyRainDays > 0) {
    risk += Math.min(25, heavyRainDays * 10);
    const heavyDates = [];
    for (let i = 0; i < days; i++) {
      if (daily.precipitation_sum[i] > 30) {
        heavyDates.push(formatDay(daily.time[i]));
      }
    }
    advisories.push({
      icon: '⛈️',
      severity: 'alert',
      title: t('heavyRainTitle', { days: heavyRainDays, s: heavyRainDays > 1 ? 's' : '' }),
      body: t('heavyRainBody', { dates: heavyDates.join(', '), crop: t(crop.id) }),
      actions: [
        t('heavyRainAction1'),
        t('heavyRainAction2'),
        t('heavyRainAction3'),
        t('heavyRainAction4'),
      ],
    });
  }

  if (deficit > 15 && dryDays >= 4) {
    risk += Math.min(20, Math.round(deficit / 2));
    advisories.push({
      icon: '💧',
      severity: 'caution',
      title: t('irrigationTitle'),
      body: t('irrigationBody', { rain: Math.round(totalRain), deficit: Math.round(deficit), crop: t(crop.id), need: crop.waterNeedWeekly, dry: dryDays }),
      actions: [
        t('irrigationAction1', { deficit: Math.round(deficit) }),
        t(`${crop.id}_tip_irrigation`) || crop.tips.irrigation,
        t('irrigationAction3'),
      ],
    });
  } else if (deficit <= 0 && heavyRainDays === 0) {
    advisories.push({
      icon: '💧',
      severity: 'safe',
      title: t('waterAdequateTitle'),
      body: t('waterAdequateBody', { rain: Math.round(totalRain), crop: t(crop.id), need: crop.waterNeedWeekly }),
      actions: [t('waterAdequateAction1')],
    });
  }

  return { advisories, risk };
}

// ─── Wind ───
function analyzeWind(crop, daily, days) {
  const advisories = [];
  let risk = 0;
  const avgWind = daily.wind_speed_10m_max.reduce((s, v) => s + (v || 0), 0) / days;
  const highWindDays = daily.wind_speed_10m_max.filter(v => v > crop.windSprayMax).length;
  const calmDays = [];

  for (let i = 0; i < days; i++) {
    if (daily.wind_speed_10m_max[i] <= crop.windSprayMax) {
      calmDays.push(formatDay(daily.time[i]));
    }
  }

  if (highWindDays > 3) {
    risk += 10;
    advisories.push({
      icon: '💨',
      severity: 'caution',
      title: t('highWindTitle'),
      body: t('highWindBody', { limit: crop.windSprayMax, days: highWindDays }),
      actions: [
        calmDays.length > 0
          ? t('highWindActionCalm', { calm: calmDays.slice(0, 3).join(', ') })
          : t('highWindActionMorning'),
        t('highWindActionStake'),
      ],
    });
  }

  if (avgWind > 30) {
    risk += 8;
    advisories.push({
      icon: '🌪️',
      severity: 'alert',
      title: t('strongWindTitle'),
      body: t('strongWindBody', { wind: Math.round(avgWind) }),
      actions: [
        t('strongWindAction1'),
        t('strongWindAction2'),
        t('strongWindAction3'),
      ],
    });
  }

  return { advisories, risk };
}

// ─── Disease Risk (Humidity) ───
function analyzeDisease(crop, hourly, days) {
  const advisories = [];
  let risk = 0;
  const hoursPerDay = 24;
  let highHumHours = 0;
  const totalHours = Math.min(hourly.relative_humidity_2m.length, days * hoursPerDay);

  for (let h = 0; h < totalHours; h++) {
    if (hourly.relative_humidity_2m[h] >= crop.humidityDiseaseMin) {
      highHumHours++;
    }
  }

  const highHumPercent = Math.round((highHumHours / totalHours) * 100);

  if (highHumPercent > 40) {
    risk += Math.min(25, Math.round(highHumPercent / 3));
    advisories.push({
      icon: '🦠',
      severity: highHumPercent > 60 ? 'alert' : 'caution',
      title: t('diseaseRiskTitle', { percent: highHumPercent }),
      body: t('diseaseRiskBody', { limit: crop.humidityDiseaseMin, hours: highHumHours, crop: t(crop.id), diseases: crop.diseases.map(d => t(d) || d).join(', ') }),
      actions: [
        t('diseaseRiskAction1'),
        t('diseaseRiskAction2'),
        t('diseaseRiskAction3'),
        t('diseaseRiskAction4'),
      ],
    });
  } else if (highHumPercent < 15) {
    advisories.push({
      icon: '🦠',
      severity: 'safe',
      title: t('diseaseLowTitle'),
      body: t('diseaseLowBody', { crop: t(crop.id) }),
      actions: [t('diseaseLowAction1')],
    });
  }

  return { advisories, risk };
}

// ─── UV ───
function analyzeUV(crop, daily, days) {
  const advisories = [];
  let risk = 0;
  const highUVDays = daily.uv_index_max.filter(v => v >= 8).length;

  if (highUVDays > 0) {
    risk += Math.min(10, highUVDays * 3);
    advisories.push({
      icon: '☀️',
      severity: highUVDays >= 4 ? 'caution' : 'safe',
      title: t('highUVTitle', { days: highUVDays }),
      body: t('highUVBody'),
      actions: [
        t('highUVAction1'),
        t('highUVAction2'),
        t('highUVAction3'),
      ],
    });
  }

  return { advisories, risk };
}

// ─── Best Days Calculation ───
function calculateBestDays(crop, daily, days) {
  const bestDays = [];
  const dayScores = [];

  for (let i = 0; i < days; i++) {
    const temp = (daily.temperature_2m_max[i] + daily.temperature_2m_min[i]) / 2;
    const rain = daily.precipitation_sum[i] || 0;
    const rainProb = daily.precipitation_probability_max[i] || 0;
    const wind = daily.wind_speed_10m_max[i] || 0;

    // Score for planting (moderate temp, low rain, low wind)
    let plantScore = 100;
    if (temp < crop.tempOptMin || temp > crop.tempOptMax) plantScore -= 30;
    if (rain > 5) plantScore -= 20;
    if (rainProb > 50) plantScore -= 15;
    if (wind > 20) plantScore -= 20;

    // Score for spraying (no rain, low wind)
    let sprayScore = 100;
    if (rain > 0) sprayScore -= 50;
    if (rainProb > 30) sprayScore -= 20;
    if (wind > crop.windSprayMax) sprayScore -= 40;

    // Score for harvesting (dry, sunny)
    let harvestScore = 100;
    if (rain > 2) harvestScore -= 60;
    if (rainProb > 40) harvestScore -= 20;
    if (wind > 25) harvestScore -= 15;

    dayScores.push({
      day: formatDay(daily.time[i]),
      date: daily.time[i],
      plant: Math.max(0, plantScore),
      spray: Math.max(0, sprayScore),
      harvest: Math.max(0, harvestScore),
      rain,
      wind,
    });
  }

  // Best day for each activity
  const activities = [
    { key: 'plant', label: t('plantingActivity'), emoji: '🌱' },
    { key: 'spray', label: t('sprayingActivity'), emoji: '🧪' },
    { key: 'harvest', label: t('harvestingActivity'), emoji: '🫳' },
  ];

  for (const activity of activities) {
    const sorted = [...dayScores].sort((a, b) => b[activity.key] - a[activity.key]);
    const best = sorted[0];
    if (best[activity.key] >= 50) {
      bestDays.push({
        activity: activity.label,
        emoji: activity.emoji,
        day: best.day,
        reason: t('bestDayReason', { rain: Math.round(best.rain), wind: Math.round(best.wind) }),
        score: best[activity.key],
      });
    }
  }

  return bestDays;
}

// ─── Helper ───
function formatDay(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  // Format based on current language
  return d.toLocaleDateString(t('per_acre') === 'प्रति एकड़' ? 'hi-IN' : 'en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
}
