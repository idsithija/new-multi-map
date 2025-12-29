import * as THREE from "three";

export class Player {
  private player: THREE.Mesh;
  private speed: number = 0.1;
  private keys = {
    w: false,
    a: false,
    s: false,
    d: false,
  };

  constructor() {
    // Create a simple player representation (e.g., a cylinder)
    const playerGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 8);

    const playerMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ff00, // Green color for the player
      flatShading: true,
    });

    this.player = new THREE.Mesh(playerGeometry, playerMaterial);
    this.player.castShadow = true;
    this.player.position.set(0, 1, 0); // Start above the ground

    window.addEventListener("keydown", (e) => {
      if (e.key === "w") this.keys.w = true;
      if (e.key === "a") this.keys.a = true;
      if (e.key === "s") this.keys.s = true;
      if (e.key === "d") this.keys.d = true;
    });

    window.addEventListener("keyup", (e) => {
      if (e.key === "w") this.keys.w = false;
      if (e.key === "a") this.keys.a = false;
      if (e.key === "s") this.keys.s = false;
      if (e.key === "d") this.keys.d = false;
    });
  }

  public addPlayerToScene(scene: THREE.Scene): void {
    scene.add(this.player);
  }

  public getPlayerMesh(): THREE.Mesh {
    return this.player;
  }

  public update(): void {
    if (this.keys.w) this.player.position.z -= this.speed;
    if (this.keys.s) this.player.position.z += this.speed;
    if (this.keys.a) this.player.position.x -= this.speed;
    if (this.keys.d) this.player.position.x += this.speed;
    
    // Keep player on the ground (prevent falling through floor)
    this.player.position.y = 1;
  }
}
