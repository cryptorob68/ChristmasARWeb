// Import Three.js as an ES Module
import * as THREE from './libs/three.module.js';

// Scene Initialization
const scene = new THREE.Scene();

// Camera Setup
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 20;

// Renderer Setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add a Grid Helper
const gridHelper = new THREE.GridHelper(50, 50, 0xff0000, 0x00ff00);
scene.add(gridHelper);

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
