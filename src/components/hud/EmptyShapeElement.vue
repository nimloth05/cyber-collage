<template>
  <button @click="plusClicked" style="width: 64px; height: 64px">+</button>
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
