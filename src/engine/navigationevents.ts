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

//* **************************************************
// Mouse, Scroll
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

    const x = (mouseEvent.offsetX / eventTarget.width * window.devicePixelRatio) * 2 - 1;
    const y = -(mouseEvent.offsetY / eventTarget.height * window.devicePixelRatio) * 2 + 1;

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
// Touch Handlers
// ***************************************************

// let ongoingTouches: TouchList;
let neverTouched = true;

const touchPath1 = {identifier: -1, cordNew: [0, 0], cordOld: [0, 0]};
const touchPath2 = {identifier: -1, cordNew: [0, 0], cordOld: [0, 0]};

function touchIdStrings(touches: any) {
  let string = "";
  touches.forEach(function (touch: any) { string += `id: ${touch.identifier} `; });
  return string;
}

function touchNormalizedDeviceCoordinates(touch: any, target: any) {
  const box = target.getBoundingClientRect();
  return [
    (touch.clientX - box.left) / target.width * window.devicePixelRatio * 2 - 1,
    -(touch.clientY - box.top) / target.height * window.devicePixelRatio * 2 + 1,
  ];
}

function normalizedDeviceCoordinates(event: any) {
  const box = event.target.getBoundingClientRect();
  return [
    (event.clientX - box.left) / event.target.width * window.devicePixelRatio * 2 - 1,
    -(event.clientY - box.top) / event.target.height * window.devicePixelRatio * 2 + 1,
  ];
}

function relativeDeviceCoordinates(event: any) {
  const box = event.target.getBoundingClientRect();
  return [event.clientX - box.left, event.target.height - event.clientY + box.top];
}

function handleStart(event: any) {
  if (neverTouched) {
    promptUserforOrientationPermission().then(enabled => console.log("orientation is", enabled));
    neverTouched = false;
  }
  event.preventDefault();
  console.log("%c Touch Start", "background: #000; color: green", touchIdStrings(event.changedTouches));
  // only interpret first two touches
  for (let i = 0; i < Math.min(event.changedTouches.length, 2); i++) {
    const touch = event.changedTouches[i];
    if (touchPath1.identifier === -1) {
      touchPath1.identifier = touch.identifier;
      touchPath1.cordNew = touchNormalizedDeviceCoordinates(touch, event.target);
      // consider first touch as click
      app.agentCube.mouseClick.x = touchPath1.cordNew[0];
      app.agentCube.mouseClick.y = touchPath1.cordNew[1];
    } else if (touchPath2.identifier === -1) {
      touchPath2.identifier = touch.identifier;
      touchPath2.cordNew = touchNormalizedDeviceCoordinates(touch, event.target);
    }
  }
  console.table(touchPath1);
  console.table(touchPath2);
}

/*
  // console.log("start", event.changedTouches[0].radiusX, event.changedTouches[0].radiusX);
  // touch start pretends to be also a mouse click
  const [x, y] = touchNormalizedDeviceCoordinates(event.changedTouches[0], event.target);
  app.agentCube.mouseClick.x = x;
  app.agentCube.mouseClick.y = y;
  // console.log("click x: ", app.agentCube.mouseClick.x, " y: ", app.agentCube.mouseClick.y);
  ongoingTouches = event.changedTouches;
}  */

function handleMove(event: any) {
  event.preventDefault();
  // console.log("%c Touch Move", "background: #000; color: orange", touchIdStrings(event.changedTouches));
  // console.log("moved", event.changedTouches[0].clientY - div.getBoundingClientRect().top);
  // console.log("Touch Move", event.changedTouches[0].radiusX, event.changedTouches[0].radiusX);
  // console.log("touch move dx=", event.changedTouches[0].clientX - ongoingTouches[0].clientX, "dy= ", event.changedTouches[0].clientY - ongoingTouches[0].clientY);
  // app.agentCube.camera.trackPan(-event.changedTouches[0].clientX + ongoingTouches[0].clientX, -event.changedTouches[0].clientY + ongoingTouches[0].clientY, 2.0);
}

function handleEnd(event: any) {
  event.preventDefault();
  console.log("%c Touch End", "background: #000; color: red", touchIdStrings(event.changedTouches));
  // reset IDs
  touchPath1.identifier = -1;
  touchPath2.identifier = -1;
  console.table(touchPath1);
  console.table(touchPath2);
}

// ***************************************************
// Pointer Handlers
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
// -----------------------------------------------------------------------------

