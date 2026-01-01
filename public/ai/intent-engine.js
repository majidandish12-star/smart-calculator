/* =========================================================
   HyperCalc vX++ – Legendary AI Brain Intent Engine
   Author: Majid Andishmandzade
   Role:
   - Multi-language (Persian/English) intent detection
   - Multi-intent prioritization & clustering
   - Dynamic AI suggestions (hundreds)
   - Memory-driven personalization
   - AutoTrainer & ExplainEngine integration
   - Reality & Physics Engine ready
========================================================= */

import { NLPParser } from './nlp-parser.js';
import { LearningEngine } from './learning-engine.js';
import { ExplainEngine } from './explain-engine.js';

export class AIIntentEngine {
  constructor(profile='general') {
    this.profile = profile;
    this.nlp = new NLPParser();
    this.memory = new LearningEngine();
    this.explainer = new ExplainEngine();
    this.intentMap = [];
    this.dynamicRules = [];
    this.initDefaultIntents();
    this.initDynamicRules();
  }

  // ======================
  // Initialize default intents
  // ======================
  initDefaultIntents() {
    const intents = [
      { keywords: ['مساحت','area'], intent:'calculate_area' },
      { keywords: ['حجم','volume'], intent:'calculate_volume' },
      { keywords: ['محیط','perimeter'], intent:'calculate_perimeter' },
      { keywords: ['جرم','mass'], intent:'calculate_mass' },
      { keywords: ['سرعت','velocity'], intent:'calculate_velocity' },
      { keywords: ['انرژی','energy'], intent:'calculate_energy' },
      { keywords: ['طول','length'], intent:'calculate_length' },
      { keywords: ['pdf'], intent:'export_pdf' },
      { keywords: ['csv'], intent:'export_csv' },
      { keywords: ['reality','تصویر','image'], intent:'upload_image' },
      { keywords: ['compute','calculate','محاسبه'], intent:'general_calculation' },
      { keywords: ['help','راهنما'], intent:'help' },
      { keywords: ['history','تاریخچه'], intent:'show_history' }
    ];
    this.intentMap.push(...intents);
  }

  // ======================
  // Dynamic AI rules for suggestions
  // ======================
  initDynamicRules() {
    const hints = [
      'Optimize addition/multiplication patterns',
      'Check unit consistency',
      'Break long equations into sub-steps',
      'Use physics engine for kinetic & potential energy',
      'Check division by zero',
      'Round large numbers intelligently',
      'Predict next steps with AutoTrainer AI',
      'Leverage previous user patterns',
      'Highlight potential negative results',
      'Analyze multi-intent commands',
      'Export historical calculations for reference',
      'Suggest CSV/PDF outputs for records',
      'Recommend simplifications for complex inputs',
      'Visualize calculation steps in Reality Canvas',
      'Provide confidence score for each operation',
      'Detect repeated mistakes from memory',
      'Cluster similar commands for optimization',
      'Auto-trigger shortcuts based on pattern recognition',
      'Alert on potentially erroneous large computations',
      'Track trends in velocity, mass, energy calculations'
    ];

    this.dynamicRules.push(...hints.map(h=>({condition: ()=>true, text: `💡 ${h}`})));
  }

  // ======================
  // Detect intents with priority
  // ======================
  detect(input) {
    const parsed = this.nlp.parse(input);
    let detectedIntents = [];

    // Multi-intent detection
    for(const map of this.intentMap){
      for(const kw of map.keywords){
        if(new RegExp(kw,'i').test(input)) {
          detectedIntents.push(map.intent);
          break;
        }
      }
    }

    detectedIntents = detectedIntents.length ? [...new Set(detectedIntents)] : ['unknown'];

    // Memory log
    detectedIntents.forEach(intent=>{
      this.memory.remember({input, intent, profile:this.profile, timestamp:new Date().toISOString()});
    });

    // Generate AI suggestions
    const suggestions = this.generateSuggestions(input, parsed, detectedIntents);

    // Explain engine insights
    const explain = this.explainer.explainInput(input, parsed, detectedIntents);

    return {
      input,
      parsed,
      intents: detectedIntents,
      primaryIntent: detectedIntents[0],
      suggestions,
      explain,
      memorySnapshot: this.memory.memory.slice(-20) // last 20 entries
    };
  }

  // ======================
  // Generate suggestions dynamically
  // ======================
  generateSuggestions(input, parsed, intents){
    const suggestions = [];

    // Apply dynamic rules
    this.dynamicRules.forEach(rule=>{
      if(rule.condition({input, parsed, intents})) suggestions.push(rule.text);
    });

    // Context-based
    if(parsed.numbers.length>3) suggestions.push('⚡ Complex calculation detected – consider step-by-step breakdown');
    if(parsed.numbers.some(n=>n>1000)) suggestions.push('⚠ Large number detected – verify precision');
    if(parsed.type==='physics') suggestions.push('🔬 Physics calculation – WASM-enhanced if available');

    // Memory-based
    const lastEntries = this.memory.memory.slice(-10);
    lastEntries.forEach(entry=>{
      if(entry.input.includes(input)) suggestions.push(`💡 Reuse pattern from history: ${entry.input} → ${entry.intent}`);
    });

    return suggestions;
  }

  // ======================
  // Batch detect multiple inputs
  // ======================
  batchDetect(arr){
    return arr.map(i=>this.detect(i));
  }

  // ======================
  // Add custom intent
  // ======================
  addIntent(keywords,intentName){
    this.intentMap.push({keywords,intent:intentName});
  }

  // ======================
  // AutoTrainer analysis for advanced recommendations
  // ======================
  autoTrainerAnalysis(){
    const clusters = {};
    const history = this.memory.memory;
    history.forEach(entry=>{
      if(!clusters[entry.intent]) clusters[entry.intent]=[];
      clusters[entry.intent].push(entry.input);
    });

    const insights = [];
    for(const intent in clusters){
      insights.push(`🔹 Intent "${intent}" has ${clusters[intent].length} occurrences`);
      if(clusters[intent].length>3) insights.push(`💡 Suggest creating shortcut or template for "${intent}"`);
    }
    return insights;
  }
                            }
