import { World } from './world.js';
import { Body } from './body.js';

export class PhysicsSandbox {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');

    this.world = new World({});
    this.lastTime = null;

    this._loop = this._loop.bind(this);
  }

  addBody(config) {
    const body = new Body(config);
    this.world.addBody(body);
    return body;
  }

  start() {
    requestAnimationFrame(this._loop);
  }

  _loop(time) {
    if (!this.lastTime) this.lastTime = time;
    const dt = (time - this.lastTime) / 1000;
    this.lastTime = time;

    this.world.step(dt);
    this.render();

    requestAnimationFrame(this._loop);
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.world.bodies.forEach(b => {
      this.ctx.beginPath();
      this.ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = '#38bdf8';
      this.ctx.fill();
    });
  }
}
