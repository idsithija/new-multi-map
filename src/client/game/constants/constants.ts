import * as Three from "three";
import { metalness } from "three/examples/jsm/nodes/Nodes.js";

export const constants = {
  general: {
    backgroundColor: "#d6c9a6",
  },
  sky: {
    color: "#ff9c9c",
    intensity: 20,
    position: new Three.Vector3(10, 20, 10),
    fogNear: 50,
    fogFar: 500,
    fogColor: "#d6c9a6"
  },
  floor: {
    color: "#b61b1b",
    metalness: 0.2,
    roughness: 0.7,
  },
  grass:{
    color: "#d6c9a6",
    count: 5000,
    spread: 10,
  }
};
