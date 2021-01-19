<template>
  <undo-redo-toolbar/>
  <div class="play-bar">
    <button @click="toggleState" class="btn sizeable-ui-element hud-toolbar-button">
      <img v-if="!isRunning" src="icons/play/play.svg" alt="Spiel Starten"/>
      <img v-if="isRunning" src="icons/play/pause.svg" alt="stop"/>
    </button>
    <button v-if="isRunning" @click="stop" class="btn sizeable-ui-element hud-toolbar-button">
      <img src="icons/play/stop.svg" alt="stop"/>
    </button>
  </div>
  <aux-toolbar/>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import HUD from "@/components/hud/HUD.vue";
import UndoRedoToolbar from "@/components/hud/UndoRedoToolbar.vue";
import AuxToolbar from "@/components/hud/AuxToolbar.vue";
import {app} from "@/engine/app";

@Options({
  name: "HUDTop",
  components: {
    HUD,
    UndoRedoToolbar,
    AuxToolbar,
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
