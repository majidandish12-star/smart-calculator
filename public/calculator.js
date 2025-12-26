// calculator.js
// Smart Scientific Calculator Engine v1.0
// Offline • Safe • Extendable

class MathContext {
  constructor() {
    this.angleMode = "DEG"; // DEG | RAD
  }

  toRadians(value) {
    return this.angleMode === "DEG"
      ? value * Math.PI / 180
      : value;
  }
}

class CalculatorEngine {
  constructor() {
    this.ctx = new MathContext();
    this.reset();
  }

  reset() {
    this.expression = "";
  }

  input(value) {
    this.expression += value;
  }

  getDisplayValue() {
    return this.expression || "0";
  }

  toggleAngleMode() {
    this.ctx.angleMode = this.ctx.angleMode === "DEG" ? "RAD" : "DEG";
    return this.ctx.angleMode;
  }

  calculate() {
    const tokens = this.tokenize(this.expression);
    const ast = this.parse(tokens);
    const result = this.evaluate(ast);
    this.expression = String(result);
    return result;
  }

  /* ---------------- Tokenizer ---------------- */

  tokenize(expr) {
    const regex = /\s*([0-9]*\.?[0-9]+|sin|cos|tan|√|\^|\+|\-|\*|\/|\(|\))/g;
    return expr.match(regex) || [];
  }

  /* ---------------- Parser (Shunting Yard) ---------------- */

  parse(tokens) {
    const output = [];
    const ops = [];
    const prec = { "+":1, "-":1, "*":2, "/":2, "^":3 };

    const isFunc = t => ["sin","cos","tan","√"].includes(t);

    for (let t of tokens) {
      if (!isNaN(t)) {
        output.push({ type:"num", value: parseFloat(t) });
      } else if (isFunc(t)) {
        ops.push(t);
      } else if ("+-*/^".includes(t)) {
        while (
          ops.length &&
          prec[ops[ops.length-1]] >= prec[t]
        ) {
          output.push({ type:"op", value: ops.pop() });
        }
        ops.push(t);
      } else if (t === "(") {
        ops.push(t);
      } else if (t === ")") {
        while (ops.length && ops[ops.length-1] !== "(") {
          output.push({ type:"op", value: ops.pop() });
        }
        ops.pop();
        if (isFunc(ops[ops.length-1])) {
          output.push({ type:"func", value: ops.pop() });
        }
      }
    }

    while (ops.length) {
      output.push({ type:"op", value: ops.pop() });
    }

    return output;
  }

  /* ---------------- Evaluator ---------------- */

  evaluate(rpn) {
    const stack = [];

    for (let t of rpn) {
      if (t.type === "num") {
        stack.push(t.value);
      } else if (t.type === "op") {
        const b = stack.pop();
        const a = stack.pop();
        switch (t.value) {
          case "+": stack.push(a+b); break;
          case "-": stack.push(a-b); break;
          case "*": stack.push(a*b); break;
          case "/": stack.push(a/b); break;
          case "^": stack.push(Math.pow(a,b)); break;
        }
      } else if (t.type === "func") {
        const v = stack.pop();
        switch (t.value) {
          case "sin": stack.push(Math.sin(this.ctx.toRadians(v))); break;
          case "cos": stack.push(Math.cos(this.ctx.toRadians(v))); break;
          case "tan": stack.push(Math.tan(this.ctx.toRadians(v))); break;
          case "√": stack.push(Math.sqrt(v)); break;
        }
      }
    }

    if (stack.length !== 1 || isNaN(stack[0])) {
      throw new Error("Math Error");
    }

    return +stack[0].toFixed(10);
  }
}

window.CalculatorEngine = CalculatorEngine;
