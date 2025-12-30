import { Pane } from "tweakpane";

export class BaseControls<T> {
  public pane: Pane;
  public params: T;

  constructor(params: T) {
    // Initialize tweakpane
    this.pane = new Pane({
      title: "Debug Controls",
      expanded: true,
    });

    // Parameters for tweakpane
    this.params = params;
  }
}
