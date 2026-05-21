/**
 * FarmSense — Precipitation Chart
 * Bar chart for rain amount + line for probability
 */
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

let chartInstance = null;

export function renderPrecipitationChart(canvasId, daily) {
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

  // Color bars by intensity
  const barColors = daily.precipitation_sum.map(v => {
    if (v > 30) return 'rgba(239, 68, 68, 0.7)';     // Heavy
    if (v > 10) return 'rgba(251, 191, 36, 0.7)';     // Moderate
    if (v > 2) return 'rgba(56, 189, 248, 0.7)';      // Light
    return 'rgba(56, 189, 248, 0.35)';                  // Trace
  });

  const barBorders = daily.precipitation_sum.map(v => {
    if (v > 30) return '#ef4444';
    if (v > 10) return '#fbbf24';
    return '#38bdf8';
  });

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          type: 'bar',
          label: 'Rain (mm)',
          data: daily.precipitation_sum,
          backgroundColor: barColors,
          borderColor: barBorders,
          borderWidth: 1,
          borderRadius: 4,
          barPercentage: 0.6,
          yAxisID: 'y',
        },
        {
          type: 'line',
          label: 'Probability %',
          data: daily.precipitation_probability_max,
          borderColor: '#a78bfa',
          backgroundColor: 'rgba(167, 139, 250, 0.1)',
          borderWidth: 2,
          fill: false,
          tension: 0.3,
          pointRadius: 3,
          pointBackgroundColor: '#a78bfa',
          pointBorderColor: '#0c1222',
          pointBorderWidth: 2,
          yAxisID: 'y1',
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
        },
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#64748b', font: { size: 11 } },
        },
        y: {
          position: 'left',
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: {
            color: '#38bdf8',
            font: { size: 11 },
            callback: v => v + 'mm',
          },
          title: {
            display: true,
            text: 'Rainfall',
            color: '#64748b',
            font: { size: 10 },
          },
        },
        y1: {
          position: 'right',
          min: 0,
          max: 100,
          grid: { display: false },
          ticks: {
            color: '#a78bfa',
            font: { size: 11 },
            callback: v => v + '%',
          },
          title: {
            display: true,
            text: 'Probability',
            color: '#64748b',
            font: { size: 10 },
          },
        },
      },
    },
  });
}
