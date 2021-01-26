<template>
  <div
    class="hud"
    :class="{'hud-small': isDesignTabActive, 'hud-big': !isDesignTabActive}"
  >
    <div style="display: flex">
      <shape-element
        id="current-agent"
        v-if="selectedAgentClass != null"
        :shape-ref="selectedAgentClass"
        @click="openAgentClassModal"
      />
      <empty-shape-element
        id="current-agent"
        v-if="selectedAgentClass == null"
        @click="openAgentClassModal"/>
      <tab-header v-model="selectedTab"/>
    </div>
    <agent-class-modal ref="agentClassModal"/>
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
import AgentClassModal from "@/components/util/AgentClassModal.vue";
import {app} from "@/engine/app";
import ShapeModal from "@/components/util/ShapeModal.vue";

@Options({
  name: "HUD",
  components: {
    ShapeList,
    AgentList,
    TabHeader,
    TabContainer,
    EmptyShapeElement,
    ShapeElement,
    AgentClassModal,
    ShapeModal,
  },
})
export default class HUD extends Vue {
  toggle = false;
  uiState = app.uiState;
  selectedTab = "design";

  get selectedAgentClass() {
    return this.uiState.selectedAgentClass;
  }

  openAgentClassModal() {
    (this.$refs.agentClassModal as any).show();
  }

  get isDesignTabActive() {
    return this.selectedTab === "design";
  }
}
</script>
