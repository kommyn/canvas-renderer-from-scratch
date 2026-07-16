import type { ICoords, Callback } from "../types";
import type { IDrawable, IDrawableOptions } from "./IDrawable";

export class Text implements IDrawable {
  private _text = "";
  private _font: string = "24px sans-serif";
  private _coords: ICoords = { x: 0, y: 0 };
  private _callback: Callback | null = null;

  constructor({ text, font }: { text: string; font?: string }) {
    this._text = text;

    if (font) this._font = font;
  }

  set callback(fn: Callback | null) {
    this._callback = fn;
  }

  set text(str: string) {
    this._text = str;
  }

  set x(num: number) {
    this._coords.x = num;
  }

  set y(num: number) {
    this._coords.y = num;
  }

  set font(fontStr: string) {
    this._font = fontStr;
  }

  get text() {
    return this._text;
  }

  get x() {
    return this._coords.x;
  }

  get y() {
    return this._coords.y;
  }

  get font() {
    return this._font;
  }

  draw(data: IDrawableOptions) {
    this._callback && this._callback(data);

    data.renderer.drawText(this.text, this.x, this.y, { font: this.font });
  }
}
