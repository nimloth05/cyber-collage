<template>
  <shape-list :shapes="agentClasses" @shape-selected="agentSelected" :show-plus-button="false" @plus="createAgent"/>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {AgentClass} from "@/engine/agent/AgentClass";
import {app} from "@/engine/app";
import ShapeList from "@/components/hud/ShapeList.vue";
import NewAgentModal from "@/components/util/NewAgentModal.vue";
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

  get agentClasses(): Array<AgentClass> {
    return this.repo.agentClasses;
  }

  createAgent() {
    (this.$refs.newAgentModal as NewAgentModal).show();
  }

  isEmpty(): boolean {
    return this.repo.agentClasses.length === 0;
  }

  agentSelected(description: AgentClass) {
    this.$emit("agent-clicked", description);
  }
}
</script>
