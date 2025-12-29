export class Body {
  constructor({
    x = 0,
    y = 0,
    mass = 1,
    velocityX = 0,
    velocityY = 0,
    radius = 10
  }) {
    this.x = x;
    this.y = y;
    this.vx = velocityX;
    this.vy = velocityY;
    this.mass = mass;
    this.radius = radius;

    this.forceX = 0;
    this.forceY = 0;
  }

  applyForce(fx, fy) {
    this.forceX += fx;
    this.forceY += fy;
  }

  resetForces() {
    this.forceX = 0;
    this.forceY = 0;
  }
}
