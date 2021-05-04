<template>
  <instruction-renderer
    v-for="(instruction, index) in conditions.instructions"
    :key="index"
    :declaration="instruction.declaration"
    :id="conditions.id + '-instruction-' + index"
    :argument-resolver="_argumentResolver(instruction)"
    @arg-changed="e => _updateArgument(instruction, e)"
    :read-only="false"
    :toolbarActions="getToolbarActions(instruction)"
  >
    <span class="boolean-operator" v-if="index !== conditions.length - 1"> and </span>
  </instruction-renderer>
  <add-command-button @click="addNewCondition"/>
  <instruction-declarations-modal
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
import {InstructionValue} from "@/engine/instruction-value";
import {app} from "@/engine/app";
import {AddASTNodeCommand} from "@/model/commands/instruction/AddASTNodeCommand";
import InstructionRenderer from "@/components/hud/tab/rule/InstructionRenderer.vue";
import {ChangeInstructionValueCommand} from "@/model/commands/instruction/ChangeInstructionValueCommand";
import {conditionDefinitions} from "@/engine/instruction-definitions";
import InstructionDeclarationsModal from "@/components/hud/tab/rule/InstructionDeclarationsModal.vue";
import {getDefaultActions, InstructionToolbarAction} from "@/components/hud/tab/rule/InstructionToolbarUtil";

@Options({
  name: "ConditionList",
  components: {
    AddCommandButton,
    InstructionDeclarationsModal,
    InstructionRenderer,
  },
  props: {
    conditions: AndConditionList,
  },
})
export default class ConditionPanel extends Vue {
  conditions!: AndConditionList;

  addNewCondition(): void {
    (this.$refs.conditionModal as InstructionDeclarationsModal).show();
  }

  _conditionSelected(conditionDecl: InstructionDeclaration): void {
    const condition = Instruction.createNewInstruction(Condition, conditionDecl);
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
    return conditionDefinitions;
  }

  getToolbarActions(instruction: Condition): Array<InstructionToolbarAction> {
    return getDefaultActions(this.conditions, instruction);
  }
}
</script>

<style lang="less">
.boolean-operator {
  font-style: italic;
}
</style>
