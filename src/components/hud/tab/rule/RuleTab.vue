<template>
  <div class="rule-tab-content">
    <rule-list-panel/>
  </div>

</template>

<script lang="ts">
import RuleListPanel from "@/components/hud/tab/rule/RuleListPanel.vue";
import {Options, Vue} from "vue-class-component";
import {app} from "@/engine/app";
import {Disposable, Disposables} from "@/model/util/Disposable";

@Options({
  name: "RuleTab",
  components: {
    RuleListPanel,
  },
})
export default class RuleTab extends Vue {
}
</script>
