<template>
  <div
    v-for="tool in tools"
    :key="tool.id"
    :value="tool.id"
    @click="selectedToolId = tool.id"
    :class="selectedToolId === tool.id ? 'activeTool': ''"
  >
    <img :src="tool.icon"/>
  </div>
  <!--  <select id="tool-mode" v-model="selectedToolId" name="agent-menu">-->
  <!--    <option-->
  <!--      v-for="tool in tools"-->
  <!--      :key="tool.id"-->
  <!--      :value="tool.id"-->
  <!--      :style="'background-image: url(/'+tool.icon+')'"-->
  <!--    >-->
  <!--      {{ tool.name }}-->
  <!--    </option>-->
  <!--  </select>-->
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
  uiState = app.uiState;
  selectedToolId = this.uiState.selectedTool.id;

  get tools() {
    return app.designToolbar.getTools();
  }

  getLabel(toolId: string) {
    return app.designToolbar.getTool(toolId).name;
  }
}
</script>

<style>
.activeTool {
  border: 1px solid red;
}
</style>
