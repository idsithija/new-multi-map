import * as THREE from "three";
import * as CANNON from "cannon-es";
import { Socket } from "socket.io-client";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "lil-gui";
import { Floor } from "./Floor";

export class Game {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private world: CANNON.World;
  private socket: Socket;
  private clock: THREE.Clock;
  private floor: Floor;
  private pointerControls: PointerLockControls;
  private orbitControls: OrbitControls;
  private gui: GUI = new GUI();
  private moveForward = false;
  private moveBackward = false;
  private moveLeft = false;
  private moveRight = false;
  private canJump = false;
  private velocity = new THREE.Vector3();
  private direction = new THREE.Vector3();
  private playerBody: CANNON.Body;
  private cameraMode: 'first-person' | 'orbit' = 'orbit'; // Start with orbit
  private sun!: THREE.Mesh;
  private sunGlow!: THREE.Mesh;
  private directionalLight!: THREE.DirectionalLight;
  private sunRotationSpeed: number = 0.05; // Speed of sun rotation

  constructor(socket: Socket) {
    this.socket = socket;
    this.clock = new THREE.Clock();

    // Scene setup
    this.scene = new THREE.Scene();

    // Camera setup
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    this.camera.position.set(0, 15, 40); // Start with orbit view

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(this.renderer.domElement);

    // Physics world
    this.world = new CANNON.World();
    this.world.gravity.set(0, -9.82, 0);

    // Create player physics body
    const playerShape = new CANNON.Sphere(0.5);
    this.playerBody = new CANNON.Body({ mass: 5 });
    this.playerBody.addShape(playerShape);
    this.playerBody.position.set(0, 2, 0);
    this.playerBody.linearDamping = 0.9;
    this.world.addBody(this.playerBody);

    // Setup Orbit Controls
    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbitControls.enableDamping = true;
    this.orbitControls.dampingFactor = 0.05;
    this.orbitControls.minDistance = 5;
    this.orbitControls.maxDistance = 150;
    this.orbitControls.maxPolarAngle = Math.PI / 2.1;
    this.orbitControls.target.set(0, 2, 0);
    this.orbitControls.enabled = true; // Start with orbit enabled

    // Setup First-Person Controls
    this.pointerControls = new PointerLockControls(this.camera, this.renderer.domElement);
    
    this.pointerControls.addEventListener('lock', () => {
      console.log('First-Person Mode - Use WASD to move, Space to jump, C to toggle camera');
    });

    this.pointerControls.addEventListener('unlock', () => {
      console.log('Pointer unlocked - Press C for orbit mode or click to lock again');
    });

    this.setupLighting();

    // Create floor
    this.floor = new Floor(this.scene, this.world);

    // Setup GUI controls
    this.setupGUI();

    this.setupSocketListeners();

    window.addEventListener("resize", this.onWindowResize.bind(this));
    window.addEventListener("keydown", this.onKeyDown.bind(this));
    window.addEventListener("keyup", this.onKeyUp.bind(this));
  }

