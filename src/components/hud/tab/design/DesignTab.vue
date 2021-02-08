<template>
  <div class="design-tab-content">
    <button
      class="btn tool sizeable-ui-element"
      :class="{ 'activeTool': selectedToolId === tool.id }"
      v-for="tool in tools"
      :key="tool.id"
      :value="tool.id"
      @click="selectTool(tool.id)"
      :title="tool.name"
    >
      <img class="tool-icon" :src="tool.icon" :alt="tool.name"/>
    </button>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {app} from "@/engine/app";

@Options({
  name: "DesignTab",
  emits: [],
  // watch: {
  //   selectedToolId(newValue: string, oldValue: string): void {
  //     this.uiState.selectedTool = this.toolbar.getTool(newValue);
  //     this.uiState.selectedTool.selected(previousId);
  //   },
  // },
})
export default class TabContainer extends Vue {
  uiState = app.uiState;
  toolbar = app.toolbar;

  // selectedToolId = this.uiState.selectedTool.id;

  get tools() {
    return this.toolbar.getTools();
  }

  getLabel(toolId: string) {
    return this.toolbar.getTool(toolId).name;
  }

  get selectedToolId(): string {
    return this.uiState.selectedTool.id;
  }

  selectTool(id: string) {
    const previousId = this.selectedToolId;
    this.uiState.selectedTool = this.toolbar.getTool(id);
    this.uiState.selectedTool.selected(previousId);
  }
}
</script>

<style>

</style>
