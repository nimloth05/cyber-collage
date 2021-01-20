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

@Options({
  name: "AuxToolbar",
  components: {},
})
export default class AuxToolbar extends Vue {
  private isFullscreen = false;

  fullScreen() {
    if (!this.isFullscreen) {
      AuxToolbar.requestFullscreen();
    } else {
      AuxToolbar.exitFullscreen();
    }
    this.isFullscreen = !this.isFullscreen;
  }

  private static requestFullscreen(): void {
    const elem: any = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE10 */
      elem.msRequestFullscreen();
    }
  }

  private static exitFullscreen(): void {
    const doc: any = document;
    if (doc.exitFullscreen) {
      doc.exitFullscreen();
    } else if (doc.webkitExitFullscreen) {
      doc.webkitExitFullscreen();
    } else if (doc.mozCancelFullScreen) {
      doc.mozCancelFullScreen();
    } else if (doc.msExitFullscreen) {
      doc.msExitFullscreen();
    }
  }
}
</script>
