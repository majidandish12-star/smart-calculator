/* =========================================================
   Smart Calculator – Core Intelligence Engine
   Version: 4.0.0 (Industrial Grade)
   Role:
   - Safe Math Evaluation (AST-based)
   - Profile-aware Logic
   - Reality + Physics (WASM-ready)
   - Explainability & Confidence
========================================================= */

import initRust, { calcPhysics } from './reality-calc-rust_wasm.js';

/* =========================================================
   Internal Utilities
========================================================= */

class CalcError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

/* =========================================================
   Analyzer (What is this input?)
========================================================= */
class Analyzer {
  static detect(input) {
    if (/kg|mass|velocity|energy|volume/i.test(input)) return 'physics';
    if (/^[0-9+\-*/().\s]+$/.test(input)) return 'math';
    return 'unknown';
  }
}

/* =========================================================
   Math Engine (SAFE)
========================================================= */
class MathEngine {
  static tokenize(expr) {
    return expr.match(/[0-9.]+|[+\-*/()]/g);
  }

  static toRPN(tokens) {
    const prec = { '+':1, '-':1, '*':2, '/':2 };
    const output = [], ops = [];

    for (const t of tokens) {
      if (!isNaN(t)) output.push(t);
      else if (t in prec) {
        while (ops.length && prec[ops.at(-1)] >= prec[t]) {
          output.push(ops.pop());
        }
        ops.push(t);
      } else if (t === '(') ops.push(t);
      else if (t === ')') {
        while (ops.at(-1) !== '(') output.push(ops.pop());
        ops.pop();
      }
    }
    return output.concat(ops.reverse());
  }

  static evalRPN(rpn) {
    const stack = [];
    for (const t of rpn) {
      if (!isNaN(t)) stack.push(Number(t));
      else {
        const b = stack.pop(), a = stack.pop();
        if (t === '/' && b === 0) throw new CalcError('DIV_ZERO', 'Division by zero');
        stack.push(eval(`${a}${t}${b}`));
      }
    }
    return stack[0];
  }

  static evaluate(expr) {
    const tokens = this.tokenize(expr);
    const rpn = this.toRPN(tokens);
    return this.evalRPN(rpn);
  }
}

/* =========================================================
   Confidence Engine
========================================================= */
class ConfidenceEngine {
  static score({ complexity, type, profile }) {
    let c = 0.95;

    if (complexity > 10) c -= 0.1;
    if (type === 'physics') c -= 0.05;
    if (profile === 'student') c -= 0.05;
    if (profile === 'engineer') c += 0.05;

    return Math.max(0.7, Math.min(c, 0.99));
  }
}

/* =========================================================
   Explain Engine
========================================================= */
class ExplainEngine {
  static explainMath(expr, result) {
    return `Expression "${expr}" was parsed, evaluated step-by-step, result is ${result}.`;
  }

  static explainPhysics(p) {
    return `Using classical mechanics:
Kinetic Energy = ½mv² = ${p.energy.toFixed(2)} J`;
  }
}

/* =========================================================
   SmartEngine (Public API)
========================================================= */
class SmartEngine {
  constructor(profile = 'general') {
    this.profile = profile;
    this.history = [];
    this.wasmReady = false;
  }

  async init() {
    try {
      await initRust();
      this.wasmReady = true;
      console.log('🦀 WASM ready');
    } catch {
      console.warn('WASM unavailable, JS fallback');
    }
  }

  evaluate(input) {
    const type = Analyzer.detect(input);
    const start = performance.now();

    if (type === 'math') {
      const result = MathEngine.evaluate(input);
      const confidence = ConfidenceEngine.score({
        complexity: input.length,
        type,
        profile: this.profile
      });

      const output = {
        type,
        input,
        result,
        confidence,
        explain: ExplainEngine.explainMath(input, result),
        timeMs: (performance.now() - start).toFixed(2)
      };

      this.history.push(output);
      return output;
    }

    throw new CalcError('UNSUPPORTED', 'Unsupported input');
  }

  simulatePhysics({ weight, volume, velocity = 0 }) {
    if (!this.wasmReady) {
      const energy = 0.5 * weight * velocity ** 2;
      return { energy };
    }
    return calcPhysics({ weight, volume, velocity });
  }

  setProfile(p) {
    this.profile = p;
  }

  getHistory() {
    return this.history;
  }

  clearHistory() {
    this.history = [];
  }
}

/* =========================================================
   Export
========================================================= */
window.SmartEngine = SmartEngine;
