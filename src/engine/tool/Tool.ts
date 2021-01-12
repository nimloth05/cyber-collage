import {FindAgentResult} from "@/engine/AgentCube";

export interface Tool {
  id: string;
  name: string;
  icon: string;

  /**
   * Click inside world
   * @param hitResult
   */
  executeClick(hitResult: FindAgentResult): void;

  /**
   * Move inside world
   * @param hitResult
   */
  executeMove(hitResult: FindAgentResult): void;

  /**
   * Executed if the user clicks/selects this tool.
   */
  selected(previousSelectedToolId: string): void;
}
