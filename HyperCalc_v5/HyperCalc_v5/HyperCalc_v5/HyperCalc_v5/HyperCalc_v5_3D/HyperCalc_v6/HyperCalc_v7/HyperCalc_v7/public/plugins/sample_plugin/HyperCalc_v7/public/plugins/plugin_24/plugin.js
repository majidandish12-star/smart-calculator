export function init({scene,camera,renderer,ctx2d,out}) {
  // Sample Plugin #24
  const THREE = window.THREE;
  
  // Random cube generation
  const geometry = new THREE.BoxGeometry(1,1,1);
  const material = new THREE.MeshStandardMaterial({color: Math.random()*0xffffff});
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(Math.random()*4-2,0.5,Math.random()*4-2);
  scene.add(cube);
  
  // Output plugin info
  out.textContent += '\n[Plugin #24] Loaded with random cube and ready for design.';
  
  // Canvas drawing enhancement
  ctx2d.canvas.addEventListener('mousemove', e => {
    if(e.buttons!==1) return;
    ctx2d.fillRect(e.offsetX, e.offsetY, 2, 2);
  });
}
