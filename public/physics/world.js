export class World {
  constructor({ gravity = 9.81 }) {
    this.gravity = gravity;
    this.bodies = [];
  }

  addBody(body) {
    this.bodies.push(body);
  }

  step(dt) {
    this.bodies.forEach(b => {
      b.applyForce(0, b.mass * this.gravity);
    });
  }
}
