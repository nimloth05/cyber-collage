import {app} from "@/engine/app";

// ***************************************************
// Helper Functions
// ***************************************************

async function promptUserforOrientationPermission() {
  if (DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === "function") {
    const permissionState = await DeviceOrientationEvent.requestPermission();
    if (permissionState === "granted") {
      // Permission granted
      return true;
    } else {
      // Permission denied
      return false;
    }
  }
}

function relativeDeviceCoordinates(x: number, y: number, target: any) {
  // top left = 0, 0
  const box = target.getBoundingClientRect();
  return [x - box.left, y - box.top];
}

function normalizedDeviceCoordinates(x: number, y: number, target: any) {
  // range [-1, -1] ... [1, 1] lower left = [-1, -1]
  const box = target.getBoundingClientRect();
  // clientRect does not appear to take devicePixelRatio into account. Can ignore window.devicePixelRatio
  return [(x - box.left) / box.width * 2 - 1, -(y - box.top) / box.height * 2 + 1];
}

//* **************************************************
// Mouse, ScrollWheel Events
//* **************************************************

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
    const [x, y] = normalizedDeviceCoordinates(mouseEvent.clientX, mouseEvent.clientY, eventTarget);
    listener(x, y);
  }, false);
}

function onMouseWheel(event: any) {
  event.preventDefault();
  if (event.shiftKey) {
    app.agentCube.camera.trackZoom(event.deltaX, event.deltaY);
  } else if (event.altKey) {
    app.agentCube.camera.trackSpinn(event.deltaX, event.deltaY);
  } else {
    app.agentCube.camera.trackPan(event.deltaX, event.deltaY);
  }
}

// ***************************************************
// Touch Events
// ***************************************************

// Need to keep this touch event to disable default touch scrolling
function handleMove(event: any) {
  event.preventDefault();
}

// ***************************************************
// Pointer Events
// ***************************************************
// https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events/Using_Pointer_Events
// https://mobiforge.com/design-development/html5-pointer-events-api-combining-touch-mouse-and-pen

const pointerPath1 = {identifier: -1, cordNew: [0, 0], cordOld: [0, 0]};
const pointerPath2 = {identifier: -1, cordNew: [0, 0], cordOld: [0, 0]};

function newPointerPathDistance() {
  return Math.sqrt((pointerPath1.cordNew[0] - pointerPath2.cordNew[0]) ** 2 +
                   (pointerPath1.cordNew[1] - pointerPath2.cordNew[1]) ** 2);
}

function oldPointerPathDistance() {
  return Math.sqrt((pointerPath1.cordOld[0] - pointerPath2.cordOld[0]) ** 2 +
                   (pointerPath1.cordOld[1] - pointerPath2.cordOld[1]) ** 2);
}

function newPointerPathMidpointX() {
  return (pointerPath1.cordNew[0] + pointerPath2.cordNew[0]) / 2;
}

function newPointerPathMidpointY() {
  return (pointerPath1.cordNew[1] + pointerPath2.cordNew[1]) / 2;
}

function oldPointerPathMidpointX() {
  return (pointerPath1.cordOld[0] + pointerPath2.cordOld[0]) / 2;
}

function oldPointerPathMidpointY() {
  return (pointerPath1.cordOld[1] + pointerPath2.cordOld[1]) / 2;
}

function pointsToAngle(x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1;
  const dy = y2 - y1;

  if (dx === 0) {
    if (dy > 0) {
      return 90;
    } else {
      return 270;
    }
  } else {
    if (dx > 0) {
      return Math.atan(dy / dx) * 180 / Math.PI;
    } else {
    return 180 + Math.atan(dy / dx) * 180 / Math.PI;
    }
  }
}

function newPointerPathAngle() {
  return pointsToAngle(pointerPath1.cordNew[0], pointerPath1.cordNew[1], pointerPath2.cordNew[0], pointerPath2.cordNew[1]);
}

function oldPointerPathAngle() {
  return pointsToAngle(pointerPath1.cordOld[0], pointerPath1.cordOld[1], pointerPath2.cordOld[0], pointerPath2.cordOld[1]);
}

function logPointerPath() {
  console.log(`touch pair, distance: ${newPointerPathDistance()}, angle: ${newPointerPathAngle()}`);
}

