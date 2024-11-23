// Import Three.js and GLTFLoader as ES Modules
import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';

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
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(10, 15, 20);
camera.lookAt(0, 0, 0);

// Renderer Setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x222222); // Dark grey background
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
const audioBuffers = {};

// Preload Audio Files
const audioFiles = {
  santa: './assets/xmasmusic.mp3',       // Santa's audio
  grinch: './assets/grinch_audio.mp3',  // Grinch's audio
  elf: './assets/elf_audio.mp3',        // Elf's audio
  rudolf: './assets/rudolf_audio.mp3',  // Rudolf's audio
};

Object.keys(audioFiles).forEach((key) => {
  audioLoader.load(audioFiles[key], (buffer) => {
    audioBuffers[key] = buffer; // Store the preloaded buffer
  });
});

// Function to Create 3D Models with Optional Audio
function createCharacter(x, y, z, modelFile, scale, audioKey = null) {
  const anchor = new THREE.Object3D();
  anchor.position.set(x, y, z);
  scene.add(anchor);

  const loader = new GLTFLoader();
  loader.load(
    modelFile,
    (gltf) => {
      const model = gltf.scene;
      model.scale.set(scale, scale, scale);
      anchor.add(model);

      // Attach Preloaded Audio to the Model
      if (audioKey && audioBuffers[audioKey]) {
        const objectSound = new THREE.Audio(audioListener);
        objectSound.setBuffer(audioBuffers[audioKey]);
        objectSound.setLoop(false);
        objectSound.setVolume(0.5);
        model.userData.sound = objectSound;
      }
    },
    undefined,
    (error) => {
      console.error(`Error loading model file: ${modelFile}`, error);
    }
  );

  return anchor;
}

// Add Characters with Models and Audio
createCharacter(0, 0, 0, './assets/Santa.glb', 1.5, 'santa'); // Santa with audio
createCharacter(5, 0, 5, './assets/Grinch.glb', 1.2, 'grinch'); // Grinch with audio
createCharacter(-5, 0, -5, './assets/Elf.glb', 1.3, 'elf'); // Elf with audio
createCharacter(0, 0, 10, './assets/Rudolf.glb', 1.8, 'rudolf'); // Rudolf with audio

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  scene.children.forEach((child) => {
    if (child !== gridHelper && child instanceof THREE.Object3D) {
      child.rotation.y += 0.01; // Rotate the characters
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
