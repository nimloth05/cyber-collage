<template>
  <div class="btn instruction" @click="e => $emit('click', e)">
    <img v-if="declaration.icon != null" class="sizeable-ui-element" :src="declaration.icon"
         :alt="declaration.name"/>
    <span v-if="declaration.icon == null">{{ declaration.name }}</span>
    <div class="argument">
      <parameter-renderer
        v-for="([name, paramType]) in parameters"
        :key="name"
        :param="paramType"
        :argument="getArgumentValue(name, paramType)"
        :id="getEditorId(name)"
        :read-only="readOnly"
        @arg-changed="v => setArgumentValue(name, v)"
      />
    </div>
  </div>
</template>

<script lang="ts">

import {Options, Vue} from "vue-class-component";
import ParameterRenderer from "./ParameterRenderer.vue";
import {InstructionDeclaration, ParameterType} from "@/model/InstructionDeclaration";
import {InstructionValue} from "@/engine/instruction-value";

@Options({
  name: "InstructionRenderer",
  props: {
    declaration: /* InstructionDeclaration */ Object,
    argumentResolver: Function,
    readOnly: Boolean,
    id: String,
  },
  emits: [
    "click",
    "arg-changed",
  ],
  components: {
    ParameterRenderer,
  },
})
export default class InstructionRenderer extends Vue {
  declaration!: InstructionDeclaration;
  argumentResolver!: (name: string, type: ParameterType) => InstructionValue;
  readOnly = true;
  id!: string;

  get parameters(): Array<[string, ParameterType]> {
    return Object.entries(this.declaration.parameters);
  }

  getArgumentValue(name: string, type: ParameterType): InstructionValue {
    if (this.argumentResolver === null) {
      throw new Error("ArgumentResolver not provided");
    }
    return this.argumentResolver(name, type);
  }

  setArgumentValue(name: string, value: InstructionValue): void {
    this.$emit("arg-changed", {name, value});
  }

  getEditorId(name: string): string {
    return `${this.id}-${name}-param-renderer`;
  }
}
</script>
