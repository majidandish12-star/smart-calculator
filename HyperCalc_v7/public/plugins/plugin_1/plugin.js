export function init({scene,camera,renderer,ctx2d,out}) {
  const THREE = window.THREE;
  const geometry = new THREE.BoxGeometry(1,1,1);
  const material = new THREE.MeshStandardMaterial({color:Math.random()*0xffffff});
  const cube = new THREE.Mesh(geometry,material);
  cube.position.set(Math.random()*4-2,0.5,Math.random()*4-2);
  if(scene && scene.add) scene.add(cube);
  out.textContent += '\n[Plugin #1] Loaded: Cube added.';
  ctx2d.canvas.addEventListener('mousemove',e=>{ if(e.buttons!==1) return; ctx2d.fillRect(e.offsetX,e.offsetY,2,2); });
}
