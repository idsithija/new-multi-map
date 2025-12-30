import { constants } from "../../constants/constants";
import { Grass } from "../../objects/Grass";
import { BaseControls } from "./BaseControls";

interface IGrassValues {
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
}

export interface IGrassParams {
  grass: Grass;
}

export class GrassControls extends BaseControls<IGrassValues> {
  constructor({ grass }: IGrassParams) {
    super({
      grass: {
        ...constants.grass,
      },
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
  }
}
