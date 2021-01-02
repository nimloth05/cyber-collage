<template>
  <button class="shape-element-button" @click="click()">
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

<style>
.shape-element-button {
  width: 64px;
  height: 64px;
  border: none;
  margin-bottom: 0.5em;
  font-size: 250%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  border-radius: 50%
}

.shape-element-button:hover {
  box-shadow: 0 0 10px rgba(0, 200, 200, 0.5);
}

</style>
