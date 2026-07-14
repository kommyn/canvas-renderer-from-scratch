import { Coords } from "./Coords";

export interface IButton {
  pressed: boolean;
  pressedThisFrame: boolean;
  releasedThisFrame: boolean;
}

export class ButtonsMap<T extends number | string> {
  private _buttons: Map<T, IButton> = new Map();

  get(key: T) {
    const button = this._buttons.get(key);

    if (button) {
      return button;
    } else {
      return {
        pressed: false,
        pressedThisFrame: false,
        releasedThisFrame: false,
      };
    }
  }

  set(key: T, value: Partial<IButton>) {
    const currentValue = this.get(key);

    this._buttons.set(key, { ...currentValue, ...value });
  }

  clearInput() {
    this._buttons.forEach((button) => {
      button.pressedThisFrame = false;
      button.releasedThisFrame = false;
    });
  }
}

export class InputManager {
  private _canvasElem: HTMLCanvasElement;
  private _isMouseOver: boolean = false;
  private _mouseCoords: Coords = new Coords();
  private _mouseInputMap: ButtonsMap<number> = new ButtonsMap();
  private _keybordInputMap: ButtonsMap<string> = new ButtonsMap();

  constructor(canvasElem: HTMLCanvasElement) {
    this._canvasElem = canvasElem;

    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);

    this.handleContextMenu = this.handleContextMenu.bind(this);

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  get isMouseOver() {
    return this._isMouseOver;
  }

  get mouseCoords() {
    return this._mouseCoords;
  }

  init() {
    this._canvasElem.addEventListener("mouseenter", this.handleMouseEnter);
    this._canvasElem.addEventListener("mouseleave", this.handleMouseLeave);
    this._canvasElem.addEventListener("mousemove", this.handleMouseMove);
    this._canvasElem.addEventListener("mousedown", this.handleMouseDown);
    this._canvasElem.addEventListener("mouseup", this.handleMouseUp);
    this._canvasElem.addEventListener("contextmenu", this.handleContextMenu);

    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  destory() {
    this._canvasElem.removeEventListener("mouseenter", this.handleMouseEnter);
    this._canvasElem.removeEventListener("mouseleave", this.handleMouseLeave);
    this._canvasElem.removeEventListener("mousemove", this.handleMouseMove);
    this._canvasElem.removeEventListener("mousemove", this.handleMouseDown);
    this._canvasElem.removeEventListener("mouseup", this.handleMouseUp);
    this._canvasElem.removeEventListener("contextmenu", this.handleContextMenu);

    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
  }

  processInput() {
    return {
      mouseInputMap: this._mouseInputMap,
      keyboardInputMap: this._keybordInputMap,
    };
  }

  clearInput() {
    this._mouseInputMap.clearInput();
    this._keybordInputMap.clearInput();
  }

  private handleMouseEnter() {
    this._isMouseOver = true;
  }

  private handleMouseLeave() {
    this._isMouseOver = false;
  }

  private handleMouseMove(event: MouseEvent) {
    this._mouseCoords.x = event.clientX - this._canvasElem.clientLeft;
    this._mouseCoords.y = event.clientY - this._canvasElem.clientTop;
  }

  private handleMouseDown(event: MouseEvent) {
    this._mouseInputMap.set(event.button, {
      pressed: true,
      pressedThisFrame: true,
    });
  }

  private handleMouseUp(event: MouseEvent) {
    this._mouseInputMap.set(event.button, {
      pressed: false,
      releasedThisFrame: true,
    });
  }

  private handleContextMenu(event: PointerEvent) {
    event.preventDefault();
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (event.repeat) return;

    this._keybordInputMap.set(event.code, {
      pressed: true,
      pressedThisFrame: true,
    });
  }

  private handleKeyUp(event: KeyboardEvent) {
    this._keybordInputMap.set(event.code, {
      pressed: false,
      releasedThisFrame: true,
    });
  }
}
