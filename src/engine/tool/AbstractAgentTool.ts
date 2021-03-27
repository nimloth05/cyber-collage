import {Tool} from "@/engine/tool/Tool";
import {FindAgentResult} from "@/engine/AgentCube";
import {app} from "@/engine/app";
import {Vector2} from "three";
import {Agent} from "@/engine/Agent";

export abstract class AbstractAgentTool implements Tool {
  abstract icon: string;
  abstract name: string;
  abstract id: string;

  protected toolRow = -1;
  protected toolColumn = -1;

  abstract executeClick(click: Vector2): void;

  abstract executeMove(move: Vector2): void;

  selected(previousSelectedToolId: string): void {
    // Not empty
  }

  /**
   * click must be in render space.
   * @param click
   * @param excludeAgent
   * @protected
   */
  protected getHitResult(click: Vector2, excludeAgent: Agent | null = null): FindAgentResult {
    return app.agentCube.findAgentAt(click.x, click.y, excludeAgent);
  }
}
