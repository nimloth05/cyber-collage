import {Tool} from "@/engine/tool/Tool";
import {FindAgentResult} from "@/engine/AgentCube";

export abstract class AbstractAgentTool implements Tool {
  abstract icon: string;
  abstract name: string;
  abstract id: string;

  protected toolRow = -1;
  protected toolColumn = -1;

  abstract executeClick(hitResult: FindAgentResult): void;

  abstract executeMove(hitResult: FindAgentResult): void;
}
