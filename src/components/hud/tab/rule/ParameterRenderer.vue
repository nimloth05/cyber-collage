<template>
  <component :is="valueEditor" @arg-changed="onArgChanged" v-bind="currentProperties"/>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {
  AgentClassValue,
  DirectionValue,
  InstructionValue,
  ShapeNameValue,
  SoundValue,
} from "@/engine/instruction-value";
import DirectionValueEditor from "@/components/hud/tab/rule/value-editor/DirectionValueEditor.vue";
import ShapeEditor from "@/components/hud/tab/rule/value-editor/ShapeEditor.vue";
import FormulaEditor from "@/components/hud/tab/rule/value-editor/FormulaEditor.vue";
import AgentClassSelectorEditor from "@/components/hud/tab/rule/value-editor/AgentClassSelectorEditor.vue";
import SoundValueEditor from "@/components/hud/tab/rule/value-editor/SoundValueEditor.vue";

@Options({
  name: "ParameterRenderer",
  props: {
    param: /* ParameterType */ Function,
    argument: InstructionValue,
    id: String,
    readOnly: Boolean,
  },
  emits: [
    "arg-changed",
  ],
  components: {
    DirectionValueEditor,
    ShapeEditor,
    FormulaEditor,
    AgentClassSelectorEditor,
    SoundValueEditor,
  },
})
export default class ParameterRenderer extends Vue {
  param!: Function;
  argument!: InstructionValue;
  readOnly!: boolean;
  id!: string;

  // FIXME: Use table for paramType -> Editor matching

  get valueEditor(): string {
    if (this.isDirectionValue()) {
      return "DirectionValueEditor";
    }
    if (this.isShapeValue()) {
      return "ShapeEditor";
    }
    if (this.paramTypeName === "FormulaValue") {
      return "FormulaEditor";
    }
    if (this.paramTypeName === AgentClassValue.name) {
      return "AgentClassSelectorEditor";
    }
    if (this.paramTypeName === SoundValue.name) {
      return "SoundValueEditor";
    }
    console.warn("Could not find matching editor: ", this.paramTypeName);
    return "";
  }

  get currentProperties(): object {
    return {
      readOnly: this.readOnly,
      argument: this.argument,
      id: this.id,
    };
  }

  get paramTypeName(): string {
    if (typeof this.param !== "function") {
      return "<unknown>";
    }

    // Param should be a constructor function and so it must have a name.
    return this.param.name;
  }

  isDirectionValue(): boolean {
    return this.paramTypeName === DirectionValue.name;
  }

  isShapeValue(): boolean {
    return this.paramTypeName === ShapeNameValue.name;
  }

  onArgChanged(event: any) {
    console.log("arg changed on proxy");
    this.$emit("arg-changed", event);
  }
}
</script>
