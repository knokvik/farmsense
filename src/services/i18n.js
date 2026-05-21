/**
 * FarmSense — Internationalization & Voice Service
 */

const DICTIONARY = {
  en: {
    dashboardTitle: '📊 Farm Dashboard',
    weatherTab: 'Weather',
    advisoryTab: 'Advisory',
    predictionsTab: 'Predictions',
    listen: '🔊 Listen',
    stop: '🔇 Stop',
    // We'll keep it simple for now, the real magic is the Voice Synthesis reading the dynamic text
  },
  hi: {
    dashboardTitle: '📊 फार्म डैशबोर्ड',
    weatherTab: 'मौसम',
    advisoryTab: 'सलाह',
    predictionsTab: 'भविष्यवाणी',
    listen: '🔊 सुनें',
    stop: '🔇 रोकें',
  }
};

let currentLang = 'en';
let synth = window.speechSynthesis;

export function setLanguage(lang) {
  if (DICTIONARY[lang]) {
    currentLang = lang;
    document.documentElement.lang = lang;
    updateUI();
  }
}

export function getLang() {
  return currentLang;
}

export function t(key) {
  return DICTIONARY[currentLang][key] || DICTIONARY['en'][key] || key;
}

function updateUI() {
  // Simple data-i18n attribute replacement
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
}

// ─── Voice Synthesis ───
export function speakText(text) {
  if (!synth) return;
  
  synth.cancel(); // Stop any ongoing speech

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Try to find a voice that matches the current language
  const voices = synth.getVoices();
  const langPrefix = currentLang === 'hi' ? 'hi-IN' : 'en-';
  
  const voice = voices.find(v => v.lang.startsWith(langPrefix)) || voices[0];
  if (voice) {
    utterance.voice = voice;
  }
  
  utterance.rate = 0.9; // Slightly slower for clarity
  utterance.pitch = 1;
  
  synth.speak(utterance);
}

export function stopSpeaking() {
  if (synth) synth.cancel();
}

// Ensure voices are loaded (browser quirk)
if (synth && synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = () => synth.getVoices();
}
