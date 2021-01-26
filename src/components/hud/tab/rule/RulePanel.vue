<template>
  <div class="rule">
    <div class="if-block">
      <div class="if-keyword">{{ getIfLabel() }}</div>
      <div class="conditions">
        <condition-list
          :conditions="rule.conditions"/>
      </div>
    </div>
    <div class="then-block">
      <div class="then-keyword">Dann</div>
      <div class="actions">
        <action-list
          :actions="rule.actions"/>
      </div>
    </div>
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
      return "Wenn";
    }
    if (this.ruleIndex === 0) {
      return "Wenn";
    }
    if (this.ruleIndex === this.noOfRules - 1) {
      return "Sonst";
    }
    return "Wenn sonst";
  }
}
</script>

<style lang="less">
</style>
