/* =========================================================
   HyperCalc vX – Legendary NLP & Pattern Engine
   Author: Majid Andishmandzade
   Role:
   - Parse Persian & English calculation commands
   - Extract numbers, units, operation type, physical concepts
   - Generate AI suggestions
   - Ready for LearningEngine & ExplainEngine
   - Detect multi-step expressions
========================================================= */

export class NLPParser {
  constructor() {
    this.knownUnits = ['kg','m','cm','mm','s','m/s','J','kJ','°C','K'];
    this.knownOperations = ['addition','subtraction','multiplication','division','power','root','log','sin','cos','tan'];
  }

  parse(text) {
    const output = {
      type: 'unknown',
      numbers: [],
      units: [],
      operations: [],
      concepts: [],
      suggestions: [],
      details: {},
    };

    // ======================
    // Normalize text
    // ======================
    const normalized = text.toLowerCase().replace(/[،؟!]/g,'').trim();

    // ======================
    // Extract numbers
    // ======================
    const nums = normalized.match(/\d+(\.\d+)?/g)?.map(Number) || [];
    output.numbers = nums;

    // ======================
    // Detect known units
    // ======================
    this.knownUnits.forEach(u => {
      if(new RegExp(u,'i').test(normalized)) output.units.push(u);
    });

    // ======================
    // Detect operations
    // ======================
    const opMap = {
      جمع: 'addition', add:'addition', '+':'addition',
      تفریق:'subtraction', subtract:'subtraction','−':'subtraction',
      ضرب:'multiplication', multiply:'multiplication','×':'multiplication',
      تقسیم:'division', divide:'division','÷':'division',
      توان:'power','^':'power', ریشه:'root',
      log:'log', ln:'log', sin:'sin', cos:'cos', tan:'tan'
    };
    Object.entries(opMap).forEach(([key,val])=>{
      if(new RegExp(key,'i').test(normalized)) output.operations.push(val);
    });

    // ======================
    // Detect physical concepts
    // ======================
    const conceptMap = {
      mass:['جرم','mass','kg'],
      velocity:['سرعت','velocity','m/s'],
      energy:['انرژی','energy','J','kJ'],
      area:['مساحت','area','m2','cm2'],
      perimeter:['محیط','perimeter','m','cm'],
      volume:['حجم','volume','m3','cm3'],
      length:['طول','length','m','cm','mm']
    };
    Object.entries(conceptMap).forEach(([key,patterns])=>{
      patterns.forEach(p=>{
        if(new RegExp(p,'i').test(normalized)) output.concepts.push(key);
      });
    });

    // ======================
    // Type inference
    // ======================
    if(output.concepts.includes('mass')) output.type='mass';
    else if(output.concepts.includes('energy')) output.type='energy';
    else if(output.concepts.includes('area')) output.type='area';
    else if(output.concepts.includes('volume')) output.type='volume';
    else if(output.operations.length>0) output.type='math';
    else if(output.numbers.length>0) output.type='number_sequence';
    
    // ======================
    // AI Suggestion Generator
    // ======================
    if(output.type==='math' && output.operations.includes('addition')) output.suggestions.push('💡 Consider using sum shortcuts for multiple numbers');
    if(output.type==='math' && output.operations.includes('multiplication')) output.suggestions.push('💡 Multiplication can be optimized using distributive law');
    if(output.type==='energy') output.suggestions.push('⚡ Check if kinetic or potential energy formula applies');
    if(output.type==='mass' && output.units.includes('kg')) output.suggestions.push('⚖ Ensure mass is in kilograms for physics calculations');
    if(output.numbers.length>5) output.suggestions.push('📌 Large number of operands detected, consider splitting calculations');
    if(normalized.includes('area')) output.suggestions.push('📏 Ensure units match for width and height');
    if(normalized.includes('volume')) output.suggestions.push('📐 Double-check dimensions: length × width × height');
    if(normalized.includes('velocity')) output.suggestions.push('🚀 Check velocity units and formula consistency');
    if(normalized.includes('energy')) output.suggestions.push('🔋 Remember E = ½mv² for kinetic energy');

    // ======================
    // Metadata
    // ======================
    output.details.originalText = text;
    output.details.wordCount = text.split(/\s+/).length;
    output.details.numCount = nums.length;
    output.details.timestamp = new Date().toISOString();

    return output;
  }

  // ======================
  // Utility: Batch parse multiple commands
  // ======================
  batchParse(arr) {
    return arr.map(t=>this.parse(t));
  }

  // ======================
  // Extendable: Add custom operations
  // ======================
  addOperation(name, patterns=[]) {
    this.knownOperations.push(name);
    patterns.forEach(p=>this.knownUnits.push(p));
  }

  // ======================
  // Extendable: Add custom units
  // ======================
  addUnit(unitName) {
    if(!this.knownUnits.includes(unitName)) this.knownUnits.push(unitName);
  }
      }
