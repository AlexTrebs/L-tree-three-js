import { params } from './params';
import { regenerateTree } from './TreeGenerator';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';
import './style.css';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 5);
scene.add(dirLight);
scene.add(new THREE.GridHelper(10, 10));

const treeGroup = new THREE.Group();
scene.add(treeGroup);

const Y_UP = new THREE.Vector3(0, 1, 0);
let growQueue = [];
let barkMat, leafMat;

const makeMesh = (geo, mat, pos) => {
  const m = new THREE.Mesh(geo, mat);
  m.position.copy(pos);
  return m;
};

const addBranch = ({ start, end, depth }) => {
  const dir = end.clone().sub(start);
  const len = dir.length();
  const r = params.branchRadius * params.radiusDecay ** depth;

  const geo = new THREE.CylinderGeometry(r * 0.7, r, len, 6);
  geo.translate(0, len / 2, 0);

  const mesh = makeMesh(geo, barkMat, start);
  mesh.quaternion.setFromUnitVectors(Y_UP, dir.normalize());
  treeGroup.add(mesh);

  if (depth >= params.leafStartDepth)
    treeGroup.add(makeMesh(new THREE.SphereGeometry(r * 5, 6, 6), leafMat, end));
};

const updateTree = () => {
  treeGroup.clear();
  barkMat = new THREE.MeshStandardMaterial({ color: params.barkColor });
  leafMat = new THREE.MeshStandardMaterial({ color: params.leafColor });
  growQueue = regenerateTree();
}

updateTree();

// gui
const gui = new GUI();
gui.add(params, 'iterations', 1, 8, 1);
gui.add(params, 'angle', 0, 90);
gui.add(params, 'branchLength', 0.1, 3);
gui.add(params, 'lengthDecay', 0.5, 1.0);
gui.add(params, 'branchRadius', 0.01, 0.3);
gui.add(params, 'radiusDecay', 0.5, 1.0);
gui.addColor(params, 'barkColor');
gui.addColor(params, 'leafColor');

const adv = gui.addFolder('Advanced');
adv.add(params, 'randomness', 0, 1);
adv.add(params, 'leafStartDepth', 1, 6, 1);
adv.add(params, 'verticalSpread', 0, 90);
adv.add(params, 'windStrength', 0, 5);
adv.add(params, 'windDirection', 0, 360);
adv.close();
gui.add({ regenerate: updateTree }, 'regenerate');

function animate() {
  requestAnimationFrame(animate);

  if (growQueue.length) addBranch(growQueue.shift());

  controls.update();
  renderer.render(scene, camera);
}
animate();
