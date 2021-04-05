<template>
  <input type="text" :value="modelValue" @input="$emit('update:modelValue', $event.currentTarget.value)">
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";

@Options({
  name: "FormulaInput",
  props: {
    modelValue: String,
  },
  emits: [
    "update:modelValue",
  ],
})
export default class FormulaInput extends Vue {
  private modelValue = "";
  // FIXME: Formula validation?
  // FIXME: Work with Formula object?
}
</script>
