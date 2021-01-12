<template>
  <shape-list :shapes="agentClasses" @shape-selected="agentSelected" @plus="createAgent"/>
  <new-agent-modal ref="newAgentModal" @agent-created="agentCrated"/>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {AgentDescription} from "@/engine/agent/AgentDescription";
import {app} from "@/engine/app";
import {Disposable, Disposables} from "@/model/util/Disposable";
import ShapeList from "@/components/hud/ShapeList.vue";
import {CreateAgentClass} from "@/model/commands/CreateAgentClass";
import NewAgentModal from "@/components/util/NewAgentModal.vue";
import {Shape} from "@/engine/Shape";

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
  private disposable: Disposable = new Disposables();
  agentClasses: Array<AgentDescription> = [];
  uiState = app.uiState;

  created() {
    this.disposable = app.undoManager.addListener(() => {
      this.agentClasses = [...app.repository.descriptions];
    });

    this.agentClasses = [...app.repository.descriptions];
  }

  createAgent() {
    (this.$refs.newAgentModal as NewAgentModal).show();
  }

  agentCrated(params: { shape: Shape; name: string }) {
    console.log("agent created");
    const shape = app.gallery?.findShape(params.shape.id);
    if (shape != null) {
      const desc = new AgentDescription(shape, params.name);
      app.undoManager.execute(new CreateAgentClass(app.repository, desc));
      this.uiState.selectedAgentClass = desc;
    }
    this.$emit("agent-clicked");
  }

  agentSelected(description: AgentDescription) {
    this.uiState.selectedAgentClass = description;
    this.$emit("agent-clicked");
    this.$forceUpdate();
  }

  unmounted() {
    console.log("component destroyed");
    this.disposable.dispose();
  }
}
</script>
