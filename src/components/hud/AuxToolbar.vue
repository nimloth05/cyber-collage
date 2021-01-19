<template>
  <div class="aux-bar">
    <button @click="fullScreen" class="btn sizeable-ui-element hud-toolbar-button">
      <img class="tool-icon" v-if="!isFullscreen" src="icons/aux/fullscreen.svg" alt="Vollbildschirm"/>
      <img class="tool-icon" v-if="isFullscreen" src="icons/aux/close.svg" alt="Vollbildschirm"/>
    </button>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {exitFullscreen, requestFullScreen} from "@/engine/app";

@Options({
  name: "AuxToolbar",
  components: {},
})
export default class AuxToolbar extends Vue {
  private isFullscreen = false;

  fullScreen() {
    if (!this.isFullscreen) {
      requestFullScreen();
    } else {
      exitFullscreen();
    }
    this.isFullscreen = !this.isFullscreen;
  }
}
</script>
