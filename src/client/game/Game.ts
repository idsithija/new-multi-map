import * as THREE from "three";
import { Floor } from "./objects/Floor";
import { FirstPersonControls } from "./controls/FirstPersonControls";
import { DebugControls } from "./controls/DebugControls";
import { OrbitControls } from "./controls/OrbitControls";

export class Game {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private orbitControls: OrbitControls;
  private firstPersonControls: FirstPersonControls;
  private floor: Floor;
  private debugControlsPanel: DebugControls;

  constructor() {
    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000); // Black background

    // Camera setup
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    this.camera.position.set(0, 2, 5); // Position camera to see the box

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(this.renderer.domElement);

    // First Person Controls
    this.firstPersonControls = new FirstPersonControls(
      this.camera,
      this.renderer.domElement
    );

    // Orbit Controls
    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );

    // Debug Controls
    this.debugControlsPanel = new DebugControls(
      this.scene,
      this.camera,
      this.orbitControls,
      this.firstPersonControls
    );

    // Create Floor
    this.floor = new Floor();
    this.floor.addFloorToScene(this.scene);

    // Handle window resize
    window.addEventListener("resize", this.onWindowResize.bind(this));

    // Start animation loop
    this.animate();
  }

  // Animation loop
  private animate(): void {
    requestAnimationFrame(this.animate.bind(this));

    this.renderer.render(this.scene, this.camera);
  }

  // Handle window resize
  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
