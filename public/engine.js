/* =========================================================
   Smart Calculator – Engineering Math Engine
   Version: 2.0.0
   Role: Advanced math, units, logic, explainability
========================================================= */

class SmartEngine {
  constructor(profile = 'general') {
    this.profile = profile; // student | engineer | architect | surveyor
    this.history = [];
  }

  /* =======================
     Core Evaluation
  ======================== */
  evaluate(expression) {
    const start = performance.now();

    const parsed = this._parse(expression);
    const result = this._compute(parsed);

    const confidence = this._confidenceScore(parsed);
    const duration = performance.now() - start;

    const output = {
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
     Confidence Logic (Unique)
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
}

/* =======================
   Export
======================== */
window.SmartEngine = SmartEngine;
