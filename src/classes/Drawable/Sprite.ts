import type { ICoords, ISize, Callback, IFrame } from "../types";
import type { IDrawable, IDrawableOptions } from "./IDrawable";
import { AnimationController } from "../Animation/AnimationController";
import type { SpriteSheet } from "../Animation/SpriteSheet";

export class Sprite implements IDrawable {
  private _coords: ICoords = { x: 0, y: 0 };
  private _size: ISize = { w: 0, h: 0 };
  private _callback: Callback | null = null;
  private _animationController: AnimationController;

  constructor(spriteSheet: SpriteSheet) {
    this._animationController = new AnimationController(spriteSheet);
  }

  set callback(fn: Callback | null) {
    this._callback = fn;
  }

  get x() {
    return this._coords.x;
  }

  get y() {
    return this._coords.y;
  }

  get w() {
    return this._size.w;
  }

  get h() {
    return this._size.h;
  }

  get animationName() {
    return this._animationController.animationName;
  }

  set x(num: number) {
    this._coords.x = num;
  }

  set y(num: number) {
    this._coords.y = num;
  }

  set w(num: number) {
    this._size.w = num;
  }

  set h(num: number) {
    this._size.h = num;
  }

  setAnimation(animation: string, framesDuration: number) {
    this._animationController.setAnimation(animation, framesDuration);
    this._animationController.play();
  }

  draw(data: IDrawableOptions) {
    // console.log("this: ", this._animationController.asset, this._animationController.frame)

    if (!(this._animationController.asset && this._animationController.frame))
      return;

    this._callback && this._callback(data);

    const frame = this._animationController.frame;

    // console.time("animation process");
    this._animationController.process(data.elapsedTime);
    // console.timeEnd("animation process");
    this._size.w = frame.data.w;
    this._size.h = frame.data.h;

    data.renderer.drawImage(
      this._animationController.asset,
      frame,
      this._coords,
      this._size,
    );
  }
}
