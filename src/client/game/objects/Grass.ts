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
    this.generateGrassBlades();

    // Enable shadows
    this.grass.castShadow = true;
    this.grass.receiveShadow = true;
  }

  public addGrassToScene(scene: THREE.Scene): void {
    scene.add(this.grass);
  }

  private createBladeGeometry(): THREE.BufferGeometry {
    const geometry = new THREE.BufferGeometry();

    // Get blade parameters from constants
    const blade = constants.grass.blade;
    const baseW = blade.baseWidth;
    const midW = blade.midWidth;
    const tipW = blade.tipWidth;
    const h = blade.height;

    // Define vertices for a tapered grass blade
    // Blade is wider at bottom, narrow at top, with slight curve
    const vertices = new Float32Array([
      // Bottom section (wide base)
      -baseW,
      0,
      0, // Bottom left
      baseW,
      0,
      0, // Bottom right
      -midW,
      h * 0.4,
      0, // Mid-left (slightly curved forward)

      baseW,
      0,
      0, // Bottom right
      midW,
      h * 0.4,
      0, // Mid-right
      -midW,
      h * 0.4,
      0, // Mid-left

      // Top section (narrow tip)
      -midW,
      h * 0.4,
      0, // Mid-left
      midW,
      h * 0.4,
      0, // Mid-right
      -tipW,
      h * 0.8,
      0, // Upper-left (more curved)

      midW,
      h * 0.4,
      0, // Mid-right
      tipW,
      h * 0.8,
      0, // Upper-right
      -tipW,
      h * 0.8,
      0, // Upper-left
      // Tip section (pointed)
      -tipW,
      h * 0.8,
      0, // Upper-left
      tipW,
      h * 0.8,
      0, // Upper-right
      0,
      h,
      0, // Tip (curved forward)
    ]);

    // Set the position attribute
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

    // Compute normals for proper lighting
    geometry.computeVertexNormals();

    return geometry;
  }

  private generateGrassBlades(): void {
    const dummy = new THREE.Object3D();
    const floorSize = 1000; // Match your floor size
    const cellSize = this.spread; // Use spread as cell size (10 units)
    const cellsPerSide = Math.floor(floorSize / cellSize); // 100 cells per side
    const bladesPerCell = Math.ceil(this.count / (cellsPerSide * cellsPerSide)); // Distribute blades evenly

    let bladeIndex = 0;

    // Grid-based distribution across entire floor
    for (let gridX = 0; gridX < cellsPerSide && bladeIndex < this.count; gridX++) {
      for (let gridZ = 0; gridZ < cellsPerSide && bladeIndex < this.count; gridZ++) {
        // Calculate cell center position
        const cellCenterX = (gridX * cellSize) - (floorSize / 2) + (cellSize / 2);
        const cellCenterZ = (gridZ * cellSize) - (floorSize / 2) + (cellSize / 2);

        // Place multiple blades in this cell
        for (let b = 0; b < bladesPerCell && bladeIndex < this.count; b++) {
          // Random offset within the cell
          const offsetX = (Math.random() - 0.5) * cellSize;
          const offsetZ = (Math.random() - 0.5) * cellSize;

          const finalX = cellCenterX + offsetX;
          const finalZ = cellCenterZ + offsetZ;

          // Random rotation for variety
          const randomRotation = Math.random() * Math.PI * 2;

          // Clustered height variation for natural look
          const clusterRandom = Math.random();
          let heightMin, heightMax;

          if (clusterRandom < 0.3) {
            // Short grass cluster (30% chance)
            heightMin = 0.5;
            heightMax = 0.8;
          } else if (clusterRandom < 0.7) {
            // Medium grass cluster (40% chance)
            heightMin = 0.8;
            heightMax = 1.2;
          } else {
            // Tall grass cluster (30% chance)
            heightMin = 1.0;
            heightMax = 1.6;
          }

          // Non-uniform scaling for different heights
          const scaleXZ = 0.8 + Math.random() * 0.4; // Width variation (80%-120%)
          const scaleY = heightMin + Math.random() * (heightMax - heightMin); // Height variation by cluster

          // Set position, rotation, and scale
          dummy.position.set(finalX, 0, finalZ);
          dummy.rotation.y = randomRotation;
          dummy.scale.set(scaleXZ, scaleY, scaleXZ); // Different Y scale for height variation

          // Update matrix
          dummy.updateMatrix();

          // Apply to instanced mesh
          this.grass.setMatrixAt(bladeIndex, dummy.matrix);
          bladeIndex++;
        }
      }
    }

    // Important: tell Three.js to update the instance matrix
    this.grass.instanceMatrix.needsUpdate = true;
  }

  public getGrassMesh(): THREE.InstancedMesh {
    return this.grass;
  }

  public update(deltaTime: number): void {
    // Optional: Add wind animation here later
    // For now, grass is static
  }

  public updateGeometry(): void {
    // Recreate the geometry with new blade parameters
    const newGeometry = this.createBladeGeometry();

    // Dispose old geometry
    this.grass.geometry.dispose();

    // Apply new geometry
    this.grass.geometry = newGeometry;
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
      this.generateGrassBlades();
    }

    if (spread !== undefined) {
      this.spread = spread;
      this.generateGrassBlades();
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
