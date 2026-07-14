import { ButtonsMap } from "../InputManager";

export interface IDrawableOptions {
  context: CanvasRenderingContext2D;
  elapsedTime: number;
  mouseInputMap: ButtonsMap<number>;
  keyboardInputMap: ButtonsMap<string>;
}

export interface IDrawable {
  draw: (data: IDrawableOptions) => void;
}
