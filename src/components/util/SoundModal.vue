<template>
  <div class="modal fade sound-modal" tabindex="-1" aria-labelledby="sound-modal"
       aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">
          <list-selection label="Sound wählen" :options="soundFiles" v-model="fileName"/>
          <formula-input label="Formel für Pitch" v-model="pitchFormula"/>
          <div class="text-end">
            <button class="btn btn-dark" @click="okClicked">Ok</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Modal as BModal} from "bootstrap";
import {Options, Vue} from "vue-class-component";
import {SoundValue} from "@/engine/instruction-value";
import ListSelection from "@/components/util/ListSelection.vue";
import FormulaInput from "@/components/util/FormulaInput.vue";
import {SoundDatabase} from "@/engine/sound/SoundDatabase";

@Options({
  name: "SoundModal",
  emits: [
    "ok",
  ],
  components: {
    ListSelection,
    FormulaInput,
  },
})
export default class SoundModal extends Vue {
  private _instance?: BModal;
  private fileName = "";
  private pitchFormula = "";
  private soundFiles = SoundDatabase.SOUND_FILES;

  get modalInstance() {
    return this._instance != null ? this._instance : new BModal(document.getElementById(this.$el.getAttribute("id"))!);
  }

  hide(): void {
    this.modalInstance.hide();
  }

  show(soundValue: SoundValue): void {
    this.fileName = soundValue.fileName;
    this.pitchFormula = soundValue.pitchFormula;
    this.modalInstance.show();
  }

  okClicked(): void {
    const soundValue = new SoundValue(this.fileName, this.pitchFormula);
    console.log("new soundvalue", soundValue);
    this.$emit("ok", soundValue);
    this.hide();
  }
}
</script>
