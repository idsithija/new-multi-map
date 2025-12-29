import * as THREE from "three";

export class FirstPersonControls {
  private camera: THREE.PerspectiveCamera;
  private domElment: HTMLElement;
  private enabled: boolean = true;

  constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement) {
    // Initialize FirstPersonControls
    this.camera = camera;
    this.domElment = domElement;
  }

  public update(): void {
    if (!this.enabled) return;
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  public getEnabled(): boolean {
    return this.enabled;
  }
}
