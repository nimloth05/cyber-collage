import {FindAgentResult} from "@/engine/AgentCube";
import {app} from "@/engine/app";
import {Agent} from "@/engine/Agent";
import {AbstractAgentTool} from "@/engine/tool/AbstractAgentTool";

export class PenTool extends AbstractAgentTool {
  icon = "";
  name = "Stift"; // FIXME: Translate

  executeClick(hitResult: FindAgentResult): void {
    app.agentCube.pushAgent(new Agent(app.agentType()), hitResult.row, hitResult.column);
    console.log("push agent PEN down");
    this.toolRow = hitResult.row;
    this.toolColumn = hitResult.column;
  }

  executeMove(hitResult: FindAgentResult): void {
    if (hitResult.row !== this.toolRow || hitResult.column !== this.toolColumn) {
      app.agentCube.pushAgent(new Agent(app.agentType()), hitResult.row, hitResult.column);
      console.log("push agent PEN move");
      this.toolRow = hitResult.row;
      this.toolColumn = hitResult.column;
    }
  }
}
