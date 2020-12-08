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

let ongoingTouches: TouchList;
let neverTouched = true;

function handleStart(event: any) {
  if (neverTouched) {
    promptUserforOrientationPermission().then((enabled) => console.log("orientation is", enabled));
    neverTouched = false;
  }
  event.preventDefault();
  console.log("touchstart");
  console.log(event.changedTouches);
  console.log("start", event.changedTouches[0].radiusX, event.changedTouches[0].radiusX);
// touch start pretends to be also a mouse click
  const box = event.currentTarget.getBoundingClientRect();
  app.agentCube.mouseClick.x = (event.changedTouches[0].clientX - box.left) / event.target.width * window.devicePixelRatio * 2 - 1;
  app.agentCube.mouseClick.y = -(event.changedTouches[0].clientY - box.top) / event.target.height * window.devicePixelRatio * 2 + 1;
  console.log("click x: ", app.agentCube.mouseClick.x, " y: ", app.agentCube.mouseClick.y);
  ongoingTouches = event.changedTouches;
}

function handleMove(event: any) {
  event.preventDefault();
  console.log(event.changedTouches);
// console.log("moved", event.changedTouches[0].clientY - div.getBoundingClientRect().top);
  console.log("move", event.changedTouches[0].radiusX, event.changedTouches[0].radiusX);
// console.log("touch move dx=", event.changedTouches[0].clientX - ongoingTouches[0].clientX, "dy= ", event.changedTouches[0].clientY - ongoingTouches[0].clientY);
  app.agentCube.camera.trackPan(-event.changedTouches[0].clientX + ongoingTouches[0].clientX, -event.changedTouches[0].clientY + ongoingTouches[0].clientY, 2.0);
  ongoingTouches = event.changedTouches;
}

// ***************************************************
// Orientation
// ***************************************************

// Registrations
// FIXME: Redundant to initializer code bla bla
export function registerListeners() {
  const div = document.querySelector(".scene")!;

  registerMouseListener(div, "mousemove", (x, y) => {
    app.agentCube.mouseMove.x = x;
    app.agentCube.mouseMove.y = y;
  });

  registerMouseListener(div, "click", (x, y) => {
    app.agentCube.mouseClick.x = x;
    app.agentCube.mouseClick.y = y;
  });

  div.addEventListener("wheel", onMouseWheel, {passive: false, capture: true});
  div.addEventListener("touchstart", handleStart, false);
  div.addEventListener("touchmove", handleMove, false);
}
