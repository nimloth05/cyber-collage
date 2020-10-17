import {ConditionInstance} from "@/model/ConditionInstance";
import {ActionInstance} from "@/model/ActionInstance";

export class RuleInstance {
  conditions: Array<ConditionInstance>;
  actions: Array<ActionInstance>;
  id: string;

  constructor(id: string, conditions: Array<ConditionInstance>, actions: Array<ActionInstance>) {
    this.conditions = conditions;
    this.actions = actions;
    this.id = id;
  }
}
