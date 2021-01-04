<template>
  <div>
    <rule-list-panel/>
  </div>
</template>

<script lang="ts">
import RuleListPanel from "./hud/tab/rule/RuleListPanel.vue";
import {Options, Vue} from "vue-class-component";

@Options({
  name: "CommandPanel",
  components: {
    RuleListPanel,
  },
})
export default class CommandPanel extends Vue {
}
</script>
