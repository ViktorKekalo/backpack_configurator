import * as THREE from "three";
import { OrbitControls } from "https://unpkg.com/three@0.138.0/examples/jsm/controls/OrbitControls.js";
import { GLTFExporter } from 'https://unpkg.com/three@0.138.0/examples/jsm/exporters/GLTFExporter.js';

import { Backpack, BodyColors, MetallColors, BodyMaterials } from "./configurator-manager.js";

const sceneWrapper = document.querySelector('.scene-wrapper');
const brownBodyButton = document.getElementById('body-brown');
const blackBodyButton = document.getElementById('body-black');
const blueBodyButton = document.getElementById('body-blue');
const silverMetallColor = document.getElementById('metall-silver');
const goldMetallColor = document.getElementById('metall-gold');
const blackMetallColor = document.getElementById('metall-black');
const leatherMaterialButton = document.getElementById('material-leather');
const fabricMaterialButton = document.getElementById('material-fabric');
const denimMaterialButton = document.getElementById('material-denim');
const qrPopup = document.querySelector('.qr-popup');
const closePopupButton = document.querySelector('.close-popup-button');
//const startARButton = document.querySelector('.start-ar');
const isMobileDevice = /Mobi/i.test(window.navigator.userAgent);

let scene, camera, renderer, controls;
let backpackManager, backpackModel;

blackBodyButton.onclick = () => {
   let bodyColorButtons = document.querySelectorAll('.body-color-button');
   bodyColorButtons.forEach(button => button.classList.remove('selected'));
   blackBodyButton.classList.add('selected');
   backpackManager.changeBodyColor(BodyColors.Black);
}

brownBodyButton.onclick = () => {
   let bodyColorButtons = document.querySelectorAll('.body-color-button');
   bodyColorButtons.forEach(button => button.classList.remove('selected'));
   brownBodyButton.classList.add('selected');
   backpackManager.changeBodyColor(BodyColors.Brown);
}

blueBodyButton.onclick = () => {
   let bodyColorButtons = document.querySelectorAll('.body-color-button');
   bodyColorButtons.forEach(button => button.classList.remove('selected'));
   blueBodyButton.classList.add('selected');
   backpackManager.changeBodyColor(BodyColors.Blue);
}

leatherMaterialButton.onclick = () => {
   let bodyMatButtons = document.querySelectorAll('.material-button');
   bodyMatButtons.forEach(button => button.classList.remove('selected'));
   leatherMaterialButton.classList.add('selected');
   backpackManager.changeTextures(BodyMaterials.Leather);
}

fabricMaterialButton.onclick = () => {
   let bodyMatButtons = document.querySelectorAll('.material-button');
   bodyMatButtons.forEach(button => button.classList.remove('selected'));
   fabricMaterialButton.classList.add('selected');
   backpackManager.changeTextures(BodyMaterials.Fabric);
}

denimMaterialButton.onclick = () => {
   let bodyMatButtons = document.querySelectorAll('.material-button');
   bodyMatButtons.forEach(button => button.classList.remove('selected'));
   denimMaterialButton.classList.add('selected');
   backpackManager.changeTextures(BodyMaterials.Denim);
}

silverMetallColor.onclick = () => {
   let metallColorButtons = document.querySelectorAll('.metall-color-button');
   metallColorButtons.forEach(button => button.classList.remove('selected'));
   silverMetallColor.classList.add('selected');
   backpackManager.changeMetallColor(MetallColors.Silver);
}

goldMetallColor.onclick = () => {
   let metallColorButtons = document.querySelectorAll('.metall-color-button');
   metallColorButtons.forEach(button => button.classList.remove('selected'));
   goldMetallColor.classList.add('selected');
   backpackManager.changeMetallColor(MetallColors.Gold);
}

blackMetallColor.onclick = () => {
   let metallColorButtons = document.querySelectorAll('.metall-color-button');
   metallColorButtons.forEach(button => button.classList.remove('selected'));
   blackMetallColor.classList.add('selected');
   backpackManager.changeMetallColor(MetallColors.Black);
}

// startARButton.onclick = () => {
//    if (!isMobileDevice) {
//       qrPopup.classList.add('show');
//    }
// }

closePopupButton.onclick = () => {
   qrPopup.classList.remove('show');
}

init().then(animate);

async function init() {
   scene = new THREE.Scene();
   const { width, height } = sceneWrapper.getBoundingClientRect();
   camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10);
   camera.position.set(0, 1, 0.75);
   camera.updateProjectionMatrix();
   renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
   renderer.setSize(width, height);
   sceneWrapper.appendChild(renderer.domElement);
   setupLights(scene);
   controls = new OrbitControls(camera, renderer.domElement);
   controls.enableDamping = true;
   backpackManager = new Backpack();
   backpackModel = await backpackManager.init();
   scene.add(backpackModel);
}

// Animation loop
function animate() {
   requestAnimationFrame(animate);
   controls.update();
   renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener("resize", () => {
   const { width, height } = sceneWrapper.getBoundingClientRect();
   camera.aspect = width / height;
   camera.updateProjectionMatrix();
   renderer.setSize(width, height);
});

function setupLights(scene) {
   const dirLight = new THREE.DirectionalLight(0xffffff, 1);
   dirLight.position.set(5, 5, 5);
   dirLight.castShadow = true;
   scene.add(dirLight);
   const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
   scene.add(ambientLight);
}

// AR Button and AR Integration with model-viewer
const modelViewer = document.getElementById('ar-viewer');
const startARButton = document.querySelector('.start-ar');

// Disable AR initially
//modelViewer.setAttribute('ar', false);

// Start AR session on button click
startARButton.addEventListener("click", () => {
   exportGLB(backpackModel);
   const startARButton = document.getElementById("start-ar");
   const sceneWrapper = document.querySelector(".scene-wrapper");
   const arViewer = document.getElementById("ar-viewer");
   // Hide Three.js scene
   sceneWrapper.style.display = "none";

   // Show model-viewer and set its height dynamically
   arViewer.style.display = "block";
   arViewer.style.width = "100vw";
   arViewer.style.height = "100vh";

   // Start AR
   if (arViewer.activateAR) {
      arViewer.activateAR();
   } else {
      console.error("activateAR() is not supported on this browser.");
   }
});

function exportGLB(scene) {
   const exporter = new GLTFExporter();

   exporter.parse(scene, (gltf) => {
      const blob = new Blob([gltf], { type: "model/gltf-binary" });
      const url = URL.createObjectURL(blob);

      // Update <model-viewer> with the new model
      modelViewer.setAttribute("src", url);

      // Clean up URL to prevent memory leaks
      setTimeout(() => URL.revokeObjectURL(url), 10000);
   }, { binary: true });
}