// Import Three.js as an ES Module
import * as THREE from './libs/three.module.js';

// Audio Setup
const audioListener = new THREE.AudioListener(); // Add listener to the camera
camera.add(audioListener);

const sound = new THREE.Audio(audioListener); // Create the audio source
const audioLoader = new THREE.AudioLoader(); // Load the audio file
audioLoader.load('./assets/audio.mp3', (buffer) => {
  sound.setBuffer(buffer);
  sound.setLoop(false); // Play once
  sound.setVolume(0.5);
});

// Event Listener for Tap Interactivity
window.addEventListener('touchstart', (event) => {
  // Convert Touch Position to Normalized Device Coordinates
  const touch = event.touches[0];
  const mouse = new THREE.Vector2(
    (touch.clientX / window.innerWidth) * 2 - 1,
    -(touch.clientY / window.innerHeight) * 2 + 1
  );

  // Update the Raycaster
  raycaster.setFromCamera(mouse, camera);

  // Find Intersections
  const intersects = raycaster.intersectObjects(scene.children, true);

  // Play Audio on Tap
  if (intersects.length > 0) {
    const tappedObject = intersects[0].object;

    // Optional: Change Color on Tap
    tappedObject.material.color.set(0xff00ff); // Purple for feedback

    // Play the audio
    if (!sound.isPlaying) {
      sound.play();
    }
  }
});

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
renderer.setClearColor(0x222222); // Dark grey background
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

// Create Multiple Anchors with Objects
const anchors = [];

// Function to Create Anchors and Add Objects
function createAnchor(x, y, z, color, shape = 'cube') {
  const anchor = new THREE.Object3D();
  anchor.position.set(x, y, z); // Position the anchor
  scene.add(anchor);

  // Choose geometry based on the shape
  let geometry;
  if (shape === 'cube') geometry = new THREE.BoxGeometry();
  else if (shape === 'sphere') geometry = new THREE.SphereGeometry(0.5, 32, 32);
  else if (shape === 'cone') geometry = new THREE.ConeGeometry(0.5, 1, 32);

  const material = new THREE.MeshBasicMaterial({ color });
  const mesh = new THREE.Mesh(geometry, material);
  anchor.add(mesh);

  // Slightly raise the object above the grid
  mesh.position.set(0, 0.5, 0);

  anchors.push(anchor);
}

// Add Anchors with Different Shapes and Colors
createAnchor(0, 5, 0, 0xff0000, 'cube');    // Red cube
createAnchor(5, 0, 5, 0x0000ff, 'sphere'); // Blue sphere
createAnchor(-5, 0, -5, 0xffff00, 'cone'); // Yellow cone


function animate() {
  requestAnimationFrame(animate);

  // Rotate the main cube
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  // Rotate each anchor
  anchors.forEach((anchor) => {
    anchor.rotation.y += 0.01; // Spin the anchor on its Y-axis
  });

  renderer.render(scene, camera);
}

animate();
