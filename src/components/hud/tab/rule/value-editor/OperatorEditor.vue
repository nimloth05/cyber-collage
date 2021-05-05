<template>
  <list-selection-editor
    :argument="value"
    :options="options"
    @option-selected="optionSelected"/>
</template>
<script lang="ts">
import ListSelectionEditor from "@/components/hud/tab/rule/value-editor/ListSelectionEditor";
import {defineComponent} from "vue";
import {ListSelectionEntry, OperatorValue} from "@/engine/instruction-value";

export default defineComponent({
  components: {ListSelectionEditor},
  data(props) {
    return {};
  },
  methods: {
    optionSelected(option: ListSelectionEntry) {
      this.$emit("arg-changed", new OperatorValue(option.instructionValue));
    },
  },
});
</script>
