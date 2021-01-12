<template>
  <div class="modal fade" id="$el.getAttribute('id')" tabindex="-1" aria-labelledby="condition-modal"
       aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">
          <ul>
            <li
              v-for="conditionDeclaration in conditions"
              :key="conditionDeclaration.name"
              @click="_conditionClicked(conditionDeclaration)"
            >
              {{ conditionDeclaration.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {instructionDefinitions} from "@/engine/instruction-definitions";
import {Condition} from "@/engine/Instruction";
import {InstructionDeclaration} from "@/model/InstructionDeclaration";
import {Modal} from "bootstrap";

@Options({
  name: "ConditionModal",
  emits: [
    "selected",
  ],
})
export default class ConditionModal extends Vue {
  conditions = instructionDefinitions.filter(it => it.class === Condition);

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

  _conditionClicked(conditionDecl: InstructionDeclaration) {
    this.$emit("selected", conditionDecl);
    this.hide();
  }
}
</script>
