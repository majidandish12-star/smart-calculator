// ui.js
// 🎛️ UI Controller نهایی برای Smart Calculator + Reality & AutoTrainer + Offline

import { CalculatorEngine } from './calculator.js';
import { AutoTrainer } from './auto_trainer.js';
import { GeometryEngine } from './geometry.js';
import { CanvasMeasure } from './canvas-measure.js';
import { PhysicsSandbox } from './physics/sandbox.js';
import { HyperUltraPhysicsBody } from './physics/body.js';

document.addEventListener("DOMContentLoaded", () => {
  // ======================
  // عناصر UI
  // ======================
  const display = document.getElementById("display");
  const buttons = document.querySelectorAll("button");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const fileInput = document.getElementById("fileInput");
  const historyDiv = document.getElementById("history");

  // ======================
  // موتور اصلی محاسبات
  // ======================
  const engine = new CalculatorEngine();
  const trainer = new AutoTrainer();
  const geo = new GeometryEngine();
  const measure = new CanvasMeasure(canvas);
  const sandbox = new PhysicsSandbox({ gravity: 9.81 });

  const ball = new HyperUltraPhysicsBody({ mass: 5, radius: 15, position:{x:150,y:50,z:0} });
  sandbox.world.addBody(ball);
  sandbox.start();

  let currentInput = '';

  function updateDisplay(value) {
    display.textContent = value;
  }

  function addHistoryEntry(text, color = '#cbd5e1') {
    const div = document.createElement('div');
    div.textContent = text;
    div.style.color = color;
    historyDiv.prepend(div);
  }

  // ======================
  // کنترل دکمه‌ها
  // ======================
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const val = btn.textContent;
      switch(val) {
        case 'C':
          currentInput = '';
          updateDisplay('0');
          engine.reset();
          trainer.showSuggestions(currentInput);
          break;

        case '=':
          computeResult();
          break;

        case '📷 Reality':
          fileInput.click();
          break;

        case 'CSV':
          exportCSV();
          break;

        case 'PDF':
          exportPDF();
          break;

        default:
          currentInput += val;
          updateDisplay(currentInput);
      }
    });
  });

  // ======================
  // صفحه کلید
  // ======================
  document.addEventListener('keydown', e => {
    if(!isNaN(e.key)) { currentInput += e.key; updateDisplay(currentInput); }
    else if(e.key === 'Enter') computeResult();
    else if(e.key === 'Backspace') { currentInput = currentInput.slice(0,-1); updateDisplay(currentInput || '0'); }
  });

  // ======================
  // محاسبه + AutoTrainer + Physics Update
  // ======================
  function computeResult() {
    try {
      const res = engine.calculate();
      updateDisplay(res);

      // تاریخچه
      const timestamp = new Date().toLocaleTimeString();
      addHistoryEntry(`[${timestamp}] ${currentInput} = ${res}`);

      // پیشنهادات AutoTrainer
      const suggestions = trainer.suggest(currentInput);
      suggestions.forEach(s => addHistoryEntry(s.hint || s, '#facc15'));

      // به‌روزرسانی فیزیک و هندسه
      sandbox.update(1/60);
      measure.draw();

      currentInput = '';
    } catch(e) {
      updateDisplay('Error');
      console.error(e);
    }
  }

  // ======================
  // تحلیل تصویر / Reality
  // ======================
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    if(!file) return;

    try {
      // شبیه‌سازی تحلیل تصویر
      const reader = new FileReader();
      reader.onload = () => {
        addHistoryEntry(`📷 تصویر بارگذاری شد: ${file.name}`, '#34d399');
      };
      reader.readAsDataURL(file);
    } catch(e) {
      alert("خطا در تحلیل تصویر: " + e.message);
    }
  });

  // ======================
  // خروجی CSV
  // ======================
  function exportCSV() {
    let csv = 'Expression,Result,Timestamp\n';
    engine.getHistory().forEach(h => {
      csv += `"${h.expression}","${h.result}","${new Date(h.timestamp).toLocaleString()}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'hypercalc_history.csv';
    link.click();
  }

  // ======================
  // خروجی PDF
  // ======================
  function exportPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 10;
    engine.getHistory().forEach(h => {
      doc.text(`${new Date(h.timestamp).toLocaleString()} | ${h.expression} = ${h.result}`, 10, y);
      y += 10;
    });
    doc.save('hypercalc_history.pdf');
  }

  // ======================
  // Service Worker پیشرفته برای حالت آفلاین
  // ======================
  if('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
      .then(reg => {
        console.log('✅ SW Registered');

        // اگر SW جدید آماده باشه
        if(reg.waiting) reg.waiting.postMessage('UPDATE_NOW');

        reg.addEventListener('updatefound', () => {
          const newSW = reg.installing;
          newSW?.addEventListener('statechange', () => {
            if(newSW.state === 'installed') newSW.postMessage('UPDATE_NOW');
          });
        });
      });
    });
  }

});