  private setupGUI(): void {
    this.gui = new GUI();
    this.gui.title("Jungle Environment Controls");

    // Camera mode display
    const cameraFolder = this.gui.addFolder("Camera (Press C to toggle)");
    const cameraSettings = {
      mode: 'Orbit Mode',
    };
    cameraFolder.add(cameraSettings, 'mode').listen().disable();

    // Sun controls
    const sunFolder = this.gui.addFolder("Sun & Day/Night Cycle");
    const sunSettings = {
      rotationSpeed: this.sunRotationSpeed,
      pauseSun: false,
      resetToNoon: () => {
        // Reset sun to noon position (top of sky)
        this.sun.position.set(0, 300, 0);
        this.sunGlow.position.copy(this.sun.position);
      }
    };
    
    sunFolder
      .add(sunSettings, 'rotationSpeed', 0, 1, 0.01)
      .name('Sun Speed')
      .onChange((value: number) => {
        this.sunRotationSpeed = value;
      });
    
    sunFolder
      .add(sunSettings, 'pauseSun')
      .name('Pause Sun')
      .onChange((value: boolean) => {
        if (value) {
          this.sunRotationSpeed = 0;
          sunSettings.rotationSpeed = 0;
        } else {
          this.sunRotationSpeed = 0.05;
          sunSettings.rotationSpeed = 0.05;
        }
      });
    
    sunFolder.add(sunSettings, 'resetToNoon').name('Reset to Noon');

    // Background color
    const bgFolder = this.gui.addFolder("Background");
    const bgSettings = {
      backgroundColor: 0x87a96b,
    };
    bgFolder
      .addColor(bgSettings, "backgroundColor")
      .onChange((value: number) => {
        this.scene.background = new THREE.Color(value);
      });

    // Lighting controls
    const lightFolder = this.gui.addFolder("Lighting");
    const lightSettings = {
      ambientIntensity: 0.5,
      sunIntensity: 0.8,
      sunColor: 0xffffcc,
      hemisphereIntensity: 0.6,
    };

    const ambientLight = this.scene.children.find(
      (c) => c instanceof THREE.AmbientLight
    ) as THREE.AmbientLight;
    const directionalLight = this.scene.children.find(
      (c) => c instanceof THREE.DirectionalLight
    ) as THREE.DirectionalLight;
    const hemisphereLight = this.scene.children.find(
      (c) => c instanceof THREE.HemisphereLight
    ) as THREE.HemisphereLight;

    lightFolder
      .add(lightSettings, "ambientIntensity", 0, 2)
      .onChange((value: number) => {
        if (ambientLight) ambientLight.intensity = value;
      });
    lightFolder
      .add(lightSettings, "sunIntensity", 0, 3)
      .onChange((value: number) => {
        if (directionalLight) directionalLight.intensity = value;
      });
    lightFolder
      .addColor(lightSettings, "sunColor")
      .onChange((value: number) => {
        if (directionalLight) directionalLight.color.set(value);
      });
    lightFolder
      .add(lightSettings, "hemisphereIntensity", 0, 2)
      .onChange((value: number) => {
        if (hemisphereLight) hemisphereLight.intensity = value;
      });

    // Renderer settings
    const rendererFolder = this.gui.addFolder("Renderer");
    const rendererSettings = {
      toneMapping: this.renderer.toneMapping,
      toneMappingExposure: 1.0,
      shadows: true,
    };
    rendererFolder
      .add(rendererSettings, "toneMappingExposure", 0, 3)
      .onChange((value: number) => {
        this.renderer.toneMappingExposure = value;
      });
    rendererFolder
      .add(rendererSettings, "shadows")
      .onChange((value: boolean) => {
        this.renderer.shadowMap.enabled = value;
      });
  }

  private setupLighting(): void {
    // Ambient light - softer for jungle atmosphere
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    // Directional light (sun filtering through canopy)
    this.directionalLight = new THREE.DirectionalLight(0xffffcc, 0.8);
    this.directionalLight.position.set(30, 50, 20);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.camera.left = -100;
    this.directionalLight.shadow.camera.right = 100;
    this.directionalLight.shadow.camera.top = 100;
    this.directionalLight.shadow.camera.bottom = -100;
    this.directionalLight.shadow.mapSize.width = 2048;
    this.directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(this.directionalLight);

    // Visual sun in the sky
    const sunGeometry = new THREE.SphereGeometry(8, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff99
    });
    this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
    // Position sun far away in the direction of the light
    const sunDistance = 300;
    const lightDir = this.directionalLight.position.clone().normalize();
    this.sun.position.copy(lightDir.multiplyScalar(sunDistance));
    this.scene.add(this.sun);

