/**
 * FarmSense — Prediction Engine
 * Rule-based yield prediction, risk assessment, and reduction estimation
 * Uses real weather data × crop thresholds × soil properties × growth stage
 */

import { getCropById } from '../data/crops.js';
import { getSoilById } from '../data/soils.js';
import { getWeatherInfo } from './weather.js';

/**
 * Base yield data for Indian crops (quintals per acre, average conditions)
 */
const BASE_YIELDS = {
  rice: 18,
  wheat: 14,
  sugarcane: 280,
  cotton: 6,
  maize: 12,
  soybean: 8,
  groundnut: 7,
  mustard: 5,
  bajra: 8,
  jowar: 7,
  tur: 5,
  chana: 6,
  tomato: 80,
  onion: 60,
  potato: 70,
};

/**
 * Growth stages for scheduling analysis
 * Duration is in days from sowing
 */
const GROWTH_STAGES = {
  rice:      [{ name: 'Germination', duration: 15 }, { name: 'Seedling', duration: 25 }, { name: 'Tillering', duration: 30 }, { name: 'Flowering', duration: 25 }, { name: 'Grain Filling', duration: 20 }, { name: 'Maturity', duration: 15 }],
  wheat:     [{ name: 'Germination', duration: 10 }, { name: 'Crown Root', duration: 20 }, { name: 'Tillering', duration: 25 }, { name: 'Heading', duration: 20 }, { name: 'Grain Filling', duration: 25 }, { name: 'Maturity', duration: 20 }],
  sugarcane: [{ name: 'Germination', duration: 30 }, { name: 'Tillering', duration: 90 }, { name: 'Grand Growth', duration: 120 }, { name: 'Maturity', duration: 120 }],
  cotton:    [{ name: 'Germination', duration: 12 }, { name: 'Vegetative', duration: 35 }, { name: 'Square Formation', duration: 25 }, { name: 'Flowering', duration: 30 }, { name: 'Boll Development', duration: 40 }, { name: 'Maturity', duration: 25 }],
  maize:     [{ name: 'Germination', duration: 10 }, { name: 'Vegetative', duration: 30 }, { name: 'Tasseling', duration: 10 }, { name: 'Silking', duration: 15 }, { name: 'Grain Filling', duration: 25 }, { name: 'Maturity', duration: 15 }],
  soybean:   [{ name: 'Germination', duration: 10 }, { name: 'Vegetative', duration: 30 }, { name: 'Flowering', duration: 20 }, { name: 'Pod Filling', duration: 25 }, { name: 'Maturity', duration: 15 }],
  groundnut: [{ name: 'Germination', duration: 10 }, { name: 'Vegetative', duration: 25 }, { name: 'Flowering', duration: 20 }, { name: 'Pegging', duration: 25 }, { name: 'Pod Filling', duration: 20 }, { name: 'Maturity', duration: 15 }],
  mustard:   [{ name: 'Germination', duration: 8 }, { name: 'Vegetative', duration: 30 }, { name: 'Flowering', duration: 20 }, { name: 'Siliqua Dev.', duration: 25 }, { name: 'Maturity', duration: 20 }],
  bajra:     [{ name: 'Germination', duration: 8 }, { name: 'Vegetative', duration: 25 }, { name: 'Heading', duration: 15 }, { name: 'Grain Filling', duration: 20 }, { name: 'Maturity', duration: 12 }],
  jowar:     [{ name: 'Germination', duration: 10 }, { name: 'Vegetative', duration: 30 }, { name: 'Heading', duration: 15 }, { name: 'Grain Filling', duration: 20 }, { name: 'Maturity', duration: 15 }],
  tur:       [{ name: 'Germination', duration: 10 }, { name: 'Vegetative', duration: 50 }, { name: 'Flowering', duration: 30 }, { name: 'Pod Filling', duration: 30 }, { name: 'Maturity', duration: 20 }],
  chana:     [{ name: 'Germination', duration: 10 }, { name: 'Vegetative', duration: 30 }, { name: 'Flowering', duration: 20 }, { name: 'Pod Filling', duration: 25 }, { name: 'Maturity', duration: 15 }],
  tomato:    [{ name: 'Germination', duration: 10 }, { name: 'Vegetative', duration: 25 }, { name: 'Flowering', duration: 20 }, { name: 'Fruiting', duration: 30 }, { name: 'Harvest Period', duration: 40 }],
  onion:     [{ name: 'Germination', duration: 10 }, { name: 'Vegetative', duration: 30 }, { name: 'Bulb Init.', duration: 20 }, { name: 'Bulb Filling', duration: 30 }, { name: 'Maturity', duration: 15 }],
  potato:    [{ name: 'Sprout Dev.', duration: 15 }, { name: 'Vegetative', duration: 20 }, { name: 'Tuber Init.', duration: 15 }, { name: 'Tuber Bulking', duration: 25 }, { name: 'Maturity', duration: 15 }],
};

