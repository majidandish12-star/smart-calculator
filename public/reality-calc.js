import initRust, { calcPhysics } from './reality-calc-rust_wasm.js';

const aiWorker = new Worker('reality-calc-ai.js');

export class RealityCalc {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.imageData = null;
  }

  async loadImage(file) {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        this.ctx.drawImage(img, 0, this.canvas.width, this.canvas.height);
        this.imageData = this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height);
        resolve(true);
      };
      img.src = URL.createObjectURL(file);
    });
  }

  async analyzeObject() {
    return new Promise(resolve => {
      aiWorker.onmessage = (e) => resolve(e.data);
      aiWorker.postMessage(this.imageData);
    });
  }

  calculatePhysics(params) {
    return calcPhysics(params);
  }

  async processReality(file) {
    await this.loadImage(file);
    const aiResult = await this.analyzeObject();
    const physicsResult = this.calculatePhysics({
      weight: aiResult.weight,
      volume: aiResult.volume,
      velocity: aiResult.velocity || 0
    });
    return {...aiResult, physics: physicsResult};
  }
}
