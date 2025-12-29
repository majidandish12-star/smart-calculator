/* =========================================================
   Smart Calculator Core Engine
   Version: 2.0.0
   Author: Smart Calculator Project
   Responsibility: Pure calculation logic (NO UI)
========================================================= */

class CalculatorEngine {
  constructor() {
    this.reset();
  }

  /* =======================
     Core State
  ======================== */
  reset() {
    this.expression = '';
    this.lastResult = null;
    this.error = null;
    this.memory = 0;
    this.history = [];
    this.mode = 'standard'; // standard | scientific
  }

  /* =======================
     Mode Control
  ======================== */
  setMode(mode) {
    if (['standard', 'scientific'].includes(mode)) {
      this.mode = mode;
    }
  }

  /* =======================
     Input Handling
  ======================== */
  input(value) {
    if (this.error) this.reset();

    const normalized = this._normalizeInput(value);

    if (!this._isValidNext(normalized)) return;

    this.expression += normalized;
  }

  getDisplayValue() {
    return this.expression || '0';
  }

  /* =======================
     Calculation
  ======================== */
  calculate() {
    if (!this.expression) return 0;

    try {
      let expr = this._sanitizeExpression(this.expression);
      expr = this._transformAdvancedOps(expr);

      const result = this._safeEval(expr);

      this.lastResult = result;
      this.history.push({
        expression: this.expression,
        result,
        timestamp: Date.now()
      });

      this.expression = String(result);
      this.error = null;

      return result;
    } catch (e) {
      this.error = 'CALC_ERROR';
      throw new Error('Calculation Error');
    }
  }

  /* =======================
     Memory Functions
  ======================== */
  memoryAdd() {
    this.memory += Number(this.expression || 0);
  }

  memorySubtract() {
    this.memory -= Number(this.expression || 0);
  }

  memoryRecall() {
    this.expression = String(this.memory);
    return this.memory;
  }

  memoryClear() {
    this.memory = 0;
  }

  /* =======================
     History
  ======================== */
  getHistory() {
    return [...this.history];
  }

  clearHistory() {
    this.history = [];
  }

  /* =======================
     Utilities
  ======================== */
  _normalizeInput(val) {
    const map = {
      '×': '*',
      '÷': '/',
      '−': '-',
      '^': '^',
      '%': '%'
    };
    return map[val] || val;
  }

  _isValidNext(val) {
    const last = this.expression.slice(-1);

    if (this._isOperator(last) && this._isOperator(val)) return false;

    if (!this.expression && this._isOperator(val) && val !== '-') return false;

    if (val === '.') {
      const parts = this.expression.split(/[\+\-\*\/\^]/);
      if (parts[parts.length - 1].includes('.')) return false;
    }

    return true;
  }

  _isOperator(char) {
    return ['+', '-', '*', '/', '^', '%'].includes(char);
  }

  _sanitizeExpression(expr) {
    if (this._isOperator(expr.slice(-1))) {
      expr = expr.slice(0, -1);
    }
    return expr;
  }

  _transformAdvancedOps(expr) {
    // Power operator
    expr = expr.replace(/(\d+(\.\d+)?)\^(\d+(\.\d+)?)/g, 'Math.pow($1,$3)');

    // Percentage
    expr = expr.replace(/(\d+(\.\d+)?)%/g, '($1/100)');

    return expr;
  }

  _safeEval(expr) {
    if (!/^[0-9+\-*/().\sMathpow,]+$/.test(expr)) {
      throw new Error('Unsafe expression');
    }

    // eslint-disable-next-line no-new-func
    return Function(`"use strict"; return (${expr})`)();
  }

  /* =======================
     Advanced Hooks (Future)
  ======================== */
  getLastResult() {
    return this.lastResult;
  }

  hasError() {
    return this.error !== null;
  }
}

/* =======================
   Export (Browser Global)
======================== */
window.CalculatorEngine = CalculatorEngine;
