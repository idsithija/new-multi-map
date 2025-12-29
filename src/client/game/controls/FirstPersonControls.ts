import * as THREE from "three";

export class FirstPersonControls {
  private camera: THREE.PerspectiveCamera;
  private domElment: HTMLElement;
  private enabled: boolean = true;
  private defaultPosition = new THREE.Vector3(0, 2, 5);

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

  public resetCamera(): void {
    this.camera.position.copy(this.defaultPosition);
  }
}
