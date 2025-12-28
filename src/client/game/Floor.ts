import * as THREE from "three";
import * as CANNON from "cannon-es";

export class Floor {
  private meshes: THREE.Mesh[] = [];
  private bodies: CANNON.Body[] = [];

  constructor(scene: THREE.Scene, world: CANNON.World) {
    this.createJungleTerrain(scene, world);
  }

  private createJungleTerrain(scene: THREE.Scene, world: CANNON.World): void {
    // Main jungle ground - green with texture-like appearance
    this.createOrganicGround(scene, world);
    
    // Add map features with location markers
    this.addRivers(scene, world);
    this.addBridges(scene, world);
    this.addMountains(scene, world);
    this.addRocks(scene, world);
    this.addTrees(scene, world);
    this.addGrassPatches(scene, world);
    this.addHouses(scene, world);
    
    // Add grid markers to visualize map zones
    this.addGridMarkers(scene);
  }

  // Check if a point is inside the river area
  private isInRiver(x: number, z: number): boolean {
    // Check pond area first (circular)
    const pondCenter = { x: -10, z: 0, radius: 35 };
    const distToPond = Math.sqrt((x - pondCenter.x) ** 2 + (z - pondCenter.z) ** 2);
    if (distToPond < pondCenter.radius + 3) { // Add 3 unit buffer
      return true;
    }

    const riverPath = [
      { x: -70, z: -95, width: 6 },
      { x: -50, z: -70, width: 15 },
      { x: -30, z: -45, width: 25 },
      { x: -20, z: -20, width: 12 },
      { x: -10, z: 0, width: 50 },
      { x: -15, z: 25, width: 14 },
      { x: -5, z: 50, width: 22 },
      { x: 10, z: 70, width: 7 },
      { x: 25, z: 95, width: 14 }
    ];

    for (let j = 0; j < riverPath.length - 1; j++) {
      const p1 = riverPath[j];
      const p2 = riverPath[j + 1];
      const dist = this.pointToLineSegmentDistance(x, z, p1.x, p1.z, p2.x, p2.z);
      const t = this.getPositionAlongSegment(x, z, p1.x, p1.z, p2.x, p2.z);
      const interpolatedWidth = p1.width + (p2.width - p1.width) * t;
      
      if (dist < interpolatedWidth / 2 + 2) { // Add 2 unit buffer
        return true;
      }
    }
    return false;
  }

