<template>
  <div v-if="visible" class="backdrop" @click="close()"/>
  <div v-if="visible" class="inline-editor">
    <div class="container-fluid">
      <div
        class="overlay-list-selection-container"
        v-for="option in options"
        :key="option.instructionValue"
        @click="handleClick(option)"
      >
        <span>{{ option.label }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {ListSelectionEntry} from "@/engine/instruction-value";

export default defineComponent({
  name: "OverlayListSelectionEditor",
  components: {},
  props: {
    visible: Boolean,
    options: Array as PropType<Array<ListSelectionEntry>>,
  },
  emits: [
    "element-selected",
    "update:visible",
  ],
  watch: {},
  methods: {
    close() {
      this.$emit("update:visible", false);
    },
    handleClick(option: ListSelectionEntry): void {
      this.$emit("element-selected", option);
      this.close();
    },
  },
});
</script>
