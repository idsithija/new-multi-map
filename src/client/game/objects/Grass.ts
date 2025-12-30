import * as THREE from "three";
import { constants } from "../constants/constants";

export class Grass {
  private grass: THREE.InstancedMesh;
  private count: number;
  private spread: number;

  constructor(
    count: number = constants.grass.count,
    spread: number = constants.grass.spread
  ) {
    this.count = count;
    this.spread = spread;

    // Create custom grass blade geometry
    const grassGeometry = this.createBladeGeometry();

    const grassMaterial = new THREE.MeshStandardMaterial({
      color: 0x228b22, // Forest green
      flatShading: true,
      side: THREE.DoubleSide,
    });
    this.grass = new THREE.InstancedMesh(
      grassGeometry,
      grassMaterial,
      this.count
    );

    // Set position for each blade
    // this.generateGrassBlades();

    // Enable shadows
    this.grass.castShadow = true;
    this.grass.receiveShadow = true;
  }

  public addGrassToScene(scene: THREE.Scene): void {
    scene.add(this.grass);
  }

  private createBladeGeometry(): THREE.BufferGeometry {
    const geometry = new THREE.BufferGeometry();

    // Define vertices for a tapered grass blade
    // Blade is wider at bottom, narrow at top, with slight curve
    const vertices = new Float32Array([
      // Bottom section (wide base)
      -0.05,
      0,
      0, // Bottom left
      0.05,
      0,
      0, // Bottom right
      -0.04,
      0.4,
      0.05, // Mid-left (slightly curved forward)

      0.05,
      0,
      0, // Bottom right
      0.04,
      0.4,
      0.05, // Mid-right
      -0.04,
      0.4,
      0.05, // Mid-left

      // Top section (narrow tip)
      -0.04,
      0.4,
      0.05, // Mid-left
      0.04,
      0.4,
      0.05, // Mid-right
      -0.015,
      0.8,
      0.1, // Upper-left (more curved)

      0.04,
      0.4,
      0.05, // Mid-right
      0.015,
      0.8,
      0.1, // Upper-right
      -0.015,
      0.8,
      0.1, // Upper-left

      // Tip section (pointed)
      -0.015,
      0.8,
      0.1, // Upper-left
      0.015,
      0.8,
      0.1, // Upper-right
      0,
      1,
      0.15, // Tip (curved forward)
    ]);

    // Set the position attribute
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

    // Compute normals for proper lighting
    geometry.computeVertexNormals();

    return geometry;
  }

  // private generateGrassBlades(): void {
  //   const dummy = new THREE.Object3D();

  //   for (let i = 0; i < this.count; i++) {
  //     // Random position within spread area
  //     const randomX = (Math.random() - 0.5) * this.spread;
  //     const randomZ = (Math.random() - 0.5) * this.spread;

  //     // Random rotation for variety
  //     const randomRotation = Math.random() * Math.PI * 2;

  //     // Random scale for variation (80% - 120% of original size)
  //     const randomScale = 0.8 + Math.random() * 0.4;

  //     // Set position, rotation, and scale
  //     dummy.position.set(randomX, 0, randomZ);
  //     dummy.rotation.y = randomRotation;
  //     dummy.scale.set(randomScale, randomScale, randomScale);

  //     // Update matrix
  //     dummy.updateMatrix();

  //     // Apply to instanced mesh
  //     this.grass.setMatrixAt(i, dummy.matrix);
  //   }

  //   // Important: tell Three.js to update the instance matrix
  //   this.grass.instanceMatrix.needsUpdate = true;
  // }

  public getGrassMesh(): THREE.InstancedMesh {
    return this.grass;
  }

  public update(deltaTime: number): void {
    // Optional: Add wind animation here later
    // For now, grass is static
  }

  public dispose(): void {
    this.grass.geometry.dispose();
    if (this.grass.material instanceof THREE.Material) {
      this.grass.material.dispose();
    }
  }

  public setGrassProperties({
    color,
    count,
    spread,
    rotateX,
    rotateY,
    rotateZ,
  }: {
    count?: number;
    spread?: number;
    color?: string;
    rotateX?: number;
    rotateY?: number;
    rotateZ?: number;
  }): void {
    if (color) {
      (this.grass.material as THREE.MeshStandardMaterial).color.set(color);
    }

    if (count !== undefined) {
      this.count = count;
      // this.generateGrassBlades();
    }

    if (spread !== undefined) {
      this.spread = spread;
      // this.generateGrassBlades();
    }

    if (
      rotateX !== undefined ||
      rotateY !== undefined ||
      rotateZ !== undefined
    ) {
      const dummy = new THREE.Object3D();
    }
  }
}
