import * as THREE from "three";
import { constants } from "../../constants/constants";
import { Pane } from "tweakpane";

export interface IGeneralParams {
  pane: Pane;
  scene: THREE.Scene;
}

export interface IGeneralValues {
  general: {
    backgroundColor: string;
    fogNear: number;
    fogFar: number;
    fogColor: string;
  };
}

export class GeneralFolder {
  private params: IGeneralValues;
  
  constructor({ pane, scene }: IGeneralParams) {
    this.params = {
      general: {
        ...constants.general,
      },
    };

    const generalDebugFolder = pane.addFolder({
      title: "General",
      expanded: false,
    });

    // Background color control
    generalDebugFolder
      .addBinding(this.params.general, "backgroundColor", {
        label: "Background Color",
      })
      .on("change", (ev) => {
        scene.background = new THREE.Color(ev.value);
      });

    generalDebugFolder
      .addBinding(this.params.general, "fogColor", {
        label: "Fog Color",
      })
      .on("change", (ev) => {
        scene.fog = new THREE.Fog(
          new THREE.Color(ev.value).getHex(),
          this.params.general.fogNear,
          this.params.general.fogFar
        );
      });

    generalDebugFolder
      .addBinding(this.params.general, "fogNear", {
        label: "Fog Near",
        min: -50,
        max: 100,
        step: 0.2,
      })
      .on("change", (ev) => {
        scene.fog = new THREE.Fog(
          new THREE.Color(this.params.general.fogColor).getHex(),
          ev.value,
          this.params.general.fogFar
        );
      });

    generalDebugFolder
      .addBinding(this.params.general, "fogFar", {
        label: "Fog Far",
        min: -100,
        max: 200,
        step: 0.2,
      })
      .on("change", (ev) => {
        scene.fog = new THREE.Fog(
          new THREE.Color(this.params.general.fogColor).getHex(),
          this.params.general.fogNear,
          ev.value
        );
      });
  }
}
