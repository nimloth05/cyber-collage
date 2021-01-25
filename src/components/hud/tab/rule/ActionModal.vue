<template>
  <div class="modal fade" id="$el.getAttribute('id')" tabindex="-1" aria-labelledby="action-modal" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">
          <instruction-renderer
            v-for="declaration in declarations"
            :key="declaration.name"
            @click="_actionSelected(declaration)"
            :declaration="declaration"
            :argument-resolver="_getDefaultValue"
          />
          <!--            <img v-if="declarations.icon != null" class="tool-icon" :src="declarations.icon"-->
          <!--                 :alt="declarations.name"/>-->
          <!--            <span v-if="declarations.icon == null">{{ declarations.name }}</span>-->
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {InstructionDeclaration} from "@/model/InstructionDeclaration";
import {Modal} from "bootstrap";
import InstructionRenderer from "@/components/hud/tab/rule/InstructionRenderer.vue";
import {InstructionValue} from "@/engine/instruction-value";

@Options({
  name: "ActionModal",
  components: {
    InstructionRenderer,
  },
  props: {
    declarations: Array,
  },
  emits: [
    "selected",
  ],
})
export default class ActionModal extends Vue {
  // FIXME: InstructionDecl funktioniert nicht
  declarations!: Array<any>;

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

  _getDefaultValue(name: string): InstructionValue {
    return new InstructionValue(name);
  }
}
</script>
