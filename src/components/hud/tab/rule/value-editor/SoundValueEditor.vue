<template>
  <span @click="openModal" style="min-width: 2em">{{ soundName }}</span>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {markRaw} from "vue";
import {SoundValue} from "@/engine/instruction-value";
import SoundModal from "@/components/util/SoundModal.vue";
import {SoundDatabase} from "@/engine/sound/SoundDatabase";

@Options({
  name: "SoundValueEditor",
  props: {
    argument: SoundValue,
    readOnly: Boolean,
    id: String,
  },
  emits: [
    "arg-changed",
  ],
  components: {
    SoundModal,
  },
})
export default class SoundValueEditor extends Vue {
  argument!: SoundValue;
  readOnly!: boolean;

  get soundName(): string {
    return SoundDatabase.getName(this.argument.fileName);
  }

  openModal(): void {
    if (this.readOnly) {
      return;
    }

    this.$eventBus.emit("open", {
      component: markRaw(SoundModal),
      props: {
        soundValue: this.argument,
        okHandler: (soundValue: SoundValue) => {
          this.soundValueChanged(soundValue);
        },
      },
    });
  }

  soundValueChanged(args: SoundValue): void {
    this.$emit("arg-changed", args);
  }
}
</script>
