<template>
  <div class="condition"
       v-for="(c, index) in conditions.instructionObjects"
       :key="index">
    <div>{{ c.name }}</div>
    <span class="boolean-operator" v-if="index !== conditions.length - 1"> and </span>
  </div>
  <add-command-button @click="addNewCondition"/>
  <condition-modal :id="conditions.id" ref="conditionModal" @selected="_conditionSelected"/>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import AddCommandButton from "../../../AddCommandButton.vue";
import {AndConditionList, Condition} from "@/engine/Instruction";
import {InstructionDeclaration} from "@/model/InstructionDeclaration";
import ConditionModal from "@/components/hud/tab/rule/ConditionModal.vue";
import {DirectionValue, ShapeNameValue} from "@/engine/instruction-value";

@Options({
  name: "ConditionList",
  components: {
    AddCommandButton,
    ConditionModal,
  },
  props: {
    conditions: AndConditionList,
  },
})
export default class ConditionPanel extends Vue {
  conditions!: AndConditionList;

  addNewCondition(): void {
    // open dialog
    // wait for dialog to finish
    // show ui for selecting a particular condition
    (this.$refs.conditionModal as ConditionModal).show();
  }

  _conditionSelected(conditionDecl: InstructionDeclaration): void {
    this.conditions.add(new Condition(conditionDecl, {
      shape: new ShapeNameValue("cat"),
      direction: new DirectionValue([-1, 1]),
    }));
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
