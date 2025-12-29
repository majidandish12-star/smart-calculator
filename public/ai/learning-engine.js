export class LearningEngine {
  constructor() {
    this.memory = JSON.parse(localStorage.getItem('hc-memory') || '[]');
  }

  remember(entry) {
    this.memory.push(entry);
    localStorage.setItem('hc-memory', JSON.stringify(this.memory));
  }

  suggest() {
    const last = this.memory.slice(-1)[0];
    return last ? `شاید دوباره ${last.input}?` : null;
  }
}
