import { integrate } from './integrator.js';

export class Sandbox {
  constructor(world) {
    this.world = world;
  }

  update(dt) {
    this.world.step(dt);
    this.world.bodies.forEach(b => integrate(b, dt));
  }
}
