<template>
  <div class="rule-tab-content">
    <button @click="compile">Compile</button>
    <rule-list-panel/>
  </div>

</template>

<script lang="ts">
import RuleListPanel from "@/components/hud/tab/rule/RuleListPanel.vue";
import {Options, Vue} from "vue-class-component";
import {app} from "@/engine/app";

@Options({
  name: "RuleTab",
  components: {
    RuleListPanel,
  },
})
export default class RuleTab extends Vue {
  compile() {
    app.repository.compile();
  }
}
</script>
