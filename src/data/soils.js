/**
 * FarmSense — Indian Soil Types Database
 * Properties used by the prediction engine for yield & risk estimation
 */

const soils = [
  {
    id: 'alluvial',
    name: 'Alluvial Soil',
    emoji: '🏞️',
    desc: 'Found in Indo-Gangetic plains. Rich in potash, very fertile.',
    waterRetention: 0.7,    // 0-1 scale
    drainage: 0.65,
    fertility: 0.9,
    bestCrops: ['rice', 'wheat', 'sugarcane', 'maize'],
    yieldMultiplier: 1.1,   // Boost factor to base yield
  },
  {
    id: 'black',
    name: 'Black Soil (Regur)',
    emoji: '⬛',
    desc: 'Deccan plateau. Rich in calcium, magnesium. Self-ploughing clay.',
    waterRetention: 0.9,
    drainage: 0.35,
    fertility: 0.85,
    bestCrops: ['cotton', 'soybean', 'jowar', 'groundnut'],
    yieldMultiplier: 1.05,
  },
  {
    id: 'red',
    name: 'Red Soil',
    emoji: '🟤',
    desc: 'Southern & Eastern India. Iron-rich, low in nitrogen/phosphorus.',
    waterRetention: 0.4,
    drainage: 0.8,
    fertility: 0.55,
    bestCrops: ['groundnut', 'bajra', 'potato', 'tomato'],
    yieldMultiplier: 0.85,
  },
  {
    id: 'laterite',
    name: 'Laterite Soil',
    emoji: '🧱',
    desc: 'Western Ghats & northeast. Acidic, rich in iron/aluminum.',
    waterRetention: 0.3,
    drainage: 0.9,
    fertility: 0.4,
    bestCrops: ['tea', 'coffee', 'cashew', 'rubber'],
    yieldMultiplier: 0.75,
  },
  {
    id: 'clay',
    name: 'Clay Soil',
    emoji: '🫙',
    desc: 'Heavy texture, high water holding capacity. Sticky when wet.',
    waterRetention: 0.95,
    drainage: 0.2,
    fertility: 0.7,
    bestCrops: ['rice', 'wheat', 'sugarcane'],
    yieldMultiplier: 0.9,
  },
  {
    id: 'sandy',
    name: 'Sandy Soil',
    emoji: '🏜️',
    desc: 'Rajasthan, coastal regions. Low water retention, easy to till.',
    waterRetention: 0.2,
    drainage: 0.95,
    fertility: 0.3,
    bestCrops: ['bajra', 'groundnut', 'mustard'],
    yieldMultiplier: 0.7,
  },
  {
    id: 'loamy',
    name: 'Loamy Soil',
    emoji: '🌿',
    desc: 'Ideal mix of sand, silt, clay. Best for most crops.',
    waterRetention: 0.65,
    drainage: 0.7,
    fertility: 0.85,
    bestCrops: ['wheat', 'maize', 'tomato', 'onion', 'potato'],
    yieldMultiplier: 1.15,
  },
  {
    id: 'mountain',
    name: 'Mountain / Forest Soil',
    emoji: '⛰️',
    desc: 'Hilly regions. Rich in humus, acidic, high organic content.',
    waterRetention: 0.55,
    drainage: 0.75,
    fertility: 0.65,
    bestCrops: ['potato', 'maize', 'wheat'],
    yieldMultiplier: 0.8,
  },
  {
    id: 'desert',
    name: 'Desert Soil (Arid)',
    emoji: '🌵',
    desc: 'Thar region. High mineral content, very low organic matter.',
    waterRetention: 0.15,
    drainage: 0.95,
    fertility: 0.25,
    bestCrops: ['bajra', 'mustard', 'jowar'],
    yieldMultiplier: 0.6,
  },
];

export default soils;

export function getSoilById(id) {
  return soils.find(s => s.id === id) || null;
}
