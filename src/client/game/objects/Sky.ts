import * as Three from "three";
import { constants } from "../constants/constants";

export class Sky {
  private moonLight: Three.DirectionalLight;
  private fogColor: string = constants.sky.fogColor;

  constructor(scene: Three.Scene) {
    // Initialize moon light to simulate sky lighting
    this.moonLight = new Three.DirectionalLight(
      constants.sky.color,
      constants.sky.intensity
    );
    // Set initial position and shadow properties
    this.createMoonLight();

    // scene.fog = new Three.Fog(
    //   this.fogColor,
    //   constants.sky.fogNear,
    //   constants.sky.fogFar
    // );
  }

  // Helper method to configure moon light properties
  private createMoonLight(): void {
    this.moonLight.position.set(
      constants.sky.position.x,
      constants.sky.position.y,
      constants.sky.position.z
    );
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
  public setMoonLightProperties({
    color,
    intensity,
    position,
  }: {
    color?: number;
    intensity?: number;
    position?: Three.Vector3;
  }): void {
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
