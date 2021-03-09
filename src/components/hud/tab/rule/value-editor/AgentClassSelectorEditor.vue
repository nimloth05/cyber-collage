<template>
  <img
    class="sizeable-ui-element"
    @click="openModal"
    :src="getShapePath()" :alt="getShapeId()"/>
  <agent-class-modal :id="id + '-agent-list'" ref="agentClassModal" @agent-clicked="agentSelected"/>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {Gallery} from "@/engine/Gallery";
import {AgentClassValue} from "@/engine/instruction-value";
import {app} from "@/engine/app";
import AgentClassModal from "@/components/util/AgentClassModal.vue";
import {AgentClass} from "@/engine/agent/AgentClass";

@Options({
  name: "ShapeEditor",
  props: {
    argument: AgentClassValue,
    readOnly: Boolean,
    id: String,
  },
  emits: [
    "arg-changed",
  ],
  components: {
    AgentClassModal,
  },
})
export default class ShapeEditor extends Vue {
  readOnly!: boolean;
  argument!: AgentClassValue;

  openModal(): void {
    if (this.readOnly) {
      return;
    }
    (this.$refs.agentClassModal as any).show();
  }

  getShapePath(): string {
    return Gallery.getShapePath(this.getShapeId());
  }

  getShapeId(): string {
    const agentClass = app.repository.getClass(this.argument.agentClassName);
    return agentClass != null ? agentClass.shape.id : "";
  }

  agentSelected(agentClass: AgentClass) {
    console.log("agentClass", agentClass);
    this.$emit("arg-changed", new AgentClassValue(agentClass.name));
  }
}
</script>
