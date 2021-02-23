<template>
  <span>FE</span>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {FormulaValue, InstructionValue} from "@/engine/instruction-value";

@Options({
  name: "FormulaEditor",
  props: {
    argument: FormulaValue,
    id: String,
  },
  emits: [
    "arg-changed",
  ],
})
export default class FormulaEditor extends Vue {

}
</script>
