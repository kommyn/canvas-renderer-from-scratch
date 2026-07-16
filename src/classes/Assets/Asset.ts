import { Texture } from "./Texture";

export class Asset {
  private _isLoaded: boolean = false;
  private _elem: HTMLImageElement | null = null;
  private _src: string;
  private _texture: Texture | null = null;

  constructor(src: string) {
    this._src = src;
  }

  get isLoaded() {
    return this._isLoaded;
  }

  get texture() {
    return this._texture;
  }

  get src() {
    return this._src;
  }

  load(): Promise<boolean> {
    return new Promise((resolve) => {
      this._elem = document.createElement("img");

      this._elem.addEventListener("load", () => {
        this._isLoaded = true;

        resolve(true);
      });

      this._elem.addEventListener("error", () => {
        console.error(`Error loading image by src "${this._src}"`);
        resolve(false);
      });

      this._elem.src = this._src;
    });
  }

  unload() {
    if (!(this._elem && this._isLoaded)) {
      console.warn(
        `Asset by src "${this._src}" cannot be released because it is not loaded`,
      );

      return false;
    }

    if (this._texture) {
      this._texture.removeTextureFromVRAM();
      this._texture = null;
    }

    this._elem.src = "";
    this._elem.remove();

    this._elem = null;
    this._isLoaded = false;

    return true;
  }

  getRenderingElem(context: CanvasRenderingContext2D): HTMLImageElement | null;
  getRenderingElem(context: WebGL2RenderingContext): Texture | null;
  getRenderingElem(
    context: CanvasRenderingContext2D | WebGL2RenderingContext,
  ): HTMLImageElement | Texture | null {
    if (!this.isLoaded) return null;

    if (context instanceof CanvasRenderingContext2D) return this._elem;

    if (context instanceof WebGL2RenderingContext) return this._texture;

    return null;
  }

  loadGlTexture(context: WebGL2RenderingContext) {
    if (!this._isLoaded || !this._elem) return;

    this._texture = new Texture(context);

    this._texture.loadTextureToVRAM(this._elem);
  }

  uploadGlTexture() {
    if (this._texture) this._texture.removeTextureFromVRAM();
  }
}
