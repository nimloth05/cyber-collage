<template>
  <div class="rule">
    <div class="ifStatement">
      <span class="ifKeyword">{{ getIfLabel() }}</span>
      <condition-list :conditions="rule.conditions"/>
    </div>
    <div>then</div>
    <action-list :actions="rule.actions"/>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import ConditionList from "@/components/hud/tab/rule/ConditionList.vue";
import ActionList from "@/components/hud/tab/rule/ActionList.vue";
import {Rule} from "@/engine/Instruction";

@Options({
  name: "RulePanel",
  components: {
    ConditionList,
    ActionList,
  },
  props: {
    ruleIndex: Number,
    noOfRules: Number,
    rule: Rule,
  },
})
export default class RulePanel extends Vue {
  ruleIndex!: number;
  noOfRules!: number;
  rule!: Rule;

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
</style>
