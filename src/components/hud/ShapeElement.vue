<template>
  <button class="shape-element-button sizeable-ui-element" @click="click()">
    <img class="tool-icon" :src="shapeRef.shape.iconPath" :alt="shapeRef.shape.id">
  </button>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {ShapeRef} from "@/engine/Shape";

@Options({
  props: {
    // FIXME: Should be ShapeRef?
    shapeRef: Object,
  },
  emits: [
    "click",
  ],
})
export default class ShapeElement extends Vue {
  shapeRef!: ShapeRef;

  click() {
    this.$emit("click", this.shapeRef);
  }
}
</script>

<style>
</style>
