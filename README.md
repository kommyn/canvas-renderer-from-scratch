# canvas_learn

A 2D rendering engine for the browser, written from scratch in TypeScript — no rendering, math or animation libraries. Only the DOM, Canvas 2D and WebGL2 APIs.

This is a learning project: the goal is to understand how engines like PixiJS or Phaser work internally by building the same pieces by hand — the frame loop, sprite sheets, an asset registry, per-frame input polling and a swappable render backend.

**Status:** the Canvas 2D backend is complete and runs the demo. The WebGL2 backend is in progress — context creation and texture upload to VRAM are implemented, sprite drawing is not yet.

---

## Stack

TypeScript (`strict`), Webpack 5 (ts-loader + Babel), ESLint (typescript-eslint) + Prettier. The only runtime dependency is `@babel/runtime`; `normalize.css` is used for the demo page.

---

## Demo

The demo scene (`src/index.ts`) spawns a grid of animated sprites from a single sprite sheet, moves one of them with **WASD** (including diagonals, each with its own animation) and draws an FPS counter in the top-right corner.

```bash
yarn install
yarn start          # webpack dev server
```

Other scripts:

```bash
yarn build:dev      # development bundle into dist/
yarn build:prod     # minified production bundle
yarn lint           # eslint over src/
yarn prettier       # format src/
```

---

## Quick start

```ts
import { Application } from "./classes/Application";
import { Assets } from "./classes/Assets/Assets";
import { SpriteSheet } from "./classes/Animation/SpriteSheet";
import { Sprite } from "./classes/Drawable/Sprite";

import sheetImage from "./assets/footman.jpg";
import sheetData from "./assets/footman.json";

const app = new Application("2d"); // "2d" | "webgl2"
app.init();                        // sizes the canvas to the window by default
document.body.append(app.canvas);

const asset = await Assets.load(sheetImage);
const sheet = new SpriteSheet(asset!, sheetData);
sheet.parse();

const sprite = new Sprite(sheet);
sprite.x = 100;
sprite.y = 100;
sprite.setAnimation("walking_right", 100); // animation name, ms per frame

sprite.callback = ({ elapsedTime, keyboardInputMap }) => {
  if (keyboardInputMap.get("KeyD").pressed) {
    sprite.x += elapsedTime * 0.25;
  }
};

app.addDrawable(sprite);
app.run();
```

---

## Architecture

```
Application ──> ICanvasRenderer ──> Canvas2DRenderer | WebGL2Renderer
    │
    ├── Timer            frame delta from performance.now()
    ├── InputManager     DOM events -> per-frame ButtonsMap
    └── Set<IDrawable>   Sprite, Text
                              │
                              └── AnimationController ──> SpriteSheet ──> Asset ──> Texture
```

### Application

Owns the canvas, the `requestAnimationFrame` loop, the renderer, the input manager and the set of drawables. Each frame it clears the canvas, reads the frame delta, polls input, and calls `draw()` on every drawable with a single options object:

```ts
interface IDrawableOptions {
  renderer: ICanvasRenderer;
  elapsedTime: number;
  mouseInputMap: ButtonsMap<number>;
  keyboardInputMap: ButtonsMap<string>;
}
```

The canvas is resized to `window` or to any element passed as `init({ resizeTo })`.

### Renderers

The backend is chosen once, in the `Application` constructor, and hidden behind `ICanvasRenderer`:

```ts
interface ICanvasRenderer {
  context: RenderingContext;
  init(canvas: HTMLCanvasElement): void;
  clearCanvas(): void;
  drawText(text: string, x: number, y: number, options?: { font?: string }): void;
  drawImage(asset: Asset, frame: IAnimationFrame, coords: ICoords, size: ISize): void;
}
```

Drawables never touch a concrete context, so adding a backend means implementing one interface. `Canvas2DRenderer` maps `drawImage` onto the sub-rectangle form of `CanvasRenderingContext2D.drawImage`; `WebGL2Renderer` currently implements only `init` and `clearCanvas`.

### Assets

`Assets` is a singleton registry over `Asset` objects. `Assets.load(src)` loads an image once and returns the cached instance on subsequent calls; `unload` / `delete` release the DOM element and, if one exists, the GPU texture.

`Asset.getRenderingElem(context)` is overloaded on the context type: with a 2D context it returns the `HTMLImageElement`, with a WebGL2 context it lazily creates a `Texture`, uploads the pixels to VRAM and returns it. `Texture` uses `CLAMP_TO_EDGE` and `LINEAR` so non-power-of-two images work without mipmaps, and deletes the texture explicitly on unload.

### Animation

`SpriteSheet` parses a JSON description of the sheet defensively — the raw data is typed as `unknown` and every field is validated while parsing:

```json
{
  "frames": {
    "up_1": { "x": 22, "y": 62, "w": 30, "h": 52 }
  },
  "animations": {
    "walking_up": ["up_1", "up_2", "up_3", "up_4"]
  }
}
```

Animations are stored as linked `IAnimationFrame` nodes (`{ data, name, next }`), so advancing a frame is a pointer hop.

`AnimationController` is an explicit state machine with `IDLE`, `PLAY` and `PAUSE` states implemented as objects with `play` / `stop` / `pause` / `process` — transitions live in the states themselves rather than in a switch. `process(elapsedTime)` accumulates the frame delta and moves to the next frame once `framesDuration` is exceeded.

### Input

`InputManager` subscribes to mouse and keyboard events on the canvas and converts them into per-frame `ButtonsMap` structures. Every button exposes:

```ts
interface IButton {
  pressed: boolean;
  pressedThisFrame: boolean;
  releasedThisFrame: boolean;
}
```

Game code polls this state inside `draw()` instead of registering its own listeners; the per-frame flags are cleared at the end of each frame by the application loop.

### Utilities

- `EventBus<E>` — typed publish/subscribe over an event-name → payload map.
- `StateMachine<T>` — generic machine driven by a transition table.
- `Timer` — frame delta based on `performance.now()`.
- `Coords`, `Size` — small value objects behind `ICoords` / `ISize`.

---

## Roadmap

- **WebGL2 backend:** shader program, quad/UV buffers, orthographic projection, then instanced batching so thousands of sprites cost a few draw calls — and a benchmark against the Canvas 2D path. Notes and derivations live in `WEBGL_GUIDE.md`, `WEBGL_SINGLE_SPRITE.md` and `WEBGL_QA.md`.
- **Restructuring:** split the engine from the demo (`engine/` with a public barrel vs `demo/`), move to Vite, add vitest coverage for the pure logic (sprite-sheet parsing, animation controller, timer, asset de-duplication). The full plan is in `PLAN.txt`.
- **Known gaps:** `Scene` is a stub, `Text` and `Sprite` duplicate their coordinate/callback logic instead of sharing an `Entity` base, and the frame delta is not clamped — see `CODE_ANALYSIS.md`.
