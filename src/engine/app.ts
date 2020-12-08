// ***************************************************
// A P P
// ***************************************************

import {Gallery, shapeNames} from "@/engine/Gallery.ts";
import {AgentCube} from "@/engine/AgentCube";
import {oneOf} from "@/engine/helperfunctions";
import {ChickenAgent} from "@/engine/example-agents";
import {registerListeners} from "@/engine/navigationevents";
import {UndoManager} from "@/model/UndoManager";

//* **************************************************
// T E S T I N G
//* **************************************************

export const app: { name: string; agentCube: AgentCube; gallery: Gallery | null; undoManager: UndoManager } = {
  name: "Cyber Collage",
  agentCube: new AgentCube(60, 20),
  gallery: null,
  undoManager: new UndoManager(),
};

// window.app = app; // need to be able to tinker with this

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

  const r1 = new ChickenAgent("Giraffe", app.agentCube);
  const r2 = new ChickenAgent("Giraffe", app.agentCube);
  const r3 = new ChickenAgent("Dog", app.agentCube);
  const r4 = new ChickenAgent("Rooster", app.agentCube);
  const c1 = new ChickenAgent("Elephant", app.agentCube);

  app.agentCube.pushAgent(r1, 1, 1);
  app.agentCube.pushAgent(c1, 1, 1);
  app.agentCube.pushAgent(r2, 1, 1);
  app.agentCube.pushAgent(r3, 1, 1);
  app.agentCube.pushAgent(r4, 5, 5);

  for (let i = 0; i < 0; i++) {
    app.agentCube.pushAgent(new ChickenAgent("Dog", app.agentCube), 0, 0);
  }

  for (let i = 0; i < 0; i++) {
    app.agentCube.pushAgent(new ChickenAgent("Rabbit", app.agentCube), 0, 0);
  }

// console.log(app.agentCube);
// console.log(`does the chicken see the rooster: ${chickenAgent.see("Rooster", 0, -1)}`);
// console.log(`does the rooster see the chicken: ${roosterAgent.see("Chicken", 0, 1)}`);

// for (let row = 0; row < app.agentCube.rows; row++)
//    for (let column = 0; column < app.agentCube.columns; column++)
//        app.agentCube.pushAgent(new ChickenAgent(), row, column);

  for (let i = 0; i < 50; i++) {
    const agent = new ChickenAgent(oneOf(shapeNames), app.agentCube);
    app.agentCube.pushAgent(
      agent,
      Math.floor(Math.random() * app.agentCube.rows),
      Math.floor(Math.random() * app.agentCube.columns),
    );
  }

// app.agentCube.broadcast("whenCreatingNewAgent");

  registerListeners();
  console.log("App init complete, start render cycle");
  animate();
}

// app.agentCube.draw();
