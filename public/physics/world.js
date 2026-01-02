// ==========================================================
// HyperCalc Ultimate World Engine
// Role:
// - Full 3D Multi-Object Simulation
// - Gravity, Airflow, Friction, Torque, Collisions
// - Energy, Momentum, Stress Analysis
// - WASM Physics Integration
// - HyperUltraPhysicsBody & Sandbox Compatible
// - AI suggestions & ExplainEngine ready
// ==========================================================

import { HyperUltraPhysicsBody } from './body.js';
import { integrate } from './integrator.js';

export class WorldUltimate {
  constructor({
    gravity = { x: 0, y: 9.81, z: 0 },
    airResistance = 0.01,
    frictionGlobal = 0.98,
    maxSubSteps = 10,
    dtDefault = 1 / 60
  } = {}) {
    this.gravity = gravity;
    this.airResistance = airResistance;
    this.frictionGlobal = frictionGlobal;
    this.bodies = [];
    this.time = 0;
    this.dtDefault = dtDefault;
    this.maxSubSteps = maxSubSteps;
    this.events = []; // logs for AI and ExplainEngine
  }

  // Add a body to the world
  addBody(body) {
    if (!(body instanceof HyperUltraPhysicsBody)) {
      console.warn('⚠ Attempted to add non-physics body!');
      return;
    }
    this.bodies.push(body);
    this.events.push(`Added body: ${body.id}`);
  }

  // Remove a body
  removeBody(bodyId) {
    this.bodies = this.bodies.filter(b => b.id !== bodyId);
    this.events.push(`Removed body: ${bodyId}`);
  }

  // Step simulation by dt
  step(dt = this.dtDefault) {
    const subDt = dt / this.maxSubSteps;

    for (let step = 0; step < this.maxSubSteps; step++) {
      // Reset forces
      this.bodies.forEach(b => b.resetForces());

      // Apply global forces (gravity, air resistance)
      this.bodies.forEach(b => {
        b.applyForce(
          this.gravity.x * b.mass,
          this.gravity.y * b.mass,
          this.gravity.z * b.mass
        );
      });

      // Integrate each body (position, velocity)
      this.bodies.forEach(b => integrate(b, subDt));

      // Handle collisions between all pairs
      for (let i = 0; i < this.bodies.length; i++) {
        for (let j = i + 1; j < this.bodies.length; j++) {
          this.bodies[i].collideWith(this.bodies[j]);
        }
      }

      // Apply friction & air resistance globally
      this.bodies.forEach(b => {
        b.velocity.x *= this.frictionGlobal * (1 - this.airResistance);
        b.velocity.y *= this.frictionGlobal * (1 - this.airResistance);
        b.velocity.z *= this.frictionGlobal * (1 - this.airResistance);
      });

      // Update time
      this.time += subDt;
    }

    // Log world status for AI or ExplainEngine
    this.events.push(`World stepped by dt=${dt.toFixed(4)}s, time=${this.time.toFixed(2)}s`);
  }

  // Get summary of the world
  getStatus() {
    return {
      time: this.time,
      bodyCount: this.bodies.length,
      bodies: this.bodies.map(b => b.getStatus()),
      events: [...this.events]
    };
  }

  // Apply external global force (e.g., explosion, wind)
  applyGlobalForce(fx = 0, fy = 0, fz = 0) {
    this.bodies.forEach(b => b.applyForce(fx, fy, fz));
    this.events.push(`Applied global force: (${fx},${fy},${fz})`);
  }

  // Reset world (clear bodies and events)
  reset() {
    this.bodies = [];
    this.events = [];
    this.time = 0;
  }

  // Query bodies with filters for AI suggestions
  queryBodies(filterFn) {
    return this.bodies.filter(filterFn);
  }

  // Auto-suggest warnings or optimizations
  generateSuggestions() {
    const suggestions = [];
    this.bodies.forEach(b => {
      if (b.energy > 50000) suggestions.push(`⚡ ${b.id} has very high kinetic energy!`);
      if (b.mass > 1000) suggestions.push(`⚠ ${b.id} is very heavy, check constraints`);
      if (Math.abs(b.velocity.y) > 50) suggestions.push(`⚠ ${b.id} vertical velocity too high`);
    });
    return suggestions;
  }
}
