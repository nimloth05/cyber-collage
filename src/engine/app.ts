// ***************************************************
// A P P
// ***************************************************

import {Gallery, shapeNames} from "@/engine/Gallery.ts";
import {AgentCube} from "@/engine/AgentCube";
import {oneOf} from "@/engine/helperfunctions";
import {ChickenAgent} from "@/engine/example-agents";
import {registerListeners} from "@/engine/navigationevents";
import {UndoManager} from "@/model/UndoManager";

// ***************************************************
// T E S T I N G
// ***************************************************

export const app: { name: string; agentCube: AgentCube; gallery: Gallery | null; undoManager: UndoManager; agentType: Function; tool: Function } = {
  name: "Cyber Collage",
  agentCube: new AgentCube(100, 100),
  gallery: null,
  undoManager: new UndoManager(),
  agentType: function () {
    const e: any = document.getElementById("agent-menu");
    return e.options[e.selectedIndex].value;
  },
  tool: function () {
    const e: any = document.getElementById("tool-mode");
    return e.options[e.selectedIndex].value;
  },
};

 (window as any).app = app; // need to be able to tinker with this

function animate() {
  requestAnimationFrame(animate);
  app.agentCube.step();
  app.agentCube.render();
}

export async function init() {
  app.agentCube.init3DSystem();

  app.gallery = await Gallery.loadShapes(app.agentCube.cellSize, (loaded, total, percentage) => {
    console.log(`loaded ${loaded} of ${total} ${percentage}% completion`);
  });

// add agents

  const r1 = new ChickenAgent("Giraffe");
  const r2 = new ChickenAgent("Giraffe");
  const r3 = new ChickenAgent("Dog");
  const r4 = new ChickenAgent("Rooster");
  const c1 = new ChickenAgent("Elephant");

  app.agentCube.pushAgent(r1, 1, 1);
  app.agentCube.pushAgent(c1, 1, 1);
  app.agentCube.pushAgent(r2, 1, 1);
  app.agentCube.pushAgent(r3, 1, 1);
  app.agentCube.pushAgent(r4, 5, 5);

  for (let i = 0; i < 0; i++) {
    app.agentCube.pushAgent(new ChickenAgent("Dog"), 0, 0);
  }

  for (let i = 0; i < 0; i++) {
    app.agentCube.pushAgent(new ChickenAgent("Rabbit"), 0, 0);
  }

// console.log(app.agentCube);
// console.log(`does the chicken see the rooster: ${chickenAgent.see("Rooster", 0, -1)}`);
// console.log(`does the rooster see the chicken: ${roosterAgent.see("Chicken", 0, 1)}`);

// for (let row = 0; row < app.agentCube.rows; row++)
//    for (let column = 0; column < app.agentCube.columns; column++)
//        app.agentCube.pushAgent(new ChickenAgent(), row, column);

  for (let i = 0; i < 500; i++) {
    const agent = new ChickenAgent(oneOf(shapeNames));
    app.agentCube.pushAgent(
      agent,
      Math.floor(Math.random() * app.agentCube.rows),
      Math.floor(Math.random() * app.agentCube.columns),
    );
  }

  window.addEventListener("resize", () => {
    app.agentCube.threeResize();
  });

// app.agentCube.broadcast("whenCreatingNewAgent");

  registerListeners();
  console.log("App init complete, start render cycle");
  animate();
}

// app.agentCube.draw();
