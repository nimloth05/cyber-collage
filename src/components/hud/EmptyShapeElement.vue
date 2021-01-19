<template>
  <button
    @click="plusClicked"
    class="shape-element-button sizeable-ui-element"
  >
    +
  </button>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";

@Options({
  name: "EmptyShapeElement",
  emits: [
    "plus",
  ],
  props: {
    shapes: Array,
  },
})
export default class EmptyShapeElement extends Vue {
  plusClicked(): void {
    this.$emit("plus");
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
