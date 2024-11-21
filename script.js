// Import Three.js as an ES Module
import * as THREE from './libs/three.module.js';

// Scene Initialization
const scene = new THREE.Scene();

// Camera Setup
const camera = new THREE.PerspectiveCamera(
  75, // Field of View
  window.innerWidth / window.innerHeight, // Aspect Ratio
  0.1, // Near Clipping Plane
  1000 // Far Clipping Plane
);
camera.position.set(10, 15, 20); // Position the camera
camera.lookAt(0, 0, 0); // Point the camera at the scene

// Renderer Setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x222222); // Dark grey background
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

// Grid Helper
const gridHelper = new THREE.GridHelper(50, 50, 0xff0000, 0x00ff00);
scene.add(gridHelper);

// Raycaster for Interactivity
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Audio Setup
const audioListener = new THREE.AudioListener();
camera.add(audioListener);

const audioLoader = new THREE.AudioLoader();
const audioMap = {}; // Store audio objects by object ID

// Function to Create Anchors and Add Objects
function createAnchor(x, y, z, color, shape = 'cube', audioFile = null) {
  const anchor = new THREE.Object3D();
  anchor.position.set(x, y, z); // Set anchor position
  scene.add(anchor);

  // Geometry Selection
  let geometry;
  if (shape === 'cube') geometry = new THREE.BoxGeometry();
  else if (shape === 'sphere') geometry = new THREE.SphereGeometry(0.5, 32, 32);
  else if (shape === 'cone') geometry = new THREE.ConeGeometry(0.5, 1, 32);

  const material = new THREE.MeshBasicMaterial({ color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData.originalColor = color; // Store original color
  anchor.add(mesh);

  // Slightly raise the object above the grid
  mesh.position.set(0, 0.5, 0);

  // Attach Audio to the Object if Provided
  if (audioFile) {
    const objectSound = new THREE.Audio(audioListener);
    audioLoader.load(audioFile, (buffer) => {
      objectSound.setBuffer(buffer);
      objectSound.setLoop(false);
      objectSound.setVolume(0.5);
    });
    mesh.userData.sound = objectSound; // Save the sound to the object
  }

  return mesh; // Return the object for reference
}

// Add Objects with Audio
createAnchor(0, 0, 0, 0x00ff00, 'cube'); // Central green cube (no audio)
createAnchor(0, 5, 0, 0xff0000, 'cube', './assets/audio1.mp3'); // Red cube with audio
createAnchor(5, 0, 5, 0x0000ff, 'sphere', './assets/audio2.mp3'); // Blue sphere with audio
createAnchor(-5, 0, -5, 0xffff00, 'cone', './assets/audio3.mp3'); // Yellow cone with audio

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate objects around their Y-axis
  scene.children.forEach((child) => {
    if (child instanceof THREE.Object3D) {
      child.rotation.y += 0.01;
    }
  });

  renderer.render(scene, camera);
}

animate();

// Interactivity for Tap Events
window.addEventListener('touchstart', (event) => {
  // Convert touch position to normalized device coordinates
  const touch = event.touches[0];
  mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;

  // Update the Raycaster
  raycaster.setFromCamera(mouse, camera);

  // Find intersections
  const intersects = raycaster.intersectObjects(scene.children, true);

  // If an object is tapped, handle the event
  if (intersects.length > 0) {
    const tappedObject = intersects[0].object;

    // Play the object's audio if it has one
    if (tappedObject.userData.sound) {
      tappedObject.userData.sound.play();
    }

    // Optional: Change the object's color temporarily for feedback
    tappedObject.material.color.set(0xff00ff); // Purple
    setTimeout(() => {
      tappedObject.material.color.set(tappedObject.userData.originalColor);
    }, 300);
  }
});
