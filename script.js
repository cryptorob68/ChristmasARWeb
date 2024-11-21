import * as THREE from './libs/three.module.js';

// The rest of your Three.js code remains the same.


// Initialize the Three.js Scene
const scene = new THREE.Scene();

// Add a Grid Helper to the Scene
const gridHelper = new THREE.GridHelper(150, 150, 0xff0000, 0x00ff00); // Red for main lines, green for secondary
scene.add(gridHelper);

// Create a Camera
const camera = new THREE.PerspectiveCamera(
  75, // Field of View
  window.innerWidth / window.innerHeight, // Aspect Ratio
  0.1, // Near Clipping Plane
  1000 // Far Clipping Plane
);

// Create a WebGL Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add a Basic Cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Position the Camera
camera.position.z = 5;

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate the Cube
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();
