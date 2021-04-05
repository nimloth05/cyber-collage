<template>
  <div>
    <label for="soundFiles">{{ label }}</label>
    <select name="soundFiles"
            id="soundFiles"
            :value="modelValue"
            @change="$emit('update:modelValue', $event.currentTarget.value)"
    >
      <option disabled value="">Bitte wählen</option>
      <option v-for="option in options"
              :key="option.value"
              :value="option.value"
      >{{ option.label }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";

export type SelectionOption = {
  value: string;
  label: string;
}

@Options({
  name: "ListSelection",
  props: {
    label: String,
    options: Array,
    // current selection
    modelValue: String,
  },
  emits: [
    "update:modelValue",
  ],
})
export default class ListSelection extends Vue {
  private options: Array<SelectionOption> = [];
  private label = "";
  private modelValue = "";
}
</script>
