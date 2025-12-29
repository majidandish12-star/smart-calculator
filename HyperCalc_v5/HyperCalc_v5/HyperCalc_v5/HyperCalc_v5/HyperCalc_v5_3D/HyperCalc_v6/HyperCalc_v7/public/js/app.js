import init,{calc_physics} from './wasm/hypercalc_wasm.js';
import {RealityEngine} from './reality/reality-engine.js';
import * as THREE from 'https://cdn.skypack.dev/three';

const canvas2d=document.getElementById('canvas2d');
const ctx2d=canvas2d.getContext('2d');
const out=document.getElementById('output');
const reality=new RealityEngine();
const viewer=document.getElementById('viewer3d');

const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(75,viewer.clientWidth/viewer.clientHeight,0.1,1000);
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setSize(viewer.clientWidth,viewer.clientHeight);
viewer.appendChild(renderer.domElement);
camera.position.z=5;
const controls=new THREE.OrbitControls(camera,renderer.domElement);

const animate=()=>{ requestAnimationFrame(animate); renderer.render(scene,camera); };
animate();

let drawing=false;
canvas2d.addEventListener('mousedown',()=>drawing=true);
canvas2d.addEventListener('mouseup',()=>drawing=false);
canvas2d.addEventListener('mousemove',e=>{ if(!drawing)return; ctx2d.fillRect(e.offsetX,e.offsetY,2,2); });

document.getElementById('clear').onclick=()=>{ ctx2d.clearRect(0,0,canvas2d.width,canvas2d.height); out.textContent=''; while(scene.children.length>0){scene.remove(scene.children[0]);} };

document.getElementById('analyze').onclick=async()=>{
  const strokes=[...Array(10).keys()];
  const img=await reality.analyzeImage({data:strokes});
  const cnv=await reality.analyzeCanvas(strokes);
  const map=await reality.analyzeMap([{x:0,y:0},{x:10,y:10}]);
  out.textContent=JSON.stringify({img,cnv,map},null,2);
};

document.getElementById('autoDesign').onclick=()=>{
  const geometry=new THREE.BoxGeometry(1,1,1);
  const material=new THREE.MeshStandardMaterial({color:0x00ff77});
  const cube=new THREE.Mesh(geometry,material);
  cube.position.set(Math.random()*3-1.5,0.5,Math.random()*3-1.5);
  scene.add(cube);
};

document.getElementById('suggestDesign').onclick=()=>{
  const designs=[{type:'Modern',color:0xff0000},{type:'Classic',color:0x00ff00},{type:'Asian',color:0x0000ff},{type:'Forest',color:0x00ffff},{type:'Hotel',color:0xff00ff},{type:'Apartment',color:0xffff00}];
  designs.forEach(d=>{
    const geo=new THREE.BoxGeometry(1,1,1);
    const mat=new THREE.MeshStandardMaterial({color:d.color});
    const mesh=new THREE.Mesh(geo,mat);
    mesh.position.set(Math.random()*4-2,0.5,Math.random()*4-2);
    scene.add(mesh);
  });
};

// =========================
// Plugin Loader
// =========================
const pluginContainer={};
document.getElementById('loadPlugin').onclick=async()=>{
  const pluginUrl=prompt('آدرس پلاگین را وارد کنید:');
  if(!pluginUrl) return;
  const pluginModule=await import(pluginUrl);
  if(pluginModule.init){ pluginModule.init({scene,camera,renderer,ctx2d,out}); pluginContainer[pluginUrl]=pluginModule; alert('پلاگین بارگذاری شد'); }
};
