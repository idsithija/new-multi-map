import * as THREE from "three";
import { constants } from "../constants/constants";

export class ThirdPersonCameraControls {
  private camera: THREE.PerspectiveCamera;
  private target: THREE.Mesh;
  private offset: THREE.Vector3;
  private currentPosition: THREE.Vector3;
  private currentLookAt: THREE.Vector3;
  private smoothness: number = 0.1; // Lower = smoother (0.05-0.15 recommended)
  private lookAtOffset: number = constants.thirdPerson.lookAtOffset;

  constructor(
    camera: THREE.PerspectiveCamera,
    target: THREE.Mesh,
    offset: THREE.Vector3 = new THREE.Vector3(0, 1.5, 6)
  ) {
    this.camera = camera;
    this.target = target;
    this.offset = offset;
    this.currentPosition = new THREE.Vector3();
    this.currentLookAt = new THREE.Vector3();

    // Initialize camera position
    this.currentPosition.copy(target.position).add(offset);
    this.currentLookAt.copy(target.position);
  }

  public update(): void {
    // Calculate ideal camera position (behind and above the player)
    const idealOffset = this.offset.clone();
    const idealPosition = new THREE.Vector3();
    idealPosition.copy(this.target.position).add(idealOffset);

    // Smoothly interpolate camera position
    this.currentPosition.lerp(idealPosition, this.smoothness);

    // Smoothly interpolate look-at position (slightly above player)
    const idealLookAt = this.target.position.clone();
    idealLookAt.y += this.lookAtOffset; // Look at player's center
    this.currentLookAt.lerp(idealLookAt, this.smoothness);

    // Update camera
    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.currentLookAt);
  }

  public setOffset(offset: THREE.Vector3): void {
    this.offset = offset;
  }

  public setSmoothness(smoothness: number): void {
    this.smoothness = THREE.MathUtils.clamp(smoothness, 0.01, 1);
  }

  public setLookAtOffset(offset: number): void {
    this.lookAtOffset = offset;
  }

  public getOffset(): THREE.Vector3 {
    return this.offset;
  }
}
