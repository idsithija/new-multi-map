import * as Three from "three";

export class Sky {
  private moonLight: Three.DirectionalLight;
  private fogColor: number = 0x0d0e23;

  constructor(scene: Three.Scene) {
    // Initialize moon light to simulate sky lighting
    this.moonLight = new Three.DirectionalLight(0xb3ccff, 0.12);
    // Set initial position and shadow properties
    this.createMoonLight();
    
    scene.fog = new Three.Fog(this.fogColor, 10, 2000);
  }

  // Helper method to configure moon light properties
  private createMoonLight(): void {
    this.moonLight.position.set(10, 20, 10);
    this.moonLight.castShadow = true;

    // Optional shadow settings
    this.moonLight.shadow.mapSize.width = 2048;
    this.moonLight.shadow.mapSize.height = 2048;
    this.moonLight.shadow.camera.near = 0.5;
    this.moonLight.shadow.camera.far = 500;
  }

  // Method to add the sky (moon light) to the scene
  public addSkyToScene(scene: Three.Scene): void {
    scene.add(this.moonLight);
  }

  // Method to update moon light properties
  public setMoonLightDetails(
    color?: number,
    intensity?: number,
    position?: Three.Vector3
  ): void {
    if (color !== undefined) {
      this.moonLight.color = new Three.Color(color);
    }
    if (intensity !== undefined) {
      this.moonLight.intensity = intensity;
    }
    if (position !== undefined) {
      this.moonLight.position.set(position.x, position.y, position.z);
    }
  }
}
