// ***************************************************
// A P P
// ***************************************************

import {Gallery} from "@/engine/Gallery.ts";
import {registerListeners} from "@/engine/navigationevents";
import {AppContext} from "@/engine/AppContext";
import {SaveTool} from "@/engine/tool/SaveTool";
import {WORLD_CONTEXT_ID} from "@/model/Commands";
import {ref} from "vue";

// ***************************************************
// T E S T I N G
// ***************************************************

export const app = new AppContext();

// FIXME: Global scope pollution
// (window as any).app = app; // need to be able to tinker with this

export async function init() {
  app.agentCube.init3DSystem();

  app.gallery = await Gallery.loadShapes(app.agentCube.map.cellSize, (loaded, total, percentage) => {
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
    app.agentCube.renderer.threeResize();
  });

  SaveTool.registerListener(app.undoManager);

  registerListeners();

  SaveTool.loadState();

  app.undoManager.addListener(() => {
    app.repository.compile();

    const uiState = ref(app.uiState);
    uiState.value.undoRedo.canUndo = app.undoManager.canUndo(WORLD_CONTEXT_ID);
    uiState.value.undoRedo.canRedo = app.undoManager.canRedo(WORLD_CONTEXT_ID);
  });
  app.repository.compile();

  console.log("App init complete, start render cycle");
  app.gameLoop.run();

  // Vue.forceUpdate();
}

// app.agentCube.draw();
