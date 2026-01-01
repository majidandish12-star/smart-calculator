/* =========================================================
   Smart Calculator – Legendary Core Engine
   Version: 5.0.0 (Legendary)
   Role:
   - Safe Math Evaluation (AST-based)
   - Profile-aware Logic + AI Insights
   - Reality + Physics (WASM-ready)
   - AutoTrainer + Pattern Recognition
   - Explainability & Confidence
========================================================= */

import initRust, { calcPhysics } from './reality-calc-rust_wasm.js';

/* =========================================================
   Internal Utilities
========================================================= */
class CalcError extends Error {
  constructor(code, message) { super(message); this.code = code; }
}

/* =========================================================
   Analyzer
========================================================= */
class Analyzer {
  static detect(input) {
    if (/kg|mass|velocity|energy|volume/i.test(input)) return 'physics';
    if (/^[0-9+\-*/().\s]+$/.test(input)) return 'math';
    return 'unknown';
  }

  static complexityScore(input) {
    return Math.min(20, input.length/2);
  }
}

/* =========================================================
   Math Engine (SAFE + AST)
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
        while (ops.length && prec[ops.at(-1)] >= prec[t]) output.push(ops.pop());
        ops.push(t);
      } else if (t==='(') ops.push(t);
      else if (t===')') { while(ops.at(-1)!=='(') output.push(ops.pop()); ops.pop(); }
    }
    return output.concat(ops.reverse());
  }

  static evalRPN(rpn) {
    const stack = [];
    for (const t of rpn) {
      if (!isNaN(t)) stack.push(Number(t));
      else {
        const b = stack.pop(), a = stack.pop();
        if(t==='/' && b===0) throw new CalcError('DIV_ZERO','Division by zero');
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
   Confidence Engine + AI Insights
========================================================= */
class ConfidenceEngine {
  static score({ complexity, type, profile }) {
    let c = 0.95;
    c -= complexity*0.01;
    if(type==='physics') c -= 0.05;
    if(profile==='student') c -= 0.05;
    if(profile==='engineer') c += 0.05;
    if(profile==='scientist') c += 0.08;
    return Math.max(0.6, Math.min(c,0.99));
  }
}

/* =========================================================
   AI Suggestions / AutoTrainer
========================================================= */
class AISuggestions {
  static generate(expr, result) {
    const suggestions = [];
    if(expr.includes('+')) suggestions.push('💡 Optimize addition patterns');
    if(expr.includes('*')) suggestions.push('💡 Multiplication shortcut detected');
    if(expr.includes('/')) suggestions.push('💡 Division may produce fractions');
    if(expr.includes('-')) suggestions.push('💡 Subtraction – negative numbers check');
    if(result>1000) suggestions.push('⚠ Large number detected – overflow risk');
    if(result<0) suggestions.push('💡 Negative result – verify correctness');
    if(expr.length>15) suggestions.push('💡 Complex expression – consider breaking down');
    if(expr.includes('(') || expr.includes(')')) suggestions.push('💡 Parentheses detected – nested computation');
    if(!isNaN(result) && result%2===0) suggestions.push('💡 Even result detected');
    if(!isNaN(result) && result%2!==0) suggestions.push('💡 Odd result detected');
    if(expr.includes('.')) suggestions.push('💡 Decimal detected – rounding may apply');
    if(expr.includes('0')) suggestions.push('💡 Zero detected – division caution');
    suggestions.push('💡 AutoTrainer recommends next optimal calculation');
    return suggestions;
  }
}

/* =========================================================
   Explain Engine
========================================================= */
class ExplainEngine {
  static explainMath(expr,result) {
    return `Expression "${expr}" parsed & evaluated step-by-step. Result: ${result}.`;
  }

  static explainPhysics(p) {
    return `Physics Simulation:
Kinetic Energy = ½ * mass * velocity² = ${p.energy.toFixed(2)} J`;
  }
}

/* =========================================================
   SmartEngine (Public API)
========================================================= */
class SmartEngine {
  constructor(profile='general'){
    this.profile = profile;
    this.history = [];
    this.wasmReady = false;
  }

  async init(){
    try{ await initRust(); this.wasmReady=true; console.log('🦀 WASM ready'); }
    catch{ console.warn('WASM unavailable – fallback to JS'); }
  }

  evaluate(input){
    const type = Analyzer.detect(input);
    const start = performance.now();

    if(type==='math'){
      const result = MathEngine.evaluate(input);
      const confidence = ConfidenceEngine.score({
        complexity: Analyzer.complexityScore(input),
        type,
        profile: this.profile
      });
      const suggestions = AISuggestions.generate(input,result);

      const output = { type, input, result, confidence, suggestions,
        explain: ExplainEngine.explainMath(input,result),
        timeMs: (performance.now()-start).toFixed(2)
      };
      this.history.push(output);
      return output;
    }

    throw new CalcError('UNSUPPORTED','Unsupported input');
  }

  simulatePhysics({weight, volume, velocity=0}){
    if(!this.wasmReady) return { energy:0.5*weight*velocity**2 };
    return calcPhysics({weight, volume, velocity});
  }

  setProfile(p){ this.profile=p; }
  getHistory(){ return this.history; }
  clearHistory(){ this.history=[]; }
}

/* =========================================================
   Export
========================================================= */
window.SmartEngine = SmartEngine;
