<template>
  <div class="modal fade agent-class-modal" id="agent-combined-modal" tabindex="-1"
       aria-labelledby="agent-combined-modal"
       aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">
          <h5 v-if="hasAgents()">Agenten</h5>
          <agent-list ref="agentList" @agent-clicked="agentSelected"/>
          <hr v-if="hasAgents()"/>
          <h5 class="mt-4">Neuer Agent erstellen</h5>
          <div class="mb-4">
            <input v-model="agentName" placeholder="Agenten-Klassennamen"/>
          </div>
          <shape-list :show-plus-button="false" :shapes="shapeList" @shape-selected="shapeSelected"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">

import {ShapeRef} from "@/engine/Shape";
import {Options, Vue} from "vue-class-component";
import {Modal as BModal} from "bootstrap";
import {app} from "@/engine/app";
import ShapeList from "@/components/hud/ShapeList.vue";
import AgentList from "@/components/hud/AgentList.vue";
import {AgentClass} from "@/engine/agent/AgentClass";
import {CreateAgentClass} from "@/model/commands/CreateAgentClass";
import {AgentRepository} from "@/engine/agent/AgentRepository";

@Options({
  name: "AgentCombinedModal",
  components: {
    ShapeList,
    AgentList,
  },
  emits: [
    "agent-created",
  ],
})
export default class AgentCombinedModal extends Vue {
  agentName = "";
  shapeList: Array<ShapeRef> = [];
  repo: AgentRepository = app.repository;
  uiState = app.uiState;

  private _instance?: BModal;

  get modalInstance() {
    return this._instance != null ? this._instance : new BModal(document.getElementById("agent-combined-modal")!);
  }

  hide() {
    this.modalInstance.hide();
  }

  agentSelected(agentClass: AgentClass) {
    this.uiState.selectedAgentClass = agentClass;
    this.hide();
  }

  show() {
    // Since we have lazy init of the gallery we cannot initialize the field during construction phase
    this.shapeList = Object.values(app.gallery!.shapes).map(shape => ({shape}));
    this.agentName = "";
    this.modalInstance.show();
  }

  shapeSelected(shapeRef: ShapeRef): void {
    if (this.agentName === "") {
      this.agentName = shapeRef.shape.id; // FIXME: Check if an agent with this name already exists and if so, change name to "${shape.id}-${agentCount + 1}"
    }

    const desc = new AgentClass(shapeRef.shape, this.agentName);
    app.undoManager.execute(new CreateAgentClass(this.repo, desc));
    this.uiState.selectedAgentClass = desc;
    this.hide();
  }

  hasAgents(): boolean {
    const agentList: any = this.$refs.agentList;
    if (agentList == null) {
      return false;
    }
    return !agentList.isEmpty();
  }
}

</script>
