import "normalize.css";

import "./styles.module.css";

import { Text } from "./classes/Drawable/Text";
import { Sprite } from "./classes/Drawable/Sprite";

import FootmanJson from "./assets/footman.json";

import Footman from "./assets/footman.jpg";
import { SpriteSheet } from "./classes/Animation/SpriteSheet";

import { Application } from "./classes/Application";
import type { Callback } from "./classes/types";
import { Assets } from "./classes/Assets/Assets";

const app = new Application("webgl2");

app.init();

document.body.append(app.canvas);

const fpsDrawable = new Text({ text: "", font: "24px sans-serif" });
fpsDrawable.callback = ({ renderer, elapsedTime }) => {
  fpsDrawable.text = String(Math.ceil(1000 / elapsedTime));
  fpsDrawable.x = renderer.context.canvas.width - 50;
  fpsDrawable.y = 50;
};

app.addDrawable(fpsDrawable);

let footmanSpriteSheet: SpriteSheet;
const createFootSpriteSheet = async () => {
  const footmanAsset = await Assets.load(Footman);
  if (!footmanAsset) return null;

  if (!footmanSpriteSheet) {
    footmanSpriteSheet = new SpriteSheet(footmanAsset, FootmanJson);
    footmanSpriteSheet.parse();
  }
  return footmanSpriteSheet;
};

const createFootmanSprite = async (x: number, y: number) => {
  await createFootSpriteSheet();

  const footmanSprite = new Sprite(footmanSpriteSheet);
  const footSpeed = 0.25;
  const footmanFramesDuration = 100;
  footmanSprite.x = x;
  footmanSprite.y = y;
  footmanSprite.setAnimation("staying_up", 100);

  const callback: Callback = ({ elapsedTime, keyboardInputMap }) => {
    const keyW = keyboardInputMap.get("KeyW");
    const keyA = keyboardInputMap.get("KeyA");
    const keyS = keyboardInputMap.get("KeyS");
    const keyD = keyboardInputMap.get("KeyD");

    let footmanSpeed = elapsedTime * footSpeed;

    // BAD PRACTICE!!! REWORK IT!!!
    if (keyW.pressed && keyD.pressed) {
      footmanSprite.y = footmanSprite.y - 0.75 * footmanSpeed;
      footmanSprite.x = footmanSprite.x + 0.75 * footmanSpeed;
      footmanSprite.setAnimation("walking_right_up", footmanFramesDuration);
    } else if (keyW.pressed && keyA.pressed) {
      footmanSprite.y = footmanSprite.y - 0.75 * footmanSpeed;
      footmanSprite.x = footmanSprite.x - 0.75 * footmanSpeed;
      footmanSprite.setAnimation("walking_left_up", footmanFramesDuration);
    } else if (keyS.pressed && keyD.pressed) {
      footmanSprite.y = footmanSprite.y + 0.75 * footmanSpeed;
      footmanSprite.x = footmanSprite.x + 0.75 * footmanSpeed;
      footmanSprite.setAnimation("walking_right_down", footmanFramesDuration);
    } else if (keyS.pressed && keyA.pressed) {
      footmanSprite.y = footmanSprite.y + 0.75 * footmanSpeed;
      footmanSprite.x = footmanSprite.x - 0.75 * footmanSpeed;
      footmanSprite.setAnimation("walking_left_down", footmanFramesDuration);
    } else if (keyW.pressed) {
      footmanSprite.y = footmanSprite.y - footmanSpeed;
      footmanSprite.setAnimation("walking_up", footmanFramesDuration);
    } else if (keyA.pressed) {
      footmanSprite.x = footmanSprite.x - footmanSpeed;
      footmanSprite.setAnimation("walking_left", footmanFramesDuration);
    } else if (keyS.pressed) {
      footmanSprite.y = footmanSprite.y + footmanSpeed;
      footmanSprite.setAnimation("walking_down", footmanFramesDuration);
    } else if (keyD.pressed) {
      footmanSprite.x = footmanSprite.x + footmanSpeed;
      footmanSprite.setAnimation("walking_right", footmanFramesDuration);
    } else if (footmanSprite.animationName === "walking_up") {
      footmanSprite.setAnimation("staying_up", footmanFramesDuration);
    } else if (footmanSprite.animationName === "walking_down") {
      footmanSprite.setAnimation("staying_down", footmanFramesDuration);
    } else if (footmanSprite.animationName === "walking_right") {
      footmanSprite.setAnimation("staying_right", footmanFramesDuration);
    } else if (footmanSprite.animationName === "walking_left") {
      footmanSprite.setAnimation("staying_left", footmanFramesDuration);
    } else if (footmanSprite.animationName === "walking_left_up") {
      footmanSprite.setAnimation("staying_left_up", footmanFramesDuration);
    } else if (footmanSprite.animationName === "walking_left_down") {
      footmanSprite.setAnimation("staying_left_down", footmanFramesDuration);
    } else if (footmanSprite.animationName === "walking_right_up") {
      footmanSprite.setAnimation("staying_right_up", footmanFramesDuration);
    } else if (footmanSprite.animationName === "walking_right_down") {
      footmanSprite.setAnimation("staying_right_down", footmanFramesDuration);
    }
  };

  footmanSprite.callback = callback;

  return footmanSprite;
};

(async () => {
  await createFootSpriteSheet();
  
  const footmanSprites = await Promise.all(
    Array.from({ length: 10000 }).map((_, index) =>
      createFootmanSprite(
        50 + 50 * Math.floor(index % (app.w / 50)),
        50 + 50 * Math.floor(index / (app.h / 50)),
      ),
    ),
  );

  footmanSprites.forEach(
    (footmanSprite) => footmanSprite && app.addDrawable(footmanSprite),
  );

  app.run();
})();
