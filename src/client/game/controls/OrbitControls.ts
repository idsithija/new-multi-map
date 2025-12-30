import { OrbitControls as ThreeOrbitControls } from "three/examples/jsm/Addons.js";
import * as THREE from "three";

export class OrbitControls {
  private orbitControls: ThreeOrbitControls;

  constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement) {
    // Initialize OrbitControls
    this.orbitControls = new ThreeOrbitControls(camera, domElement);

    // Configure OrbitControls settings
    this.orbitControls.enableDamping = true;
    this.orbitControls.dampingFactor = 0.05;
    this.orbitControls.screenSpacePanning = false;
    this.orbitControls.maxPolarAngle = Math.PI / 2;
  }
}
