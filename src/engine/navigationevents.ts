//* **************************************************
//  Mouse, Scroll, and Touch Handlers
//* **************************************************

import {app} from "@/engine/app";

// FIXME: Redundant to initializer code
const div = document.querySelector(".scene")!;

/**
 * Mouse listener which calculates device normalized coordinates [-1, +1]
 * @param target
 * @param {mousemove | click} eventName
 * @param {(x: number, y: number) => void} listener receives normalized Device normalized coordinates [-1, +1]
 */
function registerMouseListener(target: Element, eventName: "mousemove" | "click", listener: (x: number, y: number) => void) {
  target.addEventListener(eventName, function (event) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    const mouseEvent = event as MouseEvent;
    const eventTarget = mouseEvent.target as HTMLCanvasElement;

    const x = (mouseEvent.offsetX / eventTarget.width * window.devicePixelRatio) * 2 - 1;
    const y = -(mouseEvent.offsetY / eventTarget.height * window.devicePixelRatio) * 2 + 1;

    listener(x, y);
  }, false);
}

registerMouseListener(div, "mousemove", (x, y) => {
  app.agentCube.mouseMove.x = x;
  app.agentCube.mouseMove.y = y;
});

registerMouseListener(div, "click", (x, y) => {
  app.agentCube.mouseClick.x = x;
  app.agentCube.mouseClick.y = y;
});

function onMouseWheel(event: Event) {
  const mouseEvent = event as WheelEvent;
  mouseEvent.preventDefault();
  if (mouseEvent.shiftKey) {
    app.agentCube.camera.trackZoom(mouseEvent.deltaX, mouseEvent.deltaY);
  } else if (mouseEvent.altKey) {
    app.agentCube.camera.trackSpinn(mouseEvent.deltaX, mouseEvent.deltaY);
  } else {
    app.agentCube.camera.trackPan(mouseEvent.deltaX, mouseEvent.deltaY);
  }
}

div.addEventListener("wheel", onMouseWheel, {passive: false, capture: true});
