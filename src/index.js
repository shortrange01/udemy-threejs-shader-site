import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "lil-gui";
import vertexShader from './shader/vertexShader';
import fragmentShader from './shader/fragmentShader';
import skyImage from './textures/sky.jpg';

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Canvas
const canvas = document.querySelector(".webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const skyTexture = textureLoader.load(skyImage);
scene.background = skyTexture;

// Geometry
const geometry = new THREE.PlaneGeometry(10, 10, 512, 512);

// Color
const colorObject = {};
colorObject.depthColor = "#2d8eae";
colorObject.surfaceColor = "#d1edff";

// Material
// const material = new THREE.MeshBasicMaterial();
const material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  uniforms: {
    uWaveLength: { value: 0.17 },
    uFrequency: { value: new THREE.Vector2(5.0, 3.6)},
    uTime: { value: 0 },
    uWaveSpeed: { value: 0.7 },
    uDepthColor: { value: new THREE.Color(colorObject.depthColor)},
    uSurfaceColor: { value: new THREE.Color(colorObject.surfaceColor)},
    uColorOffset: { value: 0.03 },
    uColorMultiplier: { value: 7.0 },
    uSmallWaveElevation: { value: 0.1 },
    uSmallWaveFrequency: { value: 3.0 },
    uSmallWaveSpeed: { value: 0.2 },
  }
});

// Mesh
const mesh = new THREE.Mesh(geometry, material);
mesh.rotation.x = -Math.PI / 2;
scene.add(mesh);

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 0.23, 0);
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const cameraLookAtSpeed = {
  x: 0.3, y: 0.3, z: 0.3
};
const cameraLookAtMove = {
  x: 0.3, y: 0.3, z: 0.3
};
const cameraDistance = {
  x: 3.6, z: 3.6
}
const cameraRoundSpeed = {
  x: 0.1, z: 0.1
}

const animate = () => {
  //時間取得
  const elapsedTime = clock.getElapsedTime();
  material.uniforms.uTime.value = elapsedTime;

  // カメラを円周上に周回させる
  camera.position.x = Math.sin(elapsedTime * cameraRoundSpeed.x) * cameraDistance.x;
  camera.position.z = Math.cos(elapsedTime * cameraRoundSpeed.z) * cameraDistance.z;

  camera.lookAt(
    Math.cos(elapsedTime * cameraLookAtSpeed.x) * cameraLookAtMove.x,
    Math.sin(elapsedTime * cameraLookAtSpeed.y) * cameraLookAtMove.y,
    Math.sin(elapsedTime *  cameraLookAtSpeed.z) * cameraLookAtMove.z
  );

  // controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
};

animate();

// デバッグ
const gui = new dat.GUI({width: 300});
const cameraFolder = gui.addFolder('camera');
gui.add(material.uniforms.uWaveLength, "value").min(0).max(1).step(0.01).name('uWaveLength');
gui.add(material.uniforms.uFrequency.value, "x").min(0).max(10).step(0.001).name('uFrequencyX');
gui.add(material.uniforms.uFrequency.value, "y").min(0).max(10).step(0.001).name('uFrequencyY');
gui.add(material.uniforms.uWaveSpeed, "value").min(0).max(4).step(0.001).name('uWaveSpeed');
gui.add(material.uniforms.uColorOffset, "value").min(0).max(1).step(0.001).name('uColorOffset');
gui.add(material.uniforms.uColorMultiplier, "value").min(0).max(10).step(0.001).name('uColorMultiplier');
gui.add(material.uniforms.uSmallWaveElevation, "value").min(0).max(1).step(0.001).name('uSmallWaveElevation');
gui.add(material.uniforms.uSmallWaveFrequency, "value").min(0).max(30).step(0.001).name('uSmallWaveFrequency');
gui.add(material.uniforms.uSmallWaveSpeed, "value").min(0).max(1).step(0.001).name('uSmallWaveSpeed');
gui.addColor(colorObject, "depthColor").onChange(()=> {material.uniforms.uDepthColor.value.set(colorObject.depthColor)});
gui.addColor(colorObject, "surfaceColor").onChange(()=> {material.uniforms.uSurfaceColor.value.set(colorObject.surfaceColor)});
cameraFolder.add(cameraDistance, 'x').min(0).max(8).step(0.1).name('cameraDistanceX');
cameraFolder.add(cameraDistance, 'z').min(0).max(8).step(0.1).name('cameraDistanceZ');
cameraFolder.add(cameraRoundSpeed, 'x').min(0).max(0.5).step(0.01).name('cameraRoundSpeedX');
cameraFolder.add(cameraRoundSpeed, 'z').min(0).max(0.5).step(0.01).name('cameraRoundSpeedZ');
cameraFolder.add(cameraLookAtMove, 'x').min(0).max(1).step(0.01).name('cameraLookAtMoveX');
cameraFolder.add(cameraLookAtMove, 'y').min(0).max(1).step(0.01).name('cameraLookAtMoveY');
cameraFolder.add(cameraLookAtMove, 'z').min(0).max(1).step(0.01).name('cameraLookAtMoveZ');
cameraFolder.add(cameraLookAtSpeed, 'x').min(0).max(1).step(0.01).name('cameraLookAtSpeedX');
cameraFolder.add(cameraLookAtSpeed, 'y').min(0).max(1).step(0.01).name('cameraLookAtSpeedY');
cameraFolder.add(cameraLookAtSpeed, 'z').min(0).max(1).step(0.01).name('cameraLookAtSpeedZ');
// gui.show(false);
