import type { ICanvasRenderer } from "./ICanvasRenderer";
import type { Asset } from "../Assets/Asset";
import type { IAnimationFrame, ICoords, ISize } from "../types";

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

  clearCanvas() {
    this.context.clearRect(
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height,
    );
  }

  drawText(text: string, x: number, y: number, options?: { font?: string }) {
    if (options?.font) this.context.font = options.font;

    this.context.fillText(text, x, y);
  }

  drawImage(
    asset: Asset,
    frame: IAnimationFrame,
    coords: ICoords,
    size: ISize,
  ) {
    this._context.drawImage(
      asset.getRenderingElem(this._context) as CanvasImageSource,
      frame.data.x,
      frame.data.y,
      frame.data.w,
      frame.data.h,
      coords.x - frame.data.w,
      coords.y - frame.data.h,
      size.w,
      size.h,
    );
  }
}
