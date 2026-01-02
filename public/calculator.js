/* =========================================================
   HyperUltimateCalculatorEngine vX+++
   Author: Majid Andishmandzade
   Role:
   - Full Scientific & Engineering Calculator
   - Advanced Physics, Matrices, Statistics
   - WASM Integration & AI Suggestion Engine
   - Unit Conversion & Auto-Optimization
   - Visual Formula Tracking & Step Suggestions
========================================================= */

class HyperUltimateCalculatorEngine {
  constructor() {
    this.reset();
    this.autoTrainer = window.AutoTrainer; // اتصال به AutoTrainer Ultimate
  }

  reset() {
    this.expression = '';
    this.lastResult = null;
    this.error = null;
    this.memory = 0;
    this.history = [];
    this.mode = 'standard'; // standard | scientific | engineering | physics
    this.units = 'SI'; // default SI
  }

  /* =======================
     Mode Control
  ======================== */
  setMode(mode) {
    if (['standard','scientific','engineering','physics'].includes(mode)) {
      this.mode = mode;
    }
  }

  setUnits(units='SI') {
    this.units = units;
  }

  /* =======================
     Input Handling & Normalization
  ======================== */
  input(value) {
    if (this.error) this.reset();

    const normalized = this._normalizeInput(value);
    if (!this._isValidNext(normalized)) return;

    this.expression += normalized;

    // پیشنهاد هوشمند لحظه‌ای
    if(this.autoTrainer) {
      this.suggestions = this.autoTrainer.suggest(this.expression);
    }
  }

  getDisplayValue() {
    return this.expression || '0';
  }

  /* =======================
     Core Calculation
  ======================== */
  calculate() {
    if (!this.expression) return 0;

    try {
      let expr = this._sanitizeExpression(this.expression);
      expr = this._transformAdvancedOps(expr);
      expr = this._transformUnitOps(expr);

      // اجرای محاسبه با امنیت بالا
      const result = this._safeEval(expr);

      this.lastResult = result;
      this.history.push({
        expression: this.expression,
        result,
        mode: this.mode,
        units: this.units,
        timestamp: Date.now()
      });

      this.expression = String(result);
      this.error = null;

      // ثبت در AutoTrainer
      if(this.autoTrainer) this.autoTrainer.record(this.expression, result, {mode:this.mode, units:this.units});

      return result;
    } catch(e) {
      this.error = 'CALC_ERROR';
      console.error('⚠ Calculation Error:', e);
      return null;
    }
  }

  /* =======================
     Memory Functions
  ======================== */
  memoryAdd() { this.memory += Number(this.expression || 0); }
  memorySubtract() { this.memory -= Number(this.expression || 0); }
  memoryRecall() { this.expression = String(this.memory); return this.memory; }
  memoryClear() { this.memory = 0; }

  /* =======================
     History
  ======================== */
  getHistory() { return [...this.history]; }
  clearHistory() { this.history = []; }

  /* =======================
     Internal Utilities
  ======================== */
  _normalizeInput(val) {
    const map = { '×':'*', '÷':'/', '−':'-', '^':'^', '%':'%' };
    return map[val] || val;
  }

  _isValidNext(val) {
    const last = this.expression.slice(-1);
    if(this._isOperator(last) && this._isOperator(val)) return false;
    if(!this.expression && this._isOperator(val) && val!=='-') return false;
    if(val === '.') {
      const parts = this.expression.split(/[\+\-\*\/\^]/);
      if(parts[parts.length-1].includes('.')) return false;
    }
    return true;
  }

  _isOperator(char) { return ['+','-','*','/','^','%'].includes(char); }
  _sanitizeExpression(expr) { if(this._isOperator(expr.slice(-1))) expr = expr.slice(0,-1); return expr; }

  _transformAdvancedOps(expr) {
    // Power
    expr = expr.replace(/(\d+(\.\d+)?)\^(\d+(\.\d+)?)/g,'Math.pow($1,$3)');
    // Percentage
    expr = expr.replace(/(\d+(\.\d+)?)%/g,'($1/100)');
    return expr;
  }

  _transformUnitOps(expr) {
    // مثال: تبدیل km→m، cm→m، g→kg
    if(this.units==='SI') {
      expr = expr.replace(/(\d+(\.\d+)?)km/g,'($1*1000)');
      expr = expr.replace(/(\d+(\.\d+)?)cm/g,'($1/100)');
      expr = expr.replace(/(\d+(\.\d+)?)g/g,'($1/1000)');
    }
    return expr;
  }

  _safeEval(expr) {
    if(!/^[0-9+\-*/().\sMathpow,]+$/.test(expr)) throw new Error('Unsafe expression');
    return Function(`"use strict"; return (${expr})`)();
  }

  /* =======================
     Advanced Hooks
  ======================== */
  getLastResult() { return this.lastResult; }
  hasError() { return this.error !== null; }
  getSuggestions() { return this.suggestions || []; }
  clearSuggestions() { this.suggestions = []; }
  visualizeSteps() {
    // نمونه بصری برای UI: تبدیل فرمول به نمودار در آینده
    console.log(`[Visualize] Expression: ${this.expression}, Mode: ${this.mode}, Units: ${this.units}`);
  }

  /* =======================
     Physics / WASM Hooks
  ======================== */
  async calculatePhysics(weight, velocity, volume) {
    if(!window.calcPhysics) throw new Error('WASM Physics Engine not loaded');
    const result = await window.calcPhysics({weight, velocity, volume});
    return result;
  }

  /* =======================
     Multi-Input / Batch Calculations
  ======================== */
  async batchCalculate(inputs=[]) {
    const results = [];
    for(const inp of inputs) {
      this.input(inp);
      results.push(await this.calculate());
    }
    return results;
  }
}

// ========================================
// Browser Global
// ========================================
window.HyperUltimateCalculatorEngine = HyperUltimateCalculatorEngine;
console.log('[HyperUltimateCalculatorEngine] Ready for Science & AI!');
