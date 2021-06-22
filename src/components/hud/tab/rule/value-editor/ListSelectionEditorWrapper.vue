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
import {AbstractStringListValue} from "@/engine/instruction-value";

export default defineComponent({
  components: {ListSelectionEditor},
  props: {
    argument: Object as PropType<AbstractStringListValue<object>>,
    readOnly: Boolean,
    id: String,
  },
  emits: [
    "arg-changed",
  ],
  data(props) {
    return {
      instructionValue: props?.argument?.value,
      options: props?.argument?.getOptions(),
    };
  },
  watch: {
    instructionValue() {
      this.$emit("arg-changed", this.argument?.createFromString(this.instructionValue ?? ""));
    },
  },
});
</script>