function twoFingerTouch() {
  return (pointerPath1.identifier !== -1) && (pointerPath2.identifier !== -1);
}

// -----------------------------------------------------------------------------
// Dampening: 1 = no dampening, 0 = fully damened. Reasonable values 0.9 ... 0.1
// A damper implements a low-pass filter to get rid of touch tracking noise
// Assume dampening to run @ 60FPS
// -----------------------------------------------------------------------------

let inMomentumMode = false;

const spinnDamper = {value: 0, minValue: 0.01, dampening: 0.5, momentumDampening: 0.02};
const zoomDamper = {value: 0, minValue: 0.1, dampening: 0.5, momentumDampening: 0.02};
const panDamperX = {value: 0, minValue: 0.1, dampening: 0.5, momentumDampening: 0.02};
const panDamperY = {value: 0, minValue: 0.1, dampening: 0.5, momentumDampening: 0.02};

function currentDampening (damper: any) {
  if (inMomentumMode) {
    return damper.momentumDampening;
  } else {
    return damper.dampening;
  }
}

function isDamperRequired(damper: any) {
  // if the value falls below the min value then the damper is not needed anymore
  return (Math.abs(damper.value) > damper.minValue);
}

function areDampersRequired() {
  // is there at least one damper that needs being serviced?
  return (isDamperRequired(spinnDamper) || isDamperRequired(zoomDamper) || isDamperRequired(panDamperX) || isDamperRequired(panDamperY));
}

function dampenedSpinn(value: number) {
  // avoid flips
  if (value > 180) value = value - 360;
  if (value < -180) value = value + 360;
  // low pass filter
  const dampening = currentDampening(spinnDamper);
  spinnDamper.value = dampening * value + (1 - dampening) * spinnDamper.value;
  return spinnDamper.value;
}

function dampenedZoom(value: number) {
  const dampening = currentDampening(zoomDamper);
  zoomDamper.value = dampening * value + (1 - dampening) * zoomDamper.value;
  // console.log("dampened zoom value", zoomDamper.value);
  return zoomDamper.value;
}

function dampenedPanX(value: number) {
  const dampening = currentDampening(panDamperX);
  panDamperX.value = dampening * value + (1 - dampening) * panDamperX.value;
  // console.log("dampened pan X value", zoomDamper.value);
  return panDamperX.value;
}

function dampenedPanY(value: number) {
  const dampening = currentDampening(panDamperY);
  panDamperY.value = dampening * value + (1 - dampening) * panDamperY.value;
  return panDamperY.value;
}

function isTiltingGesture() {
  // Hack: interpret two nearly vertical fingers as Tilting Gesture if first finger touched is near top
  const topMargin = 40;
  if (pointerPath1.cordNew[1] > topMargin) return false;
  let angle = newPointerPathAngle();
  if (angle > 180) angle -= 180; // if upper/lower finger flipped
  const titleAngle = 90;
  const tiltMargin = 10;
  return ((angle < titleAngle + tiltMargin) && (angle > titleAngle - tiltMargin));
}

function interpretPointerPath() {
  if (twoFingerTouch()) {
    if (isTiltingGesture()) {
      app.agentCube.camera.trackSpinn(0, dampenedZoom(oldPointerPathDistance() - newPointerPathDistance()), Math.PI / 180);
    } else {
      app.agentCube.camera.trackSpinn(dampenedSpinn(newPointerPathAngle() - oldPointerPathAngle()), 0, Math.PI / 180);
      app.agentCube.camera.trackZoom(0, dampenedZoom(newPointerPathDistance() - oldPointerPathDistance()));
      app.agentCube.camera.trackPan(dampenedPanX(oldPointerPathMidpointX() - newPointerPathMidpointX()),
                                    dampenedPanY(oldPointerPathMidpointY() - newPointerPathMidpointY()),
                                    0.2);
    }
  }
}

// -------------------------------------
// Down, Move, Up Event Handlers        |
// -------------------------------------

