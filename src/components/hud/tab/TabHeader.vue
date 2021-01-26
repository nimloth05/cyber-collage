<template>
  <ul class="hud-tab-list">
    <!--    <li>-->
    <!--&lt;!&ndash;      <img src="" alt="Play-Knopf" title="Spielen"/>&ndash;&gt;-->
    <!--      Play-->
    <!--    </li>-->
    <li
      class="sizeable-ui-element"
      :class="{selected: currentTab === 'design'}" @click="switchTab('design')">
      <img src="img/tab/world.svg" class="tool-icon" alt="Design-Icon"/>
    </li>
    <li
      class="sizeable-ui-element"
      :class="{selected: currentTab === 'rule'}" @click="switchTab('rule')">
      <!--      <img src="" alt="Programmieren" title="Programmieren"/>-->
      <img src="img/tab/rules.svg" class="tool-icon" alt="Regeln-Icon"/>
    </li>
  </ul>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";

@Options({
  name: "TabHeader",
  emits: [
    "update:modelValue",
  ],
  props: {
    modelValue: String,
  },
})
export default class TabHeader extends Vue {
  currentTab = "design";

  switchTab(tabId: string) {
    this.currentTab = tabId;
    this.$emit("update:modelValue", tabId);
  }
}
</script>
