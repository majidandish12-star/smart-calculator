/* =====================================
   Physics Engine (Base)
   HyperCalc v2
===================================== */

class PhysicsEngine {
  kineticEnergy(m, v) {
    return 0.5 * m * v * v;
  }

  momentum(m, v) {
    return m * v;
  }

  density(m, volume) {
    return volume === 0 ? 0 : m / volume;
  }
}

window.PhysicsEngine = PhysicsEngine;
