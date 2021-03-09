<template>
  <ul class="shape-list">
    <li
      v-for="shape in shapes"
      :key="shape.shape.id">
      <shape-element :shape-ref="shape" @click="shapeClicked(shape)"/>
    </li>
  </ul>
  <div class="text-end">
    <empty-shape-element v-if="showPlusButton" @click="plusClicked"/>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {ShapeRef} from "@/engine/Shape";
import ShapeElement from "@/components/hud/ShapeElement.vue";
import EmptyShapeElement from "@/components/hud/EmptyShapeElement.vue";

@Options({
  name: "ShapeList",
  components: {
    ShapeElement,
    EmptyShapeElement,
  },
  emits: [
    "shape-selected",
    "plus",
  ],
  props: {
    shapes: Array,
    showPlusButton: {
      type: Boolean,
      default: () => true,
    },
  },
})
export default class ShapeList extends Vue {
  shapes: Array<ShapeRef> = [];
  showPlusButton = true;

  shapeClicked(shape: ShapeRef): void {
    this.$emit("shape-selected", shape);
  }

  plusClicked(): void {
    this.$emit("plus");
  }
}
</script>

<style>
</style>
