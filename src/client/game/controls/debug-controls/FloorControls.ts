import { Pane } from "tweakpane";
import { constants } from "../../constants/constants";
import { Floor } from "../../objects/Floor";

export interface IFloorParams {
  pane: Pane;
  floor: Floor;
}

interface IFloorValues {
  floor: {
    color: string;
    metalness: number;
    roughness: number;
  };
}

export class FloorControls {
  private params: IFloorValues;
  constructor({ pane, floor }: IFloorParams) {
    this.params = {
      floor: {
        ...constants.floor,
      },
    };

    const floorDebugFolder = pane.addFolder({
      title: "Floor",
      expanded: false,
    });

    // Floor color control
    floorDebugFolder
      .addBinding(this.params.floor, "color", {
        label: "Floor Color",
      })
      .on("change", (ev) => {
        floor.setFloorProperties({ color: ev.value });
      });

    // Floor metalness control
    floorDebugFolder
      .addBinding(this.params.floor, "metalness", {
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
      .addBinding(this.params.floor, "roughness", {
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
