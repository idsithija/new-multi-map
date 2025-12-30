import { Pane } from "tweakpane";
import * as Three from "three";
import { Sky } from "../objects/Sky";
import { constants } from "../constants/constants";
import { Floor } from "../objects/Floor";
import { Grass } from "../objects/Grass";
import { ThirdPersonControls } from "./ThirdPersonControls";

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
      shadow: {
        mapSize: number;
        cameraNear: number;
        cameraFar: number;
        cameraSize: number;
      };
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
      blade: {
        baseWidth: number;
        midWidth: number;
        tipWidth: number;
        height: number;
      };
    };
    camera: {
      offset: Three.Vector3;
      smoothness: number;
    };
  };

  constructor(scene: Three.Scene, sky: Sky, floor: Floor, grass: Grass, thirdPersonControls: ThirdPersonControls) {
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

    // Shadow subfolder
    const shadowDebugFolder = skyDebugFolder.addFolder({
      title: "Light Shadows",
      expanded: false,
    });

    shadowDebugFolder
      .addBinding(this.params.sky.shadow, "mapSize", {
        label: "Shadow Map Size",
        min: 512,
        max: 4096,
        step: 512,
      })
      .on("change", (ev) => {
        sky.setShadowProperties({ mapSize: ev.value });
      });

    shadowDebugFolder
      .addBinding(this.params.sky.shadow, "cameraNear", {
        label: "Shadow Near",
        min: 0.1,
        max: 10,
        step: 0.1,
      })
      .on("change", (ev) => {
        sky.setShadowProperties({ cameraNear: ev.value });
      });

    shadowDebugFolder
      .addBinding(this.params.sky.shadow, "cameraFar", {
        label: "Shadow Far",
        min: 100,
        max: 1000,
        step: 10,
      })
      .on("change", (ev) => {
        sky.setShadowProperties({ cameraFar: ev.value });
      });

    shadowDebugFolder
      .addBinding(this.params.sky.shadow, "cameraSize", {
        label: "Shadow Area Size",
        min: 10,
        max: 200,
        step: 5,
      })
      .on("change", (ev) => {
        sky.setShadowProperties({ cameraSize: ev.value });
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
        label: "Grass Count",
      })
      .on("change", (ev) => {
        grass.setGrassProperties({
          count: ev.value,
        });
      });

    grassDebugFolder
      .addBinding(constants.grass, "spread", {
        label: "Grass Spread",
      })
      .on("change", (ev) => {
        grass.setGrassProperties({
          spread: ev.value,
        });
      });

    // Blade Geometry subfolder
    const bladeDebugFolder = grassDebugFolder.addFolder({
      title: "Blade Shape",
      expanded: true,
    });

    bladeDebugFolder
      .addBinding(constants.grass.blade, "baseWidth", {
        label: "Base Width",
        min: 0.01,
        max: 0.2,
        step: 0.005,
      })
      .on("change", () => {
        grass.updateGeometry();
      });

    bladeDebugFolder
      .addBinding(constants.grass.blade, "midWidth", {
        label: "Mid Width",
        min: 0.01,
        max: 0.15,
        step: 0.005,
      })
      .on("change", () => {
        grass.updateGeometry();
      });

    bladeDebugFolder
      .addBinding(constants.grass.blade, "tipWidth", {
        label: "Tip Width",
        min: 0.005,
        max: 0.1,
        step: 0.005,
      })
      .on("change", () => {
        grass.updateGeometry();
      });

    bladeDebugFolder
      .addBinding(constants.grass.blade, "height", {
        label: "Height",
        min: 0.3,
        max: 3.0,
        step: 0.1,
      })
      .on("change", () => {
        grass.updateGeometry();
      });

    // Camera folder
    const cameraDebugFolder = this.pane.addFolder({
      title: "Third Person Camera",
      expanded: false,
    });

    cameraDebugFolder
      .addBinding(constants.camera, "offset", {
        label: "Camera Offset",
        x: { min: -20, max: 20, step: 0.5 },
        y: { min: 0, max: 30, step: 0.5 },
        z: { min: -20, max: 20, step: 0.5 },
      })
      .on("change", (ev) => {
        thirdPersonControls.setOffset(
          new Three.Vector3(
            constants.camera.offset.x,
            constants.camera.offset.y,
            constants.camera.offset.z
          )
        );
      });

    cameraDebugFolder
      .addBinding(constants.camera, "smoothness", {
        label: "Camera Smoothness",
        min: 0.01,
        max: 0.5,
        step: 0.01,
      })
      .on("change", (ev) => {
        thirdPersonControls.setSmoothness(ev.value);
      });
  }
}
