import * as Three from "three";
import { metalness } from "three/examples/jsm/nodes/Nodes.js";

export const constants = {
  general: {
    backgroundColor: "#222d6c",
    fogNear: -27.2,
    fogFar: 33.6,
    fogColor: "#222d6c",
  },
  sky: {
    color: "#7d85ae",
    intensity: 11.96,
    position: new Three.Vector3(10, 20, 10),
    mapSize: 2048,
    shadowCameraNear: 0.5,
    shadowCameraFar: 500,
    shadowCameraSize: 50,
  },
  floor: {
    color: "#14233b",
    metalness: 0,
    roughness: 1,
  },
  grass: {
    color: "#228B22",
    count: 2000000,
    spread: 10,
    blade: {
      baseWidth: 0.19,
      midWidth: 0.09,
      tipWidth: 0.015,
      height: 1.0,
    },
  },
  thirdPerson: {
    offset: new Three.Vector3(0, 1.5, 6),
    smoothness: 0.1,
    lookAtOffset: 1,
  },
  player: {
    speed: 0.1,
    color: 0x00ff00,
    radius: 0.5,
    height: 2,
    segments: 8,
  },
};
