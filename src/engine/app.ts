// ***************************************************
// A P P
// ***************************************************

import {Gallery} from "@/engine/Gallery.ts";
import {registerListeners} from "@/engine/navigationevents";
import {AppContext} from "@/engine/AppContext";
import {SaveTool} from "@/engine/tool/SaveTool";

// ***************************************************
// T E S T I N G
// ***************************************************

export const app = new AppContext();

// FIXME: Global scope pollution
(window as any).app = app; // need to be able to tinker with this

function animate() {
  requestAnimationFrame(animate);
  app.gameLoop.update();
  app.agentCube.render();
}

export function requestFullScreen() {
  const elem: any = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}

export function exitFullscreen() {
  const doc: any = document;
  if (doc.exitFullscreen) {
    doc.exitFullscreen();
  } else if (doc.webkitExitFullscreen) {
    doc.webkitExitFullscreen();
  } else if (doc.mozCancelFullScreen) {
    doc.mozCancelFullScreen();
  } else if (doc.msExitFullscreen) {
    doc.msExitFullscreen();
  }
}

export async function init() {
  app.agentCube.init3DSystem();

  app.gallery = await Gallery.loadShapes(app.agentCube.cellSize, (loaded, total, percentage) => {
    console.log(`loaded ${loaded} of ${total} ${percentage}% completion`);
  });

// add agents

// console.log(app.agentCube);
// console.log(`does the chicken see the rooster: ${chickenAgent.see("Rooster", 0, -1)}`);
// console.log(`does the rooster see the chicken: ${roosterAgent.see("Chicken", 0, 1)}`);

// for (let row = 0; row < app.agentCube.rows; row++)
//    for (let column = 0; column < app.agentCube.columns; column++)
//        app.agentCube.pushAgent(new ChickenAgent(), row, column);

  // for (let i = 0; i < 500; i++) {
  //   const agent = new ChickenAgent(oneOf(shapeNames));
  //   app.agentCube.pushAgent(
  //     agent,
  //     Math.floor(Math.random() * app.agentCube.rows),
  //     Math.floor(Math.random() * app.agentCube.columns),
  //   );
  // }

  window.addEventListener("resize", () => {
    app.agentCube.threeResize();
  });

  registerListeners();

  SaveTool.loadState();

  console.log("App init complete, start render cycle");
  animate();
}

// app.agentCube.draw();
