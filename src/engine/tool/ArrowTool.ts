import {AbstractAgentTool} from "@/engine/tool/AbstractAgentTool";
import {FindAgentResult} from "@/engine/AgentCube";
import {Agent} from "@/engine/Agent";
import {app} from "@/engine/app";
import {AddAgentToWorldCommand} from "@/model/commands/AddAgentToWorld";
import {GridVector} from "@/model/util/GridVector";
import {TeleportCommand} from "@/model/commands/TeleportCommand";

export class ArrowTool extends AbstractAgentTool {
  id = "arrow";
  icon = "icons/tab/hand-pointer.svg";
  name = "Verschieben"; // FIXME: Translate

  get agentSelected(): Agent | null {
    return app.agentCube.agentSelected;
  }

  get agentDragged(): Agent | null {
    return app.agentCube.agentDragged;
  }

  set agentDragged(value: Agent | null) {
    app.agentCube.agentDragged = value;
  }

  executeClick(hitResult: FindAgentResult): void {
    // select agent
    if (hitResult.agent !== this.agentSelected) {
      if (this.agentSelected) {
        this.agentSelected.deselect();
        app.agentCube.agentSelected = null;
      }
      if (hitResult.agent != null) {
        hitResult.agent.select();
        app.agentCube.agentSelected = hitResult.agent;
      }
    }
    // start drag
    if (hitResult.agent != null) {
      app.agentCube.agentDragged = hitResult.agent;
    }
  }

  executeMove(hitResult: FindAgentResult): void {
    const agentDragged = app.agentCube.agentDragged;

    if (agentDragged != null) {
      if (hitResult.row !== this.toolRow || hitResult.column !== this.toolColumn) {
        app.undoManager.execute(new TeleportCommand(agentDragged, new GridVector(hitResult.column, hitResult.row)));
        this.toolRow = hitResult.row;
        this.toolColumn = hitResult.column;
      }
    }
    // Hovering: does not work on touch interfaces
    /*
    if (!agent) this.hoverAt(row, column);
    if (agent !== this.agentHovered) {
      if (this.agentHovered) {
        this.agentHovered.unhover();
        this.agentHovered = null;
      }
      if (agent) {
        (agent as any).hover(); // TS!#$
        this.agentHovered = agent;
      }
    } */
  }
}
