/**
 * FarmSense — Temperature Chart
 * 7-day min/max temperature line chart with gradient fills
 */
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

let chartInstance = null;

export function renderTemperatureChart(canvasId, daily) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  const ctx = canvas.getContext('2d');
  const labels = daily.time.map(d => {
    const dt = new Date(d + 'T00:00:00');
    return dt.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
  });

  // Gradient fills
  const gradientMax = ctx.createLinearGradient(0, 0, 0, 220);
  gradientMax.addColorStop(0, 'rgba(251, 191, 36, 0.3)');
  gradientMax.addColorStop(1, 'rgba(251, 191, 36, 0.01)');

  const gradientMin = ctx.createLinearGradient(0, 0, 0, 220);
  gradientMin.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
  gradientMin.addColorStop(1, 'rgba(56, 189, 248, 0.01)');

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Max °C',
          data: daily.temperature_2m_max,
          borderColor: '#fbbf24',
          backgroundColor: gradientMax,
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#fbbf24',
          pointBorderColor: '#0c1222',
          pointBorderWidth: 2,
          pointHoverRadius: 6,
        },
        {
          label: 'Min °C',
          data: daily.temperature_2m_min,
          borderColor: '#38bdf8',
          backgroundColor: gradientMin,
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#38bdf8',
          pointBorderColor: '#0c1222',
          pointBorderWidth: 2,
          pointHoverRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index',
      },
      plugins: {
        legend: {
          labels: {
            color: '#94a3b8',
            font: { family: "'Inter', sans-serif", size: 11 },
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 16,
          },
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          borderColor: 'rgba(255,255,255,0.08)',
          borderWidth: 1,
          titleColor: '#f1f5f9',
          bodyColor: '#94a3b8',
          padding: 12,
          cornerRadius: 8,
          titleFont: { family: "'Inter', sans-serif", weight: '600' },
          bodyFont: { family: "'Inter', sans-serif" },
          callbacks: {
            label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y}°C`,
          },
        },
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#64748b', font: { size: 11 } },
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: {
            color: '#64748b',
            font: { size: 11 },
            callback: v => v + '°',
          },
        },
      },
    },
  });
}
