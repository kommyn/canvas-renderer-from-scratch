import type { IDrawableOptions } from "./Drawable/IDrawable";

export interface ICoords {
  x: number;
  y: number;
}

export interface ISize {
  w: number;
  h: number;
}

export interface IFrame {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface IAnimationFrame {
  data: IFrame;
  name: string;
  next: IAnimationFrame | null;
}

export type Callback = (data: IDrawableOptions) => void;

export enum MouseButtonsEnum {
  LEFT = 0,
  MIDDLE = 1,
  RIGHT = 2,
  BACK = 3,
  FORWARD = 4,
}

export const MouseButtonsMap = {
  0: "LEFT",
  1: "MIDDLE",
  2: "RIGHT",
  3: "BACK",
  4: "FORWARD",
  LEFT: 0,
  MIDDLE: 1,
  RIGHT: 2,
  BACK: 3,
  FORWARD: 4,
} as const;
