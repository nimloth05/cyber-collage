<template>
  <instruction-renderer
    v-for="(instruction, index) in conditions.instructionObjects"
    :key="index"
    :declaration="instruction.declaration"
    :argument-resolver="_argumentResolver(instruction)"
    @arg-changed="e => _updateArgument(instruction, e)">
    <span class="boolean-operator" v-if="index !== conditions.length - 1"> and </span>
  </instruction-renderer>
  <add-command-button @click="addNewCondition"/>
  <action-modal
    :id="conditions.id"
    ref="conditionModal"
    @selected="_conditionSelected"
    :declarations="_getConditions()"
  />
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import AddCommandButton from "../../../AddCommandButton.vue";
import {Action, AndConditionList, Condition, Instruction} from "@/engine/Instruction";
import {InstructionDeclaration} from "@/model/InstructionDeclaration";
import {DirectionValue, InstructionValue, ShapeNameValue} from "@/engine/instruction-value";
import {app} from "@/engine/app";
import {AddASTNodeCommand} from "@/model/commands/instruction/AddASTNodeCommand";
import InstructionRenderer from "@/components/hud/tab/rule/InstructionRenderer.vue";
import {ChangeInstructionValueCommand} from "@/model/commands/instruction/ChangeInstructionValueCommand";
import {instructionDefinitions} from "@/engine/instruction-definitions";
import ActionModal from "@/components/hud/tab/rule/ActionModal.vue";

@Options({
  name: "ConditionList",
  components: {
    AddCommandButton,
    ActionModal,
    InstructionRenderer,
  },
  props: {
    conditions: AndConditionList,
  },
})
export default class ConditionPanel extends Vue {
  conditions!: AndConditionList;

  addNewCondition(): void {
    (this.$refs.conditionModal as ActionModal).show();
  }

  _conditionSelected(conditionDecl: InstructionDeclaration): void {
    const condition = new Condition(conditionDecl, {
      shape: new ShapeNameValue("cat"),
      direction: new DirectionValue([-1, 1]),
    });
    app.undoManager.execute(new AddASTNodeCommand<Condition>(this.conditions, condition));
  }

  _argumentResolver(action: Instruction): (name: string) => InstructionValue | undefined {
    return (name: string): InstructionValue | undefined => {
      return action.getArgumentValue(name);
    };
  }

  _updateArgument(action: Action, e: any): void {
    const {name, value} = e;
    app.undoManager.execute(new ChangeInstructionValueCommand(action, name, value));
  }

  _getConditions(): Array<any> {
    return instructionDefinitions.filter(it => it.class === Condition);
  }
}
</script>

<style lang="less">
.boolean-operator {
  font-style: italic;
}
</style>
