// Import Three.js as an ES Module
import * as THREE from './libs/three.module.js';

// Initialize the Three.js Scene
const scene = new THREE.Scene();

// Create a Camera
const camera = new THREE.PerspectiveCamera(
  75, // Field of View
  window.innerWidth / window.innerHeight, // Aspect Ratio
  0.1, // Near Clipping Plane
  1000 // Far Clipping Plane
);

// Adjust the Camera Position
camera.position.set(10, 15, 20); // Move the camera higher and further back
camera.lookAt(0, 0, 0);         // Point the camera toward the center of the scene

// Create a WebGL Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xeeeeee); // Light grey background
document.body.appendChild(renderer.domElement);

// Add a Grid Helper to the Scene
const gridHelper = new THREE.GridHelper(50, 50, 0xff0000, 0x00ff00); // Larger grid with red and green lines
scene.add(gridHelper);

// Add Ambient Light to Brighten the Scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
scene.add(ambientLight);

// Add Directional Light for Shadows and Depth
const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Strong white light
directionalLight.position.set(5, 10, 7); // Position the light
scene.add(directionalLight);

// Add a Basic Cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green cube
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Position the Cube Slightly Above the Grid
cube.position.set(0, 0.5, 0); // Slightly above the grid center

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate the Cube
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();
