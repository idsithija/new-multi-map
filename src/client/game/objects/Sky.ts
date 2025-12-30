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

    scene.fog = new Three.Fog(
      this.fogColor,
      constants.sky.fogNear,
      constants.sky.fogFar
    );
  }

  // Helper method to configure moon light properties
  private createMoonLight(): void {
    this.moonLight.position.set(
      constants.sky.position.x,
      constants.sky.position.y,
      constants.sky.position.z
    );
    this.moonLight.castShadow = true;

    // Shadow settings
    this.moonLight.shadow.mapSize.width = constants.sky.shadow.mapSize;
    this.moonLight.shadow.mapSize.height = constants.sky.shadow.mapSize;
    this.moonLight.shadow.camera.near = constants.sky.shadow.cameraNear;
    this.moonLight.shadow.camera.far = constants.sky.shadow.cameraFar;
    
    // Shadow camera size (orthographic camera bounds)
    const size = constants.sky.shadow.cameraSize;
    this.moonLight.shadow.camera.left = -size;
    this.moonLight.shadow.camera.right = size;
    this.moonLight.shadow.camera.top = size;
    this.moonLight.shadow.camera.bottom = -size;
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

  // Method to update shadow properties
  public setShadowProperties({
    mapSize,
    cameraNear,
    cameraFar,
    cameraSize,
  }: {
    mapSize?: number;
    cameraNear?: number;
    cameraFar?: number;
    cameraSize?: number;
  }): void {
    if (mapSize !== undefined) {
      this.moonLight.shadow.mapSize.width = mapSize;
      this.moonLight.shadow.mapSize.height = mapSize;
      this.moonLight.shadow.map?.dispose();
      this.moonLight.shadow.map = null;
    }
    if (cameraNear !== undefined) {
      this.moonLight.shadow.camera.near = cameraNear;
      this.moonLight.shadow.camera.updateProjectionMatrix();
    }
    if (cameraFar !== undefined) {
      this.moonLight.shadow.camera.far = cameraFar;
      this.moonLight.shadow.camera.updateProjectionMatrix();
    }
    if (cameraSize !== undefined) {
      this.moonLight.shadow.camera.left = -cameraSize;
      this.moonLight.shadow.camera.right = cameraSize;
      this.moonLight.shadow.camera.top = cameraSize;
      this.moonLight.shadow.camera.bottom = -cameraSize;
      this.moonLight.shadow.camera.updateProjectionMatrix();
    }
  }
}
