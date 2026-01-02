/* =======================================================
   HyperCalc Lab – 3D Sandbox & Canvas Measure Fusion
   Features:
   - Measure length & area live (2D & pseudo-3D)
   - Multi-object physics (HyperUltraPhysicsBody)
   - Collisions, gravity, torque, energy, momentum
   - Sandbox UI + interactive canvas
   - Glow, gradient, fancier visualization
   - Save/load & unit conversion
   - AutoTrainer integration for suggestions
======================================================= */

import { HyperUltraPhysicsBody } from '../physics/hyper_ultra_body.js';
import { Sandbox } from '../physics/sandbox.js';
import { CanvasMeasure } from './canvas-measure.js';
import { AutoTrainer } from './auto_trainer.js';

export class HyperCalcLab {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.measure = new CanvasMeasure(this.canvas, { mode: "line", showMetrics: true });
    this.sandbox = new Sandbox(this);
    this.bodies = [];
    this.autoTrainer = window.AutoTrainer;

    // Mouse interactivity
    this.canvas.addEventListener('click', e => this.handleClick(e));
    requestAnimationFrame(() => this.loop());
  }

  addBody(params) {
    const body = new HyperUltraPhysicsBody(params);
    this.bodies.push(body);
    this.sandbox.world.addBody(body);
    return body;
  }

  handleClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Example: add body at click with random mass/velocity
    this.addBody({
      position: { x, y, z: 0 },
      velocity: { x: Math.random()*10-5, y: Math.random()*10-5, z: 0 },
      mass: Math.random()*50+5,
      radius: 10 + Math.random()*5
    });
    
    // Record in AutoTrainer
    this.autoTrainer.record({ x, y }, { action: "addBody" });
  }

  loop(dt = 1/60) {
    this.update(dt);
    this.draw();
    requestAnimationFrame(() => this.loop(dt));
  }

  update(dt) {
    // Physics update
    this.sandbox.update(dt);

    // Collision detection
    for(let i=0;i<this.bodies.length;i++){
      for(let j=i+1;j<this.bodies.length;j++){
        this.bodies[i].collideWith(this.bodies[j]);
      }
    }

    // AutoTrainer suggestions
    this.autoTrainer.showSuggestions({ bodies: this.bodies.length });
  }

  draw() {
    // Clear
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw measurements
    this.measure.draw();

    // Draw bodies
    this.bodies.forEach(body => {
      const p = body.position;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, body.radius, 0, Math.PI*2);
      this.ctx.fillStyle = "rgba(0,200,255,0.7)";
      this.ctx.shadowColor = "cyan";
      this.ctx.shadowBlur = 15;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      // Draw momentum vector
      this.ctx.beginPath();
      this.ctx.moveTo(p.x, p.y);
      this.ctx.lineTo(p.x + body.momentum.x*0.1, p.y + body.momentum.y*0.1);
      this.ctx.strokeStyle = "#ffcc00";
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    });
  }

  saveState() {
    const bodiesData = this.bodies.map(b => ({
      id: b.id,
      position: b.position,
      velocity: b.velocity,
      mass: b.mass,
      radius: b.radius
    }));
    return JSON.stringify({ bodies: bodiesData, points: this.measure.savePoints() });
  }

  loadState(jsonStr) {
    try {
      const data = JSON.parse(jsonStr);
      this.bodies = [];
      data.bodies.forEach(b => this.addBody(b));
      this.measure.loadPoints(data.points);
    } catch(e){
      console.warn("Failed to load HyperCalcLab state");
    }
  }
}

// 🔹 Initialize
window.HyperCalcLab = HyperCalcLab;
console.log("[HyperCalcLab] Ready – Fusion Sandbox + Canvas Measure + HyperPhysics");
