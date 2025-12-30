import { Pane } from "tweakpane";
import { constants } from "../../constants/constants";
import { Grass } from "../../objects/Grass";

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
  pane: Pane;
  grass: Grass;
}

export class GrassControls {
  private params: IGrassValues;

  constructor({ pane, grass }: IGrassParams) {
    this.params = {
      grass: {
        ...constants.grass,
      },
    };

    const grassDebugFolder = pane.addFolder({
      title: "Grass",
      expanded: false,
    });

    grassDebugFolder
      .addBinding(this.params.grass, "color", {
        label: "Grass Color",
      })
      .on("change", (ev) => {
        grass.setGrassProperties({
          color: ev.value,
        });
      });

    grassDebugFolder
      .addBinding(this.params.grass, "count", {
        label: "Grass Count",
      })
      .on("change", (ev) => {
        grass.setGrassProperties({
          count: ev.value,
        });
      });

    grassDebugFolder
      .addBinding(this.params.grass, "spread", {
        label: "Grass Spread",
      })
      .on("change", (ev) => {
        grass.setGrassProperties({
          spread: ev.value,
        });
      });

    grassDebugFolder
      .addBinding(this.params.grass.blade, "baseWidth", {
        label: "Base Width",
        min: 0.01,
        max: 0.2,
        step: 0.005,
      })
      .on("change", () => {
        grass.updateGeometry();
      });

    grassDebugFolder
      .addBinding(this.params.grass.blade, "midWidth", {
        label: "Mid Width",
        min: 0.01,
        max: 0.15,
        step: 0.005,
      })
      .on("change", () => {
        grass.updateGeometry();
      });

    grassDebugFolder
      .addBinding(this.params.grass.blade, "tipWidth", {
        label: "Tip Width",
        min: 0.005,
        max: 0.1,
        step: 0.005,
      })
      .on("change", () => {
        grass.updateGeometry();
      });

    grassDebugFolder
      .addBinding(this.params.grass.blade, "height", {
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
