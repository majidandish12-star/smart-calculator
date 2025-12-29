hereclass LearningEngine {
  constructor() {
    this.patterns = {};
  }

  learn(expr) {
    this.patterns[expr] = (this.patterns[expr] || 0) + 1;
  }

  predict() {
    return Object.entries(this.patterns)
      .sort((a,b)=>b[1]-a[1])[0]?.[0];
  }
}

window.LearningEngine = LearningEngine;
