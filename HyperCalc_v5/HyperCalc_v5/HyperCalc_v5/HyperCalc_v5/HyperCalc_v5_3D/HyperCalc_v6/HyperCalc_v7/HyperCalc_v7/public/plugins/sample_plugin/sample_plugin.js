export function init({scene,camera,renderer,ctx2d,out}) {
  // Sample 3D cube generator
  const THREE = window.THREE;
  const geometry = new THREE.BoxGeometry(1,1,1);
  const material = new THREE.MeshStandardMaterial({color:0xffa500});
  const cube = new THREE.Mesh(geometry,material);
  cube.position.set(0,0.5,0);
  scene.add(cube);

  // Auto-design suggestion
  out.textContent += '\\n[Plugin] Sample Plugin Loaded: Cube added and ready for auto-design.';

  // Listen for canvas strokes
  ctx2d.canvas.addEventListener('mousemove',e=>{
    if(e.buttons!==1) return;
    ctx2d.fillRect(e.offsetX,e.offsetY,2,2);
  });
}
