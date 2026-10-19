import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { animate } from "motion";
import { physics } from "../motion";
import { asset } from "../assets";

export type CarView = "Perspective" | "Side" | "Top" | "Front";
export type CarScene = { show: (model: string) => Promise<void>; preset: (view: CarView) => void; rotate: (angle: number) => void; zoom: (step: number) => void; reset: () => void; dispose: () => void };
function release(object: THREE.Object3D) {
  object.traverse(child => { if (child instanceof THREE.Mesh) {
    child.geometry.dispose(); const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach(material => material.dispose());
  }});
}
export function createCarScene(host: HTMLElement, reduced: boolean): CarScene {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, .01, 80);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false; controls.enableZoom = false;
  controls.enableDamping = !reduced; controls.dampingFactor = .13; controls.rotateSpeed = .7;
  controls.minPolarAngle = .01; controls.maxPolarAngle = Math.PI - .1;
  renderer.domElement.style.touchAction = "pan-y";
  scene.add(new THREE.HemisphereLight(0xffffff, 0xb5b8c4, 2.5));
  const key = new THREE.DirectionalLight(0xffffff, 3); key.position.set(-3, 6, 4); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024); key.shadow.camera.left = -3; key.shadow.camera.right = 3;
  key.shadow.camera.top = 3; key.shadow.camera.bottom = -3; key.shadow.normalBias = .015; scene.add(key);
  const fill = new THREE.DirectionalLight(0xe7edff, 1.2); fill.position.set(3, 2, -4); scene.add(fill);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(10,10), new THREE.ShadowMaterial({opacity:.13}));
  floor.rotation.x = -Math.PI/2; floor.position.y = -.36; floor.receiveShadow = true; scene.add(floor);
  const loader = new GLTFLoader(); const models = new Map<string, Promise<THREE.Group>>();
  let current: THREE.Group | undefined, disposed = false, request = 0, frame = 0, baseDistance = 4.9, magnification = 1;
  let tween: ReturnType<typeof animate> | undefined;
  function render() { frame = 0; if (disposed) return; controls.update(); renderer.render(scene, camera); }
  function invalidate() { if (!disposed && !frame) frame = requestAnimationFrame(render); }
  controls.addEventListener("change", invalidate);
  controls.addEventListener("start", () => tween?.stop());
  function move(position: THREE.Vector3) {
    tween?.stop();
    if (reduced) { camera.position.copy(position); controls.update(); invalidate(); return; }
    const start = camera.position.clone();
    tween = animate(0, 1, { ...physics.gentle, onUpdate: t => {
      camera.position.lerpVectors(start, position, t); controls.update(); invalidate();
    }});
  }
  function preset(view: CarView) {
    const positions = { Perspective: [-1,.72,1.4], Side: [0,.05,1], Top: [0,1,.001], Front: [-1,.05,0] };
    move(new THREE.Vector3(...positions[view]).normalize().multiplyScalar(baseDistance / magnification));
  }
  const resize = new ResizeObserver(() => {
    const width = host.clientWidth, height = host.clientHeight; if (!width || !height) return;
    camera.aspect = width / height; camera.updateProjectionMatrix();
    baseDistance = Math.max(4.9, 2.8 / (2 * Math.tan(THREE.MathUtils.degToRad(17.5)) * camera.aspect) * 1.3);
    camera.position.setLength(baseDistance / magnification);
    renderer.setSize(width, height); controls.update(); invalidate();
  });
  camera.position.set(-1,.72,1.4).normalize().multiplyScalar(baseDistance);
  controls.update(); resize.observe(host);
  return {
    async show(file) {
      const token = ++request;
      if (!models.has(file)) models.set(file, loader.loadAsync(asset(file)).then(gltf => {
        const model = gltf.scene;
        if (disposed) return model;
        const box = new THREE.Box3().setFromObject(model), center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const wrapper = new THREE.Group(); model.position.sub(center); wrapper.add(model);
        wrapper.scale.setScalar(2.8 / size.x);
        wrapper.traverse(child => { if (child instanceof THREE.Mesh) { child.castShadow = true; child.receiveShadow = true; } });
        return wrapper;
      }).catch(error => { models.delete(file); throw error; }));
      const next = await models.get(file)!;
      if (disposed || token !== request) return;
      if (current) scene.remove(current); current = next; scene.add(next);
      floor.position.y = new THREE.Box3().setFromObject(next).min.y - .007;
      invalidate();
    },
    preset,
    rotate(angle) {
      const spherical = new THREE.Spherical().setFromVector3(camera.position); spherical.theta += angle;
      move(new THREE.Vector3().setFromSpherical(spherical));
    },
    zoom(step) {
      magnification = THREE.MathUtils.clamp(magnification * Math.pow(1.18,step), .75, 1.8);
      move(camera.position.clone().setLength(baseDistance / magnification));
    },
    reset() { magnification = 1; preset("Perspective"); },
    dispose() {
      disposed = true; request++; tween?.stop(); cancelAnimationFrame(frame); resize.disconnect(); controls.dispose();
      // Release resolved models; in-flight loaders release themselves on completion.
      models.forEach(promise => promise.then(model => release(model)).catch(() => {}));
      floor.geometry.dispose(); (floor.material as THREE.Material).dispose();
      renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
    },
  };
}
