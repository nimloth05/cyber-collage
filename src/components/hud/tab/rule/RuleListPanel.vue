<template>
  <div class="rules">
    <rule-panel
      v-for="(rule, index) in rules.instructionObjects"
      :key="rule.id"
      :rule="rule"
      :ruleIndex="index"
      :noOfRules="rules.length">
    </rule-panel>
    <div>
      <add-command-button @click="addRule"/>
    </div>
  </div>
</template>

<script lang="ts">

import {Options, Vue} from "vue-class-component";
import RulePanel from "@/components/hud/tab/rule/RulePanel.vue";
import AddCommandButton from "../../../AddCommandButton.vue";
import {Rule, RuleList} from "@/engine/Instruction";

@Options({
  name: "RuleListPanel",
  components: {
    RulePanel,
    AddCommandButton,
  },
})
export default class RuleListPanel extends Vue {
  rules: RuleList = new RuleList([]);
  // rules: Array<Rule> = [
  // new RuleInstance(
  //   "rule2",
  //   [
  //     new ConditionInstance("see a dog"),
  //     new ConditionInstance("the dog barks"),
  //   ], [
  //     new ActionInstance("pet dog"),
  //   ]),
  // new RuleInstance(
  //   "rule1",
  //   [
  //     new ConditionInstance("see a frog"),
  //     new ConditionInstance("the frog is red"),
  //   ], [
  //     new ActionInstance("move left"),
  //     new ActionInstance("move right"),
  //   ]),
  // ];

  addRule() {
    // this.rules.push(new RuleInstance("rule3", [], []));
    this.rules.add(new Rule());

    console.log("code:", this.rules.compile());
  }
}
</script>
