<template>
  <overlay-list-selection-editor
    v-model:visible="editorVisible"
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
import {DirectionValue, ListSelectionEntry} from "@/engine/instruction-value";

export default defineComponent({
  components: {OverlayListSelectionEditor},
  props: {
    argument: Object as PropType<unknown>,
    options: Array as PropType<Array<ListSelectionEntry>>,
    readOnly: Boolean,
    id: String,
  },
  data(props) {
    return {
      editorVisible: false,
    };
  },
  methods: {
    elementChanged(eventData: ListSelectionEntry): void {
      console.log("changed", eventData);
      // Middle icon pressed, no change

      this.$emit("arg-changed", new DirectionValue(directionRow, directionColumn));
    }
  },
  computed: {
    selectedElementLabel() {
      const label = this.options.find(s => s.instructionValue === this.argument);
      return label !== undefined ? label.label : "not found";
    },
  },
});
</script>
