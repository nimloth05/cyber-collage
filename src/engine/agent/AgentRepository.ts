import {AgentDescription} from "@/engine/agent/AgentDescription";

export class AgentRepository {
  private agents: Array<AgentDescription> = [];

  add(description: AgentDescription) {
    this.agents.push(description);
  }

  remove(description: AgentDescription) {
    const index = this.agents.indexOf(description);
    if (index != null) {
      this.agents.splice(index, 1);
    }
  }

  get descriptions() {
    // FIXME: Pass out array?
    return this.agents;
  }
}
