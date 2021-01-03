<template>
  <div class="command"
       v-for="(action, index) in actions.instructionObjects"
       :key="index">
    {{ action.name }}
  </div>
  <add-command-button @click="addNewAction"/>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {ActionInstance} from "@/model/ActionInstance";
import AddCommandButton from "@/components/AddCommandButton.vue";
import {Action, ActionList} from "@/engine/Instruction";
import {instructionDefinitions} from "@/engine/instruction-definitions";

@Options({
  name: "ActionList",
  props: {
    actions: Object,
  },
  components: {
    AddCommandButton,
  },
})
export default class ActionPanel extends Vue {
  actions!: ActionList;

  addNewAction() {
    this.actions.instructionObjects.push(new Action(instructionDefinitions[2], {}));
    // this.actions.push(new ActionInstance("make sound"));
  }
}
</script>

<style lang="less">
.command {
  margin-left: 2rem;
  background-color: darkgray;
}
</style>