/**
 * Irrigation method efficiency multipliers
 */
const IRRIGATION_METHODS = {
  rainfed:    { name: 'Rainfed (No Irrigation)', multiplier: 0.7, waterEfficiency: 0.3 },
  flood:      { name: 'Flood / Surface', multiplier: 0.85, waterEfficiency: 0.5 },
  sprinkler:  { name: 'Sprinkler', multiplier: 0.95, waterEfficiency: 0.75 },
  drip:       { name: 'Drip Irrigation', multiplier: 1.1, waterEfficiency: 0.95 },
  furrow:     { name: 'Furrow', multiplier: 0.9, waterEfficiency: 0.6 },
};

export { IRRIGATION_METHODS };

/**
 * Generate comprehensive prediction for a farmer based on their inputs + weather data
 * 
 * @param {object} params
 * @param {string} params.cropId - Selected crop
 * @param {string} params.soilId - Selected soil type
 * @param {number} params.area - Farm area in acres
 * @param {string} params.irrigation - Irrigation method key
 * @param {string} params.sowingDate - ISO date string of sowing
 * @param {object} params.forecast - Open-Meteo forecast response
 * @param {object} [params.historical] - Open-Meteo historical data (optional)
 * @returns {object} Prediction result
 */
export function generatePrediction({ cropId, soilId, area, irrigation, sowingDate, forecast, historical }) {
  const crop = getCropById(cropId);
  const soil = getSoilById(soilId);
  const irrMethod = IRRIGATION_METHODS[irrigation] || IRRIGATION_METHODS.rainfed;

  if (!crop || !soil || !forecast?.daily) {
    return { error: 'Missing required data for prediction' };
  }

  const daily = forecast.daily;
  const days = daily.time.length;

  // ─── 1. Growth Stage Analysis ───
  const growthStage = analyzeGrowthStage(cropId, sowingDate);
  
  // ─── 2. Weather Suitability Score ───
  const weatherScore = calculateWeatherScore(crop, daily, days, forecast.hourly);
  
  // ─── 3. Soil Suitability ───
  const soilScore = calculateSoilScore(crop, soil);
  
  // ─── 4. Yield Prediction ───
  const yieldPrediction = predictYield(crop, soil, irrMethod, area, weatherScore, soilScore, growthStage);
  
  // ─── 5. Risk Assessment ───
  const risks = assessRisks(crop, soil, daily, days, forecast.hourly, irrMethod, growthStage);
  
  // ─── 6. Reduction Estimate ───
  const reduction = estimateReduction(weatherScore, soilScore, risks, growthStage);
  
  // ─── 7. Recommendations ───
  const recommendations = generateRecommendations(crop, soil, irrMethod, growthStage, risks, daily, weatherScore);
  
  // ─── 8. Weekly Weather Summary ───
  const weatherSummary = summarizeWeather(daily, days);

  return {
    crop,
    soil,
    area,
    irrigationMethod: irrMethod,
    growthStage,
    weatherScore,
    soilScore,
    yieldPrediction,
    risks,
    reduction,
    recommendations,
    weatherSummary,
  };
}

