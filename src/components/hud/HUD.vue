<template>
  <div class="hud">
    <div style="display: flex">
      <shape-element
        v-if="uiState.selectedAgentClass != null"
        :shape-ref="uiState.selectedAgentClass"
        @click="openAgentClassModal"
      />
      <empty-shape-element v-if="uiState.selectedAgentClass == null"
                           @click="openAgentClassModal"/>
      <button @click="undo">
        Undo
      </button>
      <button @click="redo">
        Redo
      </button>
      <tab-header v-model="selectedTab"/>
    </div>
    <modal ref="agentClassModal"/>
    <tab-container :selected-tab-id="selectedTab"/>
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
  selectedTab = "design";

  openAgentClassModal() {
    (this.$refs.agentClassModal as Modal).show();
  }

  undo() {
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
  top: calc(100% - 300px);
  /*top: 500px;*/
  /*bottom: 300px;*/
  height: 300px;
  /*background-color: #d3d3d3;*/
  background-color: #b5b5b5;
}
</style>
