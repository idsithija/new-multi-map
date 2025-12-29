import { Pane } from "tweakpane";
import * as Three from "three";
import { OrbitControls } from "./OrbitControls";
import { FirstPersonControls } from "./FirstPersonControls";

export class DebugControls {
  private pane: Pane;
  private params: {
    cameraMode: "firstPerson" | "orbit";
    backgorundColor: string;
  };
  private currentControlMode: "firstPerson" | "orbit" = "firstPerson";
  private orbitControls: OrbitControls;
  private firstPersonControls: FirstPersonControls;

  constructor(
    scene: Three.Scene,
    orbitControls: OrbitControls,
    firstPersonControls: FirstPersonControls
  ) {
    // Store references
    this.orbitControls = orbitControls;
    this.firstPersonControls = firstPersonControls;

    // Initialize tweakpane
    this.pane = new Pane({
      title: "Debug Controls",
      expanded: true,
    });

    // Parameters for tweakpane
    this.params = {
      cameraMode: "firstPerson",
      backgorundColor: "#000000",
    };

    // General folder
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
        this.switchControlMode(ev.value as "firstPerson" | "orbit");
      });
  }

  private switchControlMode(mode: "firstPerson" | "orbit"): void {
    this.currentControlMode = mode;

    if (mode === "firstPerson") {
      // Disable orbit
      this.orbitControls.setEnabled(false);

      // Enable first person
      this.firstPersonControls.setEnabled(true);
    } else {
      // Disable first person
      this.firstPersonControls.setEnabled(false);

      // Enable orbit
      this.orbitControls.setEnabled(true);
    }
  }

  public getCurrentControlMode(): "firstPerson" | "orbit" {
    return this.currentControlMode;
  }
}
