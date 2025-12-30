import { Pane } from "tweakpane";
import * as Three from "three";
import { Sky } from "../objects/Sky";
import { constants } from "../constants/constants";
import { Floor } from "../objects/Floor";
import { Grass } from "../objects/Grass";

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
    floor: {
      color: string;
      metalness: number;
      roughness: number;
    };
    grass: {
      color: string;
      count: number;
      spread: number;
    };
  };

  constructor(scene: Three.Scene, sky: Sky, floor: Floor, grass: Grass) {
    // Initialize tweakpane
    this.pane = new Pane({
      title: "Debug Controls",
      expanded: true,
    });

    // Parameters for tweakpane
    this.params = constants;

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
        sky.setMoonLightProperties({
          color: new Three.Color(ev.value).getHex(),
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
          position: new Three.Vector3(
            this.params.sky.position.x,
            this.params.sky.position.y,
            this.params.sky.position.z
          ),
        });
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
        min: -50,
        max: 100,
        step: 0.2,
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
        min: -100,
        max: 200,
        step: 0.2,
      })
      .on("change", (ev) => {
        scene.fog = new Three.Fog(
          new Three.Color(this.params.sky.fogColor).getHex(),
          this.params.sky.fogNear,
          ev.value
        );
      });

    // Floor folder
    const floorDebugFolder = this.pane.addFolder({
      title: "Floor",
      expanded: false,
    });

    // Floor color control
    floorDebugFolder
      .addBinding(constants.floor, "color", {
        label: "Floor Color",
      })
      .on("change", (ev) => {
        floor.setFloorProperties({ color: ev.value });
      });

    // Floor metalness control
    floorDebugFolder
      .addBinding(constants.floor, "metalness", {
        label: "Floor Metalness",
        min: 0,
        max: 1,
        step: 0.01,
      })
      .on("change", (ev) => {
        floor.setFloorProperties({ metalness: ev.value });
      });

    // Floor roughness control
    floorDebugFolder
      .addBinding(constants.floor, "roughness", {
        label: "Floor Roughness",
        min: 0,
        max: 1,
        step: 0.01,
      })
      .on("change", (ev) => {
        floor.setFloorProperties({ roughness: ev.value });
      });

      const grassDebugFolder = this.pane.addFolder({
        title: "Grass",
        expanded: false,
      });

      grassDebugFolder
      .addBinding(constants.grass, "color", {
        label: "Grass Color",
      })
      .on("change", (ev) => {
        grass.setGrassProperties({ 
          color: ev.value,

        });
      });

      grassDebugFolder
      .addBinding(constants.grass, "count", {
        label: "Grass Count",}).on("change", (ev) => {
          grass.setGrassProperties({ 
            count: ev.value,
          });
      });

      grassDebugFolder
      .addBinding(constants.grass, "spread", {
        label: "Grass Spread",}).on("change", (ev) => {
          grass.setGrassProperties({ 
            spread: ev.value,
          });
      });
      
  }
}
