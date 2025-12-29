export class Body {
  constructor({ mass, position, velocity, radius = 10 }) {
    this.mass = mass;
    this.position = position;
    this.velocity = velocity;
    this.radius = radius;
    this.force = { x: 0, y: 0 };
  }

  applyForce(fx, fy) {
    this.force.x += fx;
    this.force.y += fy;
  }

  resetForce() {
    this.force.x = 0;
    this.force.y = 0;
  }
}
