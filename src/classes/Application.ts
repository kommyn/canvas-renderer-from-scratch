import { Canvas2DRenderer } from "./Renderers/Canvas2DRenderer";
import { Timer } from "./Timer";
import type { RendererType } from "./Renderers/ICanvasRenderer";
import type { IDrawable } from "./Drawable/IDrawable";
import { InputManager } from "./InputManager";

export class Application {
  private _initialized = false;
  private _canvas: HTMLCanvasElement = document.createElement("canvas");
  private _resizeTo: HTMLElement | Window | null = null;
  private _renderer!: Canvas2DRenderer;
  private _timer: Timer = new Timer();
  private _width = 0;
  private _height = 0;
  private _drawables: Set<IDrawable> = new Set();
  private _inputManager = new InputManager(this._canvas);

  constructor() {
    this.handleWindowResize = this.handleWindowResize.bind(this);
    this.runInner = this.runInner.bind(this);
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

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get initialized() {
    return this._initialized;
  }

  get context() {
    return this._renderer.context;
  }

  private getCanvasRenderer(type: RendererType) {
    return new Canvas2DRenderer();
  }

  init({
    resizeTo = window,
    rendererType = "2d",
  }: { resizeTo?: HTMLElement | Window; rendererType?: RendererType } = {}) {
    this._resizeTo = resizeTo;
    this._renderer = this.getCanvasRenderer(rendererType);

    this.handleWindowResize();

    window.addEventListener("resize", this.handleWindowResize);

    this._renderer.init(this._canvas);

    this._initialized = true;

    this._inputManager.init();
  }

  destroy() {
    this._inputManager.destory();

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

  private handleWindowResize() {
    if (!(this._resizeTo && this._canvas)) return;

    if (this._resizeTo instanceof Window) {
      this._width = document.body.clientWidth;
      this._height = document.body.clientHeight;
    } else {
      this._width = this._resizeTo.clientWidth;
      this._height = this._resizeTo.clientHeight;
    }

    this._canvas.width = this.width;
    this._canvas.height = this.height;

    this._canvas.style.width = `${this.width}px`;
    this._canvas.style.height = `${this.height}px`;
  }

  private runInner() {
    console.time("frame");
    this._renderer.clearCanvas(this.width, this.height);

    const elapsedTime = this._timer.getElapsedTime();

    const { mouseInputMap, keyboardInputMap } =
      this._inputManager.processInput();

    const drawableOptions = {
      context: this.context,
      elapsedTime,
      mouseInputMap,
      keyboardInputMap,
    };

    this._drawables.forEach((drawable) => {
      drawable.draw(drawableOptions);
    });

    this._inputManager.clearInput();
    console.timeEnd("frame");

    requestAnimationFrame(this.runInner);
  }

  run() {
    this._timer.start();

    requestAnimationFrame(this.runInner);
  }
}
