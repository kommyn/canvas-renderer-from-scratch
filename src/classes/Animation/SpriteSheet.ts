import type { IFrame, IAnimationFrame } from "../types";
import type { Asset } from "../Assets/Asset";

export class SpriteSheet<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  private _frames: { [key: string]: IFrame } = {};
  private _animations: { [key: string]: IAnimationFrame[] } = {};
  private _rawData: T;
  private _asset: Asset;
  private _isParsed = false;

  constructor(asset: Asset, data: T) {
    this._asset = asset;
    this._rawData = data;
  }

  get frames() {
    return this._frames;
  }

  get animations() {
    return this._animations;
  }

  get asset() {
    return this._asset;
  }

  get isParsed() {
    return this._isParsed;
  }

  // TODO: Use here zod or some kind of json parsing library
  parse() {
    const keys = Object.keys(this._rawData);

    if (keys.includes("frames")) {
      this._frames = this.parseFrames(this._rawData["frames"]);
    }

    if (keys.includes("animations")) {
      this._animations = this.parseAnimations(this._rawData["animations"]);
    }

    this._isParsed = true;
  }

  private parseFrames(frames: unknown) {
    if (frames === null || typeof frames !== "object") return {};

    return Object.entries(frames).reduce<{ [key: string]: IFrame }>(
      (acc, [key, frame], index) => {
        if (frame === null || typeof frame !== "object") return acc;

        const newFrame: Partial<IFrame> = {};

        for (const key of Object.keys(frame)) {
          const value = frame[key];
          if (typeof value !== "number") continue;

          switch (key) {
            case "x":
            case "y":
            case "w":
            case "h":
              newFrame[key] = frame[key];
              break;
          }
        }

        const hasAll = ["x", "y", "w", "h"].every((prop) =>
          Object.hasOwn(newFrame, prop),
        );

        if (hasAll) {
          acc[key] = newFrame as IFrame;
        }

        return acc;
      },
      {},
    );
  }

  private parseAnimations(animations: unknown) {
    if (animations === null || typeof animations !== "object") return {};

    return Object.entries(animations).reduce<{
      [key: string]: IAnimationFrame[];
    }>((acc, [key, frameNames]) => {
      if (!(Array.isArray(frameNames) && frameNames.length)) return acc;

      const animationFrames = frameNames.reduce<IAnimationFrame[]>(
        (acc, frameName) => {
          const frame = this._frames[frameName];

          if (frame) {
            const newFrame = {
              data: frame,
              name: frameName,
              next: null,
            };

            const prevAnimatedFrame = acc[acc.length - 1];
            if (prevAnimatedFrame) prevAnimatedFrame.next = newFrame;

            acc.push(newFrame);
          }

          return acc;
        },
        [],
      );

      const isAllFramesExists = animationFrames.length === frameNames.length;

      if (isAllFramesExists) {
        acc[key] = animationFrames;
      }

      return acc;
    }, {});
  }
}
