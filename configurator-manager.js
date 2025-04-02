import * as THREE from "three";
import { GLTFLoader } from "./three/gltfLoader.js";

const BodyColors = {
   Brown: new THREE.Color(0x8B4512),
   Black: new THREE.Color(0x1A1A1A),
   Blue: new THREE.Color(0x104D97)
};

const MetallColors = {
   Silver: new THREE.Color(0xFFFFFF),
   Gold: new THREE.Color(0xFFD500),
   Black: new THREE.Color(0x1A1A1A),
}

const BodyMaterials = {
   Leather: 'leather',
   Denim: 'denim',
   Fabric: 'fabric'
}

const modelPath = './resourses/model/backpack.glb';
const bodyName = 'Mesh';
const metallName = 'Mesh_1';
const texturesPath = './resourses/textures/';
const bodyBaseTextureName = '_baseColor.jpg';
const bodyNormalTextureName = '_normal.jpg';
const bodyocclusionRoughnessMetallicTextureName = '_occlusionRoughnessMetallic.jpg';

class BodyTextures {
   baseColor;
   normal;
   occlusionRoughnessMetallic;

   constructor(baseColor, normal, occlusionRoughnessMetallic) {
      this.baseColor = baseColor;
      this.normal = normal;
      this.occlusionRoughnessMetallic = occlusionRoughnessMetallic;
   }

   checkIfNeededObject(name) {
      return (
         this.baseColor.name === `${name}${bodyBaseTextureName}` &&
         this.normal.name === `${name}${bodyNormalTextureName}` &&
         this.occlusionRoughnessMetallic.name === `${name}${bodyocclusionRoughnessMetallicTextureName}`
      );
   }
}

class Backpack {

   #textureLoader = new THREE.TextureLoader();
   #glbModelLoader = new GLTFLoader();
   #backpackModel;
   #backpackBody;
   #backpackMetall;
   #activeBodyColor = BodyColors.Brown;
   #activeMetallColor = MetallColors.Silver;
   #activeBodyMaterial = BodyMaterials.Leather;
   #bodyTextures = [];

   async init() {
      let model = await this.#glbModelLoader.loadAsync(modelPath);
      this.#backpackModel = model.scene.children[0];
      this.#backpackBody = this.#backpackModel.getObjectByName(bodyName);
      this.#backpackBody.material.color = this.#activeBodyColor;
      this.#backpackMetall = this.#backpackModel.getObjectByName(metallName);
      this.#backpackMetall.material.color = this.#activeMetallColor;
      this.#backpackBody.material.map.name = this.#activeBodyMaterial + bodyBaseTextureName;
      this.#backpackBody.material.normalMap.name = this.#activeBodyMaterial + bodyNormalTextureName;
      this.#backpackBody.material.roughnessMap.name = this.#activeBodyMaterial + bodyocclusionRoughnessMetallicTextureName;
      let texturesSet = new BodyTextures(this.#backpackBody.material.map, this.#backpackBody.material.normalMap, this.#backpackBody.material.roughnessMap);
      this.#bodyTextures.push(texturesSet);
      console.log(this.#bodyTextures);
      return this.#backpackModel;
   }

   changeBodyColor(color) {
      this.#activeBodyColor = color;
      this.#backpackBody.material.color = this.#activeBodyColor;
   }

   changeMetallColor(color) {
      this.#activeMetallColor = color;
      this.#backpackMetall.material.color = this.#activeMetallColor;
   }

   changeTextures(name) {
      this.#activeBodyMaterial = name;
      let texturesSet = this.#bodyTextures.find(texture => texture.checkIfNeededObject(this.#activeBodyMaterial));

      if (!texturesSet) {
         texturesSet = this.#downloadTextures();
      }
      this.#backpackBody.material.map = texturesSet.baseColor;
      this.#backpackBody.material.map.encoding = THREE.NoColorSpace;
      this.#backpackBody.material.map.flipY = false;
      this.#backpackBody.material.normalMap = texturesSet.normal;
      this.#backpackBody.material.normalMap.encoding = THREE.NoColorSpace;
      this.#backpackBody.material.normalMap.flipY = false;
      this.#backpackBody.material.roughnessMap = texturesSet.occlusionRoughnessMetallic;
      this.#backpackBody.material.roughnessMap.encoding = THREE.NoColorSpace;
      this.#backpackBody.material.roughnessMap.flipY = false;
      this.#backpackBody.material.metalnessMap = texturesSet.occlusionRoughnessMetallic;
      this.#backpackBody.material.metalnessMap.encoding = THREE.NoColorSpace;
      this.#backpackBody.material.metalnessMap.flipY = false;
      this.#backpackBody.material.aoMap = texturesSet.occlusionRoughnessMetallic;
      this.#backpackBody.material.aoMap.encoding = THREE.NoColorSpace;
      this.#backpackBody.material.aoMap.flipY = false;
   }

   #downloadTextures() {
      let base = this.#textureLoader.load(texturesPath + this.#activeBodyMaterial + bodyBaseTextureName);
      base.name = this.#activeBodyMaterial + bodyBaseTextureName;
      let normal = this.#textureLoader.load(texturesPath + this.#activeBodyMaterial + bodyNormalTextureName);
      normal.name = this.#activeBodyMaterial + bodyNormalTextureName;
      let occlusionRoughnessMetallic = this.#textureLoader.load(texturesPath + this.#activeBodyMaterial + bodyocclusionRoughnessMetallicTextureName);
      occlusionRoughnessMetallic.name = this.#activeBodyMaterial + bodyocclusionRoughnessMetallicTextureName;
      let texturesSet = new BodyTextures(base, normal, occlusionRoughnessMetallic);
      this.#bodyTextures.push(texturesSet);
      return texturesSet;
   }

   checkForLoadedTextures() {

   }
}

export { Backpack, BodyColors, BodyMaterials, MetallColors }