import {FindAgentResult} from "@/engine/AgentCube";

export interface Tool {
  name: string;
  icon: string;

  executeClick(hitResult: FindAgentResult): void;

  executeMove(hitResult: FindAgentResult): void;
}
