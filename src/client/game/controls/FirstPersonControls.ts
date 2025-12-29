import * as THREE from "three";

export class FirstPersonControls {
  private camera: THREE.PerspectiveCamera;
  private domElment: HTMLElement;
  private enabled: boolean = true;
  private defaultPosition = new THREE.Vector3(0, 2, 5);
  private defaultRotation = new THREE.Euler(0, 0, 0);

  constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement) {
    // Initialize FirstPersonControls
    this.camera = camera;
    this.domElment = domElement;
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  public getEnabled(): boolean {
    return this.enabled;
  }

  public resetCamera(camera: THREE.PerspectiveCamera): void {
    camera.position.copy(this.defaultPosition);
    camera.rotation.copy(this.defaultRotation);
  }
}
