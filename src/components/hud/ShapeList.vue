<template>
  <ul class="shape-list">
    <li>
      <button @click="plusClicked" style="width: 64px; height: 64px">+</button>
    </li>
    <li
      v-for="shape in shapes"
      :key="shape.shape.id">
      <shape-element :shape-ref="shape" @click="shapeClicked(shape)"/>
    </li>
  </ul>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {ShapeRef} from "@/engine/Shape";
import ShapeElement from "@/components/hud/ShapeElement.vue";

@Options({
  name: "ShapeList",
  components: {
    ShapeElement,
  },
  props: {
    shapes: Array,
  },
})
export default class ShapeList extends Vue {
  shapes: Array<ShapeRef> = [];

  shapeClicked(shape: ShapeRef): void {
    // this.$emit("agent-created");
    this.$emit("shape-selected", shape);
  }

  plusClicked(): void {
    this.$emit("plus");
  }
}
</script>

<style>
.shape-list {
  position: absolute;
  bottom: 100%;
  list-style: none;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  overflow: auto;
  height: calc(5.7 * 64px);
}

/* Hide scrollbar for Chrome, Safari and Opera */
.shape-list::-webkit-scrollbar {
  display: none;
}

.shape-list button {
  width: 64px;
  height: 64px;
  border: none;
  margin-bottom: 0.5em;
  font-size: 250%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.shape-list button:hover {
  box-shadow: 0 0 10px rgba(0, 200, 200, 0.5);
}

.shape-list li button {
  border-radius: 50%
}

</style>
