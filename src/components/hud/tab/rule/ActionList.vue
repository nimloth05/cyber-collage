<template>
  <div class="command"
       v-for="(action, index) in actions.instructionObjects"
       :key="index">
    {{ action.name }}
  </div>
  <add-command-button @click="addNewAction"/>
  <action-modal :id="actions.id" ref="actionModal" @selected="_actionSelected"/>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import AddCommandButton from "@/components/AddCommandButton.vue";
import {Action, ActionList, Condition} from "@/engine/Instruction";
import {InstructionDeclaration} from "@/model/InstructionDeclaration";
import ActionModal from "@/components/hud/tab/rule/ActionModal.vue";
import {DirectionValue} from "@/engine/instruction-value";
import {app} from "@/engine/app";
import {AddASTNodeCommand} from "@/model/commands/instruction/AddASTNodeCommand";

@Options({
  name: "ActionList",
  props: {
    actions: Object,
  },
  components: {
    AddCommandButton,
    ActionModal,
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
}
</script>

<style lang="less">
.command {
  margin-left: 2rem;
  background-color: darkgray;
}
</style>
