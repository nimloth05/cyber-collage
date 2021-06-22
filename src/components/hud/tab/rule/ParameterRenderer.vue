<template>
  <component :is="valueEditor" @arg-changed="onArgChanged" v-bind="currentProperties"/>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {
  AbstractStringListValue,
  AgentClassValue,
  DirectionValue,
  FormulaValue,
  InstructionValue,
  OperatorValue,
  ShapeNameValue,
  SoundValue,
} from "@/engine/instruction-value";
import DirectionValueEditor from "@/components/hud/tab/rule/value-editor/DirectionValueEditor.vue";
import ShapeEditor from "@/components/hud/tab/rule/value-editor/ShapeEditor.vue";
import FormulaEditor from "@/components/hud/tab/rule/value-editor/FormulaEditor.vue";
import AgentClassSelectorEditor from "@/components/hud/tab/rule/value-editor/AgentClassSelectorEditor.vue";
import SoundValueEditor from "@/components/hud/tab/rule/value-editor/SoundValueEditor.vue";
import OperatorEditor from "@/components/hud/tab/rule/value-editor/OperatorEditor.vue";
import ListSelectionEditorWrapper from "@/components/hud/tab/rule/value-editor/ListSelectionEditorWrapper.vue";

const value2Editor = {
  [DirectionValue.name]: "DirectionValueEditor",
  [ShapeNameValue.name]: "ShapeEditor",
  [FormulaValue.name]: "FormulaEditor",
  [AgentClassValue.name]: "AgentClassSelectorEditor",
  [SoundValue.name]: "SoundValueEditor",
  [OperatorValue.name]: "OperatorEditor",
};

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
    OperatorEditor,
    ListSelectionEditorWrapper,
  },
})
export default class ParameterRenderer extends Vue {
  param!: Function;
  argument!: InstructionValue;
  readOnly!: boolean;
  id!: string;

  get valueEditor(): string {
    if (this.param instanceof DirectionValue) {
      return "DirectionValueEditor";
    }

    // eslint-disable-next-line
    if (AbstractStringListValue.isPrototypeOf(this.param)) {
      return "ListSelectionEditorWrapper";
    }

    const value = value2Editor[this.paramTypeName];
    if (value == null) {
      console.warn("Could not find matching editor: ", this.paramTypeName);
      return "";
    }
    return value;
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

  get paramType(): Function {
    return this.param;
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
