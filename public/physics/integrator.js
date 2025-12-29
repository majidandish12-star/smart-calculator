export function integrate(body, dt) {
  body.velocity.x += (body.force.x / body.mass) * dt;
  body.velocity.y += (body.force.y / body.mass) * dt;

  body.position.x += body.velocity.x * dt;
  body.position.y += body.velocity.y * dt;

  body.resetForce();
}
