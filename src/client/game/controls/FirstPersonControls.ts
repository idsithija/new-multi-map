import * as THREE from "three";

export class FirstPersonControls {
  private camera: THREE.PerspectiveCamera;
  private domElment: HTMLElement;
  private defaultPosition = new THREE.Vector3(0, 2, 5);

  constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement) {
    // Initialize FirstPersonControls
    this.camera = camera;
    this.domElment = domElement;
  }

  public resetCamera(): void {
    this.camera.position.copy(this.defaultPosition);
  }
}
