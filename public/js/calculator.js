class CalculatorEngine {
  constructor() {
    this.reset();
  }

  reset() {
    this.expr = '';
  }

  input(v) {
    const map = {'×':'*','÷':'/','−':'-'};
    this.expr += map[v] || v;
  }

  calculate() {
    if (!/^[0-9+\-*/().\s]+$/.test(this.expr)) throw Error();
    const res = Function(`"use strict";return (${this.expr})`)();
    this.expr = String(res);
    return res;
  }

  value() {
    return this.expr || '0';
  }
}

window.CalculatorEngine = CalculatorEngine;
