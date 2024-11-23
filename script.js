// Import Three.js as an ES Module
import * as THREE from './libs/three.module.js';

// Unlock audio context for Safari
const audioContext = THREE.AudioContext.getContext();
document.body.addEventListener('touchstart', () => {
  if (audioContext.state !== 'running') {
    audioContext.resume();
  }
}, { once: true });

// Scene Initialization
const scene = new THREE.Scene();

// Camera Setup
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(10, 15, 20);
camera.lookAt(0, 0, 0);

// Renderer Setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x222222);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
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
const audioBuffers = {}; // Store preloaded audio buffers

// Preload Audio Files
const audioFiles = {
  redCube: './assets/xmasmusic.mp3',
  blueSphere: './assets/audio2.mp3',
  yellowCone: './assets/audio3.mp3',
};

Object.keys(audioFiles).forEach((key) => {
  audioLoader.load(audioFiles[key], (buffer) => {
    audioBuffers[key] = buffer; // Store the preloaded buffer
  });
});

// Function to Create Anchors and Add Objects
function createAnchor(x, y, z, color, shape = 'cube', audioKey = null) {
  const anchor = new THREE.Object3D();
  anchor.position.set(x, y, z);
  scene.add(anchor);

  // Geometry Selection
  let geometry;
  if (shape === 'cube') geometry = new THREE.BoxGeometry();
  else if (shape === 'sphere') geometry = new THREE.SphereGeometry(0.5, 32, 32);
  else if (shape === 'cone') geometry = new THREE.ConeGeometry(0.5, 1, 32);

  const material = new THREE.MeshBasicMaterial({ color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData.originalColor = color;
  anchor.add(mesh);

  // Slightly raise the object above the grid
  mesh.position.set(0, 0.5, 0);

  // Attach Preloaded Audio to the Object
  if (audioKey) {
    const objectSound = new THREE.Audio(audioListener);
    if (audioBuffers[audioKey]) {
      objectSound.setBuffer(audioBuffers[audioKey]);
      objectSound.setLoop(false);
      objectSound.setVolume(0.5);
      mesh.userData.sound = objectSound;
    }
  }

  return mesh;
}

// Add Objects with Unique Audio
createAnchor(0, 0, 0, 0x00ff00, 'cube'); // Central green cube (no audio)
createAnchor(0, 5, 0, 0xff0000, 'cube', 'redCube'); // Red cube with xmasmusic.mp3
createAnchor(5, 0, 5, 0x0000ff, 'sphere', 'blueSphere'); // Blue sphere with audio2.mp3
createAnchor(-5, 0, -5, 0xffff00, 'cone', 'yellowCone'); // Yellow cone with audio3.mp3

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
renderer.domElement.addEventListener('touchstart', (event) => {
  const touch = event.touches[0];
  mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const tappedObject = intersects[0].object;

    // Play the object's audio if available
    if (tappedObject.userData.sound && !tappedObject.userData.sound.isPlaying) {
      tappedObject.userData.sound.play();
    }

    // Optional: Change the object's color temporarily for feedback
    tappedObject.material.color.set(0xff00ff);
    setTimeout(() => {
      tappedObject.material.color.set(tappedObject.userData.originalColor);
    }, 300);
  }
});
