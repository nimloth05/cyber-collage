<template>
  <div class="rule">
    <div class="ifStatement">
      <span>{{ getIfLabel() }}</span>
      <condition-list :conditions="rule.conditions"/>
    </div>
    <div>then</div>
    <action-panel :actions="rule.actions"/>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import ConditionList from "@/components/ConditionList.vue";
import {RuleInstance} from "@/model/RuleInstance";
import ActionPanel from "@/components/ActionPanel.vue";

@Options({
  name: "RulePanel",
  components: {
    ConditionList,
    ActionPanel,
  },
  props: {
    ruleIndex: Number,
    noOfRules: Number,
    rule: RuleInstance,
  },
})
export default class Rule extends Vue {
  ruleIndex!: number;
  noOfRules!: number;
  rule!: RuleInstance;

  getIfLabel(): string {
    if (this.noOfRules === 1) {
      return "if";
    }
    if (this.ruleIndex === 0) {
      return "if";
    }
    if (this.ruleIndex === this.noOfRules - 1) {
      return "else";
    }
    return "else if";
  }
}
</script>

<style lang="less">
.rule {
  background-color: lightgray;
  margin: auto auto 10px;
  width: 50%;
  border-radius: 10px;
  padding: 1rem;
}
</style>
