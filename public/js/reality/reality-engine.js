class RealityEngine {
  constructor() {
    this.worker = new Worker('js/reality/ai-worker.js');
  }
  analyze(type, data) {
    return new Promise(resolve => {
      this.worker.onmessage = e => resolve(e.data);
      this.worker.postMessage({ type, data });
    });
  }
}
window.RealityEngine = RealityEngine;