// ─── Growth Stage Analysis ───
function analyzeGrowthStage(cropId, sowingDate) {
  const stages = GROWTH_STAGES[cropId];
  if (!stages || !sowingDate) {
    return { currentStage: 'Unknown', daysSinceSowing: 0, progress: 0, stages: [] };
  }

  const sowing = new Date(sowingDate);
  const now = new Date();
  const daysSinceSowing = Math.max(0, Math.floor((now - sowing) / (1000 * 60 * 60 * 24)));

  let accumulated = 0;
  let currentStage = stages[stages.length - 1].name;
  let stageIndex = stages.length - 1;
  let stageProgress = 100;
  const totalDuration = stages.reduce((s, st) => s + st.duration, 0);

  for (let i = 0; i < stages.length; i++) {
    accumulated += stages[i].duration;
    if (daysSinceSowing <= accumulated) {
      currentStage = stages[i].name;
      stageIndex = i;
      const stageStart = accumulated - stages[i].duration;
      stageProgress = Math.round(((daysSinceSowing - stageStart) / stages[i].duration) * 100);
      break;
    }
  }

  // Overall crop progress
  const overallProgress = Math.min(100, Math.round((daysSinceSowing / totalDuration) * 100));

  // Critical period check
  const criticalStages = ['Flowering', 'Tasseling', 'Silking', 'Grain Filling', 'Pod Filling',
    'Boll Development', 'Tuber Bulking', 'Fruiting', 'Pegging', 'Bulb Filling'];
  const isCritical = criticalStages.includes(currentStage);

  return {
    currentStage,
    stageIndex,
    stageProgress,
    overallProgress,
    daysSinceSowing,
    totalDuration,
    isCritical,
    stages: stages.map((s, i) => ({
      ...s,
      completed: i < stageIndex,
      current: i === stageIndex,
    })),
  };
}

// ─── Weather Suitability Score (0-100) ───
function calculateWeatherScore(crop, daily, days, hourly) {
  let score = 100;
  let tempScore = 0;
  let rainScore = 0;
  let windScore = 0;

  for (let i = 0; i < days; i++) {
    const max = daily.temperature_2m_max[i];
    const min = daily.temperature_2m_min[i];
    const avg = (max + min) / 2;
    const rain = daily.precipitation_sum[i] || 0;
    const wind = daily.wind_speed_10m_max[i] || 0;

    // Temperature scoring
    if (avg >= crop.tempOptMin && avg <= crop.tempOptMax) {
      tempScore += 100;
    } else if (avg >= crop.tempMin && avg <= crop.tempMax) {
      tempScore += 65;
    } else if (max > crop.heatStress) {
      tempScore += 20;
    } else if (min < crop.frostThreshold) {
      tempScore += 10;
    } else {
      tempScore += 40;
    }

    // Rain scoring
    const weeklyRainSoFar = daily.precipitation_sum.slice(0, i + 1).reduce((a, b) => a + (b || 0), 0);
    if (rain > 50) rainScore += 15;           // Extreme
    else if (rain > 30) rainScore += 35;       // Heavy
    else if (rain > 10) rainScore += 70;       // Moderate
    else rainScore += 95;                      // Light/ideal

    // Wind scoring
    if (wind > 40) windScore += 20;
    else if (wind > 25) windScore += 50;
    else if (wind > crop.windSprayMax) windScore += 70;
    else windScore += 100;
  }

  const avgTemp = tempScore / days;
  const avgRain = rainScore / days;
  const avgWind = windScore / days;

  // Weighted average
  score = Math.round(avgTemp * 0.4 + avgRain * 0.35 + avgWind * 0.25);

  // Humidity penalty
  if (hourly?.relative_humidity_2m) {
    const totalHours = Math.min(hourly.relative_humidity_2m.length, days * 24);
    let highHumHours = 0;
    for (let h = 0; h < totalHours; h++) {
      if (hourly.relative_humidity_2m[h] >= crop.humidityDiseaseMin) highHumHours++;
    }
    const humPct = (highHumHours / totalHours) * 100;
    if (humPct > 60) score -= 12;
    else if (humPct > 40) score -= 6;
  }

  return Math.max(0, Math.min(100, score));
}

