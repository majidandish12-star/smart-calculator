// ui.js
// 🎛️ UI Controller for Smart Calculator + RealityCalc
import { SmartEngine } from './smart-engine.js';

document.addEventListener("DOMContentLoaded", () => {
  const display = document.getElementById("display");
  const buttons = document.querySelectorAll("button");
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const upload = document.getElementById('upload');
  const chartContainer = document.getElementById('chartContainer');

  const engine = new SmartEngine('engineer'); // پروفایل پیش‌فرض
  let chart = null;

  function updateDisplay(value) {
    display.textContent = value;
  }

  // =======================
  // دکمه‌ها
  // =======================
  buttons.forEach(btn => {
    btn.addEventListener("click", async () => {
      const val = btn.textContent;

      switch (val) {
        case "C":
          engine.clearHistory();
          engine.clearRealityHistory();
          updateDisplay("0");
          if (chart) chart.destroy();
          break;

        case "=":
          try {
            const res = engine.evaluate(display.textContent);
            updateDisplay(res.result);
          } catch {
            updateDisplay("خطا");
          }
          break;

        case "📷 تحلیل تصویر":
          upload.click();
          break;

        case "CSV":
          exportCSV();
          break;

        case "PDF":
          exportPDF();
          break;

        default:
          if (engine.input) {
            engine.input(val);
            updateDisplay(engine.getDisplayValue ? engine.getDisplayValue() : display.textContent + val);
          } else {
            updateDisplay(display.textContent + val);
          }
      }
    });
  });

  // =======================
  // تحلیل تصویر / Reality
  // =======================
  upload.addEventListener("change", async () => {
    const file = upload.files[0];
    if (!file) return alert('یک تصویر انتخاب کنید!');

    try {
      const data = await engine.analyzeReality(file);
      engine.displayResult('display', data);
      updateChart();
    } catch (e) {
      alert("خطا در تحلیل تصویر: " + e.message);
    }
  });

  // =======================
  // نمودار تعاملی
  // =======================
  function updateChart() {
    const history = engine.getRealityHistory();
    if (!history.length) return;

    const labels = history.map((_, i) => `شیء ${i+1}`);
    const weights = history.map(h => h.weight);
    const volumes = history.map(h => h.volume);
    const energies = history.map(h => h.physics.kinetic_energy);

    if (chart) chart.destroy();

    chart = new Chart(chartContainer.getContext('2d'), {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'وزن (kg)', data: weights, backgroundColor: 'rgba(54, 162, 235, 0.6)' },
          { label: 'حجم (m³)', data: volumes, backgroundColor: 'rgba(255, 206, 86, 0.6)' },
          { label: 'انرژی جنبشی (J)', data: energies, backgroundColor: 'rgba(75, 192, 192, 0.6)' }
        ]
      },
      options: { responsive: true, plugins: { legend: { position: 'top' } } }
    });
  }

  // =======================
  // خروجی CSV
  // =======================
  function exportCSV() {
    const history = engine.getRealityHistory();
    let csv = 'Object,Weight(kg),Volume(m3),KineticEnergy(J),Density,Momentum\n';
    history.forEach((h, i) => {
      csv += `Object ${i+1},${h.weight},${h.volume},${h.physics.kinetic_energy},${h.physics.density},${h.physics.momentum}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'hypercalc_data.csv';
    link.click();
  }

  // =======================
  // خروجی PDF
  // =======================
  function exportPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const history = engine.getRealityHistory();
    doc.setFontSize(12);
    doc.text('HyperCalc Reality Analysis', 10, 10);
    let y = 20;
    history.forEach((h, i) => {
      doc.text(`شیء ${i+1}: وزن=${h.weight.toFixed(2)}kg, حجم=${h.volume.toFixed(2)}m³, انرژی=${h.physics.kinetic_energy.toFixed(2)}J`, 10, y);
      y += 10;
    });
    doc.save('hypercalc_report.pdf');
  }

  // =======================
  // Service Worker
  // =======================
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js'));
  }

});
