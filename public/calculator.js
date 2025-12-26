/* =========================================
   Smart Calculator Engine v1
   Offline • Safe • Extensible
========================================= */

class CalculatorEngine {
  constructor() {
    this.reset();
  }

  reset() {
    this.tokens = [];
    this.currentNumber = '';
  }

  input(value) {
    if (this.isNumber(value) || value === '.') {
      this.appendNumber(value);
    } else {
      this.appendOperator(value);
    }
  }

  appendNumber(char) {
    if (char === '.' && this.currentNumber.includes('.')) return;
    this.currentNumber += char;
  }

  appendOperator(op) {
    if (this.currentNumber !== '') {
      this.tokens.push(parseFloat(this.currentNumber));
      this.currentNumber = '';
    }

    const operatorMap = {
      '+': '+',
      '−': '-',
      '×': '*',
      '÷': '/'
    };

    if (operatorMap[op]) {
      this.tokens.push(operatorMap[op]);
    }
  }

  calculate() {
    if (this.currentNumber !== '') {
      this.tokens.push(parseFloat(this.currentNumber));
      this.currentNumber = '';
    }

    if (this.tokens.length === 0) return 0;

    const result = this.evaluateTokens(this.tokens);
    this.tokens = [];
    this.currentNumber = String(result);
    return result;
  }

  evaluateTokens(tokens) {
    let stack = [...tokens];

    // اول ضرب و تقسیم
    for (let i = 0; i < stack.length; i++) {
      if (stack[i] === '*' || stack[i] === '/') {
        const a = stack[i - 1];
        const b = stack[i + 1];
        const result = stack[i] === '*' ? a * b : a / b;

        stack.splice(i - 1, 3, result);
        i -= 1;
      }
    }

    // بعد جمع و تفریق
    let result = stack[0];
    for (let i = 1; i < stack.length; i += 2) {
      const op = stack[i];
      const num = stack[i + 1];
      if (op === '+') result += num;
      if (op === '-') result -= num;
    }

    return Number(result.toFixed(10));
  }

  isNumber(val) {
    return !isNaN(val);
  }

  getDisplayValue() {
    if (this.currentNumber !== '') return this.currentNumber;
    if (this.tokens.length > 0) return this.tokens.join(' ');
    return '0';
  }
}

window.CalculatorEngine = CalculatorEngine;