function handlePointerDown(event: any) {
  event.preventDefault();
  console.log("%c Pointer Down", "background: #000; color: green", event.pointerId, event.pointerType);
  if (pointerPath1.identifier === -1) {
      pointerPath1.identifier = event.pointerId;
      pointerPath1.cordNew = relativeDeviceCoordinates(event.clientX, event.clientY, event.target);
      // consider first touch as click
      // FIX: wrong coordinate system
      app.agentCube.mouseClick.x = pointerPath1.cordNew[0];
      app.agentCube.mouseClick.y = pointerPath1.cordNew[1];
  } else if (pointerPath2.identifier === -1) {
      pointerPath2.identifier = event.pointerId;
      pointerPath2.cordNew = relativeDeviceCoordinates(event.clientX, event.clientY, event.target);
  }
  // reset dampers
  spinnDamper.value = 0;
  zoomDamper.value = 0;
  panDamperX.value = 0;
  panDamperY.value = 0;
  inMomentumMode = false;
}

function handlePointerMove(event: any) {
  event.preventDefault();
  // console.log("%c Pointer Move", "background: #000; color: orange", event.pointerId, event.pointerType);
  if (event.pointerType === "mouse") return; // mice cannot do multi-touch: bail!
  // find matching pointer path and shift coordinates
  if (pointerPath1.identifier === event.pointerId) {
    pointerPath1.cordOld = pointerPath1.cordNew;
    pointerPath2.cordOld = pointerPath2.cordNew;
    pointerPath1.cordNew = relativeDeviceCoordinates(event.clientX, event.clientY, event.target);
    // logPointerPath();
    interpretPointerPath();
  } else if (pointerPath2.identifier === event.pointerId) {
    pointerPath1.cordOld = pointerPath1.cordNew;
    pointerPath2.cordOld = pointerPath2.cordNew;
    pointerPath2.cordNew = relativeDeviceCoordinates(event.clientX, event.clientY, event.target);
    // logPointerPath();
    interpretPointerPath();
  } else {
    console.error(`Pointer Id ${event.pointerId} not found in pointer path tables. > 2 touches?`);
  }
}

function handlePointerUp(event: any) {
  event.preventDefault();
  console.log("%c Pointer Up", "background: #000; color: red", event.pointerId, event.pointerType);
  // start momentum mode
  if (twoFingerTouch()) {
    inMomentumMode = true;
    // CONSIDER: set a timer to prevent run-away momentum handling?
  }
  // reset path id to mark end of touch
  if (pointerPath1.identifier === event.pointerId) {
    pointerPath1.identifier = -1;
  } else if (pointerPath2.identifier === event.pointerId) {
    pointerPath2.identifier = -1;
  } else {
    console.error(`Pointer Id ${event.pointerId} not found in pointer path tables. > 2 touches?`);
  }
}

// ------------------------------------------------
// Touch Momentum
//   Can be called by the engine to deal with post-up
//   event handling such as touch momentum
// ------------------------------------------------

function handleTouchMomentum() {
  if (inMomentumMode && areDampersRequired()) {
    app.agentCube.camera.trackSpinn(dampenedSpinn(0), 0, Math.PI / 180);
    app.agentCube.camera.trackZoom(0, dampenedZoom(0));
    app.agentCube.camera.trackPan(dampenedPanX(0), dampenedPanY(0), 0.2);
  } else {
    if (inMomentumMode) console.log("%c end of momentun", "background: #000; color: red");
    inMomentumMode = false;
  }
}

// ***************************************************
// Orientation
// ***************************************************

// Registrations
export function registerListeners() {
// FIXME: Redundant to initializer code
  const div = document.querySelector(".scene")!;

  registerMouseListener(div, "mousemove", (x, y) => {
    app.agentCube.mouseMove.x = x;
    app.agentCube.mouseMove.y = y;
  });

  registerMouseListener(div, "click", (x, y) => {
    app.agentCube.mouseClick.x = x;
    app.agentCube.mouseClick.y = y;
  });

  // wheel events
  div.addEventListener("wheel", onMouseWheel, {passive: false, capture: true});

  // touch events
  div.addEventListener("touchmove", handleMove, false);

  // pointer events
  div.addEventListener("pointerdown", handlePointerDown, false);
  div.addEventListener("pointermove", handlePointerMove, false);
  div.addEventListener("pointerup", handlePointerUp, false);

  // touch momentum handler
  app.agentCube.touchMomentumHandler = handleTouchMomentum;
}
