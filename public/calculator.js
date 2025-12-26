// calculator.js
// 🧠 Core Calculator Engine (Offline, Safe, Expandable)

class CalculatorEngine {
  constructor() {
    this.reset();
  }

  reset() {
    this.expression = "";
  }

  input(value) {
    const ops = ["+", "-", "×", "÷", "."];

    const last = this.expression.slice(-1);

    // جلوگیری از تکرار اپراتور
    if (ops.includes(value) && ops.includes(last)) {
      this.expression = this.expression.slice(0, -1) + value;
      return;
    }

    this.expression += value;
  }

  getDisplayValue() {
    return this.expression || "0";
  }

  calculate() {
    try {
      const safeExpression = this.expression
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/−/g, "-");

      const result = Function(`"use strict"; return (${safeExpression})`)();

      if (result === Infinity || isNaN(result)) {
        throw new Error("Math Error");
      }

      this.expression = String(result);
      return this.expression;
    } catch {
      this.reset();
      throw new Error("Calculation Error");
    }
  }
}

window.CalculatorEngine = CalculatorEngine;
