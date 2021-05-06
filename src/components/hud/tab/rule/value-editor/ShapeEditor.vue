<template>
  <img
    class="sizeable-ui-element"
    @click="changeShapeValue"
    :src="getShapePath()" :alt="getShapeId()"/>
  <shape-modal :id="id + '-shape-modal'" ref="shapeModal" @shape-selected="shapeSelected"/>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {Gallery} from "@/engine/Gallery";
import {ShapeNameValue} from "@/engine/instruction-value";
import ShapeModal from "@/components/util/ShapeModal.vue";
import {PropType} from "vue";

@Options({
  name: "ShapeEditor",
  props: {
    argument: Object as PropType<ShapeNameValue>,
    readOnly: Boolean,
    id: String,
  },
  emits: [
    "arg-changed",
  ],
  components: {
    ShapeModal,
  },
})
export default class ShapeEditor extends Vue {
  readOnly!: boolean;
  argument!: ShapeNameValue;

  changeShapeValue(): void {
    if (this.readOnly) {
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
    this.$emit("arg-changed", new ShapeNameValue(shapeId));
  }
}
</script>
