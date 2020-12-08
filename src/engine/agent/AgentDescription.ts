import {Agent} from "@/engine/Agent";

export class AgentDescription {
  shapeName: string;

  constructor(shapeName: string) {
    this.shapeName = shapeName;
  }

  createAgent(): Agent {
    return new Agent(this.shapeName);
  }
}
