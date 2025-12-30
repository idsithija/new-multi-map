import { constants } from "../../constants/constants";
import { Floor } from "../../objects/Floor";
import { BaseControls } from "./BaseControls";

export interface IFloorParams {
  floor: Floor;
}

interface IFloorValues {
  floor: {
    color: string;
    metalness: number;
    roughness: number;
  };
}

export class FloorControls extends BaseControls<IFloorValues> {
  constructor({ floor }: IFloorParams) {
    super({
      floor: {
        ...constants.floor,
      },
    });

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
  }
}
