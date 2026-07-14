import type { ISize } from "./types";

export class Size implements ISize {
  w: number;
  h: number;

  constructor(size?: { w?: number; h?: number }) {
    this.w = size?.w ?? 0;
    this.h = size?.h ?? 0;
  }
}
