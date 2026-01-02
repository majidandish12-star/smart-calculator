/* =====================================
   Unit System – Smart Calculator
   پیشرفته، دقیق و قابل توسعه
===================================== */

class UnitSystem {
  constructor() {
    // تعریف واحدها بر اساس نوع
    this.units = {
      length: {
        m: 1,
        cm: 0.01,
        mm: 0.001,
        km: 1000,
        ft: 0.3048,
        inch: 0.0254,
        yard: 0.9144
      },
      mass: {
        kg: 1,
        g: 0.001,
        mg: 0.000001,
        lb: 0.453592,
        oz: 0.0283495
      },
      time: {
        s: 1,
        min: 60,
        h: 3600
      },
      temperature: {
        C: 'C',
        F: 'F',
        K: 'K'
      }
    };
  }

  // تابع تبدیل واحد
  convert(value, from, to, type = "length") {
    if (!this.units[type][from] || !this.units[type][to]) {
      throw new Error(`واحد نامعتبر: ${from} یا ${to}`);
    }

    // تبدیل دما به شکل خاص
    if (type === "temperature") {
      return this.convertTemperature(value, from, to);
    }

    const base = value * this.units[type][from];
    return base / this.units[type][to];
  }

  // تبدیل دما (C, F, K)
  convertTemperature(value, from, to) {
    let tempC;
    switch (from) {
      case 'C': tempC = value; break;
      case 'F': tempC = (value - 32) * 5/9; break;
      case 'K': tempC = value - 273.15; break;
    }

    switch (to) {
      case 'C': return tempC;
      case 'F': return tempC * 9/5 + 32;
      case 'K': return tempC + 273.15;
    }
  }

  // اضافه کردن واحد جدید
  addUnit(type, unit, toBase) {
    if (!this.units[type]) this.units[type] = {};
    this.units[type][unit] = toBase;
  }
}

window.UnitSystem = UnitSystem;
