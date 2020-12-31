import {AbstractAgentTool} from "@/engine/tool/AbstractAgentTool";
import {FindAgentResult} from "@/engine/AgentCube";

export class EraseTool extends AbstractAgentTool {
  icon = "";
  name = "Erase";

  executeClick(hitResult: FindAgentResult): void {
    // erase hitResult.agent
    if (hitResult.agent != null) {
      hitResult.agent.erase();
    }
  }

  executeMove(hitResult: FindAgentResult): void {
    // erase agent
    if (hitResult.agent) {
      if (hitResult.row !== this.toolRow || hitResult.column !== this.toolColumn) {
        hitResult.agent.erase();
        this.toolRow = hitResult.row;
        this.toolColumn = hitResult.column;
      }
    } else {
      this.toolRow = hitResult.row;
      this.toolColumn = hitResult.column;
    }
  }
}
