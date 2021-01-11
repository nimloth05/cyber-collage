<template>
  <div
    v-for="tool in tools"
    :key="tool.id"
    :value="tool.id"
    @click="selectedToolId = tool.id"
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
  watch: {
    selectedToolId(): void {
      this.uiState.selectedTool = this.toolbar.getTool(this.selectedToolId);
    },
  },
})
export default class TabContainer extends Vue {
  toolbar = new DesignToolbar();
  uiState = app.uiState;
  selectedToolId = this.uiState.selectedTool.id;

  get tools() {
    return this.toolbar.getTools();
  }

  getLabel(toolId: string) {
    return this.toolbar.getTool(toolId).name;
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
