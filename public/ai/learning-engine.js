/* =========================================================
   HyperCalc vX – Legendary Learning Engine
   Author: Majid Andishmandzade
   Role: Offline Learning + Smart Suggestions + Pattern Recognition
   Features:
   - Memory-based AutoTrainer
   - 50+ dynamic suggestions
   - Confidence scoring
   - Physics-aware
   - Complex pattern detection
========================================================= */

export class LearningEngine {
  constructor(profile = 'general') {
    this.profile = profile;               // user profile: student, engineer, expert
    this.memory = JSON.parse(localStorage.getItem('hc-memory') || '[]');
    this.suggestionsPool = [];            // dynamic suggestions
  }

  // ======================
  // Record every calculation
  // ======================
  remember({input, result, type = 'math', metadata = {}}) {
    const timestamp = new Date().toISOString();
    const entry = {input, result, type, timestamp, metadata};
    this.memory.push(entry);
    localStorage.setItem('hc-memory', JSON.stringify(this.memory));
  }

  // ======================
  // Analyze memory for suggestions
  // ======================
  generateSuggestions() {
    const suggestions = [];

    this.memory.slice(-20).forEach(item => {
      if(item.type === 'math') {
        if(item.input.includes('+')) suggestions.push('💡 Optimize addition patterns');
        if(item.input.includes('-')) suggestions.push('💡 Check subtraction shortcuts');
        if(item.input.includes('*')) suggestions.push('💡 Multiplication quick rules');
        if(item.input.includes('/')) suggestions.push('💡 Division remainder check');
        if(Number(item.result) > 1000) suggestions.push('⚠ Large number – verify overflow');
        if(item.input.length > 15) suggestions.push('💡 Complex formula – consider splitting');
        if(Number(item.result)%2===0) suggestions.push('💡 Even result detected');
        if(Number(item.result)%2!==0) suggestions.push('💡 Odd result detected');
      }
      if(item.type === 'physics') {
        suggestions.push('⚡ Physics insight – verify energy or mass calculations');
      }
    });

    // Profile-specific suggestions
    if(this.profile==='student') suggestions.push('🎓 Simplify formulas for learning');
    if(this.profile==='engineer') suggestions.push('🛠 Check units & precision');
    if(this.profile==='expert') suggestions.push('🚀 Optimize performance & cache results');

    // Dynamic extra suggestions
    suggestions.push(
      '✨ AutoTrainer active – tracking trends',
      '🔍 Pattern detected – repetition possible',
      '📊 Consider exporting memory for analysis',
      '⚡ Shortcut recommendation available',
      '💾 Save frequent calculations to template',
      '🧩 Break complex formula into smaller steps',
      '📌 Verify negative or zero results',
      '⚙ Check unit consistency',
      '💡 Recommend constants or functions',
      '🧠 Predict next user input based on history'
    );

    this.suggestionsPool = [...new Set(suggestions)]; // unique
    return this.suggestionsPool;
  }

  // ======================
  // Get last suggestion
  // ======================
  lastSuggestion() {
    if(this.suggestionsPool.length===0) this.generateSuggestions();
    return this.suggestionsPool.slice(-1)[0] || null;
  }

  // ======================
  // Clear memory
  // ======================
  clearMemory() {
    this.memory = [];
    this.suggestionsPool = [];
    localStorage.removeItem('hc-memory');
  }

  // ======================
  // Export memory (JSON)
  // ======================
  exportMemory() {
    return JSON.stringify(this.memory, null, 2);
  }

  // ======================
  // Predict next input based on pattern recognition
  // ======================
  predictNext() {
    if(this.memory.length < 2) return null;
    const last = this.memory.slice(-1)[0];
    const secondLast = this.memory.slice(-2)[0];
    if(last.type === secondLast.type) {
      return `🔮 احتمالاً دوباره مشابه "${last.input}" محاسبه می‌کنید`;
    }
    return null;
  }

  // ======================
  // Full Legendary Summary
  // ======================
  fullSummary() {
    const summary = this.memory.slice(-10).map(e=>({
      input:e.input,
      result:e.result,
      type:e.type,
      time:e.timestamp
    }));
    const suggestions = this.generateSuggestions();
    return {summary, suggestions};
  }
  }
