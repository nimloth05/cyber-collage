import {FindAgentResult} from "@/engine/AgentCube";

export interface Tool {
  id: string;
  name: string;
  icon: string;

  executeClick(hitResult: FindAgentResult): void;

  executeMove(hitResult: FindAgentResult): void;
}
