/* =====================================
   History Engine
   HyperCalc v2
===================================== */

class HistoryEngine {
  constructor() {
    this.items = [];
  }

  add(entry) {
    this.items.push({
      ...entry,
      time: new Date().toISOString()
    });
  }

  all() {
    return this.items;
  }

  clear() {
    this.items = [];
  }
}

window.HistoryEngine = HistoryEngine;
