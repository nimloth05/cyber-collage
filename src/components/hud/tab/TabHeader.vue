<template>
  <ul class="hud-tab-list">
    <!--    <li>-->
    <!--&lt;!&ndash;      <img src="" alt="Play-Knopf" title="Spielen"/>&ndash;&gt;-->
    <!--      Play-->
    <!--    </li>-->
    <li :class="{selected: currentTab === 'design'}" @click="switchTab('design')">
      <img src="icons/tab/world.svg" width="64" height="64" alt="Design-Icon"/>
    </li>
    <li :class="{selected: currentTab === 'rule'}" @click="switchTab('rule')">
      <!--      <img src="" alt="Programmieren" title="Programmieren"/>-->
      <img src="icons/tab/rules.svg" width="64" height="64" alt="Regeln-Icon"/>
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

<style>
.hud-tab-list {
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
}

.hud-tab-list li {
  padding: 0.5em;
  text-align: center;
  height: 5em;
  background: #b5b5b5;
  position: relative;
}

.hud-tab-list li:before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  border-top: 5px solid #b5b5b5; /* white */
  border-left: 5px solid #b5b5b5;
  width: 0;
}

.hud-tab-list li:after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  border-top: 5px solid #b5b5b5; /* white */
  border-right: 5px solid #b5b5b5;
  width: 0;
}

.hud-tab-list li.selected {
  background-color: gray;
}

.hud-tab-list li.selected:before {
  border-top-color: #b5b5b5; /* white */
  border-left-color: gray;
}

.hud-tab-list li:hover {
  background-color: gray;
}

.hud-tab-list li:hover:before {
  border-top-color: #b5b5b5; /* white */
  border-left-color: gray;
}

.hud-tab-list li:hover:after {
  border-top-color: #b5b5b5; /* white */
  border-right-color: gray;
}

</style>
