<template>
  <div style="position: relative; top: calc(100% - 200px); height: 200px;">
    <button @click='switchToggle'>
      Agent hinzufügen
    </button>
    <AddAgentShapeList v-if="toggle" @agent-created="agentCreated"/>
    <button @click="undo">
      Undo
    </button>
    <button @click="redo">
      Redo
    </button>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import AddAgentShapeList from "@/components/hud/AddAgentShapeList.vue";
import {app} from "@/engine/app";
import {WORLD_CONTEXT_ID} from "@/model/Commands";

@Options({
  name: "HUD",
  components: {
    AddAgentShapeList,
  },
})
export default class HUD extends Vue {
  toggle = false;

  switchToggle() {
    this.toggle = !this.toggle;
    console.log("button clicked, current toggle state", this.toggle);
  }

  agentCreated() {
    this.toggle = false;
  }

  undo() {
    console.log("UndoManager");
    app.undoManager.undo(WORLD_CONTEXT_ID);
  }

  redo() {
    app.undoManager.redo(WORLD_CONTEXT_ID);
  }
}
</script>
