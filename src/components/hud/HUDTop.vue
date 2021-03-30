<template>
  <undo-redo-toolbar/>
  <div class="play-bar">
    <button v-if="!isRunning" @click="play" class="btn sizeable-ui-element hud-toolbar-button">
      <img src="img/play/play.svg" alt="Spiel Starten"/>
    </button>
    <button v-if="isRunning" @click="pause" class="btn sizeable-ui-element hud-toolbar-button">
      <img src="img/play/pause.svg" alt="stop"/>
    </button>
    <button v-if="isRunning || paused" @click="stop" class="btn sizeable-ui-element hud-toolbar-button">
      <img src="img/play/stop.svg" alt="stop"/>
    </button>
    <button v-if="!isRunning && paused" @click="applyMapChanges" class="btn sizeable-ui-element hud-toolbar-button">
      <img src="img/aux/apply-map-changes.svg" alt="stop"/>
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
import {MapSnapShot} from "@/engine/Map";
import {ApplyMapChangesCommand} from "@/model/commands/ApplyMapChangesCommand";

let mapState: MapSnapShot;

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
  paused = false;

  play() {
    if (!this.paused) {
      mapState = app.agentCube.map.createSnapShot();
    }

    const soundFiles: Set<string> = new Set();
    app.repository.agentClasses.forEach(agClass => {
      agClass.methods.forEach(method => {
        method.rules.forEach(rule => {
          rule.actions.forEach(action => {
            // FIXME: This is shite
            if (action.declaration.name === "playSound") {
              soundFiles.add("/sounds/snare-drum.mp3");
            }
          });
        });
      });
    });
    app.soundSystem.prepareSounds(Array.from(soundFiles.values()));
    this.gameLoop.toggleState();
  }

  pause() {
    this.gameLoop.stop();
    this.paused = true;
  }

  stop() {
    // rewind state
    app.agentCube.map.applySnapShot(mapState);
    this.gameLoop.stop();
    this.paused = false;
  }

  applyMapChanges() {
    const oldSnapShot = mapState;
    mapState = app.agentCube.map.createSnapShot();
    app.undoManager.execute(new ApplyMapChangesCommand(oldSnapShot));
    this.paused = false;
  }

  get isRunning(): boolean {
    return this.gameLoop.isRunning;
  }
}
</script>
