// ==========================================================
// HyperCalc – Visual 3D HyperReality Sandbox
// Role:
// - Real-time 3D visualization of HyperUltraPhysicsBody
// - Show trajectories, collisions, energy, momentum
// - Integrates with EngineV3Ultra & WASM physics
// - Includes visual FX for force, torque, collision
// ==========================================================

import { HyperUltraSandbox } from './sandbox.js';
import { HyperUltraPhysicsBody } from './body.js';
import { EngineV3 } from '../core/engine.v3.js';

// THREE.js for 3D visualization
import * as THREE from 'three';

export class HyperRealitySandbox3D {
  constructor(containerId, { width=800, height=600, sandbox=null } = {}) {
    this.container = document.getElementById(containerId);
    this.width = width;
    this.height = height;

    this.sandbox = sandbox || new HyperUltraSandbox({});
    this.engine = new EngineV3();

    // =========================
    // THREE.js setup
    // =========================
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(0, 50, 100);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.container.appendChild(this.renderer.domElement);

    // =========================
    // Lights
    // =========================
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(50, 100, 50);
    this.scene.add(ambientLight, directionalLight);

    // =========================
    // Body meshes
    // =========================
    this.bodyMeshes = new Map();

    // Trajectory lines
    this.trajectories = new Map();

    this.animate = this.animate.bind(this);
    this.running = false;
  }

  // Add a body and its mesh
  addBody(bodyParams) {
    const body = this.sandbox.addBody(bodyParams);

    const geometry = new THREE.SphereGeometry(body.radius, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: Math.random()*0xffffff });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(body.position.x, body.position.y, body.position.z);
    this.scene.add(mesh);
    this.bodyMeshes.set(body.id, mesh);

    // Trajectory line
    const trajMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
    const trajGeometry = new THREE.BufferGeometry().setFromPoints([ new THREE.Vector3(body.position.x, body.position.y, body.position.z) ]);
    const line = new THREE.Line(trajGeometry, trajMaterial);
    this.scene.add(line);
    this.trajectories.set(body.id, line);

    return body;
  }

  // Update mesh positions and trajectories
  updateBodies() {
    for(const body of this.sandbox.simulator.bodies){
      const mesh = this.bodyMeshes.get(body.id);
      if(!mesh) continue;

      mesh.position.set(body.position.x, body.position.y, body.position.z);

      // Update trajectory
      const line = this.trajectories.get(body.id);
      const positions = line.geometry.attributes.position.array;
      const newPoint = new THREE.Vector3(body.position.x, body.position.y, body.position.z);
      const points = Array.from(positions);
      points.push(newPoint.x, newPoint.y, newPoint.z);
      line.geometry.setFromPoints(points.map((v,i)=>new THREE.Vector3(points[i], points[i+1], points[i+2])));
    }
  }

  // Main render loop
  animate() {
    if(!this.running) return;
    requestAnimationFrame(this.animate);

    // Step simulation
    this.sandbox.step();

    // Update visuals
    this.updateBodies();

    // Render scene
    this.renderer.render(this.scene, this.camera);
  }

  // Start visualization
  start() {
    this.running = true;
    this.animate();
  }

  // Stop visualization
  stop() {
    this.running = false;
  }

  // Reset sandbox and visuals
  reset() {
    this.sandbox.reset();
    for(const mesh of this.bodyMeshes.values()){
      this.scene.remove(mesh);
    }
    this.bodyMeshes.clear();
    for(const line of this.trajectories.values()){
      this.scene.remove(line);
    }
    this.trajectories.clear();
  }
}
