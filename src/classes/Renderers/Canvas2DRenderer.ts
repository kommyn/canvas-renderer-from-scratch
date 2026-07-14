import type { ICanvasRenderer } from "./ICanvasRenderer";

export class Canvas2DRenderer implements ICanvasRenderer {
  private _context!: CanvasRenderingContext2D;

  get context() {
    return this._context;
  }

  init(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("You browser does not support 2d context");

    this._context = ctx;
  }

  clearCanvas(width: number, height: number) {
    this._context?.clearRect(0, 0, width, height);
  }
}