// ─── Soil Suitability Score ───
function calculateSoilScore(crop, soil) {
  let score = 50; // base

  // Check if this crop is ideal for this soil
  if (soil.bestCrops.includes(crop.id)) {
    score += 30;
  }

  // Fertility bonus
  score += soil.fertility * 15;

  // Water needs vs retention
  if (crop.waterNeedWeekly > 40 && soil.waterRetention < 0.4) {
    score -= 15; // High water need + low retention = bad
  }
  if (crop.waterNeedWeekly < 30 && soil.drainage > 0.7) {
    score += 5; // Low water need + good drainage = good
  }

  // Drainage for flood-prone crops
  if (crop.id === 'rice' && soil.waterRetention > 0.7) {
    score += 10; // Rice likes standing water
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

// ─── Yield Prediction ───
function predictYield(crop, soil, irrMethod, area, weatherScore, soilScore, growthStage) {
  const baseYield = BASE_YIELDS[crop.id] || 10;

  // Apply multipliers
  const soilMultiplier = soil.yieldMultiplier;
  const irrigationMultiplier = irrMethod.multiplier;
  const weatherMultiplier = weatherScore / 100;
  const soilFitMultiplier = soilScore / 100;

  // Combined multiplier (weighted)
  const combinedMultiplier = (
    soilMultiplier * 0.25 +
    irrigationMultiplier * 0.25 +
    weatherMultiplier * 0.3 +
    soilFitMultiplier * 0.2
  );

  const predictedYieldPerAcre = Math.round(baseYield * combinedMultiplier * 10) / 10;
  const totalYield = Math.round(predictedYieldPerAcre * area * 10) / 10;

  // Estimate range (±15%)
  const yieldLow = Math.round(predictedYieldPerAcre * 0.85 * 10) / 10;
  const yieldHigh = Math.round(predictedYieldPerAcre * 1.15 * 10) / 10;

  // Confidence based on data quality
  const confidence = Math.round((weatherScore * 0.4 + soilScore * 0.3 + 50 * 0.3));

  return {
    perAcre: predictedYieldPerAcre,
    total: totalYield,
    rangeLow: yieldLow,
    rangeHigh: yieldHigh,
    unit: crop.id === 'sugarcane' ? 'tonnes/acre' : 'quintals/acre',
    confidence,
    baseYield,
    multipliers: {
      soil: soilMultiplier,
      irrigation: irrigationMultiplier,
      weather: weatherMultiplier,
      soilFit: soilFitMultiplier,
    },
  };
}

// ─── Risk Assessment ───
function assessRisks(crop, soil, daily, days, hourly, irrMethod, growthStage) {
  const risks = [];

  // Drought risk
  const totalRain = daily.precipitation_sum.reduce((s, v) => s + (v || 0), 0);
  const dryDays = daily.precipitation_sum.filter(v => v < 1).length;
  const deficit = crop.waterNeedWeekly - totalRain;
  let droughtLevel = 'low';
  let droughtScore = 0;

  if (deficit > 20 && irrMethod.waterEfficiency < 0.5) {
    droughtLevel = 'high';
    droughtScore = 85;
  } else if (deficit > 10) {
    droughtLevel = irrMethod.waterEfficiency > 0.7 ? 'low' : 'medium';
    droughtScore = irrMethod.waterEfficiency > 0.7 ? 30 : 55;
  } else {
    droughtScore = 15;
  }

  risks.push({
    icon: '🏜️',
    name: 'Drought Stress',
    level: droughtLevel,
    score: droughtScore,
    detail: deficit > 0
      ? `Water deficit of ${Math.round(deficit)}mm this week. ${dryDays} dry days expected.`
      : `Adequate rainfall expected (${Math.round(totalRain)}mm).`,
  });

  // Flood risk
  const heavyRainDays = daily.precipitation_sum.filter(v => v > 30).length;
  let floodLevel = 'low';
  let floodScore = 10;

  if (heavyRainDays >= 2 && soil.drainage < 0.5) {
    floodLevel = 'high';
    floodScore = 80;
  } else if (heavyRainDays >= 1) {
    floodLevel = soil.drainage < 0.5 ? 'medium' : 'low';
    floodScore = soil.drainage < 0.5 ? 55 : 30;
  }

  risks.push({
    icon: '🌊',
    name: 'Flood / Waterlogging',
    level: floodLevel,
    score: floodScore,
    detail: heavyRainDays > 0
      ? `${heavyRainDays} heavy rain day(s) expected. Soil drainage: ${Math.round(soil.drainage * 100)}%.`
      : 'No heavy rain expected. Low waterlogging risk.',
  });

  // Heat stress
  const heatDays = daily.temperature_2m_max.filter(v => v >= crop.heatStress).length;
  let heatLevel = 'low';
  let heatScore = 10;

  if (heatDays >= 3) {
    heatLevel = 'high';
    heatScore = 75;
  } else if (heatDays >= 1) {
    heatLevel = growthStage.isCritical ? 'high' : 'medium';
    heatScore = growthStage.isCritical ? 70 : 45;
  }

  risks.push({
    icon: '🔥',
    name: 'Heat Stress',
    level: heatLevel,
    score: heatScore,
    detail: heatDays > 0
      ? `${heatDays} day(s) above ${crop.heatStress}°C. ${growthStage.isCritical ? '⚠️ Critical growth stage!' : ''}`
      : `Temperatures within safe range (<${crop.heatStress}°C).`,
  });

  // Disease pressure
  let diseaseLevel = 'low';
  let diseaseScore = 10;

  if (hourly?.relative_humidity_2m) {
    const totalHours = Math.min(hourly.relative_humidity_2m.length, days * 24);
    let highHumHours = 0;
    for (let h = 0; h < totalHours; h++) {
      if (hourly.relative_humidity_2m[h] >= crop.humidityDiseaseMin) highHumHours++;
    }
    const humPct = (highHumHours / totalHours) * 100;

    if (humPct > 60) {
      diseaseLevel = 'high';
      diseaseScore = 80;
    } else if (humPct > 35) {
      diseaseLevel = 'medium';
      diseaseScore = 50;
    }

    risks.push({
      icon: '🦠',
      name: 'Disease Pressure',
      level: diseaseLevel,
      score: diseaseScore,
      detail: humPct > 35
        ? `High humidity (>${crop.humidityDiseaseMin}%) for ${Math.round(humPct)}% of hours. Risk: ${crop.diseases.slice(0, 2).join(', ')}.`
        : 'Low humidity-driven disease risk this week.',
    });
  }

  // Pest risk (simplified — warm + humid = higher pest risk)
  const avgTemp = daily.temperature_2m_max.reduce((s, v) => s + v, 0) / days;
  let pestLevel = 'low';
  let pestScore = 15;

  if (avgTemp > 30 && diseaseScore > 40) {
    pestLevel = 'medium';
    pestScore = 50;
  }
  if (avgTemp > 35 && totalRain > 30) {
    pestLevel = 'high';
    pestScore = 70;
  }

  risks.push({
    icon: '🐛',
    name: 'Pest Pressure',
    level: pestLevel,
    score: pestScore,
    detail: pestLevel === 'high'
      ? 'Warm, wet conditions favor pest proliferation. Monitor fields closely.'
      : pestLevel === 'medium'
        ? 'Moderate pest risk. Regular scouting recommended.'
        : 'Low pest risk based on current weather conditions.',
  });

  return risks;
}

// ─── Reduction Estimate ───
function estimateReduction(weatherScore, soilScore, risks, growthStage) {
  // Base reduction from weather
  let weatherReduction = Math.max(0, 100 - weatherScore);

  // Weight by growth stage criticality
  if (growthStage.isCritical) {
    weatherReduction *= 1.3; // 30% more impact during critical stages
  }

  // Soil penalty
  const soilPenalty = Math.max(0, 50 - soilScore) * 0.5;

  // Risk-based reduction
  const highRisks = risks.filter(r => r.level === 'high');
  const medRisks = risks.filter(r => r.level === 'medium');
  const riskReduction = highRisks.length * 8 + medRisks.length * 3;

  // Total
  const totalReduction = Math.min(70, Math.round(weatherReduction * 0.4 + soilPenalty * 0.2 + riskReduction * 0.4));

  // Breakdown
  const factors = [];
  if (weatherReduction > 15) {
    factors.push({ name: 'Weather Stress', value: Math.round(weatherReduction * 0.4), icon: '⛅' });
  }
  if (soilPenalty > 5) {
    factors.push({ name: 'Soil Mismatch', value: Math.round(soilPenalty * 0.2), icon: '🟤' });
  }
  if (riskReduction > 5) {
    factors.push({ name: 'Risk Factors', value: Math.round(riskReduction * 0.4), icon: '⚠️' });
  }

  if (factors.length === 0) {
    factors.push({ name: 'Conditions Favorable', value: 0, icon: '✅' });
  }

  const severity = totalReduction <= 10 ? 'minimal'
    : totalReduction <= 25 ? 'moderate'
      : totalReduction <= 40 ? 'significant'
        : 'severe';

  return {
    totalPercent: totalReduction,
    severity,
    factors,
    message: totalReduction <= 10
      ? '✅ Minimal yield loss expected. Conditions are favorable for your crop!'
      : totalReduction <= 25
        ? '⚠️ Moderate yield reduction possible. Follow recommendations to mitigate losses.'
        : totalReduction <= 40
          ? '🟠 Significant yield reduction likely. Immediate action needed to protect your crop.'
          : '🔴 Severe yield loss expected. Consider protective measures and consult local agricultural officer.',
  };
}

// ─── Recommendations ───
function generateRecommendations(crop, soil, irrMethod, growthStage, risks, daily, weatherScore) {
  const recs = [];
  const days = daily.time.length;
  const totalRain = daily.precipitation_sum.reduce((s, v) => s + (v || 0), 0);

  // Growth-stage specific recommendations
  if (growthStage.currentStage) {
    recs.push({
      icon: '🌱',
      title: `${growthStage.currentStage} Stage Care`,
      priority: 'high',
      body: getStageAdvice(crop, growthStage),
    });
  }

  // Irrigation recommendations
  const deficit = crop.waterNeedWeekly - totalRain;
  if (deficit > 5) {
    const irrigationAmount = Math.round(deficit / irrMethod.waterEfficiency);
    recs.push({
      icon: '💧',
      title: 'Irrigation Schedule',
      priority: deficit > 20 ? 'high' : 'medium',
      body: `Apply approximately ${irrigationAmount}mm of water this week via ${irrMethod.name}. ${crop.tips.irrigation}`,
    });
  }

  // Risk-based recommendations
  const highRisks = risks.filter(r => r.level === 'high' || r.level === 'medium');
  for (const risk of highRisks) {
    if (risk.name === 'Disease Pressure') {
      recs.push({
        icon: '🧪',
        title: 'Fungicide Application',
        priority: risk.level === 'high' ? 'high' : 'medium',
        body: `Apply preventive fungicide for ${crop.diseases.slice(0, 2).join(' / ')}. Best days: ${findDryDays(daily, days).join(', ') || 'first dry window'}.`,
      });
    }
    if (risk.name === 'Heat Stress') {
      recs.push({
        icon: '🌡️',
        title: 'Heat Management',
        priority: 'high',
        body: 'Apply mulch to reduce soil temperature. Irrigate in early morning or late evening. Use shade nets for sensitive plants.',
      });
    }
    if (risk.name === 'Flood / Waterlogging') {
      recs.push({
        icon: '🌊',
        title: 'Drainage Management',
        priority: 'high',
        body: 'Clear all drainage channels immediately. Avoid applying fertilizers before heavy rain. Harvest mature produce if possible.',
      });
    }
  }

  // Soil-specific recommendations
  if (!soil.bestCrops.includes(crop.id)) {
    recs.push({
      icon: '🟤',
      title: 'Soil Amendment',
      priority: 'medium',
      body: getSoilAmendment(crop, soil),
    });
  }

  // Harvest readiness
  if (growthStage.overallProgress > 80) {
    recs.push({
      icon: '🫳',
      title: 'Harvest Planning',
      priority: 'high',
      body: `Crop is nearing maturity (${growthStage.overallProgress}% complete). ${crop.tips.harvest}`,
    });
  }

  // General best practice
  if (weatherScore > 70 && highRisks.length === 0) {
    recs.push({
      icon: '✅',
      title: 'Favorable Conditions',
      priority: 'low',
      body: 'Weather conditions are good for your crop! Continue regular management practices and field scouting.',
    });
  }

  return recs;
}

// ─── Helper: Stage-specific advice ───
function getStageAdvice(crop, growthStage) {
  const adviceMap = {
    'Germination': `Ensure adequate soil moisture for uniform germination. Avoid waterlogging. Monitor for seedling diseases.`,
    'Seedling': `Thin plants if overcrowded. Apply starter fertilizer. Protect from pests and strong winds.`,
    'Tillering': `Apply nitrogen fertilizer. ${crop.id === 'rice' ? 'Maintain 5cm standing water.' : 'Ensure adequate moisture.'} This stage determines yield potential.`,
    'Vegetative': `Apply balanced NPK fertilizer. Weed management is critical. Ensure consistent moisture.`,
    'Flowering': `⚠️ Critical stage! Stress now directly reduces yield. Ensure no water deficit. Avoid pesticide spraying on flowers.`,
    'Tasseling': `⚠️ Most critical stage for maize! Even 1-2 days of moisture stress can reduce yield by 20-30%.`,
    'Silking': `Ensure no moisture stress. Pollen viability depends on temperature — excessive heat causes kernel abortion.`,
    'Grain Filling': `Maintain steady water supply. This stage determines grain weight. Apply potassium if deficient.`,
    'Pod Filling': `Maintain consistent moisture. Any stress reduces seed size. Monitor for pod borers.`,
    'Maturity': `Reduce irrigation. Monitor for harvest readiness. ${crop.tips.harvest}`,
    'Fruiting': `Ensure consistent irrigation. Apply calcium to prevent blossom end rot. Harvest at right color stage.`,
    'Pegging': `Do not disturb soil around plants. Maintain adequate moisture for proper peg penetration.`,
    'Bulb Filling': `Reduce nitrogen. Ensure consistent moisture. Stop irrigation 2 weeks before harvest.`,
    'Tuber Bulking': `Maintain soil moisture consistently. Any fluctuation causes growth cracks. Apply potassium.`,
    'Harvest Period': `Harvest regularly at optimal maturity stage. Avoid harvesting wet produce.`,
    'Grand Growth': `Peak water requirement. Ensure regular irrigation. Apply nitrogen for maximum cane development.`,
    'Boll Development': `Monitor for bollworm. Ensure adequate moisture. Avoid late nitrogen application.`,
    'Square Formation': `Apply phosphorus-based fertilizer. Monitor for jassids and thrips.`,
    'Crown Root': `Apply first irrigation. Ensure proper establishment. Scout for termites.`,
    'Heading': `Apply final nitrogen dose. Ensure adequate moisture for proper head emergence.`,
    'Bulb Init.': `Longer day length triggers bulbing. Ensure adequate phosphorus.`,
    'Siliqua Dev.': `Maintain moisture for proper seed filling. Monitor for aphids.`,
    'Sprout Dev.': `Maintain soil temperature at 15-20°C. Ensure adequate moisture for uniform sprouting.`,
    'Tuber Init.': `Earthing up is critical. Maintain cool soil temperatures if possible.`,
  };

  return adviceMap[growthStage.currentStage] || `Continue regular care for the ${growthStage.currentStage} stage of ${crop.name}.`;
}

// ─── Helper: Soil amendment suggestions ───
function getSoilAmendment(crop, soil) {
  if (soil.fertility < 0.5) {
    return `${soil.name} has low fertility. Apply organic compost (5-10 tonnes/acre) and balanced NPK fertilizer for better ${crop.name} yields.`;
  }
  if (soil.waterRetention < 0.3 && crop.waterNeedWeekly > 30) {
    return `${soil.name} has poor water retention. Add organic matter and mulch. Consider more frequent, smaller irrigations.`;
  }
  if (soil.drainage < 0.4 && crop.id !== 'rice') {
    return `${soil.name} has poor drainage. Create raised beds or ridges for ${crop.name} to avoid root rot from waterlogging.`;
  }
  return `${soil.name} is not ideal for ${crop.name}. Consider soil amendments like compost, lime, or gypsum based on soil test results.`;
}

// ─── Helper: Find dry days for spraying ───
function findDryDays(daily, days) {
  const dryDays = [];
  for (let i = 0; i < days && dryDays.length < 3; i++) {
    if ((daily.precipitation_sum[i] || 0) < 2 && (daily.wind_speed_10m_max[i] || 0) < 15) {
      const dt = new Date(daily.time[i] + 'T00:00:00');
      dryDays.push(dt.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }));
    }
  }
  return dryDays;
}

// ─── Weather Summary ───
function summarizeWeather(daily, days) {
  const avgMaxTemp = Math.round(daily.temperature_2m_max.reduce((s, v) => s + v, 0) / days);
  const avgMinTemp = Math.round(daily.temperature_2m_min.reduce((s, v) => s + v, 0) / days);
  const totalRain = Math.round(daily.precipitation_sum.reduce((s, v) => s + (v || 0), 0));
  const avgWind = Math.round(daily.wind_speed_10m_max.reduce((s, v) => s + (v || 0), 0) / days);
  const rainyDays = daily.precipitation_sum.filter(v => v > 2).length;

  // Dominant weather
  const codes = daily.weather_code;
  const codeCount = {};
  codes.forEach(c => { codeCount[c] = (codeCount[c] || 0) + 1; });
  const dominantCode = Object.entries(codeCount).sort((a, b) => b[1] - a[1])[0]?.[0];
  const dominant = getWeatherInfo(Number(dominantCode));

  return {
    avgMaxTemp,
    avgMinTemp,
    totalRain,
    avgWind,
    rainyDays,
    dominantWeather: dominant,
  };
}
