import { FloorControls, IFloorParams } from "./FloorControls";
import { GeneralFolder, IGeneralParams } from "./GeneralFolder";
import { GrassControls, IGrassParams } from "./GrassControls";
import { ISkyParams, SkyFolder } from "./SkyFolder";

export class DebugControls {
  constructor({
    scene,
    sky,
    floor,
    grass,
  }: IGeneralParams & ISkyParams & IFloorParams & IGrassParams) {
    new GeneralFolder({ scene });
    new SkyFolder({ sky });
    new FloorControls({ floor });
    new GrassControls({ grass });
  }
}
