import type { IAnimationFrame } from "../types";
import type { SpriteSheet } from "./SpriteSheet";

enum AnimationStateEnum {
  IDLE = "IDLE",
  PAUSE = "PAUSE",
  PLAY = "PLAY",
}

interface IAnimationState {
  type: AnimationStateEnum;

  play(ctx: AnimationController): void;

  stop(ctx: AnimationController): void;

  pause(ctx: AnimationController): void;

  process(crx: AnimationController, elapsedTime: number): void;
}

const IDLE_STATE: IAnimationState = {
  type: AnimationStateEnum.IDLE,

  play: (ctx) => {
    ctx.setState(PLAY_STATE);
    ctx.resetAnimation();
  },

  stop: (ctx) => {
    ctx.resetAnimation();
  },

  pause: (ctx) => {
    ctx.setState(PAUSE_STATE);
  },

  process: () => {},
};

const PLAY_STATE: IAnimationState = {
  type: AnimationStateEnum.PLAY,

  play: () => {},

  stop: (ctx) => {
    ctx.setState(IDLE_STATE);
    ctx.resetAnimation();
  },

  pause: (ctx) => {
    ctx.setState(PAUSE_STATE);
  },

  process: (ctx, elapsedTime) => {
    if (!ctx.animationName) return;

    const animation = ctx.spriteSheet.animations[ctx.animationName];

    if (!(animation && animation.length !== 0)) return;
    if (!ctx.frame) return;

    ctx.addDuration(elapsedTime);

    if (ctx.duration < ctx.framesDuration) return;

    ctx.resetDuration();

    const nextFrame = ctx.frame.next || (animation[0] as IAnimationFrame);

    ctx.setFrame(nextFrame);
  },
};

export const PAUSE_STATE: IAnimationState = {
  type: AnimationStateEnum.PAUSE,

  play: (ctx) => {
    ctx.setState(PLAY_STATE);
  },

  stop: (ctx) => {
    ctx.setState(IDLE_STATE);
    ctx.resetAnimation();
  },

  pause: () => {},

  process: () => {},
};

export class AnimationController {
  private _spriteSheet: SpriteSheet;
  private _state: IAnimationState;
  private _duration: number = 0;
  private _frame: IAnimationFrame | null = null;
  private _animation: string | null = null;
  private _framesDuration: number = 0;

  constructor(spriteSheet: SpriteSheet) {
    this._spriteSheet = spriteSheet;
    this._state = IDLE_STATE;
  }

  get asset() {
    return this._spriteSheet.asset;
  }

  get spriteSheet() {
    return this._spriteSheet;
  }

  get animationName() {
    return this._animation;
  }

  get frame() {
    return this._frame;
  }

  get duration() {
    return this._duration;
  }

  get isPaused() {
    return this._state.type === AnimationStateEnum.PAUSE;
  }

  get isPlaying() {
    return this._state.type === AnimationStateEnum.PLAY;
  }

  get framesDuration() {
    return this._framesDuration;
  }

  setState(state: IAnimationState) {
    this._state = state;
  }

  setFrame(frame: IAnimationFrame) {
    this._frame = frame;
  }

  addDuration(duration: number) {
    this._duration += duration;
  }

  resetDuration() {
    this._duration = 0;
  }

  resetAnimation() {
    this._duration = 0;

    if (this._spriteSheet.isParsed && this._animation) {
      const animation = this._spriteSheet.animations[this._animation];
      if (!(animation && animation.length !== 0)) return;

      this._frame = animation[0] as IAnimationFrame;
    }
  }

  setAnimation(animationName: string, framesDuration: number) {
    if (animationName === this._animation) return;

    if (!this._spriteSheet.isParsed) {
      console.warn("SpriteSheet is not parsed");
      return;
    }

    const animation = this._spriteSheet.animations[animationName];
    if (!(animation && animation.length !== 0)) {
      console.warn("Animation not found or has no frames");
      return;
    }

    this._animation = animationName;
    this._frame = animation[0] as IAnimationFrame;
    this._duration = 0;
    this._framesDuration = framesDuration;
  }

  play() {
    this._state.play(this);
  }

  pause() {
    this._state.pause(this);
  }

  stop() {
    this._state.stop(this);
  }

  process(elapsedTime: number) {
    this._state.process(this, elapsedTime);
  }
}
