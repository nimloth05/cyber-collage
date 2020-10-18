<template>
  <div class="condition"
       v-for="(c, index) in conditions"
       :key="c.key">
    <div>{{ c.name }}</div>
    <span class="boolean-operator" v-if="index !== conditions.length - 1"> and </span>
  </div>
  <add-command-button @click="addNewCondition"/>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {ConditionInstance} from "@/model/ConditionInstance";
import AddCommandButton from "./AddCommandButton.vue";

@Options({
  name: "ConditionList",
  components: {
    AddCommandButton,
  },
  props: {
    conditions: Array,
  },
})
export default class Condition extends Vue {
  conditions!: Array<ConditionInstance>;

  addNewCondition() {
    console.log("addNewCondition");
    this.conditions.push(new ConditionInstance("new condition"));
  }
}
</script>

<style lang="less">
.condition {
  display: inline;
}

.boolean-operator {
  font-style: italic;
}

.condition div {
  display: inline-block;
  background-color: darkgray;
  padding: .5rem;
}

</style>
