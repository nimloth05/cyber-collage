<template>
  <list-selection-editor
    :id="id"
    v-model="instructionValue"
    :read-only="readOnly"
    :options="options"
  />
</template>
<script lang="ts">
import ListSelectionEditor from "@/components/hud/tab/rule/value-editor/ListSelectionEditor.vue";
import {defineComponent, PropType} from "vue";
import {AxisType, AxisValue} from "@/engine/instruction-value";

export default defineComponent({
  components: {ListSelectionEditor},
  props: {
    argument: Object as PropType<AxisValue>,
    readOnly: Boolean,
    id: String,
  },
  emits: [
    "arg-changed",
  ],
  data(props) {
    return {
      instructionValue: props?.argument?.value,
      options: AxisValue.options(),
    };
  },
  watch: {
    instructionValue() {
      this.$emit("arg-changed", new AxisValue(this.instructionValue as AxisType));
    },
  },
});
</script>
