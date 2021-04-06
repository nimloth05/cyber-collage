<template>
  <label>
    {{ label }}
    <input name="formula-input" type="text" :value="modelValue"
           @input="$emit('update:modelValue', $event.currentTarget.value)">
  </label>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";

@Options({
  name: "FormulaInput",
  props: {
    modelValue: String,
    label: String,
  },
  emits: [
    "update:modelValue",
  ],
})
export default class FormulaInput extends Vue {
  private modelValue = "";
  private label = "";
  // FIXME: Formula validation?
  // FIXME: Work with Formula object?
}
</script>
