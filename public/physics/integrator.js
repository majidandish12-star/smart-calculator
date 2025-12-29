export function integrate(body, dt) {
  const ax = body.forceX / body.mass;
  const ay = body.forceY / body.mass;

  body.vx += ax * dt;
  body.vy += ay * dt;

  body.x += body.vx * dt;
  body.y += body.vy * dt;

  body.resetForces();
}
