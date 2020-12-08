<template>
  <ul>
    <li
      v-for="description in agentDescriptions"
      :key="description.shapeName">
      <button @click="selectedAgentClass(description)">
        {{ description.shapeName }}
      </button>
    </li>
  </ul>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {AgentDescription} from "@/engine/agent/AgentDescription";
import {app} from "@/engine/app";
import {Disposable, Disposables} from "@/model/util/Disposable";

@Options({
  name: "AgentList",
  components: {},
})
export default class AddAgentShapeList extends Vue {
  private disposable: Disposable = new Disposables();
  agentDescriptions: Array<AgentDescription> = [];

  created() {
    this.disposable = app.undoManager.addListener(() => {
      console.log("undo listener notified");
      this.agentDescriptions = [...app.agentCube.repository.descriptions];
      console.log("this.agentDescriptions", this.agentDescriptions);
    });
  }

  selectedAgentClass(description: AgentDescription) {
    app.agentCube.selectedAgent = description;
  }

  destroyed() {
    console.log("component destroyed");
    this.disposable.dispose();
  }
}
</script>
