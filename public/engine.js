/* =========================================================
   Smart Calculator – Engineering Math + Reality Engine
   Version: 3.0.0
   Role: Advanced math, units, logic, explainability,
         Reality/Augmented Object Analysis
========================================================= */

import initRust, { calcPhysics } from './reality-calc-rust_wasm.js';

const aiWorker = new Worker('reality-calc-ai.js');

class SmartEngine {
  constructor(profile = 'general') {
    this.profile = profile; // student | engineer | architect | surveyor
    this.history = [];
    this.realityHistory = [];
    this.realityCalc = null;
  }

  /* =======================
     Core Evaluation (Math)
  ======================== */
  evaluate(expression) {
    const start = performance.now();

    const parsed = this._parse(expression);
    const result = this._compute(parsed);
    const confidence = this._confidenceScore(parsed);
    const duration = performance.now() - start;

    const output = {
      type: 'math',
      input: expression,
      result,
      confidence,
      profile: this.profile,
      timeMs: duration.toFixed(2),
      tree: parsed
    };

    this.history.push(output);
    return output;
  }

  /* =======================
     Reality Evaluation (Photo/Canvas/Map)
  ======================== */
  async analyzeReality(fileOrCanvas) {
    if (!this.realityCalc) {
      this.realityCalc = new RealityCalc(fileOrCanvas instanceof HTMLCanvasElement ? fileOrCanvas.id : null);
    }

    const result = await this.realityCalc.processReality(fileOrCanvas);
    this.realityHistory.push(result);
    return result;
  }

  /* =======================
     Parser (Math Tree)
  ======================== */
  _parse(expr) {
    const normalized = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-');

    if (!/^[0-9+\-*/().\sA-Za-z]+$/.test(normalized)) {
      throw new Error('Invalid expression');
    }

    return {
      type: 'Expression',
      value: normalized
    };
  }

  /* =======================
     Computation
  ======================== */
  _compute(node) {
    try {
      // eslint-disable-next-line no-new-func
      return Function(`"use strict"; return (${node.value})`)();
    } catch {
      throw new Error('Math error');
    }
  }

  /* =======================
     Confidence Logic
  ======================== */
  _confidenceScore(node) {
    let score = 1.0;

    if (node.value.includes('/')) score -= 0.05;
    if (node.value.includes('*')) score -= 0.02;
    if (node.value.length > 20) score -= 0.1;

    if (this.profile === 'engineer') score += 0.05;
    if (this.profile === 'student') score -= 0.05;

    return Math.max(0.7, Math.min(score, 0.99));
  }

  /* =======================
     Profiles
  ======================== */
  setProfile(profile) {
    this.profile = profile;
  }

  /* =======================
     History
  ======================== */
  getHistory() {
    return this.history;
  }

  clearHistory() {
    this.history = [];
  }

  getRealityHistory() {
    return this.realityHistory;
  }

  clearRealityHistory() {
    this.realityHistory = [];
  }

  /* =======================
     Physics Simulation
  ======================== */
  simulatePhysics({ weight, volume, velocity = 0 }) {
    return calcPhysics({ weight, volume, velocity });
  }

  /* =======================
     Output to HTML (Interactive)
  ======================== */
  displayResult(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (data.type === 'math') {
      container.innerHTML = `
        <h3>Math Evaluation</h3>
        <p>Input: ${data.input}</p>
        <p>Result: ${data.result}</p>
        <p>Confidence: ${data.confidence}</p>
        <p>Profile: ${data.profile}</p>
        <p>Duration: ${data.timeMs} ms</p>
      `;
    } else if (data.type === 'reality') {
      container.innerHTML = `
        <h3>Reality Analysis</h3>
        <p>Object Type: ${data.shape}</p>
        <p>Weight: ${data.weight.toFixed(2)} kg</p>
        <p>Volume: ${data.volume.toFixed(2)} m³</p>
        <p>Velocity: ${data.velocity?.toFixed(2) || 0} m/s</p>
        <p>Kinetic Energy: ${data.physics.kinetic_energy.toFixed(2)} J</p>
        <p>Density: ${data.physics.density.toFixed(2)} kg/m³</p>
        <p>Momentum: ${data.physics.momentum.toFixed(2)} kg·m/s</p>
      `;
    }
  }
}

/* =========================================================
   RealityCalc Integration
========================================================= */
class RealityCalc {
  constructor(canvasId = null) {
    this.canvas = canvasId ? document.getElementById(canvasId) : null;
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.imageData = null;
  }

  async loadImage(file) {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        if (this.ctx) this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
        this.imageData = this.ctx ? this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height) : null;
        resolve(true);
      };
      img.src = file instanceof HTMLCanvasElement ? file.toDataURL() : URL.createObjectURL(file);
    });
  }

  async analyzeObject() {
    return new Promise(resolve => {
      aiWorker.onmessage = e => resolve(e.data);
      aiWorker.postMessage(this.imageData);
    });
  }

  async processReality(fileOrCanvas) {
    if (fileOrCanvas instanceof HTMLCanvasElement) {
      this.canvas = fileOrCanvas;
      this.ctx = this.canvas.getContext('2d');
    }
    await this.loadImage(fileOrCanvas);
    const aiResult = await this.analyzeObject();
    const physicsResult = calcPhysics({
      weight: aiResult.weight,
      volume: aiResult.volume,
      velocity: aiResult.velocity || 0
    });
    return {...aiResult, physics: physicsResult, type: 'reality'};
  }
}

/* =======================
   Export
======================== */
window.SmartEngine = SmartEngine;
window.RealityCalc = RealityCalc;
