/* =====================================
   Unit System – Smart Calculator
===================================== */

class UnitSystem {
  constructor() {
    this.units = {
      length: {
        m: 1,
        cm: 0.01,
        mm: 0.001,
        km: 1000,
        ft: 0.3048
      }
    };
  }

  convert(value, from, to, type = "length") {
    if (!this.units[type][from] || !this.units[type][to]) {
      throw new Error("Invalid unit");
    }

    const base = value * this.units[type][from];
    return base / this.units[type][to];
  }
}

window.UnitSystem = UnitSystem;
