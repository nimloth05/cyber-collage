<template>
  <overlay-list-selection-editor
    v-model:visible="editorVisible"
    :options="options"
    @element-selected="elementSelected"
  />
  <span
    class="sizeable-ui-element"
    @click="changeElement"
  >{{ selectedElementLabel }}
  </span>
</template>

<script lang="ts">

import {defineComponent, PropType} from "vue";
import OverlayListSelectionEditor from "@/components/hud/tab/rule/value-editor/OverlayListSelectionEditor.vue";
import {ListSelectionEntry} from "@/engine/instruction-value";

export default defineComponent({
  components: {OverlayListSelectionEditor},
  props: {
    modelValue: String,
    options: {
      type: Array as PropType<Array<ListSelectionEntry>>,
      required: true,
    },
    readOnly: Boolean,
    id: String,
  },
  data(props) {
    return {
      editorVisible: false,
    };
  },
  methods: {
    elementSelected(eventData: ListSelectionEntry): void {
      console.log("changed", eventData);
      // Middle icon pressed, no change

      this.$emit("update:modelValue", eventData.instructionValue);
      this.$emit("arg-changed", eventData.instructionValue);
    },
    changeElement() {
      this.editorVisible = true;
    },
  },
  computed: {
    selectedElementLabel(): string {
      const label = this.options.find(s => (s.instructionValue as unknown) === this.modelValue);
      return label !== undefined ? label.label : "not found";
    },
  },
});
</script>
