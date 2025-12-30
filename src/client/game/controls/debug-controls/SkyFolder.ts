import * as THREE from "three";
import { constants } from "../../constants/constants";
import { Sky } from "../../objects/Sky";
import { Pane } from "tweakpane";

export interface ISkyValues {
  sky: {
    color: string;
    intensity: number;
    position: THREE.Vector3;
    mapSize: number;
    shadowCameraNear: number;
    shadowCameraFar: number;
    shadowCameraSize: number;
  };
}

export interface ISkyParams {
  pane: Pane;
  sky: Sky;
}

export class SkyFolder {
  private params: ISkyValues;

  constructor({ pane, sky }: ISkyParams) {
    this.params = {
      sky: {
        ...constants.sky,
      },
    };

    const skyDebugFolder = pane.addFolder({
      title: "Sky",
      expanded: false,
    });

    skyDebugFolder
      .addBinding(this.params.sky, "color", {
        label: "Sky Color",
      })
      .on("change", (ev) => {
        sky.setMoonLightProperties({
          color: new THREE.Color(ev.value).getHex(),
        });
      });

    skyDebugFolder
      .addBinding(this.params.sky, "intensity", {
        label: "Sky Intensity",
        min: 0,
        max: 100,
        step: 0.01,
      })
      .on("change", (ev) => {
        sky.setMoonLightProperties({
          intensity: ev.value,
        });
      });

    skyDebugFolder
      .addBinding(this.params.sky, "position", {
        label: "Sky Position",
        x: { min: -100, max: 100, step: 1 },
        y: { min: -100, max: 100, step: 1 },
        z: { min: -100, max: 100, step: 1 },
      })
      .on("change", (ev) => {
        sky.setMoonLightProperties({
          position: new THREE.Vector3(
            this.params.sky.position.x,
            this.params.sky.position.y,
            this.params.sky.position.z
          ),
        });
      });

    skyDebugFolder
      .addBinding(this.params.sky, "mapSize", {
        label: "Shadow Map Size",
        min: 512,
        max: 4096,
        step: 512,
      })
      .on("change", (ev) => {
        sky.setShadowProperties({ mapSize: ev.value });
      });

    skyDebugFolder
      .addBinding(this.params.sky, "shadowCameraNear", {
        label: "Shadow Near",
        min: 0.1,
        max: 50,
        step: 0.1,
      })
      .on("change", (ev) => {
        sky.setShadowProperties({ cameraNear: ev.value as number });
      });

    skyDebugFolder
      .addBinding(this.params.sky, "shadowCameraFar", {
        label: "Shadow Far",
        min: -100,
        max: 100,
        step: 0.1,
      })
      .on("change", (ev) => {
        sky.setShadowProperties({ cameraFar: ev.value });
      });

    skyDebugFolder
      .addBinding(this.params.sky, "shadowCameraSize", {
        label: "Shadow Area Size",
        min: 10,
        max: 200,
        step: 5,
      })
      .on("change", (ev) => {
        sky.setShadowProperties({ cameraSize: ev.value });
      });
  }
}
