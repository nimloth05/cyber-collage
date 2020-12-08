<template>
  <ul style="position: absolute; bottom: 100%">
    <li
      v-for="shape in shapes"
      :key="shape.name">
      <button @click="addAgent(shape)">
        {{ shape.name }}
      </button>
    </li>
  </ul>
</template>

<script lang="ts">
import {values} from "lodash";
import {Options, Vue} from "vue-class-component";
import {app} from "@/engine/app";
import {Shape} from "@/engine/Shape";
import {CreateAgentClass} from "@/model/commands/CreateAgentClass";
import {AgentDescription} from "@/engine/agent/AgentDescription";

@Options({
  name: "AddAgentShapeList",
  components: {},
})
export default class AddAgentShapeList extends Vue {
  shapes: Array<Shape> = [];

  created() {
    this.shapes = values(app.gallery?.shapes);
  }

  addAgent(shape: Shape): void {
    app.undoManager.execute(new CreateAgentClass(app.agentCube, new AgentDescription(shape.name)));
    this.$emit("agent-created");
  }
}
</script>
