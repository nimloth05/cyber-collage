<template>
  <div class="modal fade" id="$el.getAttribute('id')" tabindex="-1" aria-labelledby="argument-modal" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">
          <div
            v-for="([name, arg]) in instruction.args"
            :key="name">
            <span>{{ name }}</span>
            <argument-editor
              :v-modal="arg"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {Modal} from "bootstrap";

@Options({
  name: "InstructionModal",
  props: {
    instruction: /* Parameters */ Object,
  },
  components: {},
  emits: [
    "",
  ],
})
export default class InstructionModal extends Vue {
  instruction!: Instruction;

  private _instance?: Modal;

  get modalInstance() {
    return this._instance != null ? this._instance : new Modal(document.getElementById(this.$el.getAttribute("id"))!);
  }

  hide() {
    this.modalInstance.hide();
  }

  show() {
    this.modalInstance.show();
  }
}
</script>
