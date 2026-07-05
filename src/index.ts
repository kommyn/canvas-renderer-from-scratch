import "normalize.css";

import "./styles.module.css";

const canvasElement = document.createElement("canvas");

let windowWidth = document.body.clientWidth;
let windowHeight = document.body.clientHeight;

window.addEventListener("resize", () => {
  windowWidth = document.body.clientWidth;
  windowHeight = document.body.clientHeight;

  if (canvasElement) {
    canvasElement.setAttribute("width", String(windowWidth));
    canvasElement.setAttribute("height", String(windowHeight));
    canvasElement.style.width = `${windowWidth}px`;
    canvasElement.style.height = `${windowHeight}px`;
  }
});

if (canvasElement) {
  canvasElement.setAttribute("width", String(windowWidth));
  canvasElement.setAttribute("height", String(windowHeight));
  canvasElement.style.width = `${windowWidth}px`;
  canvasElement.style.height = `${windowHeight}px`;
}

document.body.appendChild(canvasElement);

const context2d = canvasElement.getContext("2d");

if (context2d) {
  draw(context2d);
} else {
  alert("No avail");
}

function draw(context2d: CanvasRenderingContext2D) {
  // Set line width
  context2d.lineWidth = 10;

  // Wall
  context2d.strokeRect(75, 140, 150, 110);

  // Door
  context2d.fillRect(130, 190, 40, 60);

  // Roof
  context2d.beginPath();
  context2d.moveTo(50, 140);
  context2d.lineTo(150, 60);
  context2d.lineTo(250, 140);
  context2d.closePath();
  context2d.stroke();
}
