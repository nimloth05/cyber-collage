<template>
  <instruction-renderer
    v-for="(action, index) in actions.instructions"
    :key="index"
    :declaration="action.declaration"
    :argument-resolver="_argumentResolver(action)"
    :id="actions.id + '-instruction-' + index"
    :read-only="false"
    @arg-changed="e => _updateArgument(action, e)"
    :toolbarActions="getToolbarActions(action)"
  />
  <add-command-button @click="addNewAction"/>
  <instruction-declarations-modal
    :id="actions.id"
    ref="actionModal"
    @selected="_actionSelected"
    :declarations="_getActionDeclarations()"
  />
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import AddCommandButton from "@/components/AddCommandButton.vue";
import {Action, ActionList, Instruction} from "@/engine/Instruction";
import {InstructionDeclaration} from "@/model/InstructionDeclaration";
import InstructionDeclarationsModal from "@/components/hud/tab/rule/InstructionDeclarationsModal.vue";
import {InstructionValue} from "@/engine/instruction-value";
import {app} from "@/engine/app";
import {AddASTNodeCommand} from "@/model/commands/instruction/AddASTNodeCommand";
import InstructionRenderer from "@/components/hud/tab/rule/InstructionRenderer.vue";
import {ChangeInstructionValueCommand} from "@/model/commands/instruction/ChangeInstructionValueCommand";
import {actionDefinitions} from "@/engine/instruction-definitions";
import {getDefaultActions, InstructionToolbarAction} from "@/components/hud/tab/rule/InstructionToolbarUtil";

@Options({
  name: "ActionList",
  props: {
    actions: Object,
  },
  components: {
    AddCommandButton,
    InstructionDeclarationsModal,
    InstructionRenderer,
  },
})
export default class ActionPanel extends Vue {
  actions!: ActionList;

  addNewAction() {
    (this.$refs.actionModal as any).show();
  }

  _actionSelected(decl: InstructionDeclaration): void {
    const action = Instruction.createNewInstruction(Action, decl);
    app.undoManager.execute(new AddASTNodeCommand<Action>(this.actions, action));
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

  _getActionDeclarations(): Array<any> {
    return actionDefinitions;
  }

  getToolbarActions(instruction: Action): Array<InstructionToolbarAction> {
    return getDefaultActions(this.actions, instruction);
  }
}
</script>
