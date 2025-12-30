import { Pane } from "tweakpane";
import { FloorControls, IFloorParams } from "./FloorControls";
import { GeneralFolder, IGeneralParams } from "./GeneralFolder";
import { GrassControls, IGrassParams } from "./GrassControls";
import { ISkyParams, SkyFolder } from "./SkyFolder";

interface IDebugControls {
  scene: THREE.Scene;
  sky: ISkyParams["sky"];
  floor: IFloorParams["floor"];
  grass: IGrassParams["grass"];
}

export class DebugControls {
  private pane: Pane;

  constructor({ scene, sky, floor, grass }: IDebugControls) {
    this.pane = new Pane({
      title: "Debug Controls",
      expanded: true,
    });

    new GeneralFolder({ pane: this.pane, scene });
    new SkyFolder({ pane: this.pane, sky });
    new FloorControls({ pane: this.pane, floor });
    new GrassControls({ pane: this.pane, grass });
  }
}
