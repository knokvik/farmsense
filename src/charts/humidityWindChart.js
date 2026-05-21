/**
 * FarmSense — Humidity & Wind Chart
 * Combined area chart for humidity + line for wind speed
 */
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

let chartInstance = null;

export function renderHumidityWindChart(canvasId, daily, hourly) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  const ctx = canvas.getContext('2d');
  const days = daily.time.length;
  const labels = daily.time.map(d => {
    const dt = new Date(d + 'T00:00:00');
    return dt.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
  });

  // Calculate daily average humidity from hourly data
  const dailyHumidity = [];
  for (let i = 0; i < days; i++) {
    const start = i * 24;
    const end = Math.min(start + 24, hourly.relative_humidity_2m.length);
    let sum = 0, count = 0;
    for (let h = start; h < end; h++) {
      if (hourly.relative_humidity_2m[h] != null) {
        sum += hourly.relative_humidity_2m[h];
        count++;
      }
    }
    dailyHumidity.push(count > 0 ? Math.round(sum / count) : 0);
  }

  // Gradient for humidity
  const humidityGradient = ctx.createLinearGradient(0, 0, 0, 220);
  humidityGradient.addColorStop(0, 'rgba(45, 212, 191, 0.3)');
  humidityGradient.addColorStop(1, 'rgba(45, 212, 191, 0.02)');

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Humidity %',
          data: dailyHumidity,
          borderColor: '#2dd4bf',
          backgroundColor: humidityGradient,
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#2dd4bf',
          pointBorderColor: '#0c1222',
          pointBorderWidth: 2,
          yAxisID: 'y',
        },
        {
          label: 'Wind km/h',
          data: daily.wind_speed_10m_max,
          borderColor: '#fb923c',
          backgroundColor: 'rgba(251, 146, 60, 0.1)',
          borderWidth: 2.5,
          fill: false,
          tension: 0.3,
          pointRadius: 4,
          pointBackgroundColor: '#fb923c',
          pointBorderColor: '#0c1222',
          pointBorderWidth: 2,
          yAxisID: 'y1',
          borderDash: [5, 3],
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
          min: 0,
          max: 100,
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: {
            color: '#2dd4bf',
            font: { size: 11 },
            callback: v => v + '%',
          },
          title: {
            display: true,
            text: 'Humidity',
            color: '#64748b',
            font: { size: 10 },
          },
        },
        y1: {
          position: 'right',
          grid: { display: false },
          ticks: {
            color: '#fb923c',
            font: { size: 11 },
            callback: v => v + ' km/h',
          },
          title: {
            display: true,
            text: 'Wind Speed',
            color: '#64748b',
            font: { size: 10 },
          },
        },
      },
    },
  });
}
