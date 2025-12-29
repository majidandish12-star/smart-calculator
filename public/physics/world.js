import { integrate } from './integrator.js';

export class World {
  constructor({ gravity = 9.81, friction = 0.01 }) {
    this.gravity = gravity;
    this.friction = friction;
    this.bodies = [];
  }

  addBody(body) {
    this.bodies.push(body);
  }

  step(dt) {
    this.bodies.forEach(body => {
      body.applyForce(0, body.mass * this.gravity);
      body.applyForce(-body.vx * this.friction, -body.vy * this.friction);
      integrate(body, dt);
    });
  }
}