    // Sun glow effect
    const glowGeometry = new THREE.SphereGeometry(12, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff88,
      transparent: true,
      opacity: 0.3
    });
    this.sunGlow = new THREE.Mesh(glowGeometry, glowMaterial);
    this.sunGlow.position.copy(this.sun.position);
    this.scene.add(this.sunGlow);

    // Hemisphere light for natural outdoor lighting
    const hemisphereLight = new THREE.HemisphereLight(0x87a96b, 0x3a5a1a, 0.6);
    this.scene.add(hemisphereLight);

    // Background color
    this.scene.background = new THREE.Color(0x87a96b);
  }

  private setupSocketListeners(): void {
    this.socket.on("playerJoined", (data: any) => {
      console.log("Player joined:", data.id);
      // Create other players
    });

    this.socket.on("playerLeft", (id: string) => {
      console.log("Player left:", id);
      // Remove player
    });

    this.socket.on("playersUpdate", (players: any) => {
      // Update other players positions
    });
  }

  public start(): void {
    this.animate();
    this.socket.emit("joinGame");
  }

  private animate(): void {
    requestAnimationFrame(this.animate.bind(this));

    const delta = this.clock.getDelta();

    // Update physics
    this.world.step(1 / 60, delta, 3);

    // Rotate sun around the map
    const sunOrbitRadius = 300;
    const sunAngle = Date.now() * 0.0001 * this.sunRotationSpeed; // Slow rotation
    
    // Sun moves in arc from east to west
    this.sun.position.x = Math.cos(sunAngle) * sunOrbitRadius;
    this.sun.position.y = Math.sin(sunAngle) * sunOrbitRadius * 0.8 + 50; // Keep above horizon mostly
    this.sun.position.z = Math.sin(sunAngle * 0.5) * sunOrbitRadius * 0.3;
    
    // Update glow position
    this.sunGlow.position.copy(this.sun.position);
    
    // Update directional light to match sun position
    const lightDirection = this.sun.position.clone().normalize();
    this.directionalLight.position.copy(lightDirection.multiplyScalar(100));
    
    // Adjust light intensity based on sun height (day/night cycle)
    const sunHeight = this.sun.position.y;
    if (sunHeight > 0) {
      // Daytime
      this.directionalLight.intensity = 0.8 * (sunHeight / sunOrbitRadius);
    } else {
      // Nighttime - very dim
      this.directionalLight.intensity = 0.1;
    }

    if (this.cameraMode === 'first-person' && this.pointerControls.isLocked) {
      // First-person movement
      this.velocity.x -= this.velocity.x * 10.0 * delta;
      this.velocity.z -= this.velocity.z * 10.0 * delta;
      this.velocity.y -= 9.8 * 10.0 * delta;

      this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
      this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
      this.direction.normalize();

      const speed = 15.0;
      if (this.moveForward || this.moveBackward) this.velocity.z -= this.direction.z * speed * delta;
      if (this.moveLeft || this.moveRight) this.velocity.x -= this.direction.x * speed * delta;

      this.pointerControls.moveRight(-this.velocity.x * delta);
      this.pointerControls.moveForward(-this.velocity.z * delta);

      this.camera.position.x = this.playerBody.position.x;
      this.camera.position.y = this.playerBody.position.y + 0.7;
      this.camera.position.z = this.playerBody.position.z;

      if (this.playerBody.position.y < 2) {
        this.canJump = true;
      }
    } else if (this.cameraMode === 'orbit') {
      // Orbit controls update
      this.orbitControls.update();
    }

    // Render
    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private onKeyDown(event: KeyboardEvent): void {
    // Toggle camera mode with C key
    if (event.code === 'KeyC') {
      this.toggleCameraMode();
      return;
    }

    // Movement controls (only in first-person mode)
    if (this.cameraMode === 'first-person') {
      switch (event.code) {
        case 'KeyW':
          this.moveForward = true;
          break;
        case 'KeyS':
          this.moveBackward = true;
          break;
        case 'KeyA':
          this.moveLeft = true;
          break;
        case 'KeyD':
          this.moveRight = true;
          break;
        case 'Space':
          if (this.canJump) {
            this.velocity.y += 8;
            this.canJump = false;
            this.playerBody.velocity.y = 8;
          }
          break;
      }
    }
  }

  private toggleCameraMode(): void {
    if (this.cameraMode === 'orbit') {
      // Switch to first-person
      this.cameraMode = 'first-person';
      this.orbitControls.enabled = false;
      this.camera.position.set(
        this.playerBody.position.x,
        this.playerBody.position.y + 0.7,
        this.playerBody.position.z
      );
      this.pointerControls.lock();
      console.log('Switched to First-Person Mode');
    } else {
      // Switch to orbit
      this.cameraMode = 'orbit';
      if (this.pointerControls.isLocked) {
        this.pointerControls.unlock();
      }
      this.orbitControls.enabled = true;
      this.camera.position.set(0, 15, 40);
      this.orbitControls.target.set(0, 2, 0);
      console.log('Switched to Orbit Mode');
    }
  }

  private onKeyUp(event: KeyboardEvent): void {
    if (this.cameraMode === 'first-person') {
      switch (event.code) {
        case 'KeyW':
          this.moveForward = false;
          break;
        case 'KeyS':
          this.moveBackward = false;
          break;
        case 'KeyA':
          this.moveLeft = false;
          break;
        case 'KeyD':
          this.moveRight = false;
          break;
      }
    }
  }
}
