/**
 * FarmSense — Crop Advisory Engine
 * Rule-based AI advisory: weather data × crop thresholds → actionable advice
 */

import { getCropById } from '../data/crops.js';
import { getWeatherInfo } from './weather.js';

/**
 * Generate comprehensive advisory for a crop given forecast data
 * @param {string} cropId - Crop ID from crops database
 * @param {object} forecast - Open-Meteo forecast response
 * @returns {{ advisories: Array, bestDays: Array, riskScore: number, riskLevel: string, riskDesc: string }}
 */
export function generateAdvisory(cropId, forecast) {
  const crop = getCropById(cropId);
  if (!crop || !forecast?.daily) {
    return { advisories: [], bestDays: [], riskScore: 0, riskLevel: 'low', riskDesc: 'Select a crop to see advisory' };
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
    ? '✅ Conditions are favorable for your crop. Continue regular practices.'
    : riskScore <= 65
      ? '⚠️ Some weather stress expected. Follow the advisories below carefully.'
      : '🚨 High stress conditions ahead. Take immediate protective action.';

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
      title: `Heat Stress Warning — ${heatDays} day${heatDays > 1 ? 's' : ''}`,
      body: `Temperatures will exceed ${crop.heatStress}°C, which is above ${crop.name}'s heat tolerance. This can damage flowers, reduce fruit set, and slow growth.`,
      actions: [
        'Apply mulch to reduce soil temperature',
        'Irrigate in early morning or late evening',
        'Use shade nets if available',
        'Avoid transplanting on hot days',
      ],
    });
  }

  if (coldDays > 0) {
    risk += Math.min(25, coldDays * 10);
    advisories.push({
      icon: '❄️',
      severity: coldDays >= 2 ? 'alert' : 'caution',
      title: `Cold/Frost Risk — ${coldDays} day${coldDays > 1 ? 's' : ''}`,
      body: `Minimum temperatures will drop near or below ${crop.frostThreshold}°C. ${crop.name} is sensitive to cold at this level.`,
      actions: [
        'Cover young plants with plastic/straw at night',
        'Irrigate fields in evening to retain soil warmth',
        'Avoid pruning during cold spells',
      ],
    });
  }

  if (optimalDays >= 5 && heatDays === 0 && coldDays === 0) {
    advisories.push({
      icon: '🌡️',
      severity: 'safe',
      title: 'Temperature — Ideal Range',
      body: `Temperatures are within the optimal ${crop.tempOptMin}–${crop.tempOptMax}°C range for ${crop.name} for most of the week. Great growing conditions!`,
      actions: ['Continue regular crop management'],
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
      title: `Heavy Rain Alert — ${heavyRainDays} day${heavyRainDays > 1 ? 's' : ''}`,
      body: `Heavy rainfall (>30mm) expected on ${heavyDates.join(', ')}. Risk of waterlogging and crop damage for ${crop.name}.`,
      actions: [
        'Ensure field drainage channels are clear',
        'Postpone fertilizer/pesticide application',
        'Harvest mature produce before heavy rain',
        'Protect seedbeds with temporary covers',
      ],
    });
  }

  if (deficit > 15 && dryDays >= 4) {
    risk += Math.min(20, Math.round(deficit / 2));
    advisories.push({
      icon: '💧',
      severity: 'caution',
      title: 'Irrigation Needed',
      body: `Expected rainfall (${Math.round(totalRain)}mm) is ${Math.round(deficit)}mm short of ${crop.name}'s weekly water need (${crop.waterNeedWeekly}mm). ${dryDays} dry days ahead.`,
      actions: [
        `Plan irrigation to supplement ~${Math.round(deficit)}mm`,
        crop.tips.irrigation,
        'Water early morning to minimize evaporation',
      ],
    });
  } else if (deficit <= 0 && heavyRainDays === 0) {
    advisories.push({
      icon: '💧',
      severity: 'safe',
      title: 'Water Supply — Adequate',
      body: `Expected rainfall of ${Math.round(totalRain)}mm meets ${crop.name}'s water requirement of ${crop.waterNeedWeekly}mm/week.`,
      actions: ['No additional irrigation needed this week'],
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
      title: 'High Wind — Spraying Window Limited',
      body: `Wind speeds will exceed ${crop.windSprayMax} km/h on ${highWindDays} days. Not suitable for pesticide/fertilizer spraying.`,
      actions: [
        calmDays.length > 0
          ? `Best days for spraying: ${calmDays.slice(0, 3).join(', ')}`
          : 'Consider early morning spraying when winds are calmer',
        'Stake tall plants to prevent lodging',
      ],
    });
  }

  if (avgWind > 30) {
    risk += 8;
    advisories.push({
      icon: '🌪️',
      severity: 'alert',
      title: 'Strong Wind Warning',
      body: `Average maximum wind speed is ${Math.round(avgWind)} km/h. Risk of physical crop damage and accelerated soil moisture loss.`,
      actions: [
        'Install windbreaks if possible',
        'Secure greenhouse/polytunnel structures',
        'Delay transplanting to calmer period',
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
      title: `Disease Risk — High Humidity (${highHumPercent}% of hours)`,
      body: `Humidity will exceed ${crop.humidityDiseaseMin}% for ${highHumHours} hours this week. ${crop.name} is susceptible to: ${crop.diseases.join(', ')}.`,
      actions: [
        'Apply preventive fungicide during a dry window',
        'Improve air circulation (wider spacing, remove lower leaves)',
        'Monitor fields daily for early disease symptoms',
        'Avoid overhead irrigation',
      ],
    });
  } else if (highHumPercent < 15) {
    advisories.push({
      icon: '🦠',
      severity: 'safe',
      title: 'Disease Risk — Low',
      body: `Humidity levels are mostly below the disease threshold for ${crop.name}. Low fungal disease pressure expected.`,
      actions: ['Continue regular scouting'],
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
      title: `High UV Index — ${highUVDays} day${highUVDays > 1 ? 's' : ''}`,
      body: 'Very high UV radiation can cause sunscald on fruits and accelerate moisture loss.',
      actions: [
        'Use shade cloth for sensitive vegetables',
        'Farmers: wear hats and protective clothing',
        'Schedule field work in early morning/late afternoon',
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
    { key: 'plant', label: 'Planting / Transplanting', emoji: '🌱' },
    { key: 'spray', label: 'Pesticide Spraying', emoji: '🧪' },
    { key: 'harvest', label: 'Harvesting', emoji: '🫳' },
  ];

  for (const activity of activities) {
    const sorted = [...dayScores].sort((a, b) => b[activity.key] - a[activity.key]);
    const best = sorted[0];
    if (best[activity.key] >= 50) {
      bestDays.push({
        activity: activity.label,
        emoji: activity.emoji,
        day: best.day,
        reason: `Low rain (${Math.round(best.rain)}mm), wind ${Math.round(best.wind)} km/h`,
        score: best[activity.key],
      });
    }
  }

  return bestDays;
}

// ─── Helper ───
function formatDay(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
}
