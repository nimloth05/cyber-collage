<template>
  <div class="command-list"
       v-for="action in actions"
       :key="action.id">
    {{ action.name }}
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {ActionInstance} from "@/model/ActionInstance";

@Options({
  name: "ActionPanel",
  props: {
    actions: Array,
  },
})
export default class ActionPanel extends Vue {
  actions!: Array<ActionInstance>;
}
</script>
