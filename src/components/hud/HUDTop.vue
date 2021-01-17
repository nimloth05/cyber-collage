<template>
  <div class="hud-overlay">
    <div class="m-auto">
      <div class="play-bar">
        <b-buton @click="toggleState" class="hud-toolbar-button">
          <img v-if="!isRunning" style="width: 100%; height: 100%" src="icons/play/play.svg" alt="Spiel Starten"/>
          <img v-if="isRunning" style="width: 100%; height: 100%" src="icons/play/pause.svg" alt="stop"/>
        </b-buton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import HUD from "@/components/hud/HUD.vue";
import {app} from "@/engine/app";

@Options({
  name: "HUDTop",
  components: {
    HUD,
  },
})
export default class HUDTop extends Vue {
  gameLoop = app.gameLoop;

  toggleState() {
    this.gameLoop.running = !this.gameLoop.running;
  }

  get isRunning(): boolean {
    return this.gameLoop.running;
  }
}
</script>

<style lang="scss">
.hud-overlay {
  position: relative;
  height: 20px;
}
</style>
