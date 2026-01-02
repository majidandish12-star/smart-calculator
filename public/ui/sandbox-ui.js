// ==========================================================
// HyperCalc Lab Ultimate Sandbox
// Full Integration: Physics, EngineV3, UI, AI Suggestions
// Interactive, 3D, Energy halos, Collisions, Forces, Explosions
// ==========================================================

import { HyperUltraPhysicsBody } from '../physics/body.js';
import { WorldUltimate } from '../physics/world.js';
import { integrate } from '../physics/integrator.js';
import { EngineV3 } from '../core/engine.v3.js';
import { LearningEngine } from '../core/learning-engine.js';

export function initHyperCalcLab(canvasId = 'sandboxCanvas') {
  // -----------------------------
  // 1️⃣ World setup
  // -----------------------------
  const world = new WorldUltimate({
    gravity: { x: 0, y: 9.81, z: 0 },
    airResistance: 0.01,
    frictionGlobal: 0.99,
    maxSubSteps: 10
  });

  // -----------------------------
  // 2️⃣ Canvas setup
  // -----------------------------
  const canvas = document.getElementById(canvasId);
  canvas.width = window.innerWidth * 0.9;
  canvas.height = window.innerHeight * 0.85;
  const ctx = canvas.getContext('2d');

  // -----------------------------
  // 3️⃣ EngineV3 + Learning
  // -----------------------------
  const engine = new EngineV3();
  engine.learn = new LearningEngine();

  // -----------------------------
  // 4️⃣ Body creation helper
  // -----------------------------
  function createRandomBody() {
    const body = new HyperUltraPhysicsBody({
      mass: Math.random() * 50 + 1,
      position: { x: Math.random() * canvas.width, y: Math.random() * canvas.height, z: 0 },
      velocity: { x: Math.random() * 50 - 25, y: Math.random() * 50 - 25, z: 0 },
      radius: Math.random() * 15 + 5,
      elasticity: Math.random() * 0.5 + 0.5,
      angularVelocity: Math.random() * 5
    });
    world.addBody(body);
    return body;
  }

  const bodies = Array.from({ length: 5 }, createRandomBody);

  // -----------------------------
  // 5️⃣ User Interactions
  // -----------------------------
  canvas.addEventListener('click', (e) => {
    const fx = (Math.random() - 0.5) * 1000;
    const fy = (Math.random() - 0.5) * 1000;
    world.applyGlobalForce(fx, fy, 0);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') world.gravity.y -= 1;
    if (e.key === 'ArrowDown') world.gravity.y += 1;
    if (e.key === 'ArrowLeft') world.gravity.x -= 1;
    if (e.key === 'ArrowRight') world.gravity.x += 1;
    if (e.key === ' ') bodies.push(createRandomBody());
  });

  // -----------------------------
  // 6️⃣ Drag & Drop
  // -----------------------------
  let draggingBody = null;
  canvas.addEventListener('mousedown', e => {
    const x = e.offsetX, y = e.offsetY;
    draggingBody = world.bodies.find(b => {
      const dx = b.position.x - x, dy = b.position.y - y;
      return Math.sqrt(dx*dx + dy*dy) < b.radius;
    });
  });
  canvas.addEventListener('mousemove', e => {
    if (draggingBody) {
      draggingBody.applyForce(e.movementX * 50, e.movementY * 50, 0);
    }
  });
  canvas.addEventListener('mouseup', () => draggingBody = null);

  // -----------------------------
  // 7️⃣ Fantasy Energy Halos
  // -----------------------------
  function drawEnergyHalos() {
    world.bodies.forEach(body => {
      const intensity = Math.min(body.energy / 1000, 1);
      ctx.beginPath();
      ctx.arc(body.position.x, body.position.y, body.radius + intensity * 20, 0, Math.PI*2);
      ctx.strokeStyle = `rgba(255,255,0,${intensity})`;
      ctx.stroke();
    });
  }

  // -----------------------------
  // 8️⃣ Render Loop
  // -----------------------------
  function render(dt = 1/60) {
    world.step(dt);
    world.bodies.forEach(b => integrate(b, dt));

    // Clear canvas
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw bodies
    world.bodies.forEach(body => {
      ctx.beginPath();
      ctx.arc(body.position.x, body.position.y, body.radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${(body.energy % 360)}, 100%, 50%)`;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.stroke();

      // velocity vector
      ctx.beginPath();
      ctx.moveTo(body.position.x, body.position.y);
      ctx.lineTo(body.position.x + body.velocity.x, body.position.y + body.velocity.y);
      ctx.strokeStyle = '#0f0';
      ctx.stroke();
    });

    // Energy halos
    drawEnergyHalos();

    // AI-driven suggestions
    const aiSuggestions = world.generateSuggestions?.() || [];
    ctx.fillStyle = '#fff';
    ctx.font = '16px monospace';
    aiSuggestions.forEach((s, i) => ctx.fillText(s, 10, 20 + i * 20));

    requestAnimationFrame(render);
  }

  render();

  // -----------------------------
  // 9️⃣ Return sandbox with full API
  // -----------------------------
  return {
    canvas,
    ctx,
    world,
    bodies,
    engine,
    createRandomBody
  };
}
