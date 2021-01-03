<template>
  <div class="condition"
       v-for="(c, index) in conditions.instructionObjects"
       :key="index">
    <div>{{ c.name }}</div>
    <span class="boolean-operator" v-if="index !== conditions.length - 1"> and </span>
  </div>
  <add-command-button @click="addNewCondition"/>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {ConditionInstance} from "@/model/ConditionInstance";
import AddCommandButton from "./AddCommandButton.vue";
import {AndConditionList, Condition} from "@/engine/Instruction";
import {instructionDefinitions} from "@/engine/instruction-definitions";

@Options({
  name: "ConditionList",
  components: {
    AddCommandButton,
  },
  props: {
    conditions: Array,
  },
})
export default class ConditionPanel extends Vue {
  conditions!: AndConditionList;

  addNewCondition() {
    // show ui for selecting a particular condition
    this.conditions.instructionObjects.push(new Condition(instructionDefinitions[0], {}));
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
