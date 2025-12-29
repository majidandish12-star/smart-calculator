import init,{calc_physics} from './wasm/hypercalc_wasm.js';
import {RealityEngine} from './reality/reality-engine.js';
import {loadModule} from './modules-loader.js';

const canvas=document.getElementById('canvas');
const ctx=canvas.getContext('2d');
const out=document.getElementById('output');
const reality=new RealityEngine();

let drawing=false;
canvas.addEventListener('mousedown',()=>drawing=true);
canvas.addEventListener('mouseup',()=>drawing=false);
canvas.addEventListener('mousemove',e=>{
  if(!drawing) return;
  ctx.fillRect(e.offsetX,e.offsetY,2,2);
});

document.getElementById('clear').onclick=()=>{
  ctx.clearRect(0,0,canvas.width,canvas.height);
  out.textContent='';
};

document.getElementById('calc').onclick=async()=>{
  await init();
  const pixels=ctx.getImageData(0,0,canvas.width,canvas.height).data.length;
  const volume=pixels*0.000001;
  const mass=10;
  const velocity=5;
  const res=calc_physics(mass,velocity,volume);
  out.textContent=JSON.stringify(res,null,2);
};

document.getElementById('analyze').onclick=async()=>{
  const strokes=[...Array(10).keys()];
  const imageAnalysis=await reality.analyzeImage({data:strokes});
  const canvasAnalysis=await reality.analyzeCanvas(strokes);
  const mapAnalysis=await reality.analyzeMap([{x:0,y:0},{x:10,y:10}]);
  out.textContent=JSON.stringify({imageAnalysis,canvasAnalysis,mapAnalysis},null,2);
};

// Load 30 professional modules
const modules=['architecture','civil','physics','geometry','math','astronomy','space','engineering','mechanics','electrics','robotics','ai','environment','chemistry','biology','geography','cartography','design','interior','landscape','structural','fluid','thermal','materials','quantum','finance','statistics','optimization','simulation','experimental'];
modules.forEach(mod=>loadModule(mod));
