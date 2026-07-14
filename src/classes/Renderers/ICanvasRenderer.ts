// type RenderingContext = CanvasRenderingContext2D | ImageBitmapRenderingContext | WebGLRenderingContext | WebGL2RenderingContext | GPUCanvasContext;

export type RendererType = "2d" | "bitmaprenderer" | "webgl" | "webgl2";

export type RendererTypeContextMap = {
  "2d": CanvasRenderingContext2D;
  bitmaprenderer: ImageBitmapRenderingContext;
  webgl: WebGLRenderingContext;
  webgl2: WebGL2RenderingContext;
};

export interface ICanvasRenderer {
  context: RenderingContext;
  init: (canvas: HTMLCanvasElement) => void;
  clearCanvas: (width: number, height: number) => void;
}
