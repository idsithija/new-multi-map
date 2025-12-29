import * as Three from "three";
import { constants } from "../constants/constants";

export class Floor {
  private floor: Three.Mesh;
  private size: number;

  constructor(size: number = 200) {
    this.size = size;

    this.floor = this.createFloor();
  }

  private createFloor(): Three.Mesh {
    // Create a plane geometry for the floor
    const floorGeometry = new Three.PlaneGeometry(this.size, this.size);

    // Create a simpple material with a color
    const floorMaterial = new Three.MeshStandardMaterial({
      color: 0x8b7355, // Base brown color
      flatShading: true, // ✅ Makes it look low poly
      roughness: constants.floor.roughness,
      metalness: constants.floor.metalness,
    });

    // Create the mesh
    const floorMesh = new Three.Mesh(floorGeometry, floorMaterial);

    floorMesh.receiveShadow = true; // Enable shadows on the floor
    floorMesh.rotation.x = -Math.PI / 2; // Rotate to lie flat

    return floorMesh;
  }

  // Method to add the floor to the scene
  public addFloorToScene(scene: Three.Scene): void {
    scene.add(this.floor);
  }

  // Method to update floor properties
  public setFloorProperties({
    color,
    metalness,
    roughness,
  }: {
    color?: string;
    metalness?: number;
    roughness?: number;
  }): void {
    if (color !== undefined) {
      (this.floor.material as Three.MeshStandardMaterial).color =
        new Three.Color(color);
    }
    if (metalness !== undefined) {
      (this.floor.material as Three.MeshStandardMaterial).metalness = metalness;
    }
    if (roughness !== undefined) {
      (this.floor.material as Three.MeshStandardMaterial).roughness = roughness;
    }
  }
}
