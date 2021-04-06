<template>
  <div>
    <list-selection label="Sound wählen" :options="soundFiles" v-model="fileName"/>
    <formula-input label="Formel für Pitch" v-model="pitchFormula"/>
    <div class="text-end">
      <button class="btn btn-dark" @click="okClicked">Ok</button>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {SoundValue} from "@/engine/instruction-value";
import ListSelection from "@/components/util/ListSelection.vue";
import FormulaInput from "@/components/util/FormulaInput.vue";
import {SoundDatabase} from "@/engine/sound/SoundDatabase";

export default defineComponent({
  name: "SoundModal",
  components: {
    ListSelection,
    FormulaInput,
  },
  props: {
    soundValue: {
      type: Object as PropType<SoundValue>,
      required: true,
    },
    okHandler: Function as PropType<(soundValue: SoundValue) => void>,
  },
  data(props) {
    return {
      soundFiles: SoundDatabase.SOUND_FILES,
      fileName: props.soundValue.fileName,
      pitchFormula: props.soundValue.pitchFormula,
    };
  },
  watch: {
    soundValue(soundValue: SoundValue) {
      this.fileName = soundValue.fileName;
      this.pitchFormula = soundValue.pitchFormula;
    },
  },
  methods: {
    okClicked(): void {
      const soundValue = new SoundValue(this.fileName, this.pitchFormula);
      if (this.okHandler != null) {
        this.okHandler(soundValue);
      }
      this.$emit("on-close");
    },
  },
});
</script>
