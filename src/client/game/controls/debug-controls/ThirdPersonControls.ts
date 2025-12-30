import * as THREE from "three";
import { BaseControls } from "./BaseControls";
import {ThirdPersonCameraControls} from "../ThirdPersonCameraControls";
import { constants } from "../../constants/constants";

interface IThirdPersonValues {
  thirdPerson: {
    offset: THREE.Vector3;
    smoothness: number;
  };
}

interface IThirdPersonParams {
    thirdPersonControls: ThirdPersonCameraControls
}

export class ThirdPersonControls extends BaseControls<IThirdPersonValues> {
    constructor({thirdPersonControls}: IThirdPersonParams) {
    super({
      thirdPerson: {
        ...constants.thirdPerson,
      },
    });

        const cameraDebugFolder = this.pane.addFolder({
      title: "Third Person Camera",
      expanded: false,
    });

    cameraDebugFolder
      .addBinding(constants.thirdPerson, "offset", {
        label: "Camera Offset",
        x: { min: -20, max: 20, step: 0.5 },
        y: { min: 0, max: 30, step: 0.5 },
        z: { min: -20, max: 20, step: 0.5 },
      })
      .on("change", (ev) => {
        thirdPersonControls?.setOffset(
          new THREE.Vector3(
            constants.thirdPerson.offset.x,
            constants.thirdPerson.offset.y,
            constants.thirdPerson.offset.z
          )
        );
      });

    cameraDebugFolder
      .addBinding(constants.thirdPerson, "smoothness", {
        label: "Camera Smoothness",
        min: 0.01,
        max: 0.5,
        step: 0.01,
      })
      .on("change", (ev) => {
        thirdPersonControls?.setSmoothness(ev.value);
      });
  }
}
