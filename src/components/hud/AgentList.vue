<template>
  <shape-list :shapes="agentClasses" @shape-selected="agentSelected" @plus="createAgent"/>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {AgentDescription} from "@/engine/agent/AgentDescription";
import {app} from "@/engine/app";
import {Disposable, Disposables} from "@/model/util/Disposable";
import ShapeList from "@/components/hud/ShapeList.vue";
import {CreateAgentClass} from "@/model/commands/CreateAgentClass";

@Options({
  name: "AgentList",
  components: {
    ShapeList,
  },
})
export default class AddAgentShapeList extends Vue {
  private disposable: Disposable = new Disposables();
  agentClasses: Array<AgentDescription> = [];

  created() {
    this.disposable = app.undoManager.addListener(() => {
      this.agentClasses = [...app.repository.descriptions];
    });

    this.agentClasses = [...app.repository.descriptions];
  }

  createAgent() {
    const retVal = prompt("Enter ShapeName", "chicken");
    if (retVal == null) {
      return;
    }
    const shape = app.gallery?.findShape(retVal);
    if (shape != null) {
      app.undoManager.execute(new CreateAgentClass(app.repository, new AgentDescription(shape)));
    }
  }

  agentSelected(description: AgentDescription) {
    app.agentCube.selectedAgent = description;
  }

  unmounted() {
    console.log("component destroyed");
    this.disposable.dispose();
  }
}
</script>
