// Import Three.js and GLTFLoader as ES Modules
import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';

// Unlock audio context for Safari
const audioContext = THREE.AudioContext.getContext();
document.body.addEventListener(
  'touchstart',
  () => {
    if (audioContext.state !== 'running') {
      audioContext.resume();
    }
  },
  { once: true }
);

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
const audioBuffers = {};

// Preload Audio Files
const audioFiles = {
  santa: './assets/santa_audio.mp3',
  grinch: './assets/grinch_audio.mp3',
  elf: './assets/elf_audio.mp3',
  rudolf: './assets/rudolf_audio.mp3',
};

Object.keys(audioFiles).forEach((key) => {
  audioLoader.load(audioFiles[key], (buffer) => {
    audioBuffers[key] = buffer; // Store the preloaded buffer
  });
});

// Function to Add a Character with a Model and Audio
function createCharacter(x, y, z, modelFile, scale, audioKey) {
  const anchor = new THREE.Object3D();
  anchor.position.set(x, y, z);
  scene.add(anchor);

  // Load the 3D model
  const loader = new GLTFLoader();
  loader.load(modelFile, (gltf) => {
    const model = gltf.scene;
    model.scale.set(scale, scale, scale); // Scale the model
    anchor.add(model);

    // Attach Preloaded Audio to the Model
    if (audioKey && audioBuffers[audioKey]) {
      const objectSound = new THREE.Audio(audioListener);
      objectSound.setBuffer(audioBuffers[audioKey]);
      objectSound.setLoop(false);
      objectSound.setVolume(0.5);
      model.userData.sound = objectSound;
    }
  });

  return anchor;
}

// Add Characters
createCharacter(0, 0, 0, './assets/santa.glb', 1.5, 'santa'); // Santa
createCharacter(5, 0, 5, './assets/grinch.glb', 1.2, 'grinch'); // Grinch
createCharacter(-5, 0, -5, './assets/elf.glb', 1.3, 'elf'); // Elf
createCharacter(0, 0, 10, './assets/rudolf.glb', 1.8, 'rudolf'); // Rudolf

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate only the characters (not the grid)
  scene.children.forEach((child) => {
    if (child !== gridHelper && child instanceof THREE.Object3D) {
      child.rotation.y += 0.01; // Rotate the anchor and its children
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
  }
});
