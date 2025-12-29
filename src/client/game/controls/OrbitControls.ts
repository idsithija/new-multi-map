import { OrbitControls as ThreeOrbitControls } from "three/examples/jsm/Addons.js";
import * as THREE from "three";

export class OrbitControls {
  private camera: THREE.PerspectiveCamera;
  private orbitControls: ThreeOrbitControls;
  private enabled: boolean = false;
  private defaultPosition = new THREE.Vector3(0, 10, 20);
  private defaultTarget = new THREE.Vector3(0, 0, 0);

  constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement) {
    // Initialize OrbitControls
    this.orbitControls = new ThreeOrbitControls(camera, domElement);
    this.camera = camera;

    // Configure OrbitControls settings
    this.orbitControls.enableDamping = true;
    this.orbitControls.dampingFactor = 0.05;
    this.orbitControls.screenSpacePanning = false;
    this.orbitControls.maxPolarAngle = Math.PI / 2;

    // Disable controls initially
    if (!this.enabled) {
      this.orbitControls.enabled = false;
    }
  }

  // Update method to be called in the animation loop
  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    this.orbitControls.enabled = enabled;
  }

  // Update method to be called in the animation loop
  public getEnabled(): boolean {
    return this.enabled;
  }

  public resetCamera(): void {
    this.camera.position.copy(this.defaultPosition);
    this.orbitControls.target.copy(this.defaultTarget);
    this.orbitControls.update();
  }
}
