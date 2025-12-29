import init,{calc_physics} from './wasm/hypercalc_wasm.js';
import {RealityEngine} from './reality/reality-engine.js';
import * as THREE from 'https://cdn.skypack.dev/three';

const canvas2d=document.getElementById('canvas2d');
const ctx2d=canvas2d.getContext('2d');
const out=document.getElementById('output');
const reality=new RealityEngine();

// Three.js 3D Viewer
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

document.getElementById('clear').onclick=()=>{ ctx2d.clearRect(0,0,canvas2d.width,canvas2d.height); out.textContent=''; scene.clear(); };

document.getElementById('analyze').onclick=async()=>{
  const strokes=[...Array(10).keys()];
  const img=await reality.analyzeImage({data:strokes});
  const cnv=await reality.analyzeCanvas(strokes);
  const map=await reality.analyzeMap([{x:0,y:0},{x:10,y:10}]);
  out.textContent=JSON.stringify({img,cnv,map},null,2);
};

document.getElementById('autoDesign').onclick=()=>{
  // ایجاد یک ساختمان نمونه خودکار
  const geometry=new THREE.BoxGeometry(1,1,1);
  const material=new THREE.MeshStandardMaterial({color:0x0077ff});
  const cube=new THREE.Mesh(geometry,material);
  cube.position.set(Math.random()*2-1,0.5,Math.random()*2-1);
  scene.add(cube);
};
