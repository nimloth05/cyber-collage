<template>
  <div class="rules">
    <rule-panel
      v-for="(rule, index) in rules"
      :key="rule.id"
      :rule="rule"
      :ruleIndex="index"
      :noOfRules="rules.length">
      <add-command-button/>
    </rule-panel>
    <div>
      <add-command-button/>
    </div>
  </div>
</template>

<script lang="ts">

import {Options, Vue} from "vue-class-component";
import {RuleInstance} from "@/model/RuleInstance";
import {ConditionInstance} from "@/model/ConditionInstance";
import {ActionInstance} from "@/model/ActionInstance";
import RulePanel from "@/components/RulePanel.vue";
import AddCommandButton from "./AddCommandButton.vue";

@Options({
  name: "RuleList",
  components: {
    RulePanel,
    AddCommandButton,
  },
})
export default class RuleList extends Vue {
  rules = [
    new RuleInstance(
      "rule2",
      [
        new ConditionInstance("see a dog"),
        new ConditionInstance("the dog barks"),
      ], [
        new ActionInstance("pet dog"),
      ]),
    new RuleInstance(
      "rule1",
      [
        new ConditionInstance("see a frog"),
        new ConditionInstance("the frog is red"),
      ], [
        new ActionInstance("move left"),
        new ActionInstance("move right"),
      ]),
  ];
}
</script>
