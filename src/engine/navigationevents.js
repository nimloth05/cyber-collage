//* **************************************************
//  Mouse, Scroll, and Touch Handlers
//* **************************************************

import {app} from "@/engine/app";

const div = document.querySelector(".scene");
/**
 * Mouse listener which calculates device normalized coordinates [-1, +1]
 * @param target
 * @param {mousemove | click} eventName
 * @param {(x: number, y: number) => void} listener receives normalized Device normalized coordinates [-1, +1]
 */
function registerMouseListener(target, eventName, listener) {
  target.addEventListener(eventName, function (event) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    const x = (event.offsetX / event.target.width * window.devicePixelRatio) * 2 - 1;
    const y = -(event.offsetY / event.target.height * window.devicePixelRatio) * 2 + 1;

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

function onMouseWheel(event) {
  const cameraIncrement = 0.001;
  const scrollToZoomRatio = 0.5;
  event.preventDefault();
  if (event.shiftKey) {
    app.agentCube.camera.trackZoom(event.deltaX, event.deltaY);
    // app.agentCube.camera.position.z += event.deltaY * scrollToZoomRatio;
    // app.agentCube.camera.position.x += event.deltaX * app.agentCube.camera.position.z * cameraIncrement;
    // app.agentCube.controls.update();
    // console.log(app.agentCube.camera.position.z);
  } else {
    app.agentCube.camera.trackPan(event.deltaX, event.deltaY);
    // make x/y sensitity proportional to camera distance, e.g., if you are close only small increments
    // app.agentCube.camera.position.x += event.deltaX * app.agentCube.camera.position.z * cameraIncrement;
    // app.agentCube.camera.position.y -= event.deltaY * app.agentCube.camera.position.z * cameraIncrement;
    // app.agentCube.controls.update();
    // prevent scrolling beyond a min/max value
    // camera.position.clampScalar( 0, 10 );
  }
}

window.addEventListener("wheel", onMouseWheel, {passive: false, capture: true});
