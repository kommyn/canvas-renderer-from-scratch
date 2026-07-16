import { ButtonsMap } from "../InputManager";
import type { ICanvasRenderer } from "../Renderers/ICanvasRenderer";

export interface IDrawableOptions {
  renderer: ICanvasRenderer;
  elapsedTime: number;
  mouseInputMap: ButtonsMap<number>;
  keyboardInputMap: ButtonsMap<string>;
}

export interface IDrawable {
  draw: (data: IDrawableOptions) => void;
}
