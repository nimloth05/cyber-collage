<template>
  <label for="tool-mode"> tool: </label>
  <select id="tool-mode" v-model="selectedToolId" name="agent-menu">
    <option
      v-for="toolId in tools"
      :key="toolId"
      :value="toolId"
    >
      {{ getLabel(toolId) }}
    </option>
  </select>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {app} from "@/engine/app";

@Options({
  name: "DesignTab",
  emits: [],
  watch: {
    selectedToolId(): void {
      this.uiState.selectedTool = app.designToolbar.getTool(this.selectedToolId);
    },
  },
})
export default class TabContainer extends Vue {
  selectedToolId = "";
  uiState = app.uiState;

  get tools() {
    return app.designToolbar.getIds();
  }

  getLabel(toolId: string) {
    return app.designToolbar.getTool(toolId).name;
  }
}
</script>
