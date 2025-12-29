import { Pane } from "tweakpane";
import * as Three from "three";

export class DebugControls {
  private pane: Pane;
  private params: {
    cameraMode: "firstPerson" | "orbit";
    backgorundColor: string;
  };
  private onCameraModeChange?: (mode: "firstPerson" | "orbit") => void;

  constructor(scene: Three.Scene) {
    this.pane = new Pane({
      title: "Debug Controls",
      expanded: false,
    });

    this.params = {
      cameraMode: "firstPerson",
      backgorundColor: "#000000",
    };

    const generalDebugFolder = this.pane.addFolder({
      title: "General",
      expanded: false,
    });

    generalDebugFolder
      .addBinding(this.params, "backgorundColor", {
        label: "Background Color",
      })
      .on("change", (ev) => {
        scene.background = new Three.Color(ev.value);
      });

    generalDebugFolder
      .addBinding(this.params, "cameraMode", {
        label: "Camera Mode",
        options: [
          { text: "First Person", value: "firstPerson" },
          { text: "Orbit", value: "orbit" },
        ],
      })
      .on("change", (ev) => {
        this.onCameraModeChange?.(ev.value as "firstPerson" | "orbit");
      });
  }
}
