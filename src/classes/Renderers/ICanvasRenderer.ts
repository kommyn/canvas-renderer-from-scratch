// type RenderingContext = CanvasRenderingContext2D | ImageBitmapRenderingContext | WebGLRenderingContext | WebGL2RenderingContext | GPUCanvasContext;

import type { Canvas2DRenderer } from "./Canvas2DRenderer";
import type { WebGL2Renderer } from "./WebGL2Renderer";
import type { Asset } from "../Assets/Asset";
import type { IAnimationFrame, ICoords, ISize } from "../types";

export type RendererType = "2d" | "webgl2";

export type RendererTypeContextMap = {
  "2d": Canvas2DRenderer;
  // bitmaprenderer: ImageBitmapRenderingContext;
  // webgl: WebGLRenderingContext;
  webgl2: WebGL2Renderer;
};

export type Renderer<T extends RendererType> = T extends "2d"
  ? Canvas2DRenderer
  : WebGL2Renderer;

export interface ICanvasRenderer {
  context: RenderingContext;
  init: (canvas: HTMLCanvasElement) => void;
  clearCanvas: () => void;
  drawText: (
    text: string,
    x: number,
    y: number,
    options?: { font?: string },
  ) => void;
  drawImage: (
    asset: Asset,
    frame: IAnimationFrame,
    coords: ICoords,
    size: ISize,
  ) => void;
}
