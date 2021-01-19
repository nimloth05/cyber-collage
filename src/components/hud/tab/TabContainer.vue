<template>
  <div class="tab-container">
    <rule-tab v-if="selectedTabId === 'rule'"/>
    <design-tab v-if="selectedTabId === 'design'"/>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import DesignTab from "@/components/hud/tab/design/DesignTab.vue";
import RuleTab from "@/components/hud/tab/rule/RuleTab.vue";

@Options({
  name: "TabContainer",
  components: {
    DesignTab,
    RuleTab,
  },
  props: {
    selectedTabId: String,
  },
  emits: [],
})
export default class TabContainer extends Vue {
}
</script>

<style>
</style>
