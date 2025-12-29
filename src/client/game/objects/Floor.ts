import * as Three from "three";

export class Floor {
    private floor: Three.Mesh;
    private size: number;

    constructor(size: number = 200){
        this.size = size;
        this.floor = this.createFloor();
    }

    private createFloor(): Three.Mesh {
        // Create a plane geometry for the floor
        const floorGeometry = new Three.PlaneGeometry(this.size, this.size);

        // Create a simpple material with a color
        const floorMaterial = new Three.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.8,
            metalness: 0.2,
        })

        // Create the mesh
        const floorMesh = new Three.Mesh(floorGeometry, floorMaterial);

        floorMesh.receiveShadow = true; // Enable shadows on the floor
        floorMesh.rotation.x = -Math.PI / 2; // Rotate to lie flat

        return floorMesh;
    }

    public addFloorToScene(scene: Three.Scene): void {
        scene.add(this.floor)
    }
}