<template>
  <div
    v-for="tool in tools"
    :key="tool.id"
    :value="tool.id"
    @click="selectTool(tool.id)"
    class="tool"
    :class="{ 'activeTool': selectedToolId === tool.id }"
  >
    <img class="tool-icon" :src="tool.icon" :alt="tool.name"/>
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
import {DesignToolbar} from "@/components/hud/tab/design/DesignToolbar";

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
.tool {
  display: inline-block;
  width: 5em;
  height: 5em;
  margin: 1rem;
}

.tool-icon {
  width: 100%;
  height: 100%;
}

.activeTool {
  border: 1px solid red;
}

</style>