  private createOrganicGround(scene: THREE.Scene, world: CANNON.World): void {
    const size = 200;
    const segments = 100; // Increased for better detail

    // Create terrain geometry with height variation
    const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
    
    // Get position attribute to modify vertices
    const positions = geometry.attributes.position;
    
    // River path with varying width and depth
    const riverPath = [
      { x: -70, z: -95, width: 6, depth: 1.0 },     // Very narrow start
      { x: -50, z: -70, width: 15, depth: 2.5 },    // Suddenly wider
      { x: -30, z: -45, width: 25, depth: 4.5 },    // Very wide section
      { x: -20, z: -20, width: 12, depth: 2.0 },    // Narrowing before pond
      { x: -10, z: 0, width: 50, depth: 6.0 },      // HUGE POND/LAKE (center)
      { x: -15, z: 25, width: 14, depth: 2.5 },     // Exit pond
      { x: -5, z: 50, width: 22, depth: 3.5 },      // Wide bend
      { x: 10, z: 70, width: 7, depth: 1.2 },       // Very narrow tunnel
      { x: 25, z: 95, width: 14, depth: 2.5 }       // Medium end
    ];

    // Pond center point for circular expansion
    const pondCenter = { x: -10, z: 0, radius: 35, depth: 6.5 };

    // Carve river trench with variation into the terrain
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getY(i); // In PlaneGeometry Y is the second coord
      
      // Add small random terrain noise for natural look
      let terrainNoise = (Math.sin(x * 0.1) * Math.cos(z * 0.1)) * 0.3;
      
      // Check if in pond area (circular)
      const distToPond = Math.sqrt((x - pondCenter.x) ** 2 + (z - pondCenter.z) ** 2);
      
      // Blend pond with river - create smooth transition
      let inPondArea = false;
      if (distToPond < pondCenter.radius) {
        inPondArea = true;
        // Inside pond - create circular depression
        const factor = 1 - (distToPond / pondCenter.radius);
        const pondDepth = -pondCenter.depth * factor * factor * 1.2;
        positions.setZ(i, pondDepth + terrainNoise * 0.2);
      }
      
      // Check distance to river path and interpolate width/depth
      let minDistToRiver = Infinity;
      let riverWidth = 10;
      let riverDepth = 2;
      let foundRiver = false;
      
      for (let j = 0; j < riverPath.length - 1; j++) {
        const p1 = riverPath[j];
        const p2 = riverPath[j + 1];
        const dist = this.pointToLineSegmentDistance(x, z, p1.x, p1.z, p2.x, p2.z);
        
        if (dist < minDistToRiver) {
          minDistToRiver = dist;
          foundRiver = true;
          // Interpolate width and depth based on position along segment
          const t = this.getPositionAlongSegment(x, z, p1.x, p1.z, p2.x, p2.z);
          riverWidth = p1.width + (p2.width - p1.width) * t;
          riverDepth = p1.depth + (p2.depth - p1.depth) * t;
        }
      }
      
      // Add random width variation
      const widthVariation = 1 + (Math.sin(x * 0.3 + z * 0.2) * 0.15);
      riverWidth *= widthVariation;
      
      // If within river width and not in pond, lower the terrain
      if (!inPondArea && foundRiver && minDistToRiver < riverWidth / 2) {
        // Create smooth depression with varying edges
        const factor = 1 - (minDistToRiver / (riverWidth / 2));
        // Add some randomness to the curve
        const edgeVariation = 0.9 + Math.sin(x * 0.5) * Math.cos(z * 0.5) * 0.1;
        const depth = -riverDepth * factor * factor * edgeVariation; // Quadratic for smooth edges
        positions.setZ(i, depth + terrainNoise * 0.3);
      } else if (!inPondArea) {
        // Normal ground with slight variation
        positions.setZ(i, terrainNoise);
      }
    }

    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({
      color: 0x6B8E23,
      roughness: 0.9,
      metalness: 0.0,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add(mesh);
    this.meshes.push(mesh);

    // Physics - flat ground (simple collision)
    const groundShape = new CANNON.Plane();
    const body = new CANNON.Body({ mass: 0 });
    body.addShape(groundShape);
    body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    world.addBody(body);
    this.bodies.push(body);
  }

  // Helper function to get position along line segment (0 to 1)
  private getPositionAlongSegment(px: number, pz: number, x1: number, z1: number, x2: number, z2: number): number {
    const dx = x2 - x1;
    const dz = z2 - z1;
    const lengthSquared = dx * dx + dz * dz;
    
    if (lengthSquared === 0) return 0;
    
    let t = ((px - x1) * dx + (pz - z1) * dz) / lengthSquared;
    return Math.max(0, Math.min(1, t));
  }

  // Helper function to calculate distance from point to line segment
  private pointToLineSegmentDistance(px: number, pz: number, x1: number, z1: number, x2: number, z2: number): number {
    const dx = x2 - x1;
    const dz = z2 - z1;
    const lengthSquared = dx * dx + dz * dz;
    
    if (lengthSquared === 0) {
      return Math.sqrt((px - x1) ** 2 + (pz - z1) ** 2);
    }
    
    let t = ((px - x1) * dx + (pz - z1) * dz) / lengthSquared;
    t = Math.max(0, Math.min(1, t));
    
    const projX = x1 + t * dx;
    const projZ = z1 + t * dz;
    
    return Math.sqrt((px - projX) ** 2 + (pz - projZ) ** 2);
  }

  private createHill(
    scene: THREE.Scene,
    world: CANNON.World,
    x: number,
    y: number,
    z: number,
    radius: number,
    height: number,
    color: number
  ): void {
    // Visual - using sphere for organic hill shape
    const geometry = new THREE.SphereGeometry(radius, 16, 16);
    const material = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.9,
      metalness: 0.0,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y + height / 2, z);
    mesh.scale.y = height / radius;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add(mesh);
    this.meshes.push(mesh);

    // Physics - approximate with cylinder
    const shape = new CANNON.Cylinder(radius, radius * 0.5, height, 8);
    const body = new CANNON.Body({ mass: 0 });
    body.addShape(shape);
    body.position.set(x, y + height / 2, z);
    world.addBody(body);
    this.bodies.push(body);
  }

