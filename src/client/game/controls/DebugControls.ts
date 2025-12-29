import { Pane } from "tweakpane";
import * as Three from "three";
import { Sky } from "../objects/Sky";

export class DebugControls {
  private pane: Pane;
  private params: {
    general: {
      backgroundColor: string;
    };
    sky: {
      color: string;
      intensity: number;
      position: Three.Vector3;
      fogNear: number;
      fogFar: number;
      fogColor: string;
    };
  };

  constructor(scene: Three.Scene, sky: Sky) {
    // Initialize tweakpane
    this.pane = new Pane({
      title: "Debug Controls",
      expanded: true,
    });

    // Parameters for tweakpane
    this.params = {
      general: {
        backgroundColor: "#000000",
      },
      sky: {
        color: "#b3ccff",
        intensity: 0.12,
        position: new Three.Vector3(10, 20, 10),
        fogColor: "#0d0e23",
        fogNear: 10,
        fogFar: 2000,
      },
    };

    // General folder
    const generalDebugFolder = this.pane.addFolder({
      title: "General",
      expanded: false,
    });

    // Background color control
    generalDebugFolder
      .addBinding(this.params.general, "backgroundColor", {
        label: "Background Color",
      })
      .on("change", (ev) => {
        scene.background = new Three.Color(ev.value);
      });

    // Sky folder
    const skyDebugFolder = this.pane.addFolder({
      title: "Sky",
      expanded: false,
    });

    skyDebugFolder
      .addBinding(this.params.sky, "color", {
        label: "Sky Color",
      })
      .on("change", (ev) => {
        sky.setMoonLightDetails(
          new Three.Color(ev.value).getHex(),
          this.params.sky.intensity
        );
      });

    skyDebugFolder
      .addBinding(this.params.sky, "intensity", {
        label: "Sky Intensity",
        min: 0,
        max: 1,
        step: 0.01,
      })
      .on("change", (ev) => {
        sky.setMoonLightDetails(
          new Three.Color(this.params.sky.color).getHex(),
          ev.value
        );
      });

    skyDebugFolder
      .addBinding(this.params.sky, "position", {
        label: "Sky Position",
        x: { min: -100, max: 100, step: 1 },
        y: { min: -100, max: 100, step: 1 },
        z: { min: -100, max: 100, step: 1 },
      })
      .on("change", (ev) => {
        sky.setMoonLightDetails(
          new Three.Color(this.params.sky.color).getHex(),
          this.params.sky.intensity,
          this.params.sky.position
        );
      });

    skyDebugFolder
      .addBinding(this.params.sky, "fogColor", {
        label: "Fog Color",
      })
      .on("change", (ev) => {
        scene.fog = new Three.Fog(
          new Three.Color(ev.value).getHex(),
          this.params.sky.fogNear,
          this.params.sky.fogFar
        );
      });

    skyDebugFolder
      .addBinding(this.params.sky, "fogNear", {
        label: "Fog Near",
        min: 0,
        max: 1000,
        step: 1,
      })
      .on("change", (ev) => {
        scene.fog = new Three.Fog(
          new Three.Color(this.params.sky.fogColor).getHex(),
          ev.value,
          this.params.sky.fogFar
        );
      });

    skyDebugFolder
      .addBinding(this.params.sky, "fogFar", {
        label: "Fog Far",
        min: 100,
        max: 2000,
        step: 1,
      })
      .on("change", (ev) => {
        scene.fog = new Three.Fog(
          new Three.Color(this.params.sky.fogColor).getHex(),
          this.params.sky.fogNear,
          ev.value
        );
      });
  }
}
