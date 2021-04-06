<template>
  <div class="modal fade" tabindex="-1" aria-labelledby=""
       aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">
          <slot/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import {Options, Vue} from "vue-class-component";
import AddCommandButton from "@/components/AddCommandButton.vue";
import {Modal as BModal} from "bootstrap";
import ShapeList from "@/components/hud/ShapeList.vue";

@Options({
  name: "ModalComponent",
  components: {
    AddCommandButton,
    ShapeList,
  },
  props: {
    title: String,
  },
  emits: [
    "agent-created",
  ],
})
export default class ModalComponent extends Vue {
  private _instance?: BModal;

  get modalInstance() {
    return this._instance != null ? this._instance : new BModal(document.getElementById(this.$el.getAttribute("id"))!);
  }

  hide() {
    this.modalInstance.hide();
  }

  show() {
    this.modalInstance.show();
  }
}
</script>
