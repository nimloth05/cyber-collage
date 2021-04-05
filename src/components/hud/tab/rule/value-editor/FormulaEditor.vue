<template>
  <div v-if="!readOnly">
    <input type="text" v-model="formula"/>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {FormulaValue} from "@/engine/instruction-value";

@Options({
  name: "FormulaEditor",
  props: {
    argument: FormulaValue,
    readOnly: Boolean,
    id: String,
  },
  emits: [
    "arg-changed",
  ],
})
export default class FormulaEditor extends Vue {
  argument!: FormulaValue;
  readOnly!: boolean;
  formula = "";
}
</script>
