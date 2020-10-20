<template>
  <div class="command"
       v-for="action in actions"
       :key="action.id">
    {{ action.name }}
  </div>
  <add-command-button @click="addNewAction"/>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {ActionInstance} from "@/model/ActionInstance";
import AddCommandButton from "@/components/AddCommandButton.vue";

@Options({
  name: "ActionList",
  props: {
    actions: Array,
  },
  components: {
    AddCommandButton,
  },
})
export default class ActionPanel extends Vue {
  actions!: Array<ActionInstance>;

  addNewAction() {
    this.actions.push(new ActionInstance("make sound"));
  }
}
</script>

<style lang="less">
.command {
  margin-left: 2rem;
  background-color: darkgray;
}
</style>
