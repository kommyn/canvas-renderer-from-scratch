export class Asset {
  private _isLoaded: boolean = false;
  private _elem: HTMLImageElement | null = null;
  private _src: string;

  constructor(src: string) {
    this._src = src;
  }

  load() {
    return new Promise((resolve, reject) => {
      this._elem = document.createElement("img");

      this._elem.addEventListener("load", () => {
        this._isLoaded = true;

        resolve(true);
      });

      this._elem.addEventListener("error", () => {
        reject(new Error(`Error loading image by src "${this._src}"`));
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

    this._elem.src = "";
    this._elem.remove();

    this._elem = null;
    this._isLoaded = false;
  }

  get isLoaded() {
    return this._isLoaded;
  }

  get elem() {
    return this._elem;
  }
}
