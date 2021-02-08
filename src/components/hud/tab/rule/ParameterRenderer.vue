<template>
  <img
    class="sizeable-ui-element"
    v-if="isDirectionValue()" @click="changeDirectionValue"
    :src="'img/instructions/parameters/' + getDirectionValueImage()" :alt="getDirectionValueImage()"/>
  <img
    class="sizeable-ui-element"
    v-if="isShapeValue()" @click="changeShapeValue"
    :src="getShapePath()" :alt="getShapeId()"/>
  <shape-modal v-if="isShapeValue()" :id="id + '-shape-modal'" ref="shapeModal" @shape-selected="shapeSelected"/>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {DirectionValue, InstructionValue, ShapeNameValue} from "@/engine/instruction-value";
import ShapeModal from "@/components/util/ShapeModal.vue";
import {Gallery} from "@/engine/Gallery";

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
    ShapeModal,
  },
})
export default class ParameterRenderer extends Vue {
  param!: Function;
  argument!: InstructionValue;
  readOnly!: boolean;

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

  changeDirectionValue() {
    if (this.readOnly) {
      return;
    }

    const directionValue = this.argument as DirectionValue;
    let newValue: DirectionValue | undefined;
    if (directionValue.row === 1 && directionValue.column === 0) {
      newValue = new DirectionValue(1, 1);
    } else if (directionValue.row === 1 && directionValue.column === 1) {
      newValue = new DirectionValue(0, 1);
    } else if (directionValue.row === 0 && directionValue.column === 1) {
      newValue = new DirectionValue(-1, 1);
    } else if (directionValue.row === -1 && directionValue.column === 1) {
      newValue = new DirectionValue(-1, 0);
    } else if (directionValue.row === -1 && directionValue.column === 0) {
      newValue = new DirectionValue(-1, -1);
    } else if (directionValue.row === -1 && directionValue.column === -1) {
      newValue = new DirectionValue(0, -1);
    } else if (directionValue.row === 0 && directionValue.column === -1) {
      newValue = new DirectionValue(1, -1);
    } else if (directionValue.row === 1 && directionValue.column === -1) {
      newValue = new DirectionValue(1, 0);
    }

    if (newValue !== undefined) {
      this.$emit("arg-changed", newValue);
    }
  }

  getDirectionValueImage(): string {
    const directionValue = this.argument as DirectionValue;
    if (directionValue.row === 1 && directionValue.column === 0) {
      return "arrow-up.svg";
    } else if (directionValue.row === 1 && directionValue.column === 1) {
      return "arrow-north-east.svg";
    } else if (directionValue.row === 0 && directionValue.column === 1) {
      return "arrow-right.svg";
    } else if (directionValue.row === -1 && directionValue.column === 1) {
      return "arrow-south-east.svg";
    } else if (directionValue.row === -1 && directionValue.column === 0) {
      return "arrow-down.svg";
    } else if (directionValue.row === -1 && directionValue.column === -1) {
      return "arrow-south-west.svg";
    } else if (directionValue.row === 0 && directionValue.column === -1) {
      return "arrow-left.svg";
    } else if (directionValue.row === 1 && directionValue.column === -1) {
      return "arrow-north-west.svg";
    }
    return "arrow-left.svg";
  }

  isShapeValue(): boolean {
    return this.paramTypeName === ShapeNameValue.name;
  }

  changeShapeValue(): void {
    if (this.readOnly
    ) {
      return;
    }
    (this.$refs.shapeModal as any).show();
  }

  getShapePath(): string {
    return Gallery.getShapePath(this.getShapeId());
  }

  getShapeId(): string {
    const value = this.argument as ShapeNameValue;
    return value.shapeId;
  }

  shapeSelected(shapeId: string) {
    console.log("shapeId", shapeId);
    this.$emit("arg-changed", new ShapeNameValue(shapeId));
  }
}
</script>
