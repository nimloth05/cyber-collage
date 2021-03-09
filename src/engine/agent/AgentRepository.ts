import {AgentClass} from "@/engine/agent/AgentClass";

export class AgentRepository {
  private agents: Array<AgentClass> = [];

  add(agentClass: AgentClass) {
    this.agents.push(agentClass);
  }

  remove(description: AgentClass) {
    const index = this.agents.indexOf(description);
    if (index != null) {
      this.agents.splice(index, 1);
    }
  }

  get agentClasses(): Array<AgentClass> {
    // FIXME: Pass out array?
    return this.agents;
  }

  getClass(name: string): AgentClass | undefined {
    // FIXME: Change to Map
    return this.agentClasses.find(it => it.name === name)!;
  }

  compile() {
    this.agents.forEach(it => it.compile());
  }
}
