hereclass EngineV3 extends EngineV2 {
  constructor() {
    super();
    this.learn = new LearningEngine();
  }

  evaluate(input) {
    this.learn.learn(input);
    const res = super.evaluate(input);
    res.suggestion = this.learn.predict();
    return res;
  }
}

window.EngineV3 = EngineV3;
