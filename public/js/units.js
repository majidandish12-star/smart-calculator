/* =====================================
   Units Conversion Engine
   HyperCalc v2
===================================== */

class UnitsEngine {
  constructor() {
    this.units = {
      length: {
        m: 1,
        km: 1000,
        cm: 0.01,
        mm: 0.001,
        inch: 0.0254,
        ft: 0.3048
      },
      mass: {
        kg: 1,
        g: 0.001,
        lb: 0.453592
      },
      time: {
        s: 1,
        min: 60,
        h: 3600
      }
    };
  }

  convert(value, from, to, type) {
    if (!this.units[type]) throw Error('Unknown unit type');
    const base = value * this.units[type][from];
    return base / this.units[type][to];
  }
}

window.UnitsEngine = UnitsEngine;
