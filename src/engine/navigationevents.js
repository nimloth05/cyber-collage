//* **************************************************
//  Mouse, Scroll, and Touch Handlers
//* **************************************************

import {app} from "@/engine/app";

const div = document.querySelector(".scene");

/**
 * Get real element offset with an offsetParent referencing element
 *
 * `getBoundingClientRect` return values is not correct under CSS multi-column
 * layout, so we recursively get `offsetLeft`/`offsetTop` instead.
 * @param {HTMLElement} el - element of interest
 * @param {HTMLElement} stopEl - one of the offsetParent as a reference
 * @return {object} object wth top and left offset
 */
export function getClientOffset(el, stopEl) {
  /// tail-called optimize
  function getOffset(el, stopEl, left = 0, top = 0) {
    if (el === stopEl) {
      return {left, top};
    }
    return getOffset(
      el.offsetParent,
      stopEl,
      left + el.offsetLeft,
      top + el.offsetTop,
    );
  }

  return getOffset(el, stopEl);
}

/**
 * Mouse listener which corrects offsets and scrolling positions
 * @param target
 * @param {mousemove | click} eventName
 * @param {(x: number, y: number, event: MouseEvent) => void} listener
 */
function registerMouseListener(target, eventName, listener) {
  const offset = getClientOffset(target, document.body);
  function onMouseMove(event) {
    console.log("offset", document.scrollingElement.scrollTop);
    const x = ((event.clientX - offset.left + document.scrollingElement.scrollLeft) / (target.clientWidth));
    const y = -((event.clientY - offset.top + document.scrollingElement.scrollTop) / (target.clientHeight));

    listener(x, y, event);
  }

  target.addEventListener(eventName, onMouseMove, false);
}

registerMouseListener(div, "mousemove", (x, y, event) => {
  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components
  app.agentCube.mouseMove.x = x * 2 - 1;
  app.agentCube.mouseMove.y = y * 2 + 1;
});

registerMouseListener(div, "click", (x, y, event) => {
  console.log("mouseClick", event);
  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components
  app.agentCube.mouseClick.x = x * 2 - 1;
  app.agentCube.mouseClick.y = y * 2 + 1;
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