  private createRock(
    scene: THREE.Scene,
    world: CANNON.World,
    x: number,
    y: number,
    z: number,
    size: number,
    height: number,
    color: number
  ): void {
    // Visual - irregular rock shape
    const geometry = new THREE.DodecahedronGeometry(size, 0);
    const material = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.8,
      metalness: 0.1,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y + height / 2, z);
    mesh.scale.y = height / size;
    mesh.rotation.set(Math.random(), Math.random(), Math.random());
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add(mesh);
    this.meshes.push(mesh);

    // Physics
    const shape = new CANNON.Box(new CANNON.Vec3(size, height / 2, size));
    const body = new CANNON.Body({ mass: 0 });
    body.addShape(shape);
    body.position.set(x, y + height / 2, z);
    world.addBody(body);
    this.bodies.push(body);
  }

  private createLog(
    scene: THREE.Scene,
    world: CANNON.World,
    x: number,
    y: number,
    z: number,
    length: number,
    color: number
  ): void {
    // Visual - fallen tree log
    const geometry = new THREE.CylinderGeometry(0.6, 0.8, length, 8);
    const material = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.9,
      metalness: 0.0,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.rotation.z = Math.PI / 2;
    mesh.rotation.y = Math.random() * Math.PI;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add(mesh);
    this.meshes.push(mesh);

    // Physics
    const shape = new CANNON.Cylinder(0.7, 0.7, length, 8);
    const body = new CANNON.Body({ mass: 0 });
    body.addShape(shape);
    body.position.set(x, y, z);
    const angle = Math.random() * Math.PI;
    body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), Math.PI / 2);
    const yRotation = new CANNON.Quaternion();
    yRotation.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), angle);
    body.quaternion.mult(yRotation, body.quaternion);
    world.addBody(body);
    this.bodies.push(body);
  }

  private createTree(
    scene: THREE.Scene,
    world: CANNON.World,
    x: number,
    z: number
  ): void {
    const trunkHeight = 8;
    const trunkRadius = 0.8;

    // Trunk
    const trunkGeometry = new THREE.CylinderGeometry(
      trunkRadius,
      trunkRadius * 1.2,
      trunkHeight,
      8
    );
    const trunkMaterial = new THREE.MeshStandardMaterial({
      color: 0x3d2817,
      roughness: 0.9,
    });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.set(x, trunkHeight / 2, z);
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    scene.add(trunk);
    this.meshes.push(trunk);

    // Foliage (leaves)
    const foliageGeometry = new THREE.SphereGeometry(4, 8, 8);
    const foliageMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a4d0a,
      roughness: 0.8,
    });
    const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliage.position.set(x, trunkHeight + 3, z);
    foliage.castShadow = true;
    scene.add(foliage);
    this.meshes.push(foliage);

    // Physics - trunk only
    const shape = new CANNON.Cylinder(trunkRadius, trunkRadius, trunkHeight, 8);
    const body = new CANNON.Body({ mass: 0 });
    body.addShape(shape);
    body.position.set(x, trunkHeight / 2, z);
    world.addBody(body);
    this.bodies.push(body);
  }

  public getMeshes(): THREE.Mesh[] {
    return this.meshes;
  }

  public getBodies(): CANNON.Body[] {
    return this.bodies;
  }

  // Add grid markers to visualize the 200x200 map
  private addGridMarkers(scene: THREE.Scene): void {
    const mapSize = 200;
    const gridSize = 50; // Mark every 50 units
    
    for (let x = -mapSize/2; x <= mapSize/2; x += gridSize) {
      for (let z = -mapSize/2; z <= mapSize/2; z += gridSize) {
        // Small sphere markers
        const markerGeom = new THREE.SphereGeometry(0.5, 8, 8);
        const markerMat = new THREE.MeshBasicMaterial({ 
          color: 0xffff00,
          transparent: true,
          opacity: 0.6
        });
        const marker = new THREE.Mesh(markerGeom, markerMat);
        marker.position.set(x, 1, z);
        scene.add(marker);
        
        // Add text labels using sprites
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        canvas.width = 128;
        canvas.height = 64;
        context.fillStyle = '#ffffff';
        context.font = 'Bold 20px Arial';
        context.fillText(`(${x},${z})`, 10, 40);
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMat = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.position.set(x, 3, z);
        sprite.scale.set(10, 5, 1);
        scene.add(sprite);
      }
    }
  }

  // Main river flowing across the entire map
  private addRivers(scene: THREE.Scene, world: CANNON.World): void {
    // River path markers with width/depth info
    const riverPoints = [
      { x: -70, z: -95, name: 'Tiny Start', info: 'W:6 D:1.0' },
      { x: -50, z: -70, name: 'Widening', info: 'W:15 D:2.5' },
      { x: -30, z: -45, name: 'WIDE Lake', info: 'W:25 D:4.5' },
      { x: -20, z: -20, name: 'Entering Pond', info: 'W:12 D:2.0' },
      { x: -10, z: 0, name: '🌊 CENTRAL POND 🌊', info: 'R:35 D:6.5' },
      { x: -15, z: 25, name: 'Exit Pond', info: 'W:14 D:2.5' },
      { x: -5, z: 50, name: 'Wide Bend', info: 'W:22 D:3.5' },
      { x: 10, z: 70, name: 'Tiny Tunnel', info: 'W:7 D:1.2' },
      { x: 25, z: 95, name: 'River End', info: 'W:14 D:2.5' }
    ];
    
    riverPoints.forEach((point) => {
      // Blue marker for river tunnel path with size info
      this.createLocationMarker(scene, point.x, point.z, 0x00aaff, `${point.name} (${point.info})`);
    });
  }

  private createRiverSegment(scene: THREE.Scene, x1: number, z1: number, x2: number, z2: number): void {
    const width = 8;
    const length = Math.sqrt((x2-x1)**2 + (z2-z1)**2);
    const angle = Math.atan2(z2-z1, x2-x1);
    
    const geometry = new THREE.PlaneGeometry(length, width);
    const material = new THREE.MeshStandardMaterial({
      color: 0x4488dd,
      transparent: true,
      opacity: 0.7,
      roughness: 0.1,
      metalness: 0.3
    });
    
    const river = new THREE.Mesh(geometry, material);
    river.position.set((x1+x2)/2, 0.1, (z1+z2)/2);
    river.rotation.x = -Math.PI / 2;
    river.rotation.z = angle;
    river.receiveShadow = true;
    scene.add(river);
    this.meshes.push(river);
  }

  // Mountains in strategic locations
  private addMountains(scene: THREE.Scene, world: CANNON.World): void {
    const mountains = [
      { x: -70, z: -70, height: 25, name: 'North Mountain' },
      { x: 85, z: -40, height: 30, name: 'East Peak' },
      { x: -85, z: 60, height: 20, name: 'West Ridge' },
      { x: 50, z: 75, height: 22, name: 'South Hill' }
    ];

    mountains.forEach(mountain => {
      this.createLocationMarker(scene, mountain.x, mountain.z, 0x8B4513, mountain.name);
      this.createMountain(scene, world, mountain.x, mountain.z, mountain.height);
    });
  }

  private createMountain(scene: THREE.Scene, world: CANNON.World, x: number, z: number, height: number): void {
    const baseRadius = height * 1.2;
    const geometry = new THREE.ConeGeometry(baseRadius, height, 8);
    const material = new THREE.MeshStandardMaterial({
      color: 0x654321,
      roughness: 0.9,
      metalness: 0.1
    });
    
    const mountain = new THREE.Mesh(geometry, material);
    mountain.position.set(x, height / 2, z);
    mountain.castShadow = true;
    mountain.receiveShadow = true;
    scene.add(mountain);
    this.meshes.push(mountain);

    // Physics
    const shape = new CANNON.Cylinder(0.1, baseRadius, height, 8);
    const body = new CANNON.Body({ mass: 0 });
    body.addShape(shape);
    body.position.set(x, height / 2, z);
    world.addBody(body);
    this.bodies.push(body);
  }

  // Rocks scattered across the map (small and medium)
  private addRocks(scene: THREE.Scene, world: CANNON.World): void {
    // Rock clusters - strategic locations with fixed positions
    const rockClusters = [
      { x: -30, z: -70, count: 8, sizeRange: [1, 3], spread: 15, name: 'North Rocks' },
      { x: 70, z: -45, count: 10, sizeRange: [1.5, 4], spread: 15, name: 'East Boulders' },
      { x: -75, z: 10, count: 7, sizeRange: [1, 2.5], spread: 15, name: 'West Rocks' },
      { x: 35, z: 70, count: 9, sizeRange: [1.2, 3.5], spread: 15, name: 'South Boulders' },
      { x: 5, z: 15, count: 6, sizeRange: [0.8, 2], spread: 15, name: 'Center Rocks' },
      { x: -55, z: -40, count: 5, sizeRange: [2, 5], spread: 15, name: 'Large NW Rocks' },
      { x: 55, z: 30, count: 7, sizeRange: [1, 3], spread: 15, name: 'East Field Rocks' },
      { x: -40, z: 60, count: 6, sizeRange: [1.5, 4], spread: 15, name: 'Valley Boulders' },
      { x: 25, z: -35, count: 8, sizeRange: [0.7, 2], spread: 15, name: 'Small Rocks North' },
      { x: -65, z: -70, count: 5, sizeRange: [2.5, 5], spread: 15, name: 'Mountain Base Rocks' },
      { x: 80, z: -65, count: 6, sizeRange: [2, 4.5], spread: 15, name: 'Peak Base Rocks' },
      { x: 15, z: 50, count: 4, sizeRange: [1, 2.5], spread: 15, name: 'River Rocks' },
    ];

    const minRockDistance = 2.5; // Minimum distance between rocks
    const allRockPositions: { x: number, z: number }[] = [];

    rockClusters.forEach((cluster, clusterIndex) => {
      this.createLocationMarker(scene, cluster.x, cluster.z, 0x808080, cluster.name);
      
      // Create rocks with deterministic but scattered positions
      let attempts = 0;
      let rocksPlaced = 0;
      
      while (rocksPlaced < cluster.count && attempts < cluster.count * 10) {
        // Use deterministic pseudo-random for natural placement
        const seed1 = (clusterIndex * 800 + attempts * 19) % 983;
        const seed2 = (clusterIndex * 1200 + attempts * 23) % 977;
        const seed3 = (clusterIndex * 500 + attempts * 11) % 967;
        
        const offsetX = ((seed1 / 983) - 0.5) * cluster.spread;
        const offsetZ = ((seed2 / 977) - 0.5) * cluster.spread;
        const sizeRatio = seed3 / 967;
        
        const rockX = cluster.x + offsetX;
        const rockZ = cluster.z + offsetZ;
        
        // Check minimum distance from other rocks
        let tooClose = false;
        for (const existingRock of allRockPositions) {
          const distance = Math.sqrt(
            (rockX - existingRock.x) ** 2 + (rockZ - existingRock.z) ** 2
          );
          if (distance < minRockDistance) {
            tooClose = true;
            break;
          }
        }
        
        if (!tooClose) {
          const size = cluster.sizeRange[0] + sizeRatio * (cluster.sizeRange[1] - cluster.sizeRange[0]);
          const height = size * 0.9;
          
          this.createRock(
            scene,
            world,
            rockX,
            0,
            rockZ,
            size,
            height,
            0x696969
          );
          
          allRockPositions.push({ x: rockX, z: rockZ });
          rocksPlaced++;
        }
        
        attempts++;
      }
    });
  }

  // Bridges over rivers
  private addBridges(scene: THREE.Scene, world: CANNON.World): void {
    const bridges = [
      // Bridges crossing the river (avoiding central pond)
      { x: -40, z: -57, rotation: Math.PI / 3, name: 'North Bridge' },
      { x: -25, z: -32, rotation: Math.PI / 4, name: 'North-Center Bridge' },
      // Central pond area - no bridge (too wide)
      { x: -10, z: 37, rotation: -Math.PI / 6, name: 'South-Center Bridge' },
      { x: 17, z: 82, rotation: Math.PI / 4, name: 'South Bridge' },
    ];

    bridges.forEach(bridge => {
      this.createLocationMarker(scene, bridge.x, bridge.z, 0xDEB887, bridge.name);
      this.createBridge(scene, world, bridge.x, bridge.z, bridge.rotation);
    });
  }

  private createBridge(scene: THREE.Scene, world: CANNON.World, x: number, z: number, rotation: number): void {
    const bridgeLength = 12;
    const bridgeWidth = 4;
    const bridgeHeight = 0.5;

    // Bridge deck
    const deckGeometry = new THREE.BoxGeometry(bridgeLength, bridgeHeight, bridgeWidth);
    const deckMaterial = new THREE.MeshStandardMaterial({
      color: 0x8B6914,
      roughness: 0.8
    });
    const deck = new THREE.Mesh(deckGeometry, deckMaterial);
    deck.position.set(x, 1, z);
    deck.rotation.y = rotation;
    deck.castShadow = true;
    deck.receiveShadow = true;
    scene.add(deck);
    this.meshes.push(deck);

    // Side rails
    const railGeometry = new THREE.BoxGeometry(bridgeLength, 0.3, 0.2);
    const railMaterial = new THREE.MeshStandardMaterial({
      color: 0x654321,
      roughness: 0.7
    });
    
    // Left rail
    const leftRail = new THREE.Mesh(railGeometry, railMaterial);
    leftRail.position.set(x, 1.8, z);
    leftRail.rotation.y = rotation;
    const offset1 = new THREE.Vector3(0, 0, bridgeWidth/2).applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation);
    leftRail.position.add(offset1);
    leftRail.castShadow = true;
    scene.add(leftRail);
    this.meshes.push(leftRail);

    // Right rail
    const rightRail = new THREE.Mesh(railGeometry, railMaterial);
    rightRail.position.set(x, 1.8, z);
    rightRail.rotation.y = rotation;
    const offset2 = new THREE.Vector3(0, 0, -bridgeWidth/2).applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation);
    rightRail.position.add(offset2);
    rightRail.castShadow = true;
    scene.add(rightRail);
    this.meshes.push(rightRail);

    // Support pillars
    const pillarGeometry = new THREE.CylinderGeometry(0.3, 0.4, 2, 8);
    const pillarMaterial = new THREE.MeshStandardMaterial({
      color: 0x654321,
      roughness: 0.9
    });

    // 4 pillars
    for (let i = -1; i <= 1; i += 2) {
      for (let j = -1; j <= 1; j += 2) {
        const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
        const posOffset = new THREE.Vector3(
          i * (bridgeLength / 3),
          -0.5,
          j * (bridgeWidth / 3)
        ).applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation);
        pillar.position.set(x + posOffset.x, 0.5, z + posOffset.z);
        pillar.castShadow = true;
        scene.add(pillar);
        this.meshes.push(pillar);
      }
    }

    // Physics - walkable surface
    const shape = new CANNON.Box(new CANNON.Vec3(bridgeLength/2, bridgeHeight/2, bridgeWidth/2));
    const body = new CANNON.Body({ mass: 0 });
    body.addShape(shape);
    body.position.set(x, 1, z);
    body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), rotation);
    world.addBody(body);
    this.bodies.push(body);
  }

  // Trees scattered around the map
  private addTrees(scene: THREE.Scene, world: CANNON.World): void {
    const treeZones = [
      { x: -50, z: -30, count: 25, spread: 25, name: 'North Forest' },
      { x: 30, z: -60, count: 30, spread: 25, name: 'East Woods' },
      { x: -40, z: 30, count: 20, spread: 25, name: 'West Grove' },
      { x: 10, z: 60, count: 25, spread: 25, name: 'South Forest' },
      { x: -10, z: -10, count: 15, spread: 25, name: 'Center Trees' },
      { x: -70, z: -50, count: 18, spread: 25, name: 'NW Forest' },
      { x: 60, z: -30, count: 22, spread: 25, name: 'NE Woods' },
      { x: -60, z: 50, count: 20, spread: 25, name: 'SW Grove' },
      { x: 45, z: 45, count: 18, spread: 25, name: 'SE Forest' },
      { x: 0, z: -80, count: 12, spread: 25, name: 'Far North Trees' },
      { x: -80, z: 0, count: 15, spread: 25, name: 'Far West Woods' },
      { x: 80, z: 20, count: 16, spread: 25, name: 'Far East Forest' },
    ];

    const minTreeDistance = 4; // Minimum distance between trees
    const allTreePositions: { x: number, z: number }[] = [];

    treeZones.forEach((zone, zoneIndex) => {
      this.createLocationMarker(scene, zone.x, zone.z, 0x00ff00, zone.name);
      
      // Create trees with deterministic but natural-looking positions
      let attempts = 0;
      let treesPlaced = 0;
      
      while (treesPlaced < zone.count && attempts < zone.count * 10) {
        // Use deterministic pseudo-random based on zone and attempt
        const seed1 = (zoneIndex * 1000 + attempts * 13) % 997;
        const seed2 = (zoneIndex * 1500 + attempts * 17) % 991;
        const offsetX = ((seed1 / 997) - 0.5) * zone.spread;
        const offsetZ = ((seed2 / 991) - 0.5) * zone.spread;
        
        const treeX = zone.x + offsetX;
        const treeZ = zone.z + offsetZ;
        
        // Check if not in river
        if (this.isInRiver(treeX, treeZ)) {
          attempts++;
          continue;
        }
        
        // Check minimum distance from other trees
        let tooClose = false;
        for (const existingTree of allTreePositions) {
          const distance = Math.sqrt(
            (treeX - existingTree.x) ** 2 + (treeZ - existingTree.z) ** 2
          );
          if (distance < minTreeDistance) {
            tooClose = true;
            break;
          }
        }
        
        if (!tooClose) {
          this.createTree(scene, world, treeX, treeZ);
          allTreePositions.push({ x: treeX, z: treeZ });
          treesPlaced++;
        }
        
        attempts++;
      }
    });
  }

  // Grass patches for cover
  private addGrassPatches(scene: THREE.Scene, world: CANNON.World): void {
    const grassAreas = [
      { x: 0, z: -70, size: 15, name: 'North Field' },
      { x: 60, z: 0, size: 12, name: 'East Meadow' },
      { x: -60, z: -20, size: 10, name: 'West Field' },
      { x: 20, z: 40, size: 14, name: 'South Meadow' },
      { x: -20, z: 70, size: 8, name: 'Valley Grass' },
      { x: -45, z: -60, size: 10, name: 'NW Field' },
      { x: 50, z: -50, size: 12, name: 'NE Meadow' },
      { x: -70, z: 35, size: 9, name: 'SW Grass' },
      { x: 65, z: 55, size: 11, name: 'SE Field' },
      { x: 15, z: -40, size: 8, name: 'North Plains' },
      { x: -35, z: 0, size: 10, name: 'West Plains' },
      { x: 40, z: 10, size: 9, name: 'East Plains' },
      { x: 0, z: 30, size: 13, name: 'Central Meadow' },
      { x: -50, z: -80, size: 7, name: 'Far NW Grass' },
      { x: 75, z: -75, size: 8, name: 'Far NE Field' },
      { x: -80, z: 70, size: 9, name: 'Far SW Meadow' },
      { x: 70, z: 80, size: 10, name: 'Far SE Grass' },
      { x: 30, z: -20, size: 6, name: 'Small Field 1' },
      { x: -25, z: -45, size: 7, name: 'Small Field 2' },
      { x: 10, z: 75, size: 8, name: 'Small Field 3' }
    ];

    grassAreas.forEach(area => {
      // Only add grass if not in river area
      if (!this.isInRiver(area.x, area.z)) {
        this.createLocationMarker(scene, area.x, area.z, 0x90EE90, area.name);
        this.createGrassPatch(scene, area.x, area.z, area.size);
      }
    });
  }

  private createGrassPatch(scene: THREE.Scene, x: number, z: number, size: number): void {
    const geometry = new THREE.CircleGeometry(size, 16);
    const material = new THREE.MeshStandardMaterial({
      color: 0x7CFC00,
      roughness: 1.0,
      metalness: 0.0
    });
    
    const grass = new THREE.Mesh(geometry, material);
    grass.position.set(x, 0.05, z);
    grass.rotation.x = -Math.PI / 2;
    grass.receiveShadow = true;
    scene.add(grass);
    this.meshes.push(grass);
  }

  // Houses for looting/cover
  private addHouses(scene: THREE.Scene, world: CANNON.World): void {
    const houses = [
      { x: -60, z: -60, name: 'North House' },
      { x: 70, z: -70, name: 'East House' },
      { x: -75, z: 20, name: 'West House' },
      { x: 40, z: 65, name: 'South House' },
      { x: 10, z: -30, name: 'Center House' },
      { x: -30, z: 80, name: 'Valley House' }
    ];

    houses.forEach(house => {
      this.createLocationMarker(scene, house.x, house.z, 0xff0000, house.name);
      this.createHouse(scene, world, house.x, house.z);
    });
  }

  private createHouse(scene: THREE.Scene, world: CANNON.World, x: number, z: number): void {
    const houseWidth = 6;
    const houseHeight = 5;
    const houseDepth = 6;

    // Main building
    const wallGeometry = new THREE.BoxGeometry(houseWidth, houseHeight, houseDepth);
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0x8B7355,
      roughness: 0.8
    });
    const walls = new THREE.Mesh(wallGeometry, wallMaterial);
    walls.position.set(x, houseHeight / 2, z);
    walls.castShadow = true;
    walls.receiveShadow = true;
    scene.add(walls);
    this.meshes.push(walls);

    // Roof
    const roofGeometry = new THREE.ConeGeometry(houseWidth * 0.8, 3, 4);
    const roofMaterial = new THREE.MeshStandardMaterial({
      color: 0x8B0000,
      roughness: 0.7
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(x, houseHeight + 1.5, z);
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    scene.add(roof);
    this.meshes.push(roof);

    // Physics - simple box
    const shape = new CANNON.Box(new CANNON.Vec3(houseWidth/2, houseHeight/2, houseDepth/2));
    const body = new CANNON.Body({ mass: 0 });
    body.addShape(shape);
    body.position.set(x, houseHeight / 2, z);
    world.addBody(body);
    this.bodies.push(body);
  }

  // Helper to create visible location markers
  private createLocationMarker(scene: THREE.Scene, x: number, z: number, color: number, label: string): THREE.Mesh {
    // Tall marker pole
    const poleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 8, 8);
    const poleMaterial = new THREE.MeshBasicMaterial({ color: color });
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.position.set(x, 4, z);
    scene.add(pole);

    // Marker sphere on top
    const markerGeometry = new THREE.SphereGeometry(1, 16, 16);
    const markerMaterial = new THREE.MeshBasicMaterial({ 
      color: color,
      transparent: true,
      opacity: 0.8
    });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    marker.position.set(x, 8.5, z);
    scene.add(marker);

    // Label
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = 256;
    canvas.height = 128;
    context.fillStyle = '#ffffff';
    context.strokeStyle = '#000000';
    context.lineWidth = 3;
    context.font = 'Bold 24px Arial';
    context.strokeText(label, 10, 60);
    context.fillText(label, 10, 60);
    context.font = '16px Arial';
    context.fillText(`(${x}, ${z})`, 10, 90);
    
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.position.set(x, 10, z);
    sprite.scale.set(15, 7.5, 1);
    scene.add(sprite);

    return marker;
  }
}
