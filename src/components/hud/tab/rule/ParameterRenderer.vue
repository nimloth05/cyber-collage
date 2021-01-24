<template>
  <span v-if="isDirectionValue" @click="changeDirectionValue">
    <img :src="'icons/instructions/parameters/' + getDirectionValueImage()" :alt="getDirectionValueImage()"/>
  </span>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {DirectionValue, InstructionValue} from "@/engine/instruction-value";

@Options({
  name: "ParameterRenderer",
  props: {
    param: /* ParameterType */ Function,
    argument: InstructionValue,
  },
})
export default class ParameterRenderer extends Vue {
  param!: Function;
  argument!: InstructionValue;

  get paramTypeName(): string {
    if (typeof this.param !== "function") {
      return "<unknown>";
    }

    // Param should be a constructor function and so it must have a name.
    return this.param.name;
  }

  get isDirectionValue(): boolean {
    return this.paramTypeName === "DirectionValue";
  }

  changeDirectionValue() {
    console.log("change direction value");
    const directionValue = this.argument as DirectionValue;
    if (directionValue.test[0] === 1 && directionValue.test[1] === 0) {
      directionValue.test = [0, 1]; // next is right
    } else if (directionValue.test[0] === 0 && directionValue.test[1] === 1) {
      directionValue.test = [-1, 0]; // next is down
    } else if (directionValue.test[0] === -1 && directionValue.test[1] === 0) {
      directionValue.test = [0, -1]; // next is left
    } else if (directionValue.test[0] === 0 && directionValue.test[1] === -1) {
      directionValue.test = [1, 0]; // next is up
    }
    // this.$emit("update:modelValue", value);
  }

  getDirectionValueImage(): string {
    const directionValue = this.argument as DirectionValue;
    if (directionValue.test[0] === 1 && directionValue.test[1] === 0) {
      return "arrow-up.svg";
    } else if (directionValue.test[0] === 0 && directionValue.test[1] === 1) {
      return "arrow-right.svg";
    } else if (directionValue.test[0] === -1 && directionValue.test[1] === 0) {
      return "arrow-down.svg";
    } else if (directionValue.test[0] === 0 && directionValue.test[1] === -1) {
      return "arrow-left.svg";
    }
    return "arrow-down.svg";
  }
}
</script>
