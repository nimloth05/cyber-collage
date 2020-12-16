<template>
  <div class="hud">
    <div style="display: flex">
      <button @click='switchToggle'>
        Agent selektieren
      </button>
      <agent-list v-if="toggle" @click="agentListClick"/>
      <button @click="undo">
        Undo
      </button>
      <button @click="redo">
        Redo
      </button>
      <tab-header/>
    </div>
    <tab-container/>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import ShapeList from "@/components/hud/ShapeList.vue";
import AgentList from "@/components/hud/AgentList.vue";
import TabHeader from "./tab/TabHeader.vue";
import TabContainer from "./tab/TabContainer.vue";
import {app} from "@/engine/app";
import {WORLD_CONTEXT_ID} from "@/model/Commands";

@Options({
  name: "HUD",
  components: {
    ShapeList,
    AgentList,
    TabHeader,
    TabContainer,
  },
})
export default class HUD extends Vue {
  toggle = false;

  switchToggle() {
    this.toggle = !this.toggle;
    console.log("button clicked, current toggle state", this.toggle);
  }

  agentListClick() {
    this.toggle = false;
  }

  undo() {
    console.log("UndoManager");
    app.undoManager.undo(WORLD_CONTEXT_ID);
  }

  redo() {
    app.undoManager.redo(WORLD_CONTEXT_ID);
  }
}
</script>

<style>
.hud {
  position: relative;
  top: calc(100% - 200px);
  height: 200px;
  /*background-color: #d3d3d3;*/
  background-color: #b5b5b5;
}
</style>
