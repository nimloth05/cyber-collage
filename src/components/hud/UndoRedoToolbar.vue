<template>
  <div class="undo-bar">
    <button @click="undo" :disabled="!canUndo" class="btn sizeable-ui-element hud-toolbar-button">
      <img src="img/undo/undo.svg" alt="Rückgängig"/>
    </button>
    <button @click="redo" :disabled="!canRedo" class="btn sizeable-ui-element hud-toolbar-button">
      <img src="img/undo/redo.svg" alt="Wiederholen"/>
    </button>
  </div>
</template>

<script lang="ts">

import {Options, Vue} from "vue-class-component";
import {app} from "@/engine/app";
import {WORLD_CONTEXT_ID} from "@/model/Commands";

@Options({
  name: "UndoRedoToolbar",
})
export default class UndoRedoToolbar extends Vue {
  uiState = app.uiState;

  undo() {
    app.undoManager.undo(WORLD_CONTEXT_ID);
  }

  redo() {
    app.undoManager.redo(WORLD_CONTEXT_ID);
  }

  get canUndo(): boolean {
    return this.uiState.undoRedo.canUndo;
  }

  get canRedo(): boolean {
    return this.uiState.undoRedo.canRedo;
  }
}
</script>
