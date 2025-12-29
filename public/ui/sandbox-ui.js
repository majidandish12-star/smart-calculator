import { PhysicsSandbox } from '../physics/sandbox.js';

export function initSandbox() {
  const sandbox = new PhysicsSandbox('sandboxCanvas');

  sandbox.addBody({
    x: 150,
    y: 50,
    mass: 5,
    radius: 15
  });

  sandbox.start();

  return sandbox;
}
