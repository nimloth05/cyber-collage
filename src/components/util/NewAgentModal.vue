<template>
  <div class="modal fade" id="new-agent-modal" tabindex="-1" aria-labelledby="new-agent-modal" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">
          <div class="mb-4">
            <input v-model="agentName" placeholder="Agenten-Klassennamen"/>
          </div>
          <shape-list :show-plus-button="false" :shapes="shapeList" @shape-selected="shapeSelected"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import {ShapeRef} from "@/engine/Shape";
import {Options, Vue} from "vue-class-component";
import AddCommandButton from "@/components/AddCommandButton.vue";
import {Modal as BModal} from "bootstrap";
import {app} from "@/engine/app";
import ShapeList from "@/components/hud/ShapeList.vue";

@Options({
  name: "NewAgentModal",
  components: {
    AddCommandButton,
    ShapeList,
  },
  emits: [
    "agent-created",
  ],
})
export default class NewAgentModal extends Vue {
  agentName = "";
  shapeList: Array<ShapeRef> = [];

  private _instance?: BModal;

  get modalInstance() {
    return this._instance != null ? this._instance : new BModal(document.getElementById("new-agent-modal")!);
  }

  hide() {
    this.modalInstance.hide();
  }

  show() {
    // Since we have lazy init of the gallery we cannot initialize the field during construction phase
    this.shapeList = Object.values(app.gallery!.shapes).map(shape => ({shape}));
    this.agentName = "";
    this.modalInstance.show();
  }

  shapeSelected(shapeRef: ShapeRef) {
    if (this.agentName === "") {
      this.agentName = shapeRef.shape.id; // FIXME: Check if an agent with this name already exists and if so, change name to "${shape.id}-${agentCount + 1}"
    }
    this.$emit("agent-created", {shape: shapeRef.shape, name: this.agentName});
    this.hide();
  }
}

</script>
