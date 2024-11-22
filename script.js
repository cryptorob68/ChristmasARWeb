import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(10, 15, 20);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

// Add Grid
const gridHelper = new THREE.GridHelper(50, 50, 0xff0000, 0x00ff00);
scene.add(gridHelper);

// Load Audio Files
const audioFiles = {
  santa: './assets/xmasmusic.mp3',       // Santa's audio
  grinch: './assets/grinch_audio.mp3',  // Grinch's audio
  elf: './assets/elf_audio.mp3',        // Elf's audio
  rudolf: './assets/rudolf_audio.mp3',  // Rudolf's audio
};

// Load Santa Model
const loader = new GLTFLoader();
loader.load('./assets/Santa.glb', (gltf) => {
  const model = gltf.scene;
  model.scale.set(1.5, 1.5, 1.5);
  model.position.set(0, 0, 0);
  scene.add(model);
}, undefined, (error) => {
  console.error('Error loading Santa model:', error);
});

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
