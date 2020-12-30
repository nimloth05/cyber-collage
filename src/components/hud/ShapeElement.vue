<template>
  <button @click="click()">
    <img :src="shapeRef.shape.iconPath" :alt="shapeRef.shape.id" width="64" height="64">
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
