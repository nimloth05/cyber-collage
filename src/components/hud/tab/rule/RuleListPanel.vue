<template>
  <div v-if="hasSelectedAgent" class="rules">
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
  <div v-else>
    Bitte wähle eine Agenten-Klasse
  </div>
</template>

<script lang="ts">

import {Options, Vue} from "vue-class-component";
import RulePanel from "@/components/hud/tab/rule/RulePanel.vue";
import AddCommandButton from "../../../AddCommandButton.vue";
import {Method, Rule, RuleList} from "@/engine/Instruction";
import {app} from "@/engine/app";

@Options({
  name: "RuleListPanel",
  components: {
    RulePanel,
    AddCommandButton,
  },
})
export default class RuleListPanel extends Vue {
  uiState = app.uiState;

  // data() {
  //   return {
  //   };
  // }

  get rules() {
    if (!this.hasSelectedAgent) {
      return new RuleList([]);
    }
    return (this.uiState.selectedAgentClass?.methods.getChild(0) as Method).rules;
  }

  get hasSelectedAgent(): boolean {
    return this.uiState.selectedAgentClass != null;
  }

  addRule() {
    if (!this.hasSelectedAgent) {
      return;
    }
    // this.rules.push(new RuleInstance("rule3", [], []));
    this.rules.add(new Rule());

    console.log("code:", this.rules.compile());
  }
}
</script>
