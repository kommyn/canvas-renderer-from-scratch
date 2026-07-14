import type { ICoords } from "./types";

export class Coords implements ICoords {
  x: number;
  y: number;

  constructor(coords?: { x: number; y: number }) {
    this.x = coords?.x ?? 0;
    this.y = coords?.y ?? 0;
  }
}
