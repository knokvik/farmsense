/**
 * FarmSense — Crop Doctor
 * Handles UI for pest/disease image upload and mock AI analysis
 */

import { t } from '../services/i18n.js';

export function initCropDoctor(containerId, getSelectedCrop) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="crop-doctor-card glass-card" style="margin-top: 24px;">
      <div class="cd-header" style="display:flex; align-items:center; gap: 12px; margin-bottom: 16px;">
        <span class="cd-icon" style="font-size:2rem;">🩺</span>
        <div>
          <h3 class="cd-title" style="margin:0; font-size:1.2rem; font-weight:600;" data-i18n="cropDoctorTitle">${t('cropDoctorTitle')}</h3>
          <p class="cd-desc" style="margin:0; font-size:0.9rem; color:var(--text-secondary);" data-i18n="cropDoctorDesc">${t('cropDoctorDesc')}</p>
        </div>
      </div>
      
      <div class="cd-upload-area" id="cd-upload-area" style="border: 2px dashed var(--border); border-radius: 12px; padding: 32px; text-align: center; cursor: pointer; transition: all 0.2s; position:relative; overflow:hidden;">
        <input type="file" id="cd-file-input" accept="image/*" style="display:none;" />
        <div id="cd-upload-content">
          <span style="font-size: 2.5rem; margin-bottom: 12px; display:block;">📸</span>
          <p style="margin:0; font-weight:500;" id="cd-upload-text">${t('tapToUpload')}</p>
        </div>
        
        <!-- Scanning Animation Overlay -->
        <div id="cd-scanner" class="hidden" style="position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); display:flex; flex-direction:column; align-items:center; justify-content:center;">
          <div style="width: 100px; height: 100px; border: 4px solid var(--accent-main); border-radius: 8px; position:relative;">
             <div style="position:absolute; top:0; left:0; width:100%; height:4px; background:var(--accent-main); box-shadow: 0 0 10px var(--accent-main); animation: scanline 1.5s infinite ease-in-out;"></div>
          </div>
          <p style="color:white; margin-top:16px; font-weight:600; animation: pulse 1s infinite;" id="cd-scanner-text">${t('analyzingImage')}</p>
        </div>
      </div>

      <div id="cd-result" class="hidden" style="margin-top: 20px; padding: 16px; border-radius: 8px; background: var(--bg-hover); border: 1px solid var(--border-subtle);">
        <!-- Results injected here -->
      </div>
    </div>

    <style>
      @keyframes scanline {
        0% { top: 0%; }
        50% { top: 100%; }
        100% { top: 0%; }
      }
      @keyframes pulse {
        0% { opacity: 0.6; }
        50% { opacity: 1; }
        100% { opacity: 0.6; }
      }
      .cd-upload-area:hover { border-color: var(--accent-main); background: rgba(34, 197, 94, 0.05); }
    </style>
  `;

  const uploadArea = container.querySelector('#cd-upload-area');
  const fileInput = container.querySelector('#cd-file-input');
  const scanner = container.querySelector('#cd-scanner');
  const resultDiv = container.querySelector('#cd-result');

  uploadArea.addEventListener('click', () => {
    // Only open file dialog if we aren't scanning
    if (scanner.classList.contains('hidden')) {
      fileInput.click();
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      const crop = getSelectedCrop();
      
      if (!crop) {
        alert(t('pleaseSelectCropAlert'));
        fileInput.value = ''; // reset
        return;
      }
      
      // Start mock scanning
      scanner.classList.remove('hidden');
      resultDiv.classList.add('hidden');
      
      // Simulate network/ML delay
      setTimeout(() => {
        scanner.classList.add('hidden');
        showMockResult(resultDiv, crop);
        fileInput.value = ''; // reset
      }, 2000);
    }
  });
}

export function showMockResult(container, crop) {
  // Grab a random disease from the crop's disease list
  const diseases = crop.diseases || ['General fungal infection'];
  const disease = diseases[Math.floor(Math.random() * diseases.length)];
  
  // Translate disease name and crop name
  const translatedDisease = t(disease) || disease;
  const translatedCrop = t(crop.id);

  container.innerHTML = `
    <h4 style="margin:0 0 8px 0; color:var(--red-500); display:flex; align-items:center; gap:8px;">
      <span>⚠️</span> ${t('highConfidenceMatch')}: ${translatedDisease}
    </h4>
    <p style="margin:0 0 12px 0; font-size:0.9rem; color:var(--text-secondary);">
      ${t('cropDoctorResultDesc')} <strong>${translatedDisease}</strong> ${t('per_acre') === 'प्रति एकड़' ? 'का है आपके ' : 'for your '} ${translatedCrop}.
    </p>
    <div style="padding:12px; background:rgba(34,197,94,0.1); border-left:4px solid var(--accent-main); border-radius:4px;">
      <h5 style="margin:0 0 4px 0; color:var(--accent-main);">${t('recommendedAction')}</h5>
      <p style="margin:0; font-size:0.85rem;">
        ${t('cropDoctorResultAction')}
      </p>
    </div>
  `;
  container.classList.remove('hidden');
  container.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
