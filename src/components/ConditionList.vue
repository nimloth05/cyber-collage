<template>
  <div class="condition-list"
       v-for="(c, index) in conditions"
       :key="c.key">
    <div>{{ c.name }}</div>
    <span v-if="index !== conditions.length - 1"> and </span>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {ConditionInstance} from "@/model/ConditionInstance";

@Options({
  name: "ConditionList",
  props: {
    conditions: Array,
  },
})
export default class Condition extends Vue {
  conditions!: Array<ConditionInstance>;
}
</script>

<style lang="css">
</style>
