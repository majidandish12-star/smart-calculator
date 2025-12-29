/* =====================================
   Smart Engine
   HyperCalc v2
===================================== */

class SmartEngine {
  constructor() {
    this.calc = new CalculatorEngine();
    this.units = new UnitsEngine();
    this.geometry = new GeometryEngine();
    this.physics = new PhysicsEngine();
    this.history = new HistoryEngine();
  }

  evaluate(expr) {
    const result = this.calc.calculate(expr);
    this.history.add({ type: 'math', expr, result });
    return result;
  }

  convert(value, from, to, type) {
    const result = this.units.convert(value, from, to, type);
    this.history.add({ type: 'unit', value, from, to, result });
    return result;
  }

  geometryCalc(name, ...args) {
    const result = this.geometry[name](...args);
    this.history.add({ type: 'geometry', name, args, result });
    return result;
  }

  physicsCalc(name, ...args) {
    const result = this.physics[name](...args);
    this.history.add({ type: 'physics', name, args, result });
    return result;
  }

  getHistory() {
    return this.history.all();
  }
}

window.SmartEngine = SmartEngine;
