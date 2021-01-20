<template>
  <div class="hud">
    <div style="display: flex">
      <shape-element
        v-if="selectedAgentClass != null"
        :shape-ref="selectedAgentClass"
        @click="openAgentClassModal"
      />
      <empty-shape-element v-if="selectedAgentClass == null"
                           @click="openAgentClassModal"/>
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

  get selectedAgentClass() {
    return this.uiState.selectedAgentClass;
  }

  openAgentClassModal() {
    (this.$refs.agentClassModal as Modal).show();
  }
}
</script>