const spinnDamper = {value: 0, dampening: 0.5};
const zoomDamper = {value: 0, dampening: 0.5};
const panDamperX = {value: 0, dampening: 0.5};
const panDamperY = {value: 0, dampening: 0.5};

function dampenedSpinn(value: number) {
  // avoid flips
  if (value > 180) value = value - 360;
  if (value < -180) value = value + 360;
  // low pass filter
  spinnDamper.value = spinnDamper.dampening * value + (1 - spinnDamper.dampening) * spinnDamper.value;
  return spinnDamper.value;
}

function dampenedZoom(value: number) {
  zoomDamper.value = zoomDamper.dampening * value + (1 - zoomDamper.dampening) * zoomDamper.value;
  return zoomDamper.value;
}

function dampenedPanX(value: number) {
  panDamperX.value = panDamperX.dampening * value + (1 - panDamperX.dampening) * panDamperX.value;
  return panDamperX.value;
}

function dampenedPanY(value: number) {
  panDamperY.value = panDamperY.dampening * value + (1 - panDamperY.dampening) * panDamperY.value;
  return panDamperY.value;
}

function interpretPointerPath() {
  if (twoFingerTouch()) {
    app.agentCube.camera.trackSpinn(dampenedSpinn(oldPointerPathAngle() - newPointerPathAngle()), 0, Math.PI / 180);
    app.agentCube.camera.trackZoom(0, dampenedZoom(newPointerPathDistance() - oldPointerPathDistance()));
    app.agentCube.camera.trackPan(dampenedPanX(oldPointerPathMidpointX() - newPointerPathMidpointX()),
                                  dampenedPanY(newPointerPathMidpointY() - oldPointerPathMidpointY()),
                                   0.2);
  }
}

function handlePointerDown(event: any) {
  event.preventDefault();
  console.log("%c Pointer Down", "background: #000; color: green", event.pointerId, event.pointerType);
  if (pointerPath1.identifier === -1) {
      pointerPath1.identifier = event.pointerId;
      pointerPath1.cordNew = relativeDeviceCoordinates(event);
      // consider first touch as click
      // FIX: wrong coordinate system
      app.agentCube.mouseClick.x = pointerPath1.cordNew[0];
      app.agentCube.mouseClick.y = pointerPath1.cordNew[1];
  } else if (pointerPath2.identifier === -1) {
      pointerPath2.identifier = event.pointerId;
      pointerPath2.cordNew = relativeDeviceCoordinates(event);
  }
  // reset dampers
  spinnDamper.value = 0;
  zoomDamper.value = 0;
  panDamperX.value = 0;
  panDamperY.value = 0;
}

function handlePointerMove(event: any) {
  event.preventDefault();
  // console.log("%c Pointer Move", "background: #000; color: orange", event.pointerId, event.pointerType);
  if (event.pointerType === "mouse") return; // mice cannot do multi-touch: bail!
  // find matching pointer path and shift coordinates
  if (pointerPath1.identifier === event.pointerId) {
    pointerPath1.cordOld = pointerPath1.cordNew;
    pointerPath2.cordOld = pointerPath2.cordNew;
    pointerPath1.cordNew = relativeDeviceCoordinates(event);
    // logPointerPath();
    interpretPointerPath();
  } else if (pointerPath2.identifier === event.pointerId) {
    pointerPath1.cordOld = pointerPath1.cordNew;
    pointerPath2.cordOld = pointerPath2.cordNew;
    pointerPath2.cordNew = relativeDeviceCoordinates(event);
    // logPointerPath();
    interpretPointerPath();
  } else {
    console.error(`Pointer Id ${event.pointerId} not found in pointer path tables. > 2 touches?`);
  }
}

function handlePointerUp(event: any) {
  event.preventDefault();
  console.log("%c Pointer Up", "background: #000; color: red", event.pointerId, event.pointerType);
  // reset path id to mark end of touch
  if (pointerPath1.identifier === event.pointerId) {
    pointerPath1.identifier = -1;
  } else if (pointerPath2.identifier === event.pointerId) {
    pointerPath2.identifier = -1;
  } else {
    console.error(`Pointer Id ${event.pointerId} not found in pointer path tables. > 2 touches?`);
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
  // div.addEventListener("touchstart", handleStart, false);
  div.addEventListener("touchmove", handleMove, false);
  // div.addEventListener("touchend", handleEnd, false);
  // pointer events
  div.addEventListener("pointerdown", handlePointerDown, false);
  div.addEventListener("pointermove", handlePointerMove, false);
  div.addEventListener("pointerup", handlePointerUp, false);
}
