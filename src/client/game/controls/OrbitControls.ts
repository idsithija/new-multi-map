import { OrbitControls as ThreeOrbitControls } from "three/examples/jsm/Addons.js";

export class OrbitControls {
  private orbitControls: ThreeOrbitControls;
  private enabled: boolean = true;

  constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement) {
    // Initialize OrbitControls
    this.orbitControls = new ThreeOrbitControls(camera, domElement);

    // Configure OrbitControls settings
    this.orbitControls.enableDamping = true;
    this.orbitControls.dampingFactor = 0.05;
    this.orbitControls.screenSpacePanning = false;
    this.orbitControls.maxPolarAngle = Math.PI / 2;
  }

  public update(): void {
        if (this.enabled && this.orbitControls.enabled) {
            this.orbitControls.update();
        }
    }

    public setEnabled(enabled: boolean): void {
        this.enabled = enabled;
        this.orbitControls.enabled = enabled;
        
        if (enabled) {
            console.log('🔓 Orbit controls enabled');
        } else {
            console.log('🔒 Orbit controls disabled');
        }
    }

    public getEnabled(): boolean {
        return this.enabled;
    }

    public setTarget(x: number, y: number, z: number): void {
        this.orbitControls.target.set(x, y, z);
    }

    public getControls(): ThreeOrbitControls {
        return this.orbitControls;
    }

    public dispose(): void {
        this.orbitControls.dispose();
    }
}
