/* =========================================================
   Smart Calculator Core Engine
   Version: 1.0.0
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
  }

  /* =======================
     Input Handling
  ======================== */
  input(value) {
    if (this.error) this.reset();

    // Normalize operators
    const normalized = this._normalizeInput(value);

    // Prevent invalid sequences
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
      const safeExpression = this._sanitizeExpression(this.expression);
      const result = this._safeEval(safeExpression);

      this.lastResult = result;
      this.expression = String(result);
      this.error = null;

      return result;
    } catch (e) {
      this.error = 'CALC_ERROR';
      throw new Error('Calculation Error');
    }
  }

  /* =======================
     Utilities
  ======================== */
  _normalizeInput(val) {
    const map = {
      '×': '*',
      '÷': '/',
      '−': '-'
    };
    return map[val] || val;
  }

  _isValidNext(val) {
    const last = this.expression.slice(-1);

    // Prevent double operators
    if (this._isOperator(last) && this._isOperator(val)) {
      return false;
    }

    // Prevent starting with invalid operator
    if (!this.expression && this._isOperator(val) && val !== '-') {
      return false;
    }

    // Prevent multiple dots in number
    if (val === '.') {
      const parts = this.expression.split(/[\+\-\*\/]/);
      if (parts[parts.length - 1].includes('.')) return false;
    }

    return true;
  }

  _isOperator(char) {
    return ['+', '-', '*', '/'].includes(char);
  }

  _sanitizeExpression(expr) {
    // Remove trailing operator
    if (this._isOperator(expr.slice(-1))) {
      expr = expr.slice(0, -1);
    }
    return expr;
  }

  _safeEval(expr) {
    // Strict math-only evaluation
    if (!/^[0-9+\-*/().\s]+$/.test(expr)) {
      throw new Error('Unsafe expression');
    }

    // eslint-disable-next-line no-new-func
    return Function(`"use strict"; return (${expr})`)();
  }

  /* =======================
     Advanced (Future Ready)
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
