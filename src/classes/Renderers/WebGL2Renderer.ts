import type { ICanvasRenderer } from "./ICanvasRenderer";
import type { Asset } from "../Assets/Asset";
import type { IAnimationFrame, ICoords, ISize } from "../types";

export class WebGL2Renderer implements ICanvasRenderer {
  private _context!: WebGL2RenderingContext;

  get context() {
    return this._context;
  }

  init(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("webgl2");

    if (!ctx) throw new Error("Your browser does not support WebGL2 context");

    this._context = ctx;
  }

  clearCanvas() {
    this.context.clearColor(1.0, 1.0, 1.0, 1.0);
    this.context.clear(this.context.COLOR_BUFFER_BIT);
  }

  drawText(text: string, x: number, y: number, options?: { font?: string }) {}

  drawImage(
    asset: Asset,
    frame: IAnimationFrame,
    coords: ICoords,
    size: ISize,
  ) {}
}
