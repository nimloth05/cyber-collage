import {FindAgentResult} from "@/engine/AgentCube";
import {Vector2} from "three";

export interface Tool {
  id: string;
  name: string;
  icon: string;

  /**
   * Click inside world
   */
  executeClick(click: Vector2): void;

  /**
   * Move inside world
   * @param move
   */
  executeMove(move: Vector2): void;

  /**
   * Executed if the user clicks/selects this tool.
   */
  selected(previousSelectedToolId: string): void;
}
