<template>
  <div class="modal fade shape-modal" tabindex="-1" aria-labelledby="shape-modal" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">
          <shape-list :show-plus-button="false" :shapes="shapeList" @shape-selected="shapeSelected"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import ShapeList from "@/components/hud/ShapeList.vue";
import {ShapeRef} from "@/engine/Shape";
import {Modal, Modal as BModal} from "bootstrap";
import {app} from "@/engine/app";

@Options({
  name: "ShapeModal",
  emits: [
    "shape-selected",
  ],
  components: {
    ShapeList,
  },
})
export default class ShapeModal extends Vue {
  shapeList: Array<ShapeRef> = [];

  private _instance?: BModal;

  get modalInstance() {
    return this._instance != null ? this._instance : new Modal(document.getElementById(this.$el.getAttribute("id"))!);
  }

  hide() {
    this.modalInstance.hide();
  }

  show() {
    // Since we have lazy init of the gallery we cannot initialize the field during construction phase
    console.log("loading images");
    this.shapeList = Object.values(app.gallery!.shapes).map(shape => ({shape}));
    this.modalInstance.show();
  }

  shapeSelected(shapeRef: ShapeRef) {
    this.$emit("shape-selected", shapeRef.shape.id);
    this.hide();
  }
}
</script>
