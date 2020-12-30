<template>
  <div class="hud">
    <div style="display: flex">
      <shape-element v-if="uiState.selectedAgentClass != null" :shape-ref="uiState.selectedAgentClass"
                     @click="openAgentClassModal"/>
      <empty-shape-element v-if="uiState.selectedAgentClass == null"
                           @click="openAgentClassModal"/>
      <agent-list v-if="toggle" @click="agentListClick"/>
      <button @click="undo">
        Undo
      </button>
      <button @click="redo">
        Redo
      </button>
      <tab-header/>
    </div>
    <modal ref="agentClassModal"/>
    <tab-container/>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import ShapeList from "@/components/hud/ShapeList.vue";
import AgentList from "@/components/hud/AgentList.vue";
import EmptyShapeElement from "@/components/hud/EmptyShapeElement.vue";
import ShapeElement from "@/components/hud/ShapeElement.vue";
import TabHeader from "./tab/TabHeader.vue";
import TabContainer from "./tab/TabContainer.vue";
import Modal from "@/components/util/Modal.vue";
import {app} from "@/engine/app";
import {WORLD_CONTEXT_ID} from "@/model/Commands";

@Options({
  name: "HUD",
  components: {
    ShapeList,
    AgentList,
    TabHeader,
    TabContainer,
    Modal,
    EmptyShapeElement,
    ShapeElement,
  },
})
export default class HUD extends Vue {
  toggle = false;
  uiState = app.uiState;

  switchToggle() {
    this.toggle = !this.toggle;
    console.log("button clicked, current toggle state", this.toggle);
  }

  agentListClick() {
    this.toggle = false;
  }

  openAgentClassModal() {
    (this.$refs.agentClassModal as Modal).show();
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
