<template>
  <div class="modal fade" id="$el.getAttribute('id')" tabindex="-1" aria-labelledby="action-modal" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">
          <button
            class="btn sizeable-ui-element instruction-declaration-button"
            v-for="declarations in declarations"
            :key="declarations.name"
            @click="_actionSelected(declarations)"
          >
            <img v-if="declarations.icon != null" class="tool-icon" :src="declarations.icon"
                 :alt="declarations.name"/>
            <span v-if="declarations.icon == null">{{ declarations.name }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {instructionDefinitions} from "@/engine/instruction-definitions";
import {Action} from "@/engine/Instruction";
import {InstructionDeclaration} from "@/model/InstructionDeclaration";
import {Modal} from "bootstrap";

@Options({
  name: "ActionModal",
  emits: [
    "selected",
  ],
})
export default class ActionModal extends Vue {
  declarations = instructionDefinitions.filter(it => it.class === Action);

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

  _actionSelected(conditionDecl: InstructionDeclaration) {
    this.$emit("selected", conditionDecl);
    this.hide();
  }
}
</script>
