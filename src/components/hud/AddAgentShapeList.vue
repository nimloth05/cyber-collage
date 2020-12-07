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
import {Options, Vue} from "vue-class-component";
import {app} from "@/engine/app";
import {AddAgentToWorldCommand} from "@/model/commands/AddAgentToWorld";
import {AgentFactory} from "@/model/Commands";
import {GridVector} from "@/model/util/GridVector";

@Options({
  name: "AddAgentShapeList",
  components: {},
})
export default class AddAgentShapeList extends Vue {
  shapes: Array<Shape> = [];

  created() {
    this.shapes = app.gallery?.shapes;
  }

  addAgent(shape: Shape): void {
    const agent = AgentFactory.createAgent(shape.name, shape.name);
    app.undoManager.execute(new AddAgentToWorldCommand(agent, new GridVector(0, 0, 0)));
    this.$emit("agent-created");
  }
}
</script>
