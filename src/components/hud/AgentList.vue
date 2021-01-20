<template>
  <shape-list :shapes="agentClasses" @shape-selected="agentSelected" @plus="createAgent"/>
  <new-agent-modal ref="newAgentModal" @agent-created="agentCrated"/>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {AgentClass} from "@/engine/agent/AgentClass";
import {app} from "@/engine/app";
import ShapeList from "@/components/hud/ShapeList.vue";
import {CreateAgentClass} from "@/model/commands/CreateAgentClass";
import NewAgentModal from "@/components/util/NewAgentModal.vue";
import {Shape} from "@/engine/Shape";
import {AgentRepository} from "@/engine/agent/AgentRepository";

@Options({
  name: "AgentList",
  components: {
    ShapeList,
    NewAgentModal,
  },
  emits: [
    "agent-clicked",
  ],
})
export default class AddAgentShapeList extends Vue {
  repo: AgentRepository = app.repository;
  uiState = app.uiState;

  get agentClasses(): Array<AgentClass> {
    console.log("get agentClass() => this.repo", this.repo);
    return this.repo.agentClasses;
  }

  createAgent() {
    (this.$refs.newAgentModal as NewAgentModal).show();
  }

  agentCrated(params: { shape: Shape; name: string }) {
    const shape = app.gallery?.findShape(params.shape.id);
    if (shape != null) {
      const desc = new AgentClass(shape, params.name);
      app.undoManager.execute(new CreateAgentClass(this.repo, desc));
      this.uiState.selectedAgentClass = desc;
    }
    this.$emit("agent-clicked");
  }

  agentSelected(description: AgentClass) {
    this.uiState.selectedAgentClass = description;
    this.$emit("agent-clicked");
  }
}
</script>
