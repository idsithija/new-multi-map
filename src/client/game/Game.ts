import * as THREE from "three";
import { Floor } from "./objects/Floor";
import { FirstPersonControls } from "./controls/FirstPersonControls";
import { DebugControls } from "./controls/DebugControls";
import { OrbitControls } from "./controls/OrbitControls";

export class Game {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private clock: THREE.Clock;
  private orbitControls: OrbitControls;
  private firstPersonControls: FirstPersonControls;
  private floor: Floor;
  private debugControlsPanel: DebugControls;
  private currentControlMode: "firstPerson" | "orbit" = "firstPerson";

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

    // Clock for delta time
    this.clock = new THREE.Clock();

    // Debug Controls
    this.debugControlsPanel = new DebugControls(this.scene);

    // Orbit Controls
    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );

    // First Person Controls
    this.firstPersonControls = new FirstPersonControls(
      this.camera,
      this.renderer.domElement
    );

    // Create Floor
    this.floor = new Floor();
    this.floor.addFloorToScene(this.scene);

    window.addEventListener("resize", this.onWindowResize.bind(this));

    // Start animation loop
    this.animate();
  }

  private switchControlMode(mode: "firstPerson" | "orbit"): void {
    console.log(`\n${"=".repeat(50)}`);
    console.log(`🔄 Switching Camera Mode: ${mode.toUpperCase()}`);
    console.log(`${"=".repeat(50)}\n`);

    this.currentControlMode = mode;

    if (mode === "firstPerson") {
      // Disable orbit
      this.orbitControls.setEnabled(false);

      // Enable first person
      this.firstPersonControls.setEnabled(true);

      // Reset camera
      this.camera.position.set(0, 1.7, 5);
      this.camera.rotation.set(0, 0, 0);

      console.log("✅ First Person Mode Active");
      console.log("   • Click to lock mouse");
      console.log("   • WASD to move");
      console.log("   • Mouse to look around");
      console.log("   • ESC to unlock mouse\n");
    } else {
      // Disable first person
      this.firstPersonControls.setEnabled(false);

      // Enable orbit
      this.orbitControls.setEnabled(true);

      // Position for orbit view
      this.camera.position.set(10, 8, 10);
      this.orbitControls.setTarget(0, 1, 0);
      this.orbitControls.update();

      console.log("✅ Orbit Mode Active");
      console.log("   • Left drag to rotate");
      console.log("   • Right drag to pan");
      console.log("   • Scroll to zoom\n");
    }
  }

  private animate(): void {
    requestAnimationFrame(this.animate.bind(this));

    const delta = this.clock.getDelta();

    // Update active controls
    if (this.currentControlMode === "firstPerson") {
      this.firstPersonControls.update(delta);
    } else {
      this.orbitControls.update();
    }

    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
