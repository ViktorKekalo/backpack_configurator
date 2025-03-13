import * as THREE from "three";
import { OrbitControls } from "https://unpkg.com/three@0.138.0/examples/jsm/controls/OrbitControls.js";
import { GLTFExporter } from 'https://unpkg.com/three@0.138.0/examples/jsm/exporters/GLTFExporter.js';
import { Backpack, BodyColors, MetallColors, BodyMaterials } from "./configurator-manager.js";

//#region consts

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
const isMobileDevice = /Mobi/i.test(window.navigator.userAgent);
const modelViewer = document.getElementById('ar-viewer');
const startARButton = document.querySelector('.start-ar');

//#endregion

//#region props

let scene, camera, renderer, controls;
let backpackManager, backpackModel;

//#endregion

//#region setup page

window.addEventListener("resize", () => {
   const { width, height } = sceneWrapper.getBoundingClientRect();
   camera.aspect = width / height;
   camera.updateProjectionMatrix();
   renderer.setSize(width, height);
});

blackBodyButton.onclick = () => {
   removeSelectedClass('.body-color-button');
   blackBodyButton.classList.add('selected');
   backpackManager.changeBodyColor(BodyColors.Black);
}

brownBodyButton.onclick = () => {
   removeSelectedClass('.body-color-button');
   brownBodyButton.classList.add('selected');
   backpackManager.changeBodyColor(BodyColors.Brown);
}

blueBodyButton.onclick = () => {
   removeSelectedClass('.body-color-button');
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

startARButton.onclick = () => {
   if (!isMobileDevice) {
      qrPopup.classList.add('show');
   } else {
      exportGLB(backpackModel);
      const arViewer = document.getElementById("ar-viewer");
      arViewer.style.display = "block";
      arViewer.style.width = "100vw";
      arViewer.style.height = "100vh";
      if (arViewer.activateAR) {
         arViewer.activateAR();
      } else {
         alert("activateAR() is not supported on this browser.");
      }
   }
}

closePopupButton.onclick = () => {
   qrPopup.classList.remove('show');
}

init().then(animate);

//#endregion

//#region 3d 

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

function animate() {
   requestAnimationFrame(animate);
   controls.update();
   renderer.render(scene, camera);
}

function exportGLB(scene) {
   const exporter = new GLTFExporter();

   exporter.parse(scene, (gltf) => {
      const blob = new Blob([JSON.stringify(gltf)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      modelViewer.setAttribute("src", url);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
   }, { binary: false });
}

function setupLights(scene) {
   const dirLight = new THREE.DirectionalLight(0xffffff, 1);
   dirLight.position.set(5, 5, 5);
   dirLight.castShadow = true;
   scene.add(dirLight);
   const ambientLight = new THREE.AmbientLight(0xffffff, 1);
   scene.add(ambientLight);
}

//#endregion

function removeSelectedClass(name) {
   let buttons = document.querySelectorAll(name);
   buttons.forEach(button => button.classList.remove('selected'));
}