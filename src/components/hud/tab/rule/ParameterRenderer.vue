<template>
    <img
      class="sizeable-ui-element"
      v-if="isDirectionValue" @click="changeDirectionValue"
         :src="'icons/instructions/parameters/' + getDirectionValueImage()" :alt="getDirectionValueImage()"/>
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
  emits: [
    "arg-changed",
  ],
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
    const directionValue = this.argument as DirectionValue;
    let newValue: DirectionValue | undefined;
    if (directionValue.test[0] === 1 && directionValue.test[1] === 0) {
      // directionValue.test = ; // next is right
      newValue = new DirectionValue([0, 1]);
    } else if (directionValue.test[0] === 0 && directionValue.test[1] === 1) {
      // directionValue.test = [-1, 0]; // next is down
      newValue = new DirectionValue([-1, 0]);
    } else if (directionValue.test[0] === -1 && directionValue.test[1] === 0) {
      // directionValue.test = [0, -1]; // next is left
      newValue = new DirectionValue([0, -1]);
    } else if (directionValue.test[0] === 0 && directionValue.test[1] === -1) {
      // directionValue.test = [1, 0]; // next is up
      newValue = new DirectionValue([1, 0]);
    }

    if (newValue !== undefined) {
      this.$emit("arg-changed", newValue);
    }
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
