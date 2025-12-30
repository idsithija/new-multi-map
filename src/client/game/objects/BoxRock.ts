import * as THREE from "three";

export class BoxRock {
  private boxBlock: THREE.Mesh;

  constructor() {
    const boxRockGeometry = new THREE.BoxGeometry(1, 1, 1);

    const boxRockMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });

    this.boxBlock = new THREE.Mesh(boxRockGeometry, boxRockMaterial);
    this.boxBlock.castShadow = true;
    this.boxBlock.position.set(0, 0.5, 0);
  }

  public addBoxRockToScene(scene: THREE.Scene) {
    scene.add(this.boxBlock);
  }
}
