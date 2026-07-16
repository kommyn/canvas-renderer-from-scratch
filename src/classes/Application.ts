import { Canvas2DRenderer } from "./Renderers/Canvas2DRenderer";
import { Timer } from "./Timer";
import type {
  ICanvasRenderer,
  RendererType,
  RendererTypeContextMap,
  Renderer,
} from "./Renderers/ICanvasRenderer";
import type { IDrawable } from "./Drawable/IDrawable";
import { InputManager } from "./InputManager";
import { WebGL2Renderer } from "./Renderers/WebGL2Renderer";

export class Application {
  private _type: RendererType;
  private _canvas: HTMLCanvasElement = document.createElement("canvas");
  private _resizeTo: HTMLElement | Window | null = null;
  private _renderer: ICanvasRenderer;
  private _timer: Timer = new Timer();
  private _w = 0;
  private _h = 0;
  private _drawables: Set<IDrawable> = new Set();
  private _inputManager = new InputManager(this._canvas);
  private _isInitialized = false;

  constructor(type: RendererType = "webgl2") {
    this._type = type;
    this._renderer = this.getCanvasRenderer(type);

    this.handleWindowResize = this.handleWindowResize.bind(this);
    this.runInner = this.runInner.bind(this);
  }

  get type() {
    return this._type;
  }

  get inputManager() {
    return this._inputManager;
  }

  get drawables() {
    return this._drawables;
  }

  get canvas() {
    return this._canvas;
  }

  get w() {
    return this._w;
  }

  get h() {
    return this._h;
  }

  get isInitialized() {
    return this._isInitialized;
  }

  init({ resizeTo = window }: { resizeTo?: HTMLElement | Window } = {}) {
    this._resizeTo = resizeTo;

    this.handleWindowResize();

    window.addEventListener("resize", this.handleWindowResize);

    this._renderer.init(this._canvas);

    this._inputManager.init();

    this._isInitialized = true;
  }

  destroy() {
    this._inputManager.destroy();

    this._canvas.remove();
    this._resizeTo = null;

    window.removeEventListener("resize", this.handleWindowResize);
  }

  addDrawable(drawable: IDrawable) {
    this._drawables.add(drawable);
  }

  removeDrawable(drawable: IDrawable) {
    this._drawables.delete(drawable);
  }

  run() {
    if (!this._isInitialized) return;

    this._timer.start();

    requestAnimationFrame(this.runInner);
  }

  private handleWindowResize() {
    if (!(this._resizeTo && this._canvas)) return;

    if (this._resizeTo instanceof Window) {
      this._w = document.body.clientWidth;
      this._h = document.body.clientHeight;
    } else {
      this._w = this._resizeTo.clientWidth;
      this._h = this._resizeTo.clientHeight;
    }

    this._canvas.width = this.w;
    this._canvas.height = this.h;

    this._canvas.style.width = `${this.w}px`;
    this._canvas.style.height = `${this.h}px`;
  }

  private runInner() {
    // console.time("frame");
    this._renderer.clearCanvas();

    const elapsedTime = this._timer.getElapsedTime();

    const { mouseInputMap, keyboardInputMap } =
      this._inputManager.processInput();

    const drawableOptions = {
      renderer: this._renderer,
      elapsedTime,
      mouseInputMap,
      keyboardInputMap,
    };

    this._drawables.forEach((drawable) => {
      drawable.draw(drawableOptions);
    });

    this._inputManager.clearInput();
    // console.timeEnd("frame");

    requestAnimationFrame(this.runInner);
  }

  private getCanvasRenderer(type: RendererType) {
    switch (type) {
      case "webgl2":
        return new WebGL2Renderer();
      case "2d":
      default:
        return new Canvas2DRenderer();
    }
  }
}
