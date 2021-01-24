<template>
  <instruction-renderer
    v-for="(action, index) in actions.instructionObjects"
    :key="index"
    :declaration="action.declaration"
    :argument-resolver="_argumentResolver(action)"
    @arg-changed="e => _updateArgument(action, e)"
  />
  <add-command-button @click="addNewAction"/>
  <action-modal :id="actions.id" ref="actionModal" @selected="_actionSelected"/>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import AddCommandButton from "@/components/AddCommandButton.vue";
import {Action, ActionList, Instruction} from "@/engine/Instruction";
import {InstructionDeclaration} from "@/model/InstructionDeclaration";
import ActionModal from "@/components/hud/tab/rule/ActionModal.vue";
import {DirectionValue, InstructionValue} from "@/engine/instruction-value";
import {app} from "@/engine/app";
import {AddASTNodeCommand} from "@/model/commands/instruction/AddASTNodeCommand";
import InstructionRenderer from "@/components/hud/tab/rule/InstructionRenderer.vue";
import {ChangeInstructionValueCommand} from "@/model/commands/instruction/ChangeInstructionValueCommand";

@Options({
  name: "ActionList",
  props: {
    actions: Object,
  },
  components: {
    AddCommandButton,
    ActionModal,
    InstructionRenderer,
  },
})
export default class ActionPanel extends Vue {
  actions!: ActionList;

  addNewAction() {
    (this.$refs.actionModal as ActionModal).show();
  }

  _actionSelected(decl: InstructionDeclaration): void {
    const action = new Action(decl, {
      direction: new DirectionValue([-1, 0]),
    });
    app.undoManager.execute(new AddASTNodeCommand<Action>(this.actions, action));
  }

  _openParameterDialog() {
    console.log("parameter dialog open");
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
}
</script>

<style lang="less">
.command {
  margin-left: 2rem;
  background-color: darkgray;
}
</style>
